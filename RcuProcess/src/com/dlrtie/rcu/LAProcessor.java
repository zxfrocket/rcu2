package com.dlrtie.rcu;

import java.io.IOException;
import java.util.TimerTask;

public class LAProcessor extends TimerTask
{
    private OperaComunicator mOperaInst = null ;
    
    @Override
    public void run()
    {
        if(mOperaInst != null)
        {
            try
            {
                mOperaInst.SendLA() ;
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
    
    public LAProcessor(OperaComunicator operaInst)
    {
        mOperaInst = operaInst ;
    }
}