package com.dlrtie.rcu;

import java.io.IOException;
import java.util.*;

public abstract class FrameSeparator
{
    private ByteArrayList bufferArrayList = null;
    private byte[] remainderBuffer = null;
    private ArrayList<byte[]> completeBuffers = null;
    protected abstract int FindBeginFlag(byte[] buffer);
    protected abstract int FindEndFlag(byte[] buffer);

    protected FrameSeparator()
    {
        bufferArrayList = new ByteArrayList();
        completeBuffers = new ArrayList<byte[]>();
    }
    public boolean IsCompleteFrame(byte[] buffer) throws IOException
    {
        //arRecvByte is an [out] parameter
        ByteArrayList arRecvByte = CommonCalc.Instance().CopyArrayToArrayList(buffer);
        bufferArrayList.addAll(arRecvByte);
        //addedBuffer is an [out] parameter
        byte[] addedBuffer = CommonCalc.Instance().CopyArrayListToArray(bufferArrayList);
        int aPosBegin = FindBeginFlag(addedBuffer);
        int aPosEnd = FindEndFlag(addedBuffer);

        //if it is a err data ,throw it
        if (aPosBegin != -1 && aPosEnd != -1 && aPosBegin > aPosEnd)
        {
            bufferArrayList.removeRange(0, aPosBegin);
        }

        int posIndex = 0;
        //int completeCount = 1;
        while ((aPosEnd != -1) && (aPosBegin != -1) && (aPosBegin <= aPosEnd))
        {//it is a pair
            
            byte[] onceBuffer = new byte[aPosEnd - aPosBegin + 1];                
            for (posIndex = aPosBegin; posIndex <= aPosEnd; ++posIndex)
            {
                onceBuffer[posIndex - aPosBegin] = (byte)bufferArrayList.get(posIndex);
            }
            completeBuffers.add(onceBuffer);
            
            bufferArrayList.removeRange(aPosBegin, (aPosEnd + 1));
            bufferArrayList.removeRange(0,aPosBegin);

            //cuttedBuffer is an [out] parameter
            byte[] cuttedBuffer = CommonCalc.Instance().CopyArrayListToArray(bufferArrayList);
            aPosBegin = FindBeginFlag(cuttedBuffer);
            aPosEnd = FindEndFlag(cuttedBuffer);
            //++completeCount;
        }
        //看看是否还有剩余的数据
        if (bufferArrayList.size() > 0)
        {                
            //remainderBuffer is an [out] parameter
        	remainderBuffer = CommonCalc.Instance().CopyArrayListToArray(bufferArrayList);
            return false;
        }

        remainderBuffer = null;
        return true;
    }
    
    public byte[][] getCompleteBuffers()
    {
        byte[][] buffer = new byte[completeBuffers.size()][] ;
        for (int i = 0; i < completeBuffers.size(); ++i )
        {
            buffer[i] = completeBuffers.get(i);
        }
        return buffer;
    }
    
    public byte[] getRemainderBuffer()
    {
        return remainderBuffer;
    }
    
    public void clearCompleteBuffer()
    {
        completeBuffers.clear();
    }
}

//class RcuClsHeadLenCheckFrameJudge : RcuClsFrameJudge
//{
//    private const byte HEAD_FLAG = (byte)0xAA;
//    public const int RECV_HEAD_LEN = 2;

//    public override bool IsCompleteFrame(byte[] buffer)
//    {
//        ArrayList arRecvByte;
//        RcuClsCommonCalc.Instance.CopyArrayToArrayList(buffer, out arRecvByte);

//        ArrayList arFlagInt = new ArrayList();
//        FindBeginFlag(arRecvByte, out arFlagInt);

//        ArrayList arFlamByte = new ArrayList();
//        for (int i = 0; i < arFlagInt.Count; ++i)
//        {

//            arFlamByte.Clear();
//            if (i < arFlagInt.Count - 1)
//            {
//                int stopPos = 0;
//                if (Convert.ToInt32(arFlagInt[i + 1]) == Convert.ToInt32(arFlagInt[i]) + (int)arRecvByte[Convert.ToInt32(arFlagInt[i]) + 1] + 1)
//                {//如果AA正好处于前一个Frame的check位置
//                    stopPos = Convert.ToInt32(arFlagInt[i + 1]) + 1;
//                    arFlagInt.RemoveAt(i + 1);
//                }
//                else
//                {
//                    stopPos = Convert.ToInt32(arFlagInt[i + 1]);
//                }
//                for (int j = Convert.ToInt32(arFlagInt[i]); j < stopPos; ++j)
//                {
//                    arFlamByte.Add(arRecvByte[j]);
//                }


