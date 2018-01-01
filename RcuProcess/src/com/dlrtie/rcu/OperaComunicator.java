package com.dlrtie.rcu;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SocketChannel;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Calendar;
import java.util.Timer;

public class OperaComunicator
{
    private String serverIP  = null;
    private int port  = 0;
    private int bufSize  = 0;
    private SocketChannel channel = null;
    private Timer[] trENQs = null ;
    private Timer trLA = null ;
    
    //保存当前的响应，当收到ENQ时，重新发送响应
    private ByteArrayList mSendedArrList = null;
    

    /***************************************************************
    SendNumber定义了发送给IFC的记录编号，0对应LD，1对应第1条定义的记
           录项,2对应第2条定义的记录项，RecItems+1对应LA,RecItems+2对应LE
    ***************************************************************/
    private int mSendNumber = 0;
    private final int SEND_NUM_LD = 0;
    private final int SEND_NUM_GI = SEND_NUM_LD + 1;
    private final int SEND_NUM_GC = SEND_NUM_GI + 1;
    private final int SEND_NUM_GO = SEND_NUM_GC + 1;
    private final int SEND_NUM_LA = SEND_NUM_GO + 1;
    private final int SEND_NUM_LA_KEEP = SEND_NUM_LA + 1;
    private final int SEND_NUM_LE = SEND_NUM_LA_KEEP + 1;
    
    private final byte STX = (byte)0x02;
    private final byte ETX = (byte)0x03;
    private final byte ACK = (byte)0x06;//收到任何无法解析的数据，都要回ACK
    private final byte NAK = (byte)0x15;//校验出错，也就是说，无法正常解析数据。NAK就是重新发最后一次的数据。(基本不可能，TCP/IP本身就有校验功能，错误数据重发，还指会出现错误)
    private final byte ENQ = (byte)0x05;//RCU发送LD,LR,LA,LE后，如果没有收到ACK(基本不可能，除非网断了)，就要发ENQ，问问对方收没收到,三次ENQ没回复，就断开.
    //在TCP/IP连接下，只有Server端发ENQ,Client端只发ACK应答即可
    private final int LS_TYPE = 1;
    private final int LA_TYPE = 2;
    //除非RCU收到LFC发送的LE，否则，RCU永远不发LE。RCU为的就是一直连上LFC，RCU怎么可能会主动要求断开？
    //断网或者异常之后，就重新连接，也绝对不能发LE，因为LFC收到LE后，就关了，不会在启动了。
    private final int LE_TYPE = 3;
    private final int CONN_OPERA_INTERVAL_ACK = 10000; //10s
    private final int CONN_OPERA_COUNT = 3 ;
    private final int CONN_OPERA_INTERVAL_LA = 300000; //5min
    
    private final int LOG_RECV = 1 ;
    private final int LOG_SEND = 2 ;
    
    private final String operaPriID = "opera" ;
    
    private boolean LRCCheck(final ByteArrayList arr)
    {
        boolean bCorrect = false;
        int nPos_STX = arr.indexOf(STX);
        int nPos_ETX = arr.indexOf(ETX);

        if(nPos_STX >= 0 && nPos_ETX > 0 && nPos_ETX + 2 <= arr.size())
        {
            ByteArrayList record = new ByteArrayList();
            record.addAll(arr.subList(nPos_STX + 1, nPos_ETX + 2)) ;
            bCorrect = CheckOut(record);
        }
        return bCorrect;
    }
    
    private boolean CheckOut(final ByteArrayList arr)   
    {   
        int iLen = arr.size() - 1;
        //最后一个字符是LRC
        byte LRC = arr.get(iLen);
        if(iLen > 1)
        {
           byte cLRC = 0x00;   
           for(int i = 0;i < iLen ; ++i)   
           {
               cLRC = (byte)( cLRC ^ arr.get(i) ); 
           }
           if( cLRC == LRC)
               return true;
        }
        return false;   
    }
    
    private int CheckRecordType(final ByteArrayList arr)
    {
        int nKind = 0;
        
        //LS记录
        if(arr.get(1) == (byte)'L' && arr.get(2) == (byte)'S')
        {
            nKind = LS_TYPE ;
        }
        //LA记录
        else if(arr.get(1) == (byte)'L' && arr.get(2) == (byte)'A')
        {
            nKind = LA_TYPE ;
        }
        //LE记录
        else if(arr.get(1) == (byte)'L' && arr.get(2) == (byte)'E')
        {
            nKind = LE_TYPE ;
        }
        
        return nKind;
    }
    
