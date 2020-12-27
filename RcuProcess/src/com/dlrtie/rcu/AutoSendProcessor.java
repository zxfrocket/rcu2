package com.dlrtie.rcu;

import java.io.BufferedReader;
import java.io.FileReader;
import java.sql.ResultSet;
import java.util.Timer;

public class AutoSendProcessor
{
    private IntArrayList roomidList = new IntArrayList();
    private IntArrayList floorList = new IntArrayList();
    private final int SELF_COUNT = 3 ;/*自检次数(0 到 SELF_COUNT-1)*/
    private final int POLL_COUNT = 303 ;/*轮询次数(SELF_COUNT 到 POLL_COUNT-1)*/
    
    private final String pollAutoPriID = "pollauto";
    
    private final int workModeAuto = 0;
    
    private Timer trOpenGeothermy = null ;
    private Timer trCloseGeothermy = null ;
    
    private int openInterval = 0 ;
    private int closeInterval = 0 ;
    private int sumInterval = 0 ;
    
    public AutoSendProcessor() throws Exception
    {
        /*DataOperator dataOperator = null ;
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
        }*/
        
        if(trOpenGeothermy != null)
        {
            trOpenGeothermy.cancel() ;
            trOpenGeothermy = null ;
        }
        
        if(trCloseGeothermy != null)
        {
            trCloseGeothermy.cancel() ;
            trCloseGeothermy = null ;
        }
        
        FileReader reader = new FileReader(CommonCalc.Instance().GetConfigName());
        BufferedReader buffer = new BufferedReader(reader);
        String tempString = null;
        while ((tempString = buffer.readLine()) != null) 
        {
            if(-1 == tempString.indexOf("#"))
            {
                if(tempString.indexOf("open") >=0 )
                {
                    int openMin = Integer.valueOf(tempString.replace("open=", ""));
                    openInterval = openMin * 60 * 1000 ;
                }
                else if(tempString.indexOf("close") >=0)
                {
                    int closeMin = Integer.valueOf(tempString.replace("close=", ""));
                    closeInterval = closeMin * 60 * 1000 ;
                }
            }
        }
        sumInterval = openInterval + closeInterval ;
    }
    
    public void Do() throws Exception
    {
        /*0自动模式，1轮询模式，2自检模式, 3白天模式, 4黑天模式, 5被动模式*/
        int workMode = 0 ;
        boolean hasHigherOrder = false ;
        while(true)
        {
            for(int i = 0 ; i < POLL_COUNT; ++i)
            {
                ByteArrayList bufList = null ;
                if(i < SELF_COUNT)
                {
                    for(int j = 0; j < roomidList.size(); ++j)
                    {
                        Thread.sleep(500);
                        DataOperator dataOperator = null ;
                        try
                        {
                            dataOperator = new DataOperator();
                            dataOperator.Connect();
                            if(dataOperator.getConnStatus())
                            {
                                workMode = CommonCalc.Instance().GetCurrentWorkMode(dataOperator) ;
                                hasHigherOrder = CommonCalc.Instance().HasHigherOrder(dataOperator, pollAutoPriID) ;
                                if(workModeAuto == workMode && !hasHigherOrder)
                                {
                                    int roomid = roomidList.get(j);
                                    bufList = CommonCalc.Instance().GetPollRoomData(roomid);
                                    
                                    CommonCalc.Instance().WriteDataIntoWork(dataOperator, roomid, 0x8008, 0, "[ROOM]", pollAutoPriID, bufList);
                                    System.out.println("Self-Mode:" + roomid + " write into order.");
                                }
                                else
                                {
                                    --j;
                                    dataOperator.Disconnect() ;
                                    continue;
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
                else
                {
                    for(int j = 0; j < floorList.size(); ++j)
                    {
                        Thread.sleep(500);
                        DataOperator dataOperator = null ;
                        try
                        {
                            dataOperator = new DataOperator();
                            dataOperator.Connect();
                            if(dataOperator.getConnStatus())
                            {
                                workMode = CommonCalc.Instance().GetCurrentWorkMode(dataOperator) ;
                                hasHigherOrder = CommonCalc.Instance().HasHigherOrder(dataOperator, pollAutoPriID) ;
                                if(workModeAuto == workMode && !hasHigherOrder)
                                {
                                    int floor = floorList.get(j);
                                    bufList = CommonCalc.Instance().GetPollFloorData(floor);
                                    
                                    CommonCalc.Instance().WriteDataIntoWork(dataOperator, floor, 0x8008, 0, "[FLOOR]", pollAutoPriID, bufList);
                                    System.out.println("Poll-Mode:" + floor + "floor write into order");
                                }
                                else
                                {
                                    --j;
                                    dataOperator.Disconnect() ;
                                    continue;
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
        }
    }
    
    public void Do2() throws Exception
    {
        trOpenGeothermy = new Timer();
        trCloseGeothermy = new Timer();
        trOpenGeothermy.schedule(new ScheduleProcessor(true), 0, sumInterval);
        trCloseGeothermy.schedule(new ScheduleProcessor(false), closeInterval, sumInterval);
    }
}
