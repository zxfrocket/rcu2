package com.dlrtie.rcu;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.nio.ByteBuffer;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.*;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

public class CommonCalc
{
    private static CommonCalc commonCalc = null;
    private boolean isDebug = false ;
    private int logLimitDays = 0 ;
    
    private CommonCalc() throws IOException
    {
        FileReader reader = new FileReader("conf.ini");
        BufferedReader buffer = new BufferedReader(reader);
        String tempString = null;
        while ((tempString = buffer.readLine()) != null) 
        {
            if(-1 == tempString.indexOf("#"))
            {
                if(tempString.indexOf("debug") >=0 )
                {
                    isDebug = Boolean.valueOf(tempString.replace("debug=", ""));
                }
                else if(tempString.indexOf("loglimit") >=0 )
                {
                    logLimitDays = Integer.valueOf(tempString.replace("loglimit=", ""));
                }
            }
        }
    }
    
    public static CommonCalc Instance() throws IOException {
        if(commonCalc == null) {
            synchronized (CommonCalc.class) {
                if(commonCalc == null) {
                    commonCalc = new CommonCalc();
                }
            }
        }
        return commonCalc;
    }
    
    public boolean isDebug() {
        return isDebug;
    }
    
    public int logLimitDays() {
        return logLimitDays;
    }
    
    public String GetConfigName()
    {
        String name = "" ;
        if(isDebug)
            name = "conf.ini";
        else
            name = "../../conf/conf.ini";
        return name ;
    }
    
    public String GetLogPath()
    {
        String path = "" ;
        if(isDebug)
        {
            path = "./log/";
        }
        else
        {
            path = "../../log/";
        }
        return path ;
    }

    /**
     * 
     * @param buffer
     * @param arrayList [out]
     */
    public ByteArrayList CopyArrayToArrayList(byte[] buffer)
    {
        ByteArrayList arrayList = new ByteArrayList();
        for (int i = 0; i < buffer.length; ++i )
        {
            arrayList.add(buffer[i]);
        }
        return arrayList;
    }

    /**
     * 
     * @param arrayList
     * @param buffer [out]
     */
    public byte[] CopyArrayListToArray( ByteArrayList arrayList)
    {
        byte[] buffer = new byte[arrayList.size()];
        for (int i = 0; i < arrayList.size(); ++i)
        {
            buffer[i] = (byte)arrayList.get(i);
        }
        return buffer ;
    }
    
    /**
     * 
     * @param buf
     * @return arrayList [out]
     */
    public ByteArrayList ConvertByteBufferToByteArrayList(final ByteBuffer buf, int len)
    {
        ByteArrayList arrayList = new ByteArrayList();
        for(int i = 0; i < len ; ++i)
        {
            arrayList.add(buf.get(i));
        }
        return arrayList ;
    }
    
    /**
     * 
     * @param str
     * @return arrayList [out]
     * @throws UnsupportedEncodingException 
     */
    public ByteArrayList ConvertStringToByteArrayList(String str) throws UnsupportedEncodingException
    {
        byte[] buf = str.getBytes("US-ASCII");
        ByteArrayList arrayList = CopyArrayToArrayList(buf);
        return arrayList ;
    }
    
    public String ConvertByteArrayListToString(ByteArrayList arr) throws UnsupportedEncodingException
    {
        byte[] buf = CopyArrayListToArray(arr);
        String str = new String(buf, "US-ASCII");
        return str ;
    }

    public int GetRoomID(int flloorNo,int roomNo)
    {
        return (flloorNo * 100 + roomNo);
    }

    public byte BCDToBinary(byte nBCD)
    {
        int iBCD = nBCD ;
        int aHi = ((iBCD & 0xF0) >> 4) & 0x0F;
        int aLo = iBCD & 0x0F ;
        return (byte)(10 * aHi + aLo);
    }
    
    public byte BinaryToBCD(byte nBin)
    {
        int iBin = nBin ;
        int aHi = iBin / 10 ;
        int aLo = iBin % 10 ;
        iBin = ((aHi << 4)& 0xF0) + (aLo & 0x0F) ;
        return (byte)iBin;
    }
    
