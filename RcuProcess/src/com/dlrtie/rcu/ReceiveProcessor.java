package com.dlrtie.rcu;

import java.io.IOException;
import java.io.InputStream;

import gnu.io.SerialPort;
import gnu.io.SerialPortEvent;
import gnu.io.SerialPortEventListener;

public class ReceiveProcessor implements SerialPortEventListener
{
    private void Receive(SerialPortEvent e) throws Exception
    {
        boolean isComplateFrame = false;
        int recvCount = 0;            
        do
        {
            int readCount = serialPort.getInputBufferSize();
            if(readCount > 0)
            {
                byte[] readBuffer = new byte[readCount];
                inStream.read(readBuffer);
                isComplateFrame = frameSeparator.IsCompleteFrame(readBuffer);
                ++recvCount;
            }
        } while (!isComplateFrame && recvCount  < 256);
        ProcessReceiveData(frameSeparator.getCompleteBuffers());
        frameSeparator.clearCompleteBuffer();
    }
    
    private void ProcessReceiveData(byte[][] buffers) throws Exception
    {
        for (int i = 0; i < buffers.length;  )
        {
            DataOperator dataOperator = null ;
            try
            {
                dataOperator = new DataOperator();
                dataOperator.Connect();
                if (dataOperator.getConnStatus())
                {
                    //每一帧数据记录一次Log到日志文件中
                    //在Process之前就记录日志，防止因为ProcessFrameData的异常而不记录log
                    CommonCalc.Instance().RecordSerialLog("recv", buffers[i]);
                    FrameProcessor.Instance().ProcessFrameData(dataOperator, buffers[i]);
                    //如果该帧数据是设置命令，那么需要记录到RCU_ALL_LOG里
                    CommonCalc.Instance().MakeUpNewLog(dataOperator, "[RCU]",0, buffers[i]);
                }
                dataOperator.Disconnect();
            }
            catch(Exception e)
            {
                if(dataOperator != null)
                {
                    dataOperator.ExceptionClose();
                }
                CommonCalc.Instance().RecordErrorLog("order",e.toString(), e.getStackTrace());
            }
            finally
            {
                ++i;
            }
        }
    }
    
    private SerialPort serialPort = null;
    FrameSeparator frameSeparator = null;
    private InputStream inStream = null;
    
    public ReceiveProcessor(SerialPort serialPort,FrameSeparator frameSeparator,InputStream inStream){
        this.serialPort = serialPort;
        this.frameSeparator = frameSeparator;
        this.inStream = inStream;
    }
    
    @Override
    public void serialEvent(SerialPortEvent arg)
    {
        switch (arg.getEventType()) 
        {
        case SerialPortEvent.DATA_AVAILABLE:
            try
            {
                Receive(arg);
            } 
            catch (Exception e)
            {
                try
                {
                    CommonCalc.Instance().RecordErrorLog("order",e.toString(), e.getStackTrace());
                }
                catch (IOException e1)
                {
                    e1.printStackTrace();
                }
            }
            break;
        }
    }

}
