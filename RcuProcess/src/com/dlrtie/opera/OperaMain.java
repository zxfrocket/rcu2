package com.dlrtie.opera;

public class OperaMain 
{

    /**
     * @param args
     */
    public static void main(String[] args) 
    {
            Thread tdServer = new Thread(new OperaServer());
            tdServer.start();
    }
}
