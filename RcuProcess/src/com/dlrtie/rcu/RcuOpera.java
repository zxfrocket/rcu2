package com.dlrtie.rcu;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.ConnectException;

public class RcuOpera 
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
            OperaComunicator operaInst = null ;
            try
            {
                try
                {
                    operaInst = new OperaComunicator();
                    operaInst.Open();
                }
                finally
                {
                    Thread.sleep(1000);
                }
            }
            catch (ConnectException e) 
            {
                System.out.println("Fail to connect opera, please keep opera to open!");
            } 
            catch (Exception e) 
            {
                try
                {
                    CommonCalc.Instance().RecordErrorLog("opera",e.toString(), e.getStackTrace());
                }
                catch (IOException e1)
                {
                    e1.printStackTrace();
                }
            }
        }
    }
}
