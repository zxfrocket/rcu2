package com.dlrtie.rcu;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

import com.mysql.jdbc.exceptions.jdbc4.MySQLTransactionRollbackException;

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
                /**
                 * 先看DataOperator MySQLTransactionRollbackException e 的处理
                 * 如果执行了20次死锁，还是死锁，那么这一条处理就忽略，继续下一条
                 * 这个依赖于PollSendProcessor里返回参数
                 * 不然总是在低楼层打转转
                 */
                try
                {
                    CommonCalc.Instance().RecordErrorLog("poll",e.toString(), e.getStackTrace());
                }
                catch (IOException e1)
                {
                    e1.printStackTrace();
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