    public String[] GetPairString(String str, String strBegin, String strEnd)
    {
        ArrayList<String> strArray = new ArrayList<String>();
        int startPos = 0;
        int posBegin = 0, posEnd = 0;
        int lenBegin = strBegin.length();
        int lenEnd = strEnd.length();
        posBegin = str.indexOf(strBegin, startPos);
        while (-1 != posBegin)
        {
            startPos = posBegin + lenBegin;
            posBegin = startPos;
            posEnd = str.indexOf(strEnd, startPos);
            if (-1 != posEnd)
            {
                startPos = posEnd + lenEnd;
                String strTemp = str.substring(posBegin, posEnd);
                strArray.add(strTemp);
            }
            posBegin = str.indexOf(strBegin, startPos);
        }
        //去掉strArr中重复的字段
        ArrayList<String> strfixedArray = new ArrayList<String>();
        for (int i = 0; i < strArray.size(); ++i)
        {
            String strTemp = strArray.get(i).toString();
            if(!strfixedArray.contains(strTemp))
            {
                strfixedArray.add(strTemp);
            }
        }
        String[] strArr = new String[strfixedArray.size()];
        for (int i = 0; i < strfixedArray.size(); ++i)
        {
            strArr[i] = strfixedArray.get(i).toString();
        }
        return strArr;
    }
    
    public int GetEffectUnitValue(DataOperator dataOperator, String unit_id, int unit_fact) throws SQLException, ClassNotFoundException, IOException
    {
        int unit_effect = 0;
        ResultSet dataRet = dataOperator.FillDataColl("select unit_effect from RCU_UNIT_RELATION where unit_id = '" 
                                 + unit_id + "' and unit_fact = " 
                                 + Integer.toString(unit_fact));
        if (dataRet.first())
        {
            unit_effect = dataRet.getInt("unit_effect");
        }
        return unit_effect;
    }
    
    private String pad (String str, int size, char c, boolean isprefixed) {
        if (str == null){
            str = "";
        }
        int str_size = str.length();
        int pad_len = size - str_size;
        StringBuffer retvalue = new StringBuffer();
        for (int i = 0; i < pad_len; i++) {
            retvalue.append(c);
        }
        if (isprefixed) 
            return retvalue.append(str).toString();
        return retvalue.insert(0, str).toString();
    }
    
    public String padLeft (String str ,int size ,char c) {
        return pad(str,size,c,true);
    }
    
    public Hashtable<String,Integer> GetUnitPairValue(DataOperator dataOperator, int cmdData, byte[] data) throws NumberFormatException, SQLException, ClassNotFoundException, IOException
    {
        Hashtable<String,Integer> unitPairTable = new Hashtable<String,Integer>();
        ResultSet dataRet = dataOperator.FillDataColl("select * from RCU_CMD_CONFIG where cmd_direct = 0 AND cmd_data = " + Integer.toString(cmdData));
        while(dataRet.next())
        {
            String strKey = dataRet.getNString("unit_id");
            int byteLen = dataRet.getInt("byte_len");
            int byteBeginPos = dataRet.getInt("begin_byte_pos");
            byte[] byteArr = new byte[byteLen];
            String strBinData = "";
            for (int j = 0; j < byteLen; ++j)
            {
                byteArr[j] = data[byteBeginPos + j];
                String strTempData = Integer.toBinaryString((int)(byteArr[j] & 0xFF));
                //扩展到8位
                strTempData = padLeft(strTempData,8,'0');
                strBinData += strTempData;
            }
            int bitLen = dataRet.getInt("bit_len");
            int bitBeginPos = dataRet.getInt("begin_bit_pos");
            strBinData = ReverseString(strBinData);
            strBinData = strBinData.substring(bitBeginPos, bitBeginPos + bitLen);
            strBinData = ReverseString(strBinData);
            int binData = Integer.valueOf(strBinData, 2);
            //如果值为BCD码，那么要转换为二进制
            int isBCD = dataRet.getInt("data_form");
            if (1 == isBCD)
            {
                //roomNo是0xFF的话，那么表示本层有效，那么就让roomid为floorNo*100 + 0
                //比如27层对应的roomid为2700
                if(strKey.equals("roomNo") && (byte)binData == (byte)0xFF)
                {
                    binData = (byte)0x00 ;
                }
                else
                {
                    binData = BCDToBinary((byte)binData);
                }
            }
            //如果值需要转换，那么要转换成需要的值
            int isChanged = dataRet.getInt("data_change");
            if (1 == isChanged)
            {
                binData = GetEffectUnitValue(dataOperator,strKey,binData);
            }
            unitPairTable.put(strKey, binData);
        }
        return unitPairTable;
    }
    