    private void SendACK() throws IOException
    {
        SendKey(ACK);
    }
    
    private void SendNAK() throws IOException
    {
        SendKey(NAK);
    }
    
    private void SendKey(byte key) throws IOException
    {
        if(channel != null)
        {
            ByteArrayList bal = new ByteArrayList();
            bal.add(key);
            Send(bal);
        }
    }
    
    private void Send(final ByteArrayList arr) throws IOException
    {
        if(channel != null)
        {
            byte[] btArr = CommonCalc.Instance().CopyArrayListToArray(arr);
            ByteBuffer buf = ByteBuffer.wrap(btArr);
            channel.write(buf);
            mSendedArrList = arr ;
            RecordOperaData(arr, LOG_SEND);
        }
    }
    
    private String[] GetCurOperaTime()
    {
        Calendar cal = Calendar.getInstance();
        int year = cal.get(Calendar.YEAR) - 2000 ;
        int month = cal.get(Calendar.MONTH) + 1;//0开始
        int day = cal.get(Calendar.DAY_OF_MONTH) ;//1开始
        int hour = cal.get(Calendar.HOUR_OF_DAY) ;//0开始，24小时
        int min = cal.get(Calendar.MINUTE) ;//0开始
        int second = cal.get(Calendar.SECOND) ;//0开始
        String[] strArr = new String[2];
        strArr[0] = String.format("%02d%02d%02d", year, month, day);
        strArr[1] = String.format("%02d%02d%02d", hour, min, second);
        return strArr;
    }
    
    private void ActiveSend(int nSendedNum) throws IOException
    {
        String strSend = null ;
        //得到Opera格式的当前时间
        String[] strArr = GetCurOperaTime();
        String strDate = strArr[0];
        String strTime = strArr[1];
        switch(nSendedNum)
        {
            case SEND_NUM_LD: //发送LD，LD表示连接说明
                strSend = String.format("LD|DA%s|TI%s|V#1.01|IFEM|", strDate, strTime); 
            break;
            case SEND_NUM_GI: //LR定义GI             
                strSend = "LR|RIGI|FLRNG#GNGSGVGLDATI|";
            break;
            case SEND_NUM_GC: //LR定义GC   
                strSend = "LR|RIGC|FLRNG#GNGSROGLGVDATI|";
            break;
            case SEND_NUM_GO: //LR定义G0  
                strSend = "LR|RIGO|FLRNG#GSDATI|";
            break;
            case SEND_NUM_LA: //发送LA
            case SEND_NUM_LA_KEEP: //发送LA
                strSend = String.format("LA|DA%s|TI%s|",strDate,strTime); 
               break;
            case SEND_NUM_LE:  //发送LE
                strSend = String.format("LE|DA%s|TI%s|",strDate,strTime); 
            break;
            default:
            break;
        }
        if(strSend != null)
        {
            //把字符串转化成字节流
            ByteArrayList sendList = CommonCalc.Instance().ConvertStringToByteArrayList(strSend);
            //加STX,ETX,LRC打包
            ByteArrayList packedSendList = Pack(sendList);
            Send(packedSendList);
        }
        //此时要起ENQ的定时器，也就是说，LFC如果没回ACK，RCU要发送ENQ问，为何没回？LFC几乎不可能不会ACK。
        SetENQTimer();
    }
    
    /**
     * 为待发送字符串加上STX，ETX和LRC校验码 
     * @param orgArrList
     * @return
     */
    private  ByteArrayList Pack(final ByteArrayList orgArrList)
    {
       ByteArrayList arr1 = new ByteArrayList();
       ByteArrayList arr2 = new ByteArrayList();
       
       arr1.add(STX);
       
       arr2.addAll(orgArrList);
       arr2.add(ETX);
       byte lrc = GetLRC(arr2);
       arr2.add(lrc);
       
       arr1.addAll(arr2);
       
       return arr1;  
    }
    
    /**
     * 为字符串去掉STX,ETX和LRC校验码 
     * @param orgArrList
     * @return
     */
    private  ByteArrayList Unpack(final ByteArrayList orgArrList)
    {
       ByteArrayList arr1 = new ByteArrayList();
       arr1.addAll(orgArrList);
       int len = arr1.size() ;
       arr1.removeRange(len - 2, len) ;
       arr1.remove(0);
       
       return arr1;  
    }
    
