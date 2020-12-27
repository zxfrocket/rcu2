package com.dlrtie.rcu;

import java.sql.ResultSet;

public class DataCleaner
{
    /*删除一次已经完成的工单 order_state = 2 or 3 or 4*/
    private final int INTER_TIME = 1000 ;//1秒删一次，删除之前1分钟外的
    
    public void Do() throws Exception
    {
        while(true)
        {
            DataOperator dataOperator = null ;
            IntArrayList idArrList = null ;
            try
            {
                idArrList = new IntArrayList();
                dataOperator = new DataOperator();
                dataOperator.Connect();
                if (dataOperator.getConnStatus())
                {
                    ResultSet dataRet = dataOperator.FillDataColl("select order_id from RCU_WORK_ORDER where (order_state = 2 AND process_time < SUBTIME(now(), '0:1:0.0') OR order_state in (3, 4))") ;
                    while( dataRet.next())
                    {
                        int id = dataRet.getInt("order_id");
                        idArrList.add(id);
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

            for(int i = 0; i < idArrList.size() ; ++i)
            {
                DataOperator dataOperator1 = null ;
                try
                {
                    dataOperator1 = new DataOperator();
                    dataOperator1.Connect();
                    if (dataOperator1.getConnStatus())
                    {
                        String cid = String.valueOf(idArrList.get(i));
                        dataOperator1.ExcuteCmd("delete from RCU_WORK_DATA where data_id = " + cid) ;
                        dataOperator1.ExcuteCmd("delete from RCU_WORK_ORDER where order_id = " + cid) ;
                        dataOperator1.ExcuteCmd("delete from RCU_ALL_LOG where log_time < SUBTIME(now(), '100 0:0:0.0')") ;
                        System.out.println("delete order id = " + cid);
                    }
                    dataOperator1.Disconnect();
                }
                catch(Exception e)
                {
                    if(dataOperator1 != null)
                    {
                        dataOperator1.ExceptionClose();
                    }
                    throw(e);
                }
            }
            
            Thread.sleep(INTER_TIME);
        }
    }
}
