package com.dlrtie.rcu;

import java.io.IOException;
import java.util.TimerTask;

public class EnQueryProcessor extends TimerTask
{
    private OperaComunicator mOperaInst = null ;
    private static int mCount = 0 ;
    private int mIndex = -1 ;
    
    public static void SetCount(int count)
    {
        EnQueryProcessor.mCount = count ;
    }
    
    @Override
    public void run()
    {
        if(mOperaInst != null)
        {
            try
            {
                //不用再发ENQ了，说明LFC断了
                if(mIndex >= mCount)
                {
                    mOperaInst.Close() ;
                }
                else
                {
                    mOperaInst.SendENQ() ;
                }
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
    
    public EnQueryProcessor(OperaComunicator operaInst, int index)
    {
        mOperaInst = operaInst ;
        mIndex = index ;
    }
}