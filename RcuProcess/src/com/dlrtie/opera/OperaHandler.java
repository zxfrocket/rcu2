package com.dlrtie.opera;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.ArrayList;
import java.util.Random;

public class OperaHandler implements Runnable
{
    private Socket s ;
    ArrayList<String> strArr = null ;

    public OperaHandler(Socket ls) throws IOException
    {
        s = ls ;
        FileReader reader = new FileReader("server_data.txt");
        BufferedReader buffer = new BufferedReader(reader);
        String tempString = null;
        strArr = new ArrayList<String>();
        while ((tempString = buffer.readLine()) != null) 
        {
        	strArr.add(tempString);
        }
    }

    @Override
    public void run()
    {
        try
        {
            OutputStream os = s.getOutputStream();
            InputStream is = s.getInputStream();
            PrintWriter out = new PrintWriter(os, true);
            int i = 0; 
            int len = strArr.size();
            while(true)
            {
            	if(i >= len)
            	{
            		i = 0;
            	}
            	String tempString = strArr.get(i);
                out.println(tempString);
                ++i ;
                Thread.sleep(200);
            }
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
        catch (InterruptedException e)
        {
            e.printStackTrace();
        }
    }

}
