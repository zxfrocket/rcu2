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
            catch (MySQLTransactionRollbackException e) 
            {
                CommonCalc.Instance().RecordErrorLog("poll",e.toString(), e.getStackTrace());
                /**
                 * 先看DataOperator MySQLTransactionRollbackException e 的处理
                 * 如果执行了20次死锁，还是死锁，那么这一条处理就忽略，继续下一条
                 * 不然总是在低楼层打转转
                 */
                Thread.sleep(1000);
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
