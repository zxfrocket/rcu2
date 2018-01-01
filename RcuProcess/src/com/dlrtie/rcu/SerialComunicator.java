package com.dlrtie.rcu;

import gnu.io.CommPortIdentifier;
import gnu.io.CommPortOwnershipListener;
import gnu.io.NoSuchPortException;
import gnu.io.PortInUseException;
import gnu.io.SerialPort;
import gnu.io.SerialPortEventListener;
import gnu.io.UnsupportedCommOperationException;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.SQLException;
import java.util.Enumeration;
import java.util.Random;
import java.util.TooManyListenersException;

public class SerialComunicator implements CommPortOwnershipListener
{
    private SerialPort serialPort = null;
    private CommPortIdentifier portId = null;
    FrameSeparator frameSeparator = null;
    private OutputStream outStream = null;
    private InputStream inStream = null;
    private String mPort = null ;
    private int mBaudRate = 9600 ;
    private boolean isDebug = false ;
    
//以下为公共接口
    public void Open() throws NoSuchPortException, PortInUseException, UnsupportedCommOperationException, IOException, TooManyListenersException
    {
        @SuppressWarnings("rawtypes")
        Enumeration portList = CommPortIdentifier.getPortIdentifiers();
        boolean isFindTheRightPort = false ;
        while (portList.hasMoreElements()) 
        {
               portId = (CommPortIdentifier) portList.nextElement();
               if (portId.getPortType() == CommPortIdentifier.PORT_SERIAL) 
               {
                   if(portId.getName().equals(mPort))
                   {
                       System.out.println(portId.getName());
                       System.out.println(mBaudRate);
                       isFindTheRightPort = true ;
                       break; 
                   }
               }
        }
        if(isFindTheRightPort)
        {
            if(portId != null)
            {
                serialPort = (SerialPort)portId.open("RcuProcess", 1000);
                serialPort.setSerialPortParams( mBaudRate,
                                                SerialPort.DATABITS_8,
                                                SerialPort.STOPBITS_1,
                                                SerialPort.PARITY_NONE);
                outStream = serialPort.getOutputStream();
                inStream = serialPort.getInputStream();
                serialPort.setInputBufferSize(PORT_OWNED);
                SerialPortEventListener spel = new ReceiveProcessor(serialPort,frameSeparator,inStream);
                serialPort.addEventListener(spel);
                serialPort.notifyOnDataAvailable(true);
            }
        }
        else
        {
            System.out.println("Not find any serial port in the computer!");
            throw(new NoSuchPortException());
        }
    }
        
    public void Close() throws IOException
    {
        if(portId != null){
            if(outStream != null)
            {
                outStream.close();
            }
            if(inStream != null){
                inStream.close();
            }            
            serialPort.close();
        }
    }
        
    public SerialComunicator() throws IOException
    {
        FileReader reader = new FileReader(CommonCalc.Instance().GetConfigName());
        BufferedReader buffer = new BufferedReader(reader);
        String tempString = null;
        while ((tempString = buffer.readLine()) != null) 
        {
            if(-1 == tempString.indexOf("#"))
            {
                if(tempString.indexOf("com") >=0 )
                {
                    mPort = tempString.replace("com=", "");
                }
                else if(tempString.indexOf("baud") >=0)
                {
                    mBaudRate = Integer.valueOf(tempString.replace("baud=", ""));
                }
            }
        }
        isDebug = CommonCalc.Instance().isDebug() ;
    }   
    
