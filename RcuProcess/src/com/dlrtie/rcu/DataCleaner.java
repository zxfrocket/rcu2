package com.dlrtie.rcu;

import java.sql.ResultSet;

public class DataCleaner
{
    /*鍒犻櫎涓�宸茬粡瀹屾垚鐨勫伐鍗�order_state = 2 or 3 or 4*/
    private final int INTER_TIME = 60000 ;//1绉掑垹涓�锛屽垹闄や箣鍓�鍒嗛挓澶栫殑
    
    public void Do() throws Exception
    {
        while(true)
        {
                DataOperator dataOperator1 = null ;
                try
                {
                    dataOperator1 = new DataOperator();
                    dataOperator1.Connect();
                    if (dataOperator1.getConnStatus())
                    {
                        dataOperator1.ExcuteCmd("delete from RCU_WORK_DATA") ;
                        dataOperator1.ExcuteCmd("delete from RCU_WORK_ORDER") ;
                        dataOperator1.ExcuteCmd("delete from RCU_ALL_LOG where log_time < SUBTIME(now(), '100 0:0:0.0')") ;
                        dataOperator1.ExcuteCmd("delete from RCU_TEMP_RECORD where date_time < SUBTIME(now(), '100 0:0:0.0')") ;
                        dataOperator1.ExcuteCmd("delete from RCU_SETTING_TEMP_RECORD where date_time < SUBTIME(now(), '100 0:0:0.0') AND date_time > SUBTIME(now(), '300 0:0:0.0')") ;
                        dataOperator1.ExcuteCmd("delete from RCU_WIND_RECORD where date_time < SUBTIME(now(), '100 0:0:0.0') AND date_time > SUBTIME(now(), '300 0:0:0.0')") ;
                        dataOperator1.ExcuteCmd("delete from RCU_CARD_RECORD where date_time < SUBTIME(now(), '100 0:0:0.0') AND date_time > SUBTIME(now(), '300 0:0:0.0')") ;
                        System.out.println("clear!");
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
            
            Thread.sleep(INTER_TIME);
        }
    }
}
