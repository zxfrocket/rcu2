package com.dlrtie.rcu;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

public class RcuPoll 
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
        	PollSendProcessor processor = null ;
            try
            {
                try
                {
                	processor = new PollSendProcessor();
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
                    CommonCalc.Instance().RecordErrorLog("poll",e.toString(), e.getStackTrace());
                }
                catch (IOException e1)
                {
                    e1.printStackTrace();
                }
			}

        }
    }
}
