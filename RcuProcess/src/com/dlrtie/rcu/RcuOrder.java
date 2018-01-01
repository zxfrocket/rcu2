package com.dlrtie.rcu;

import java.io.IOException;

public class RcuOrder 
{

    /**
     * @param args
     */
    public static void main(String[] args) 
    {
        while(true)
        {
            try
            {
                SerialComunicator comunicator = null ;
                try
                {
                    comunicator = new SerialComunicator();
                    comunicator.SetFrameSeparator(new Head2Tail2FrameSeparator());
                    comunicator.Open();
                    WorkOrderProcessor processor = new WorkOrderProcessor(comunicator);
                    processor.Do() ;
                }
                finally
                {
                    comunicator.Close() ;
                    Thread.sleep(1000);
                }
            }
            catch (Exception e) 
            {
                try
                {
                    CommonCalc.Instance().RecordErrorLog("order",e.toString(), e.getStackTrace());
                }
                catch (IOException e1)
                {
                    e1.printStackTrace();
                }
            }
        }
    }
}