    /**
     * 计算效验码LRC   
     * @param strDataForLRC
     */
    private byte GetLRC(final ByteArrayList arr)   
    {   
        int iLen = arr.size();
        byte cLRC = (byte)0x00;   
        for(int i = 0; i < iLen; ++i)
        {
             cLRC = (byte)(cLRC ^ arr.get(i));   
        }
        return cLRC;   
    }
    
    private boolean CustomerProc(DataOperator dataOperator, String roomname, int val) throws ClassNotFoundException, SQLException, IOException
    {
        IntArrayList roomidArr = CommonCalc.Instance().GetRoomIDFromRoomName(dataOperator,roomname);
        if(roomidArr.size() > 0)
        {
            if(1 == GetOperaStatus(dataOperator))
            {
                SendRcuCmd(dataOperator, roomidArr, val);
            }
            dataOperator.ExcuteCmd("UPDATE RCU_ROOM_STATE SET if_in = " + String.valueOf(val) + " WHERE room_name = '" + roomname + "'");
            return true ;
        }
        return false ;
    }
    
    private void CustomerIn(DataOperator dataOperator, String roomname) throws SQLException, ClassNotFoundException, IOException
    {
        if(!roomname.equals(""))
        {
            if(CustomerProc(dataOperator, roomname, 1));
            {
                System.out.println("roomname:" + roomname + " check in");
            }
        }
    }
    
    private void CustomerOut(DataOperator dataOperator, String roomname) throws SQLException, ClassNotFoundException, IOException
    {
        if(!roomname.equals(""))
        {
            if(CustomerProc(dataOperator, roomname, 0))
            {
                System.out.println("roomname:" + roomname + " check out");
            }
        }
    }
    
    private String GetRoomName(String str, String key)
    {
        int pos = str.indexOf(key);
        String strRoomName = str.substring(pos + 3, pos + 7);
        strRoomName = strRoomName.replace("|", "");
        
        return strRoomName ;
    }
    
    private void ProcessOperaData(ByteArrayList arr) throws Exception
    {
        ByteArrayList contentArr = Unpack(arr);
        String strOperaData = CommonCalc.Instance().ConvertByteArrayListToString(contentArr);
        //GI|DA090702|TI102531|RN2014|G#2|GNxieqijie|GLEA|GSY|
        //GO|DA100320|TI102520|RN1626|G#1566425|GSY|
        //GC|G#1566426|GNMs Zhao|GLEA|DA100320|TI102520|RN1626|GSN|
        //GC时，CustomerOut处理，不一定有效，可能字符串中，没有RO的信息
        if(strOperaData.length() > 2)
        {
            DataOperator dataOperator = null ;
            try
            {
                dataOperator = new DataOperator();
                dataOperator.Connect();
                if (dataOperator.getConnStatus())
                {
                    String strKey = strOperaData.substring(0, 3) ;
                    if(strKey.equals("GI|"))
                    {
                        String roomname = GetRoomName(strOperaData, "|RN");
                        CustomerIn(dataOperator, roomname);
                    }
                    else if(strKey.equals("GO|"))
                    {
                        String roomname = GetRoomName(strOperaData, "|RN");
                        CustomerOut(dataOperator, roomname);
                    }
                    else if(strKey.equals("GC|"))
                    {
                        String roomname = GetRoomName(strOperaData, "|RO");
                        CustomerOut(dataOperator, roomname);
                        roomname = GetRoomName(strOperaData, "|RN");
                        CustomerIn(dataOperator, roomname);
                    }
                }
                dataOperator.Disconnect();
            }
            catch(Exception e)
            {
                if(dataOperator != null)
                {
                    dataOperator.ExceptionClose();
                }
                throw(e);
            }
        }
    }
    
    private String GenerateLogString(final ByteArrayList arr, int type) throws IOException
    {
        String str = "";
        if(LOG_RECV == type)
        {
            str += "[recv]";
        }
        else if(LOG_SEND == type)
        {
            str += "[send]";
        }
        String content = CommonCalc.Instance().ConvertByteArrayListToString(arr);
        str += content ;
        return str ;
    }
    
