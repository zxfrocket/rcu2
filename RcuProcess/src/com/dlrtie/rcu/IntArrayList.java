package com.dlrtie.rcu;

import java.util.ArrayList;

public class IntArrayList extends ArrayList<Integer>
{

    public IntArrayList()
    {
        super();
    }

    private static final long serialVersionUID = 1L;

    @Override
    public void removeRange(int fromIndex, int toIndex)
    {
        super.removeRange(fromIndex, toIndex);
    }

}
