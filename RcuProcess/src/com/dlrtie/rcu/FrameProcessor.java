package com.dlrtie.rcu;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

public class FrameProcessor
{
    private int cmd; 
    private byte[] buffer;
    private Hashtable<String, Integer> unit_table;
    private Hashtable<String, Integer> set_table;
    private static FrameProcessor frameProcessor;
    
    private FrameProcessor()
    {
        cmd = -1; 
        buffer = null;
        unit_table = new Hashtable<String, Integer>();
        set_table = new Hashtable<String, Integer>();
    }
    //根据RCU_CMD_CONFIG确定当前CMD下有哪些unit_id(包括roomID) 
    private void ResolveUnit(DataOperator dataOperator) throws SQLException, ClassNotFoundException, IOException
    {
        ResultSet dataRet = dataOperator.FillDataColl("select * from RCU_SET_CONFIG where cmd_data = " 
                                 + String.valueOf(cmd));
        while (dataRet.next())
        {
            String strSetID = dataRet.getNString("set_id");
            String strSetDefine = dataRet.getNString("set_define");
            CommonCalc.Instance().GetPairString(strSetDefine, "[", "]");
            Integer setValue = CommonCalc.Instance().GetSetValue(dataOperator, strSetID, cmd, unit_table);
            if(setValue != null)
                set_table.put(strSetID, setValue);
        }
        //如果是room_id_set，那么room_id需要重新处理一下
        //NOTE已经没有ID设置了，A00A是欢迎晚间模式
        /*if (cmd == 0xA00A)
        {
            set_table.put("room_id", set_table.get("set_room_id"));
        }*/
    }
    //得到Cmd
    private void ResolveCmd(DataOperator dataOperator) throws SQLException, ClassNotFoundException, IOException
    {
        ResultSet dataRet = dataOperator.FillDataColl("select set_define from RCU_SET_CONFIG where set_id ='cmd'");
        if (dataRet.first())
        {
            String strExpand = dataRet.getNString("set_define");                        
            CommonCalc.Instance().GetPairString(strExpand, "[", "]");                       
            Hashtable<String, Integer> cmdTable = CommonCalc.Instance().GetUnitPairValue(dataOperator, 0x0000, buffer);
            Integer cmdInt = CommonCalc.Instance().GetSetValue(dataOperator, "cmd", 0x0000, cmdTable);
            if(cmdInt != null)
            {
                cmd = CommonCalc.Instance().GetSetValue(dataOperator, "cmd", 0x0000, cmdTable);
                unit_table = CommonCalc.Instance().GetUnitPairValue(dataOperator, cmd, buffer);
                set_table.put("cmd", cmd);
            }
        }
    }
    //根据roomID记录set值
    private void RecordSet(DataOperator dataOperator) throws SQLException, ClassNotFoundException, IOException
    {
        //不采用insert,只采用update，因为在数据库脚本里，已经insert过了
    	//TODO 类似这样的String，全部替换为StringBuilder
    	String strQuery = "update RCU_ROOM_STATE SET ";
        int roomID = 0 ;
        Enumeration<String> keys = set_table.keys();
        while (keys.hasMoreElements())
        {
            String strKey = keys.nextElement();
            Integer strValue = set_table.get(strKey);
            if(!strKey.equals("room_id"))
            {
                 strQuery += (strKey + "=" + strValue.toString() + ",");
            }
            else
            {
                roomID = strValue ;
            }
        }
        if (set_table.size() != 0)
        {
            //像上海，采用K总线，是楼层控制器那边发FF FF的离线命令，接收到这种命令
            //break_count就不能为0
            if(!set_table.containsKey("break_count"))
            {
                strQuery += "break_count=0";
            }
            else
            {
                //删除where前面的逗号
                strQuery = strQuery.substring(0, strQuery.length() - 1);
            }
            StringBuffer buf = new StringBuffer(strQuery);
            if(roomID % 100 == 0)
            {
                int floor = roomID / 100 ;
                buf.append(" where FLOOR(room_id/100) = " + Integer.toString(floor));
            }
            else
            {
                buf.append(" where room_id = " + Integer.toString(roomID));
            }
            dataOperator.ExcuteCmd(buf.toString());    
        }        
    }
    private void InitData()
    {
        cmd = -1;   
        buffer = null;
        unit_table.clear();
        set_table.clear();
    }
//以下为公共接口
    public static FrameProcessor Instance() {
        if(frameProcessor == null) {
            synchronized (FrameProcessor.class) {
                if(frameProcessor == null) {
                    frameProcessor = new FrameProcessor();
                }
            }
            
        }
        return frameProcessor;
    }    
    
    public void ProcessFrameData(DataOperator dataOperator, byte[] buffer) throws SQLException, ClassNotFoundException, IOException
    {
        InitData();
        this.buffer = buffer;
        ResolveCmd(dataOperator);
        ResolveUnit(dataOperator);
        RecordSet(dataOperator);
    }
}
