package com.dlrtie.opera;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

public class OperaServer implements Runnable
{
    private static OperaServer serverInst = null;
    private static int port  = 5018;
    
    public static OperaServer Instance()
    {
        if(serverInst == null)
        {
            synchronized (OperaServer.class)
            {
                if(serverInst == null)
                {
                	serverInst = new OperaServer();
                }
            }
        }
        return serverInst;
    }    
 
    @Override
    public void run()
    {
        try
        {
            ServerSocket s = new ServerSocket(port);
            
            while(true)
            {
                Socket ls = s.accept();
                Runnable r = new OperaHandler(ls);
                Thread t = new Thread(r);
                t.start();
            }
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
        
    }
}