    public void Send(String username, byte[] buffer) throws IOException, SQLException, ClassNotFoundException
    {
        CommonCalc.Instance().RecordSerialLog("send", username, buffer);
        
        if(isDebug)
        {
            if(buffer[4] == (byte)0x80 && buffer[5] == (byte)0x08 )
            {
                if(buffer[3] == (byte)0xFF && buffer[6] == (byte)0x00)//Floor
                {
                    Random rnd = new Random();
                    ByteArrayList bal = new ByteArrayList();
                    for(int i = 0; i < 5; ++i)
                    {
                        rnd.setSeed(i);
                        bal.add((byte)0xAA) ;
                        bal.add((byte)0xCC) ;
                        bal.add(buffer[2]) ;
                        bal.add(CommonCalc.Instance().BinaryToBCD((byte)(rnd.nextInt(20) + 1))) ;//随机房间号
                        bal.add(buffer[4]) ;
                        bal.add(buffer[5]) ;
                        bal.add((byte)0x00) ;//0000 0000 无卡 扰
                        bal.add((byte)0x25) ;
                        bal.add((byte)0x20) ;
                        bal.add((byte)0x48) ;//0100 1000 中 热
                        bal.add((byte)0xFF) ;
                        bal.add((byte)0xFF) ;
                        bal.add((byte)0xFF) ;
                        bal.add((byte)0xFF) ;
                        bal.add((byte)0x25) ;
                        bal.add((byte)0x20) ;
                        bal.add((byte)0x48) ;//0100 1000 中 热
                        bal.add((byte)0x25) ;
                        bal.add((byte)0x20) ;
                        bal.add((byte)0x48) ;//0100 1000 中 热
                        bal.add((byte)0xBB) ;
                        bal.add((byte)0xCC) ;
                    }
                    byte[] newBuf = CommonCalc.Instance().CopyArrayListToArray(bal) ;
                    outStream.write(newBuf);
                }
                else if(buffer[3] == (byte)0xFA && buffer[6] == (byte)0xFF)//DAY
                {
                    
                }
                else if(buffer[3] == (byte)0xF5 && buffer[6] == (byte)0xFF)//NIGHT
                {
                    
                }
                else if(buffer[6] == (byte)0xFF)//ROOM
                {
                    ByteArrayList bal = new ByteArrayList();
                    bal.add((byte)0xAA) ;
                    bal.add((byte)0xCC) ;
                    bal.add(buffer[2]) ;
                    //bal.add((byte)0xFF) ;
                    bal.add(buffer[3]) ;
                    bal.add(buffer[4]) ;
                    bal.add(buffer[5]) ;
                    bal.add((byte)0xC0) ;//1100 0001 有卡 勿扰 连通
                    bal.add((byte)0x28) ;
                    bal.add((byte)0x23) ;
                    bal.add((byte)0x88) ;//1001 0000 高 冷
                    bal.add((byte)0x00) ;
                    bal.add((byte)0x00) ;
                    bal.add((byte)0x02) ;
                    bal.add((byte)0x08) ;
                    bal.add((byte)0x25) ;
                    bal.add((byte)0x24) ;
                    bal.add((byte)0x80) ;//1001 0000 高 冷
                    bal.add((byte)0x00) ;
                    bal.add((byte)0x00) ;
                    bal.add((byte)0x00) ;//1001 0000 高 冷
                    bal.add((byte)0x1C) ;//地热开，35°
                    bal.add((byte)0x05) ;
                    bal.add((byte)0xBB) ;
                    bal.add((byte)0xCC) ;
                    //测试离线命令
                    /*bal.add((byte)0xAA) ;
                    bal.add((byte)0xCC) ;
                    bal.add(buffer[2]) ;
                    bal.add(buffer[3]) ;
                    bal.add((byte)0xFF) ;
                    bal.add((byte)0xFF) ;
                    bal.add((byte)0xFF) ;
                    bal.add((byte)0xFF) ;
                    bal.add((byte)0xFF) ;
                    bal.add((byte)0xFF) ;
                    bal.add((byte)0xFF) ;
                    bal.add((byte)0xBB) ;
                    bal.add((byte)0xCC) ;*/
                    
                    byte[] newBuf = CommonCalc.Instance().CopyArrayListToArray(bal) ;
                    
                    outStream.write(newBuf);
                    
                }
                return ;
            }
        }
        
        outStream.write(buffer);
    }
        
    public void SetFrameSeparator(FrameSeparator frameSeparator)
    {
        this.frameSeparator = frameSeparator;
    }
    
    @Override
    public void ownershipChange(int type)
    {
        if (type == CommPortOwnershipListener.PORT_OWNERSHIP_REQUESTED) {
            //do something
        }
    }
    
}