//                //PostRecvData(arFlamByte);
//            }
//            else
//            {//最后一个Flag出现的位置                    
//                for (int j = Convert.ToInt32(arFlagInt[i]); j < arRecvByte.Count; ++j)
//                {
//                    arFlamByte.Add(arRecvByte[j]);

//                }
//                if (arFlamByte.Count <= RECV_HEAD_LEN)
//                {
//                    if (Convert.ToInt32(arFlagInt[i]) > 0)
//                    {
//                        arRecvByte.RemoveRange(0, Convert.ToInt32(arFlagInt[i]));
//                    }


//                    return false;
//                }
//                else
//                {
//                    int frameLen = Convert.ToInt32(arFlamByte[1]) + RECV_HEAD_LEN;
//                    if (frameLen == arFlamByte.Count)
//                    {
//                        //PostRecvData(arFlamByte);
//                    }
//                    else if (frameLen < arFlamByte.Count)
//                    {//有多余的数据
//                        arFlamByte.RemoveRange(frameLen, arFlamByte.Count - frameLen);
//                        //PostRecvData(arFlamByte);

//                    }
//                    else
//                    {//未接收完                            
//                        if (Convert.ToInt32(arFlagInt[i]) > 0)
//                        {
//                            arRecvByte.RemoveRange(0, Convert.ToInt32(arFlagInt[i]));
//                        }

//                        return false;
//                    }
//                }
//            }

//        }

//        return true;
//    }

//    private void FindBeginFlag(ArrayList arFindByte, out ArrayList arFlagInt)
//    {
//        arFlagInt = new ArrayList();
//        for (int i = 0; i < arFindByte.Count; ++i)
//        {
//            if (HEAD_FLAG == Convert.ToByte(arFindByte[i]))
//            {
//                arFlagInt.Add(i);
//            }
//        }
//    }

//}
//class RcuClsHeadLenFrameJudge : RcuClsFrameJudge
//{
//    private const byte HEAD_FLAG = (byte)0xAA;
//    public const int RECV_HEAD_LEN = 2;
//    private ArrayList bufferArrayList = null;
//    private byte[][] completeBuffers = null;
//    private byte[] remainderBuffer = null;
//    public override bool IsCompleteFrame(byte[] buffer)
//    {
//        ArrayList arRecvByte;
//        RcuClsCommonCalc.Instance.CopyArrayToArrayList(buffer, out arRecvByte);

//        ArrayList arFlagInt = new ArrayList();
//        FindBeginFlag(arRecvByte, out arFlagInt);

//        ArrayList arFlamByte = new ArrayList();
//        for (int i = 0; i < arFlagInt.Count; ++i)
//        {
//            arFlamByte.Clear();
//            if (i < arFlagInt.Count - 1)
//            {
//                int stopPos = Convert.ToInt32(arFlagInt[i + 1]);
//                for (int j = Convert.ToInt32(arFlagInt[i]); j < stopPos; ++j)
//                {
//                    arFlamByte.Add(arRecvByte[j]);
//                }
//                //PostRecvData(arFlamByte);
//            }
//            else
//            {//最后一个Flag出现的位置                    
//                for (int j = Convert.ToInt32(arFlagInt[i]); j < arRecvByte.Count; ++j)
//                {
//                    arFlamByte.Add(arRecvByte[j]);
//                }
//                if (arFlamByte.Count <= RECV_HEAD_LEN)
//                {
//                    if (Convert.ToInt32(arFlagInt[i]) > 0)
//                    {
//                        arRecvByte.RemoveRange(0, Convert.ToInt32(arFlagInt[i]));
//                    }
//                    return false;
//                }
//                else
//                {
//                    int frameLen = Convert.ToInt32(arFlamByte[1]) + RECV_HEAD_LEN;
//                    if (frameLen == arFlamByte.Count)
//                    {
//                        //PostRecvData(arFlamByte);
//                    }
//                    else if (frameLen < arFlamByte.Count)
//                    {//有多余的数据
//                        arFlamByte.RemoveRange(frameLen, arFlamByte.Count - frameLen);
//                        //PostRecvData(arFlamByte);
//                    }
//                    else
//                    {//未接收完                            
//                        if (Convert.ToInt32(arFlagInt[i]) > 0)
//                        {
//                            arRecvByte.RemoveRange(0, Convert.ToInt32(arFlagInt[i]));
//                        }
//                        return false;
//                    }
//                }
//            }
//        }
//        return true;
//    }

//    private void FindBeginFlag(ArrayList arFindByte, out ArrayList arFlagInt)
//    {
//        arFlagInt = new ArrayList();
//        for (int i = 0; i < arFindByte.Count; ++i)
//        {
//            if (HEAD_FLAG == Convert.ToByte(arFindByte[i]))
//            {
//                arFlagInt.Add(i);
//            }
//        }
//    }
//}