    public String ReverseString(String strOriginal)
    {
        StringBuffer buf = new StringBuffer(strOriginal) ;
        return buf.reverse().toString() ;
    }
    
    public String ComputerExpress(String str)
    {
        ScriptEngineManager factory = new ScriptEngineManager();
        ScriptEngine engine = factory.getEngineByName ("JavaScript");
        try
        {
            engine.eval(str);
            String ret = String.valueOf(engine.get("ret")); 
            return ret ;
        } catch (ScriptException e)
        {
            e.printStackTrace();
            return "null" ;
        }        
    }
    
    public Integer GetSetValue(DataOperator dataOperator, String strSetID,int cmd,Hashtable<String, Integer> unitTable) throws SQLException, ClassNotFoundException, IOException
    {
        Integer setValue = null;
        ResultSet dataRet = dataOperator.FillDataColl("select set_define from RCU_SET_CONFIG where set_id = '" + strSetID + "' and cmd_data = " + Integer.toString(cmd));
        if ( dataRet.first())
        {
            String strSetDefine = dataRet.getNString("set_define");
            String[] strReplaceArr = GetPairString(strSetDefine, "[", "]");
            if(strReplaceArr.length <= unitTable.size())
            {
                for (int i = 0; i < strReplaceArr.length; ++i)
                {
                    strSetDefine = strSetDefine.replace( strReplaceArr[i], unitTable.get(strReplaceArr[i]).toString() );
                } 
                strSetDefine = strSetDefine.replace("[","");
                strSetDefine = strSetDefine.replace("]", "");
                String strResult = ComputerExpress(strSetDefine);
                //TODO 如果返回的数据无法转换为整数，那么应该不应该进入异常处理，而应该继续下一个field，因为
                //毕竟不是所有的field都是无效的。
                if(!strResult.equals("null"))
                {
                    try
                    {
                        setValue = new Integer((int)Double.parseDouble(strResult));
                    }
                    catch(NumberFormatException e)
                    {
                        setValue = 0 ;
                        CommonCalc.Instance().RecordErrorLog("order",e.toString(), e.getStackTrace());
                    }
                }
            }
        }
        return setValue;
    }
    
    public String GetFormateTimeString(Date curTime, String strFormate)
    {
        SimpleDateFormat df = new SimpleDateFormat(strFormate);
        String strTime = df.format(curTime);
        return strTime;
    }
    
    public byte MakeUpLightGroupState(int[] lightStates)//count=8
    {
        byte lightGroupValue = 0x00;
        if(lightStates.length == 8)
        {
            byte s0 = (byte)lightStates[0];
            byte s1 = (byte)lightStates[1];
            byte s2 = (byte)lightStates[2];
            byte s3 = (byte)lightStates[3];
            byte s4 = (byte)lightStates[4];
            byte s5 = (byte)lightStates[5];
            byte s6 = (byte)lightStates[6];
            byte s7 = (byte)lightStates[7];
            lightGroupValue = (byte)((s7 << 7) | (s6 << 6) | (s5 << 5) | (s4 << 4) | (s3 << 3) | (s2 << 2) | (s1 << 1) | (s0 << 0)); 
        }
        return lightGroupValue;
    }

    public void MakeUpNewLog(DataOperator dataOperator, String username, int log_type, byte[] buffer) throws SQLException, ClassNotFoundException
    {
        //轮检命令不记录日志0x8008
        if(buffer[4] != (byte)(-128) && buffer[5] != (byte)8 )
        {
            String sqlText = "INSERT INTO RCU_ALL_LOG(log_time,username,log_type,log_data) VALUES(now(),'" 
                + username + "','" 
                + Integer.toString(log_type) + "',?)";
            dataOperator.setPreParedCmd(sqlText);
            if(null != dataOperator.getParedCmd())
            {
                String inBuf = ConvertBufferToString(buffer);
                dataOperator.getParedCmd().setString(1, inBuf);
                dataOperator.getParedCmd().executeUpdate();
                dataOperator.getParedCmd().close();
            }
        }
    }
    
