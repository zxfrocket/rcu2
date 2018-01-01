package com.dlrtie.rcu;

public class Head1Len1FrameSeparator extends FrameSeparator
{
    private final byte HEAD_FLAG = (byte)0xAA;
    
    @Override
    protected int FindBeginFlag(byte[] buffer)
    {
        int i = 0;
        int aLen = buffer.length - 1;
        for (i = 0; i < aLen; ++i)
        {
            if (HEAD_FLAG == buffer[i])
            {
                return i;
            }
        }
        return -1;
    }

    @Override
    protected int FindEndFlag(byte[] buffer)
    {
        int endPos = -1;
        int beginPos = FindBeginFlag(buffer);
        if (beginPos != -1)
        {
            int lenPos = beginPos + 1;
            if (lenPos < buffer.length)
            {
                int len = (int)buffer[lenPos];
                int tempEndPos = lenPos + len;
                if (tempEndPos < buffer.length)
                {
                    endPos = tempEndPos;
                }
            }
        }
        return endPos;
    }

}
