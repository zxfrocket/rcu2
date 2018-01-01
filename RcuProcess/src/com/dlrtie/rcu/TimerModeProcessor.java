package com.dlrtie.rcu;

import java.io.IOException;
import java.util.TimerTask;

public class TimerModeProcessor extends TimerTask
{
    private ModeSendProcessor mProcInst = null ;
    
    @Override
    public void run()
    {
        if(mProcInst != null)
        {
            try
            {
                mProcInst.SendMode() ;
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
    
    public TimerModeProcessor(ModeSendProcessor procInst)
    {
        mProcInst = procInst ;
    }
}