    public int ConvertByteToInteger(byte v){
        int r = (v >= 0) ? v : (256 + v);
        return r;
    }
    
    public String ConvertBufferToString(byte[] buffer)
    {
        StringBuffer buf = new StringBuffer();
        for (int i = 0; i < buffer.length; ++i)
        {
            int v = ConvertByteToInteger(buffer[i]);
            String sv = Integer.toString(v,16);
            sv = sv.toUpperCase();
            if(1 == sv.length()){
                sv = "0" + sv ;
            }
            buf.append(sv);
            buf.append(" ");
        }
        buf.trimToSize();
        return buf.toString();
    }
    
    public String ConvertBytesToHexString(byte src)
    {  
        StringBuilder stringBuilder = new StringBuilder("0x");  
        int v = src & 0xFF;  
        String hv = Integer.toHexString(v);  
        if (hv.length() < 2) {  
            stringBuilder.append(0);  
        }  
        stringBuilder.append(hv);
        
        return stringBuilder.toString();  
    }  

    public int GetWorkOrderPriority(DataOperator dataOperator, String priID) throws ClassNotFoundException, SQLException, IOException
    {
        int priVal = 1000 ;
        String cmd = "SELECT pri_val FROM RCU_WORK_PRIORITY WHERE pri_id = '" + priID + "'";
        ResultSet dataRet = dataOperator.FillDataColl(cmd) ;
        if( dataRet.first())
        {
            priVal = dataRet.getInt("pri_val");
        }
        
        return priVal ;
    }
    
    private String GetMaxOrderID(DataOperator dataOperator) throws ClassNotFoundException, SQLException, IOException
    {
        BigDecimal maxID = null ;
        ResultSet dataRet = dataOperator.FillDataColl("SELECT max(order_id) AS maxID FROM RCU_WORK_ORDER") ;
        if( dataRet.first())
        {
            maxID = dataRet.getBigDecimal("maxID");
        }
        
        return maxID.toPlainString();
    }
    
    private void WriteIntoWorkOrder(DataOperator dataOperator, int roomid, int cmd, int orderType, String username, String priID ) throws ClassNotFoundException, SQLException, IOException
    {
        int priVal = GetWorkOrderPriority(dataOperator, priID);
        String cmdStr = "INSERT INTO RCU_WORK_ORDER(create_time,pri_val,username,order_state,order_type,room_id,cmd) VALUES(now()," 
                      + String.valueOf(priVal) + ",'" + username + "',0," + String.valueOf(orderType) + "," 
                      + String.valueOf(roomid) + ","  + String.valueOf(cmd) + ")"; 
        dataOperator.ExcuteCmd(cmdStr);
    }
    
    private void WriteIntoWorkData(String maxID, ByteArrayList data, DataOperator dataOperator) throws ClassNotFoundException, SQLException, IOException
    {
        int subCnt = data.size();
        for(int j = 0; j < subCnt ; ++j)
        {
            byte curVal = data.get(j);
            String hexValStr = CommonCalc.Instance().ConvertBytesToHexString(curVal);
            String cmd = "INSERT INTO RCU_WORK_DATA(data_id,data_pos,data_val) VALUES(" + maxID + "," + String.valueOf(j) + "," + hexValStr + ")"; 
            dataOperator.ExcuteCmd(cmd);
        }
    }
    
