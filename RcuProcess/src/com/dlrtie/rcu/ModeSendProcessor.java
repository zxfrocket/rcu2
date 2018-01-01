package com.dlrtie.rcu;
//到了时间，强制发送白天黑天模式的，这个白天黑天模式的优先级，比设置的优先级还高
import java.sql.ResultSet;
import java.util.Timer;

public class ModeSendProcessor
{
    private IntArrayList floorList = new IntArrayList();
    private final int WEL_COUNT = 3 ;/*模式次数(0 到 WEL_COUNT-1)*/
    
    private final String dayModePriID = "daymode";
    private final String nightModePriID = "nightmode";
    
    private Timer tr = null ; 
    private final long RESEND_MODE_INTERVAL = 1000 * 60 * 30;//30分钟
    
    public ModeSendProcessor() throws Exception
    {
        DataOperator dataOperator = null ;
        try
        {
            dataOperator = new DataOperator();
            dataOperator.Connect();
            if (dataOperator.getConnStatus())
            {
                ResultSet dataRet = dataOperator.FillDataColl("select DISTINCT FLOOR(room_id/100) AS floor from RCU_ROOM_STATE where if_have = 1 ORDER BY floor") ;
                while( dataRet.next())
                {
                    int floor = dataRet.getInt("floor");
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
        
        SetTimer();
    }
    
    private void SetTimer()
    {
        tr = new Timer()  ;
        tr.schedule(new TimerModeProcessor(this), 1000, RESEND_MODE_INTERVAL) ;
    }
    
    private void WriteDayModeIntoWork() throws Exception
    {
        for(int i = 0; i < WEL_COUNT; ++i)
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
                        int floor = floorList.get(j);
                        ByteArrayList bufList = CommonCalc.Instance().GetDayModeData(floor);
                        CommonCalc.Instance().WriteDataIntoWork(dataOperator, floor, 0x8008, 0, "[DAY]", dayModePriID, bufList);
                        System.out.println("Day-Mode:" + floor + "floor write into order.");
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
    
    private void WriteNightModeIntoWork() throws Exception
    {
        for(int i = 0; i < WEL_COUNT; ++i)
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
                        int floor = floorList.get(j);
                        ByteArrayList bufList = CommonCalc.Instance().GetNightModeData(floor);
                        CommonCalc.Instance().WriteDataIntoWork(dataOperator, floor, 0x8008, 0, "[NIGHT]", nightModePriID, bufList);
                        System.out.println("Night-Mode:" + floor + "floor write into order.");
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
    
    public void SendMode() throws Exception
    {
        int modeType = -1 ;
        DataOperator dataOperator = null ;
        try
        {
            dataOperator = new DataOperator();
            dataOperator.Connect() ;
            if(dataOperator.getConnStatus())
            {
                modeType = CommonCalc.Instance().GetModeType(dataOperator);
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
        
        if(ModeType.MODE_DAY_RANGE == modeType)
        {
            WriteDayModeIntoWork();
        }
        else if(ModeType.MODE_NIGHT_RANGE == modeType)
        {
            WriteNightModeIntoWork();
        }
    }
    
    public void Do() throws Exception
    {
        while(true)
        {
            Thread.sleep(1000);
            int modeType = -1 ;
            DataOperator dataOperator = null ;
            try
            {
                dataOperator = new DataOperator();
                dataOperator.Connect() ;
                if(dataOperator.getConnStatus())
                {
                    modeType = CommonCalc.Instance().GetModeType(dataOperator);
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
            
            if(ModeType.MODE_DAY_POINT == modeType)
            {
                WriteDayModeIntoWork();
                Thread.sleep(60000);
            }
            else if(ModeType.MODE_NIGHT_POINT == modeType)
            {
                WriteNightModeIntoWork();
                Thread.sleep(60000);
            }
        }
    }
}
