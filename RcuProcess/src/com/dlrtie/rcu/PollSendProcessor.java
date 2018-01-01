package com.dlrtie.rcu;

import java.sql.ResultSet;

public class PollSendProcessor
{
    private IntArrayList roomidList = new IntArrayList();
    private int roomIndex = 0 ;
    private IntArrayList floorList = new IntArrayList();
    private int floorIndex = 0 ;
    private int dayIndex = 0 ;
    private int nightIndex = 0 ;
    
    private final String pollRoomPriID = "pollroom";
    private final String pollFloorPriID = "pollfloor";
    private final String dayModePriID = "daymode";
    private final String nightModePriID = "nightmode";
    
    private final int workModeFloor = 1;
    private final int workModeRoom = 2;
    private final int workModeDay = 3;
    private final int workModeNight = 4;
    private final int workModeAccept = 5;
    
    public PollSendProcessor() throws Exception
    {
        DataOperator dataOperator = null ;
        try
        {
            dataOperator = new DataOperator();
            dataOperator.Connect();
            if (dataOperator.getConnStatus())
            {
                ResultSet dataRet1 = dataOperator.FillDataColl("select room_id from RCU_ROOM_STATE where if_have = 1 ORDER BY room_id") ;
                while( dataRet1.next())
                {
                    int roomID = dataRet1.getInt("room_id");
                    roomidList.add(roomID);
                }
                ResultSet dataRet2 = dataOperator.FillDataColl("select DISTINCT FLOOR(room_id/100) AS floor from RCU_ROOM_STATE where if_have = 1 ORDER BY floor") ;
                while( dataRet2.next())
                {
                    int floor = dataRet2.getInt("floor");
                    floorList.add(floor);
                }
            }
            dataOperator.Disconnect();
        }
        catch(Exception e)
        {
            if(dataOperator != null)
            {
                dataOperator.ExceptionClose();
            }
            throw(e);
        }
    }
    
    public void Do() throws Exception
    {
        boolean bHasUpdateOrder = false ;
    	while(true)
    	{
    	    Thread.sleep(500);
    		/*0自动模式，1轮询模式，2自检模式, 3白天模式, 4黑天模式, 5被动模式*/
    	    DataOperator dataOperator = null ;
    	    try
    	    {
                dataOperator = new DataOperator();
                dataOperator.Connect();
                if(dataOperator.getConnStatus())
                {
                    int workMode = CommonCalc.Instance().GetCurrentWorkMode(dataOperator) ;
                    
                    ByteArrayList bufList = null ;
                    if(workModeFloor == workMode)
                    {
                        int floor = floorList.get(floorIndex);
                        bufList = CommonCalc.Instance().GetPollFloorData(floor);
                        
                        CommonCalc.Instance().WriteDataIntoWork(dataOperator, floor, 0x8008, 0, "[FLOOR]", pollFloorPriID, bufList);
                        CommonCalc.Instance().UpdateDataInWork(dataOperator, "[ROOM]");
                        CommonCalc.Instance().UpdateDataInWork(dataOperator, "[DAY]");
                        CommonCalc.Instance().UpdateDataInWork(dataOperator, "[NIGHT]");
                        if(floorIndex < floorList.size() - 1)
                        {
                            floorIndex++;
                        }
                        else
                        {
                            floorIndex = 0;
                        }
                        bHasUpdateOrder = false;
                        System.out.println("Poll-Mode:" + floor + "floor write into order.");
                    }
                    else if(workModeRoom == workMode)
                    {
                        int roomid = roomidList.get(roomIndex);
                        bufList = CommonCalc.Instance().GetPollRoomData(roomid);
                        
                        CommonCalc.Instance().WriteDataIntoWork(dataOperator, roomid, 0x8008, 0, "[ROOM]", pollRoomPriID, bufList);
                        CommonCalc.Instance().UpdateDataInWork(dataOperator, "[FLOOR]");
                        CommonCalc.Instance().UpdateDataInWork(dataOperator, "[DAY]");
                        CommonCalc.Instance().UpdateDataInWork(dataOperator, "[NIGHT]");
                        if(roomIndex < roomidList.size() - 1)
                        {
                            roomIndex++;
                        }
                        else
                        {
                            roomIndex = 0;
                        }
                        bHasUpdateOrder = false;
                        System.out.println("Self-Mode:" + roomid + " write into order.");
                    }
                    else if(workModeDay == workMode)
                    {
                        int floor = floorList.get(dayIndex);
                        bufList = CommonCalc.Instance().GetDayModeData(floor);
                        
                        CommonCalc.Instance().WriteDataIntoWork(dataOperator, floor, 0x8008, 0, "[DAY]", dayModePriID, bufList);
                        CommonCalc.Instance().UpdateDataInWork(dataOperator, "[FLOOR]");
                        CommonCalc.Instance().UpdateDataInWork(dataOperator, "[ROOM]");
                        CommonCalc.Instance().UpdateDataInWork(dataOperator, "[NIGHT]");
                        if(dayIndex < floorList.size() - 1)
                        {
                            dayIndex++;
                        }
                        else
                        {
                            dayIndex = 0;
                        }
                        bHasUpdateOrder = false;
                        System.out.println("Day-Mode:" + floor + "floor write into order.");
                    }
                    else if(workModeNight == workMode)
                    {
                        int floor = floorList.get(nightIndex);
                        bufList = CommonCalc.Instance().GetNightModeData(floor);
                        
                        CommonCalc.Instance().WriteDataIntoWork(dataOperator, floor, 0x8008, 0, "[NIGHT]", nightModePriID, bufList);
                        CommonCalc.Instance().UpdateDataInWork(dataOperator, "[FLOOR]");
                        CommonCalc.Instance().UpdateDataInWork(dataOperator, "[ROOM]");
                        CommonCalc.Instance().UpdateDataInWork(dataOperator, "[DAY]");
                        if(nightIndex < floorList.size() - 1)
                        {
                            nightIndex++;
                        }
                        else
                        {
                            nightIndex = 0;
                        }
                        bHasUpdateOrder = false;
                        System.out.println("Night-Mode:" + floor + "floor write into order.");
                    }
                    else if(workModeAccept == workMode)
                    {
                        if(!bHasUpdateOrder)
                        {
                            int accPri = CommonCalc.Instance().GetWorkOrderPriority(dataOperator, "acceptmode");
                            String cmd = "UPDATE RCU_WORK_ORDER SET order_state = 4 WHERE pri_val < " + String.valueOf(accPri);
                            dataOperator.ExcuteCmd(cmd);
                            bHasUpdateOrder = true;
                        }
                    }
                }
                dataOperator.Disconnect() ;
    	    }
            catch(Exception e)
            {
                if(dataOperator != null)
                {
                    dataOperator.ExceptionClose();
                }
                throw(e);
            }
    	}
    }
}