    public void WriteDataIntoWork(DataOperator dataOperator, int roomid, int cmd, int orderType, String username, String priID, ByteArrayList data) throws ClassNotFoundException, SQLException, IOException
    {
        /**
         * 工单相关的表有两个RCU_WORK_ORDER和RCU_WORK_DATA,
         * 先写入RCU_WORK_ORDER，再写入RCU_WORK_DATA
         */
        /**
         * 先写入RCU_WORK_ORDER
         */
        WriteIntoWorkOrder(dataOperator, roomid, cmd, orderType, username, priID);
        /**
         * 得到order_id
         */
        String maxID = GetMaxOrderID(dataOperator);
        /**
         * 再将数据写入RCU_WORK_DATA
         */
        WriteIntoWorkData(maxID, data, dataOperator);
    }
    
    
    public void UpdateDataInWork(DataOperator dataOperator, String username) throws ClassNotFoundException, SQLException, IOException
    {
        dataOperator.ExcuteCmd("UPDATE RCU_WORK_ORDER SET order_state = 4 WHERE username = '" + username + "'");
    }
    
    public void IncreaseBreakCountRoom(DataOperator dataOperator, int roomid) throws ClassNotFoundException, SQLException, IOException
    {
        String strCmd = "UPDATE RCU_ROOM_STATE SET break_count = break_count + 1 WHERE break_count < 3 AND room_id = " + String.valueOf(roomid);
        dataOperator.ExcuteCmd(strCmd);
    }
    
    public ByteArrayList GetPollFloorData(int floor) throws IOException
    {
        byte floorBCD = CommonCalc.Instance().BinaryToBCD((byte)floor);
        ByteArrayList bufList = new ByteArrayList();
        bufList.add((byte)0xAA);
        bufList.add((byte)0xCC);
        bufList.add((byte)floorBCD);
        bufList.add((byte)0xFF);
        bufList.add((byte)0x80);
        bufList.add((byte)0x08);
        bufList.add((byte)0x00);
        bufList.add((byte)0xBB);
        bufList.add((byte)0xCC);
        return bufList ;
    }
    
    public ByteArrayList GetPollRoomData(int roomid) throws IOException
    {
        int floor = roomid / 100 ;
        byte floorBCD = CommonCalc.Instance().BinaryToBCD((byte)floor);
        int room = roomid % 100 ;
        byte roomBCD = CommonCalc.Instance().BinaryToBCD((byte)room);
        ByteArrayList bufList = new ByteArrayList();
        bufList.add((byte)0xAA);
        bufList.add((byte)0xCC);
        bufList.add((byte)floorBCD);
        bufList.add((byte)roomBCD);
        bufList.add((byte)0x80);
        bufList.add((byte)0x08);
        bufList.add((byte)0xFF);
        bufList.add((byte)0xBB);
        bufList.add((byte)0xCC);
        return bufList;
    }
    
    public ByteArrayList GetDayModeData(int floor) throws IOException
    {
        byte floorBCD = CommonCalc.Instance().BinaryToBCD((byte)floor);
        ByteArrayList bufList = new ByteArrayList();
        bufList.add((byte)0xAA);
        bufList.add((byte)0xCC);
        bufList.add((byte)floorBCD);
        bufList.add((byte)0xFA);
        bufList.add((byte)0x80);
        bufList.add((byte)0x08);
        bufList.add((byte)0xFF);
        bufList.add((byte)0xBB);
        bufList.add((byte)0xCC);
        return bufList;
    }
    
    public ByteArrayList GetNightModeData(int floor) throws IOException
    {
        byte floorBCD = CommonCalc.Instance().BinaryToBCD((byte)floor);
        ByteArrayList bufList = new ByteArrayList();
        bufList.add((byte)0xAA);
        bufList.add((byte)0xCC);
        bufList.add((byte)floorBCD);
        bufList.add((byte)0xF5);
        bufList.add((byte)0x80);
        bufList.add((byte)0x08);
        bufList.add((byte)0xFF);
        bufList.add((byte)0xBB);
        bufList.add((byte)0xCC);
        return bufList;
    }
    
    public ByteArrayList GetGeoOpenData(int roomid) throws IOException
    {
        int floor = roomid / 100 ;
        byte floorBCD = CommonCalc.Instance().BinaryToBCD((byte)floor);
        int room = roomid % 100 ;
        byte roomBCD = CommonCalc.Instance().BinaryToBCD((byte)room);
        ByteArrayList bufList = new ByteArrayList();
        bufList.add((byte)0xAA);
        bufList.add((byte)0xCC);
        bufList.add((byte)floorBCD);
        bufList.add((byte)roomBCD);
        bufList.add((byte)0xAF);
        bufList.add((byte)0xFA);
        bufList.add((byte)0xD0);
        bufList.add((byte)0x50);
        bufList.add((byte)0x00);
        bufList.add((byte)0x00);
        bufList.add((byte)0x00);
        bufList.add((byte)0xBB);
        bufList.add((byte)0xCC);
        return bufList;
    }
    
