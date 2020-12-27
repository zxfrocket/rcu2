package com.dlrtie.rcu;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;

public class WorkOrderProcessor
{
    private SerialComunicator mComInst = null ;
    
    public WorkOrderProcessor(SerialComunicator comunicator)
    {
        mComInst = comunicator ;
    }
    
    public void Do() throws Exception
    {
        while(true)
        {
            DataOperator dataOperator = null ;
            long orderID = 0 ;
            try
            {
                dataOperator = new DataOperator();
                dataOperator.Connect();
                if (dataOperator.getConnStatus())
                {
                    ResultSet dataRet = dataOperator.FillDataColl("select * from RCU_WORK_ORDER where order_state = 0 ORDER BY pri_val, order_id limit 1") ;
                    if( dataRet.first())
                    {
                        String username = dataRet.getString("username");
                        orderID = dataRet.getLong("order_id");
                        int orderType = dataRet.getInt("order_type");
                        int roomid = dataRet.getInt("room_id");
                        int priority = dataRet.getInt("pri_val");
                        //int cmd = dataRet.getInt("cmd");
                        byte[] buffer = getOrderData(dataOperator, orderID);
                        /**
                         * orderState=3说明RCU_WORK_ORDER和RCU_WORK_DATA不匹配了，那么该工单记为无效
                         */
                        String orderState = "3";
                        if (buffer.length > 0)
                        {
                            if (0 == orderType)//只发不回
                            {
                                mComInst.Send(username,buffer);
                                orderState = "2";
                                //根据用户名判断是什么命令，如果是轮检，要自增break_count，这个字段是用来判断离线的
                                if(username.equals("[ROOM]"))
                                {
                                    CommonCalc.Instance().IncreaseBreakCountRoom(dataOperator, roomid);
                                }
                                //0x8008命令的日志写到文件中，太多了，不往数据库里写(0x8008都是只发不回的)
                                RecordOrderData(buffer, username, priority);
                            }
                            else if(1 == orderType)//又发又回
                            {
                                mComInst.Send(username,buffer);
                                orderState = "1";
                                //发送完成后，写日志
                                CommonCalc.Instance().MakeUpNewLog(dataOperator, username,1, buffer);
                            }
                            else if(2 == orderType)//直接设置，根本不发
                            {
                                orderState = "2";
                                FrameProcessor.Instance().ProcessFrameData(dataOperator, buffer);
                                //Log记录没有发送记录，只有接收记录，即直接把值记录到了数据库中
                                CommonCalc.Instance().MakeUpNewLog(dataOperator, username,0, buffer);
                                //记录到文件中 北京的要求
                                CommonCalc.Instance().RecordInSettingLog(username, buffer);
                            }
                        }
                        dataOperator.ExcuteCmd("UPDATE RCU_WORK_ORDER SET process_time = now(), order_state = " + orderState +" WHERE order_id = "
                                    + String.valueOf(orderID));
                    }
                }
                dataOperator.Disconnect();
            }
            catch(Exception e)
            {
                if(dataOperator != null)
                {
                    dataOperator.ExcuteCmd("UPDATE RCU_WORK_ORDER SET process_time = now(), order_state = 3 WHERE order_id = "
                            + String.valueOf(orderID));
                    dataOperator.ExceptionClose();
                }
                throw(e);
            }
            
            //RCU硬件识别的串口数据的时间间隔就是500ms
            Thread.sleep(500);
        }
    }
    
    private void RecordOrderData(final byte[] buffer, String username, int priority) throws IOException
    {
        String textLine = GenerateLogString(buffer, username, priority);
        CommonCalc.Instance().WriteLogIntoFile("order", textLine);
    }
    
    private String GenerateLogString(final byte[] buffer, String username, int priority) throws IOException
    {
        String str = "";
        str += username ;
        str += ("[" + priority + "]");
        String content = CommonCalc.Instance().ConvertBufferToString(buffer);
        str += content ;
        return str ;
    }
    
    private byte[] getOrderData(DataOperator dataOperator, long orderID) throws SQLException, ClassNotFoundException, IOException
    {
        ByteArrayList bal = new ByteArrayList();
        if (dataOperator.getConnStatus())
        {
            String cmd = "select data_val from RCU_WORK_DATA where data_id = " + String.valueOf(orderID) + " ORDER BY data_pos";
            ResultSet dataRet = dataOperator.FillDataColl(cmd) ;
            while( dataRet.next())
            {
                /**
                 * 因为java的byte是-128~127，所以只能用getInt，不然会报错
                 */
                byte val = (byte)dataRet.getInt("data_val");
                bal.add(val);
            }
        }
        byte[] buffer = CommonCalc.Instance().CopyArrayListToArray(bal);
        return buffer ;
    }

}