    private void RecordOperaData(final ByteArrayList arr, int type) throws IOException
    {
        String textLine = GenerateLogString(arr, type);
        CommonCalc.Instance().WriteLogIntoFile("opera", textLine);
    }
    
    private int GetOperaStatus(DataOperator dataOperator) throws SQLException, ClassNotFoundException, IOException
    {
        int operaStatus = 0 ;
        ResultSet dataRet = dataOperator.FillDataColl("select cfg_value from RCU_CONFIG_PARAM where cfg_name = 'config_opera'") ;
        if( dataRet.first())
        {
            operaStatus = dataRet.getInt("cfg_value");
        }
        return operaStatus ;
    }
    
    private int GetCustomerSetCmd(DataOperator dataOperator) throws ClassNotFoundException, SQLException, IOException
    {
        int cmd = 0 ;
        ResultSet dataRet = dataOperator.FillDataColl("select cmd_id from RCU_CMD_DEFINE where cmd_name = 'cmd_in_set'") ;
        if( dataRet.first())
        {
            cmd = dataRet.getInt("cmd_id");
        }
        return cmd ;
    }
    
    private ByteArrayList GetCustomerData(DataOperator dataOperator, int roomid) throws ClassNotFoundException, SQLException, IOException
    {
        int temp = -1 ;
        int level = -1 ;
        ResultSet dataRet = dataOperator.FillDataColl("select in_setting_temp, in_wind_level from RCU_ROOM_STATE where room_id = " + String.valueOf(roomid)) ;
        if( dataRet.first())
        {
            temp = dataRet.getInt("in_setting_temp");
            level = dataRet.getInt("in_wind_level");
        }
        
        byte btemp = (byte)temp ;
        byte bcdTemp = CommonCalc.Instance().BinaryToBCD(btemp);
        ByteArrayList bal = new ByteArrayList();
        bal.add(bcdTemp);
        bal.add((byte)level);
        
        return bal ;
    }
    
    private void SendRcuCmd(DataOperator dataOperator, IntArrayList roomidArr, int if_in) throws ClassNotFoundException, IOException, SQLException
    {
    	for(int i = 0; i < roomidArr.size(); ++i)
    	{
    		int roomid = roomidArr.get(i);
            ByteArrayList data = GetCustomerData(dataOperator,roomid);
            
            int cmd = GetCustomerSetCmd(dataOperator);
            int cmd1 = (cmd >> 8) & 0xFF;
            int cmd2 = cmd & 0xFF ;
            int floor = roomid / 100 ;
            byte floorBCD = CommonCalc.Instance().BinaryToBCD((byte)floor);
            int room = roomid % 100 ;
            byte roomBCD = CommonCalc.Instance().BinaryToBCD((byte)room);
            
            ByteArrayList bufList = new ByteArrayList();
            bufList.add((byte)0xAA);
            bufList.add((byte)0xCC);
            bufList.add((byte)floorBCD);
            bufList.add((byte)roomBCD);
            bufList.add((byte)cmd1);
            bufList.add((byte)cmd2);
            bufList.add(data.get(0));
            bufList.add(data.get(1));
            bufList.add((byte)0xBB);
            bufList.add((byte)0xCC);
            
            //在此处，order_type = 1，因为这次是真的发送，而不是Web页面的入住设置，那个直接写数据库(order_type = 2)
            CommonCalc.Instance().WriteDataIntoWork(dataOperator, roomid, cmd, 1, "[LFC]", operaPriID, bufList);
    	}
    }
    
    private void SetENQTimer()
    {
        KillENQTimer();
        trENQs = new Timer[3]  ;
        for(int i = 0; i < CONN_OPERA_COUNT ; ++i)
        {
            int delay = CONN_OPERA_INTERVAL_ACK * (i + 1);
            trENQs[i] = new Timer();
            trENQs[i].schedule(new EnQueryProcessor(this, i), delay) ;
        }
    }
    
    private void KillENQTimer()
    {
        if(trENQs != null)
        {
            for(int i = 0; i < trENQs.length ; ++i)
            {
                trENQs[i].cancel() ;
                trENQs[i] = null ;
            }
            trENQs = null ;
        }
    }
    
    private void SetLATimer()
    {
        KillLATimer();
        int delay = CONN_OPERA_INTERVAL_LA;
        trLA = new Timer()  ;
        trLA.schedule(new LAProcessor(this), delay) ;
    }
    
