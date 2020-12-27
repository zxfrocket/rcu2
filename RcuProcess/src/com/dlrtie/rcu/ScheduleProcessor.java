package com.dlrtie.rcu;

import java.io.IOException;
import java.sql.SQLException;
import java.util.TimerTask;

public class ScheduleProcessor extends TimerTask
{
    private boolean isOpenGeothermy = false ;
    @Override
    public void run()
    {
        System.out.println("xxxxxx");
        DataOperator dataOperator = null ;
        try
        {
            dataOperator = new DataOperator();
            dataOperator.Connect();
            int roomid1 = 5331 ;
            int roomid2 = 5332 ;
            if(dataOperator.getConnStatus())
            {
                ByteArrayList bufList1 = null ;
                ByteArrayList bufList2 = null ;
                if(isOpenGeothermy){
                    bufList1 = CommonCalc.Instance().GetGeoOpenData(roomid1);
                    bufList2 = CommonCalc.Instance().GetGeoOpenData(roomid2);
                }
                else{
                    bufList1 = CommonCalc.Instance().GetGeoCloseData(roomid1);
                    bufList2 = CommonCalc.Instance().GetGeoCloseData(roomid2);
                }
                CommonCalc.Instance().WriteDataIntoWork(dataOperator, roomid1, 0xAFFA, 0, "[RCU]", "opera", bufList1);
                CommonCalc.Instance().WriteDataIntoWork(dataOperator, roomid2, 0xAFFA, 0, "[RCU]", "opera", bufList2);
            }
            dataOperator.Disconnect() ;
        }
        catch(Exception e)
        {
            if(dataOperator != null)
            {
                try
                {
                    dataOperator.ExceptionClose();
                } catch (SQLException e1)
                {
                    // TODO Auto-generated catch block
                    e1.printStackTrace();
                }
            }
            try
            {
                throw(e);
            } catch (Exception e1)
            {
                // TODO Auto-generated catch block
                e1.printStackTrace();
            }
        }
    }
    
    public ScheduleProcessor(boolean _isOpenGeothermy)
    {
        isOpenGeothermy = _isOpenGeothermy;
    }
}