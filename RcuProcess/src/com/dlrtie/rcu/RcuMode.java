package com.dlrtie.rcu;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

public class RcuMode 
{

    /**
     * @param args
     * @throws InterruptedException 
     * @throws UnsupportedEncodingException 
     */
    public static void main(String[] args)
    {
        while(true)
        {
            try
            {
                ModeSendProcessor processor = null ;
                try
                {
                	processor = new ModeSendProcessor();
                	processor.Do();
                }
                finally
                {
                    Thread.sleep(1000);
                }
            }
            catch (Exception e) 
            {
                try
                {
                    CommonCalc.Instance().RecordErrorLog("mode",e.toString(), e.getStackTrace());
                }
                catch (IOException e1)
                {
                    e1.printStackTrace();
                }
			}

        }
    }
}