    private void KillLATimer()
    {
        if(trLA != null)
        {
            trLA.cancel() ;
            trLA = null ;
        }
    }
    
    public void Open() throws Exception
    {
        try
        {
            channel = SocketChannel.open(new InetSocketAddress(serverIP, port));
            if(channel.isConnected())
            {
                ByteBuffer buf = ByteBuffer.allocateDirect(bufSize);
                while(true)
                {
                    buf.clear() ;
                    int len = channel.read(buf);
                    if(len > 0)
                    {
                        //收到东西了，定时器可以关了
                        KillENQTimer();
                        ByteArrayList recvList = CommonCalc.Instance().ConvertByteBufferToByteArrayList(buf, len);
                        RecordOperaData(recvList, LOG_RECV);
                        if(recvList.size() == 1)
                        {
                            //接收到ACK
                            if(recvList.get(0) == ACK) 
                            {
                                if(mSendNumber <= SEND_NUM_LA)
                                {
                                    ActiveSend(mSendNumber);
                                    ++mSendNumber;
                                }
                                else if(SEND_NUM_LA_KEEP == mSendNumber)
                                {
                                    //LA_KEEP状态下，接到ACK，说明本次连接完成了，起定时器，
                                    //等待下一次连接，不用定时器等待时间内，有什么别的数据,
                                    //反正LA定时器，就是到点就连一次
                                    if(SEND_NUM_LA_KEEP == mSendNumber)
                                    {
                                        SetLATimer();
                                    }
                                }
                                else if(SEND_NUM_LE == mSendNumber)
                                {
                                    //如果程序走到这，说明LFC关闭了
                                    KillLATimer();
                                    break;
                                }
                            }
                            //接收到NAK
                            else if(recvList.get(0) == NAK)
                            {  
                                ActiveSend(mSendNumber);
                            }
                            else if(recvList.get(0) == ENQ)
                            {
                                //接收到ENQ
                                if(null == mSendedArrList)
                                {
                                    SendNAK();
                                }
                                else
                                {
                                    Send(mSendedArrList);
                                }   
                            }
                            else
                            {
                              SendNAK();
                            }
                        }  
                        else
                        {
                            if(LRCCheck(recvList))
                            {
                                int nType = CheckRecordType(recvList);
                                switch(nType)
                                {
                                    case LS_TYPE: //LS record
                                        mSendNumber = SEND_NUM_LD;
                                        SendACK();
                                        ActiveSend(mSendNumber);
                                        ++mSendNumber;//++后，变为SEND_NUM_GI
                                    break;
                                    case LA_TYPE:  //LA record
                                        SendACK();
                                    break;
                                    case LE_TYPE: //LE record
                                        SendACK();
                                        mSendNumber = SEND_NUM_LE;
                                        ActiveSend(mSendNumber);
                                        break;
                                    default:
                                        //客人入住或退房的相应处理
                                        ProcessOperaData(recvList);
                                        SendACK();
                                    break;
                                }
                            }
                            else  //LRC校验出错，发送NAK
                            {
                                SendNAK();
                            }
                        }
                    }
                }
            }
        }
        finally
        {
            Close();
        }
    }
    
    public void SendENQ() throws IOException
    {
        SendKey(ENQ);
    }
    
    public void SendLA() throws IOException
    {
        ActiveSend(SEND_NUM_LA);
    }
    
    public void Close() throws IOException
    {
        if(channel != null)
        {
            channel.close();
            channel = null ;
        }
    }
    
    public OperaComunicator() throws IOException
    {
        FileReader reader = new FileReader(CommonCalc.Instance().GetConfigName());
        BufferedReader buffer = new BufferedReader(reader);
        String tempString = null;
        while ((tempString = buffer.readLine()) != null) 
        {
            if(-1 == tempString.indexOf("#"))
            {
                if(tempString.indexOf("ip") >=0 )
                {
                    serverIP = tempString.replace("ip=", "");
                }
                else if(tempString.indexOf("port") >=0 )
                {
                    port = Integer.valueOf(tempString.replace("port=", ""));
                }
                else if(tempString.indexOf("buffer") >=0 )
                {
                    bufSize = Integer.valueOf(tempString.replace("buffer=", ""));
                }
            }
        }
        
        EnQueryProcessor.SetCount(CONN_OPERA_COUNT);
    }
}