    public ByteArrayList GetGeoCloseData(int roomid) throws IOException
    {
        int floor = roomid / 100 ;
        byte floorBCD = CommonCalc.Instance().BinaryToBCD((byte)floor);
        int room = roomid % 100 ;
        byte roomBCD = CommonCalc.Instance().BinaryToBCD((byte)room);
        ByteArrayList bufList = new ByteArrayList();
        bufList.add((byte)0xAA);
        bufList.add((byte)0xCC);
        bufList.add((byte)floorBCD);
        bufList.add((byte)roomBCD);
        bufList.add((byte)0xAF);
        bufList.add((byte)0xFA);
        bufList.add((byte)0x85);
        bufList.add((byte)0x05);
        bufList.add((byte)0x00);
        bufList.add((byte)0x00);
        bufList.add((byte)0x00);
        bufList.add((byte)0xBB);
        bufList.add((byte)0xCC);
        return bufList;
    }
    
    public int GetCurrentWorkMode(DataOperator dataOperator) throws ClassNotFoundException, SQLException, IOException
    {
        int workMode = 0 ;
        ResultSet dataRet = dataOperator.FillDataColl("select cfg_value from RCU_CONFIG_PARAM where cfg_name = 'config_poll'") ;
        if( dataRet.first())
        {
            workMode = dataRet.getInt("cfg_value");
        }
        
        return workMode ;
    }
    
    public boolean HasHigherOrder(DataOperator dataOperator, String priID) throws SQLException, ClassNotFoundException, IOException
    {
        boolean bret = false ;
        String strCmd = "select a.order_id from RCU_WORK_ORDER a, RCU_WORK_PRIORITY b " +
                        "where b.pri_id = '" + priID + "' AND b.pri_val > a.pri_val " +
                        "AND a.order_state = 0 ORDER BY a.order_id limit 1";
        ResultSet dataRet = dataOperator.FillDataColl(strCmd) ;
        if( dataRet.first())
        {
            bret = true ;
        }
        return bret ;
    }
    
    public int GetModeType(DataOperator dataOperator) throws SQLException, ClassNotFoundException, IOException
    {
        int ret = ModeType.MODE_DAY_POINT ;
        int dayHour = 6 ;
        int nightHour = 18 ;

        ResultSet dataRet1 = dataOperator.FillDataColl("SELECT cfg_value FROM RCU_CONFIG_PARAM WHERE cfg_name = 'config_day'") ;
        if( dataRet1.first())
        {
            dayHour = dataRet1.getInt("cfg_value");
        }
        ResultSet dataRet2 = dataOperator.FillDataColl("SELECT cfg_value FROM RCU_CONFIG_PARAM WHERE cfg_name = 'config_night'") ;
        if( dataRet2.first())
        {
            nightHour = dataRet2.getInt("cfg_value");
        }
        
        Calendar cal = Calendar.getInstance() ;
        int hour = cal.get(Calendar.HOUR_OF_DAY);
        int min = cal.get(Calendar.MINUTE);
        if(nightHour < dayHour)
        {
            if(hour == nightHour && min < 1)
            {
                ret = ModeType.MODE_NIGHT_POINT ;
            }
            else if(hour == dayHour && min < 1)
            {
                ret = ModeType.MODE_DAY_POINT ;
            }
            else if(hour >= nightHour && hour < dayHour)
            {
                ret = ModeType.MODE_NIGHT_RANGE ;
            }
            else
            {
                ret = ModeType.MODE_DAY_RANGE ;
            }
        }
        else
        {
            if(hour == dayHour && min < 1)
            {
                ret = ModeType.MODE_DAY_POINT ;
            }
            else if(hour == nightHour && min < 1)
            {
                ret = ModeType.MODE_NIGHT_POINT ;
            }
            else if(hour >= dayHour && hour < nightHour)
            {
                ret = ModeType.MODE_DAY_RANGE ;
            }
            else
            {
                ret = ModeType.MODE_NIGHT_RANGE ;
            }
        }
        
        return ret ;
    }
    
