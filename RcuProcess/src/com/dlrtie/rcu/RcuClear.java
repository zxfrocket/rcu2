package com.dlrtie.rcu;

import java.io.IOException;

public class RcuClear 
{

    public static void main(String[] args)
    {
    	while(true)
    	{
            try
            {
            	DataCleaner cleaner = null ;
                try
                {
                    cleaner = new DataCleaner();
                    cleaner.Do() ;
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
                    CommonCalc.Instance().RecordErrorLog("clear",e.toString(), e.getStackTrace());
                }
                catch (IOException e1)
                {
                    e1.printStackTrace();
                }
            }
    	}
    }
}
