package com.dlrtie.rcu;

public class Head2Tail2FrameSeparator extends FrameSeparator
{
    private final byte STX = (byte)0xAA;
    private final byte ETX = (byte)0xBB;
    private final byte DLE = (byte)0xCC;

    @Override
    protected int FindBeginFlag(byte[] buffer)
    {
        int i = 0;
        int aLen = buffer.length - 1;
        for (i = 0; i < aLen; ++i)
        {
            if ((STX == buffer[i]) && (DLE == buffer[i + 1]))
            {
                return i;
            }
        }
        return -1;
    }

    @Override
    protected int FindEndFlag(byte[] buffer)
    {
        int i = 0;
        int aLen = buffer.length - 1;
        for (i = 0; i < aLen; ++i)
        {
            if ((ETX == buffer[i]) && (DLE == buffer[i + 1]))
            {
                return (i + 1);
            }
        }
        return -1;
    }

}