    public IntArrayList GetRoomIDFromRoomName(DataOperator dataOperator, String roomname) throws ClassNotFoundException, SQLException, IOException
    {
        IntArrayList roomidArr = new IntArrayList();
        ResultSet dataRet = dataOperator.FillDataColl("SELECT room_id FROM RCU_ROOM_STATE WHERE room_name = '" + roomname + "' ORDER BY room_id") ;
        while (dataRet.next())
        {
            int roomid = dataRet.getInt("room_id");
            roomidArr.add(roomid);
        }
        return roomidArr ;
    }
    
    private void DeleteFile(String sPath) 
    {  
         File file = new File(sPath);
         if (file.isFile() && file.exists())
         {
             file.delete();
         }
    }

    
    public void WriteLogIntoFile(String folder, String textLine) throws IOException
    {
        Date currentDate = new Date();
        String recordTime = CommonCalc.Instance().GetFormateTimeString(currentDate,"yyyy-MM-dd HH:mm:ss");
        String filename = CommonCalc.Instance().GetFormateTimeString(currentDate,"yyyyMMdd") + ".txt";
        String path = GetLogPath() + folder + "/" + filename;
        
        //如果文件不存在，先创建文件
        File file = new File(path);
        if(!file.exists())
        {
            //没在在创建当天日志文件时，要删除logLimitDays天前的日志文件
            Calendar cal = Calendar.getInstance();  
            cal.setTime(currentDate);  
            cal.set(Calendar.DATE, cal.get(Calendar.DATE) - logLimitDays);  
            Date oldDate = cal.getTime() ;
            String oldFileName = CommonCalc.Instance().GetFormateTimeString(oldDate,"yyyyMMdd") + ".txt";
            String oldPath = GetLogPath() + folder + "/" + oldFileName;
            DeleteFile(oldPath);
            file.createNewFile();
        }
        
        FileWriter writer = new FileWriter(path, true);
        PrintWriter printer = new PrintWriter(writer);
        
        printer.println("[" + recordTime + "]" + textLine);
        printer.close();
        writer.close() ;
    }
    
    public void RecordSerialLog(String type, final byte[] buffer) throws IOException
    {
        String str = ("[" + type + "]");
        str += CommonCalc.Instance().ConvertBufferToString(buffer);
        WriteLogIntoFile("serial", str);
    }
    
    public void RecordSerialLog(String type, String username, final byte[] buffer) throws IOException
    {
        String str = ("[" + type + "]");
        if(!username.contains("[") && !username.contains("]"))
        {
            str += ("[" + username + "]");
        }
        else
        {
            str += (username);
        }
        str += CommonCalc.Instance().ConvertBufferToString(buffer);
        WriteLogIntoFile("serial", str);
    }
    
    public void RecordInSettingLog(String username, final byte[] buffer) throws IOException
    {
        String str = "";
        if(!username.contains("[") && !username.contains("]"))
        {
            str += ("[" + username + "]");
        }
        else
        {
            str += (username);
        }
        str += CommonCalc.Instance().ConvertBufferToString(buffer);
        WriteLogIntoFile("setting", str);
    }
    
    public void RecordSerialLog(String type, String strMessage) throws IOException
    {
        String str = ("[" + type + "]");
        WriteLogIntoFile("serial", str + strMessage);
    }
    
    public void RecordErrorLog( String type, String errMessage, StackTraceElement[] trackArr) throws IOException
    {
        String str = "\n" + errMessage + "\n" ;
        for(int i = 0; i < trackArr.length ; ++i)
        {
            StackTraceElement elem = trackArr[i];
            str += "[" + elem.getFileName() + "]";
            str += "[" + elem.getClassName() + "]";
            str += "[" + elem.getMethodName() + "]";
            str += "[" + String.valueOf(elem.getLineNumber()) + "]\n";
        }
        WriteLogIntoFile("error/" + type, str);
    }
}

