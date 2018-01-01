package com.dlrtie.rcu;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

public class RcuAuto 
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
                AutoSendProcessor processor = null ;
                processor = new AutoSendProcessor();
                processor.Do();
            }
            catch (Exception e) 
            {
                try
                {
                    CommonCalc.Instance().RecordErrorLog("auto",e.toString(), e.getStackTrace());
                }
                catch (IOException e1)
                {
                    //TODO 再想想，该怎么办
                    e1.printStackTrace();
                }
            }

        }
    }
}
