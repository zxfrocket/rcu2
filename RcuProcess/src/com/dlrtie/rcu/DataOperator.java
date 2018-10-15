package com.dlrtie.rcu;

import java.io.IOException;
import java.sql.*;
import java.util.ArrayList;

import com.mysql.jdbc.exceptions.jdbc4.MySQLSyntaxErrorException;

public class DataOperator
{
    private Connection connSource = null;
    private boolean connStatus = false;
    private PreparedStatement preparedCmd = null;
    private Statement cmd = null ;
    private String lastErrorMessage = "";
    private String dbConnString;
    private String dbUserString;
    private String dbPassString;
    private ArrayList<ResultSet> retArr = new ArrayList<ResultSet>();
    private int deadLockCount = 0;
    
//以下为公共函数
    public DataOperator()
    {
        dbConnString = "jdbc:mysql://localhost:3306/rcu";
        dbUserString = "rcu_admin";
        dbPassString = "rcu_admin";        
    }
    
    public String getLastErrorMessage()
    {
        return lastErrorMessage;
    }
    
    public boolean getConnStatus()
    {
        return connStatus;
    }
    
    public boolean Connect() throws SQLException, ClassNotFoundException
    {
        Class.forName("com.mysql.jdbc.Driver");
        connSource = DriverManager.getConnection(dbConnString,dbUserString,dbPassString);
        connSource.setAutoCommit(false);
        if (connSource.isClosed())
        {
            connStatus = false;
        }
        else
        {
            connStatus = true;
        }
        return connStatus;
    }
    
    private void CommonClose() throws SQLException
    {
        for(int i = 0; i < retArr.size(); ++i)
        {
            ResultSet dataRet = retArr.get(i);
            if(dataRet != null)
            {
                if(!dataRet.isClosed())
                {
                    dataRet.close();
                }           
            }
        }
        retArr = null ;
        if(cmd != null)
        {
            if(!cmd.isClosed())
            {
                cmd.close();
            }
        }
        if(preparedCmd != null){
            if(!preparedCmd.isClosed())
            {
                preparedCmd.close();
                preparedCmd = null ;
            }
        }
    }
    
    public void Disconnect() throws SQLException
    {
        CommonClose();
        if(connSource != null)
        {
        	if(!connSource.isClosed())
        	{
        		connSource.commit();
        		connSource.close();
        	}
        }
    }
    
    public void ExceptionClose() throws SQLException
    {
        CommonClose();
        if(connSource != null)
        {
            if(!connSource.isClosed())
            {
                connSource.rollback();
                connSource.close();
            }
        }
    }
    
    public ResultSet FillDataColl(String strQuery) throws SQLException, IOException
    {
        ResultSet dataRet = null ;
        try
        {
            cmd = connSource.createStatement();
            dataRet = cmd.executeQuery(strQuery);
            retArr.add(dataRet);
        }
        catch(MySQLSyntaxErrorException e)
        {
            CommonCalc.Instance().RecordErrorLog("sql",e.toString(), e.getStackTrace());
        }
        return dataRet ;
    }
    
    public void ExcuteCmd(String strCmd) throws SQLException, IOException
    {
        try
        {
            Statement aCmd = null ;
            try
            {
                aCmd = connSource.createStatement();
                aCmd.executeUpdate(strCmd);
            }
            finally
            {
                aCmd.close() ;
            }
        }
        catch(MySQLSyntaxErrorException e)
        {
            CommonCalc.Instance().RecordErrorLog("sql",e.toString(), e.getStackTrace());
        }
        catch(MySQLTransactionRollbackException e)
        {
            CommonCalc.Instance().RecordErrorLog("sql",e.toString(), e.getStackTrace());
            ++this.deadLockCount;
            if(this.deadLockCount > 20){
                this.deadLockCount = 0;
                throws(e);
            }
            this.ExcuteCmd(strCmd);
        }
    }
    
    //为使用Parameter增加参数而加的，比如插入varbinary类型的数据，直接使用ExcuteCmd不方便
    public void setPreParedCmd(String strCmd) throws SQLException
    {
        preparedCmd = connSource.prepareStatement(strCmd);
    }
    
    public PreparedStatement getParedCmd()
    {
        return preparedCmd ;
    }
}
