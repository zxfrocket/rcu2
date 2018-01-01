<?php
class RcuUserAdd extends RcuObject
{
    protected function real_process()
    {
        switch($this->action)
        {
            case rcuconst::$action['chg']:
                $param = $this->options['param'];
                $username = $param['username'];
                $password = $param['password'];
                $level = $param['level'];
                if($this->existUsername($username))
                {
                    $this->result = array('flag' => false);
                }
                else
                {
                    $cmd = "INSERT INTO RCU_USER_INFO (username,password,reg_time,login_count,level) VALUES ('$username','$password',now(),0,$level)" ;
                    $db = new data_operator();
                    $db->conn();
                    $db->excute_cmd($cmd);
                    $db->disconn();
                    $this->result = array('flag' => true);
                }
                break;
            
        }
    }
    
    private function existUsername($username)
    {
        $cmd = "SELECT username FROM RCU_USER_INFO WHERE username = '$username' AND level < 100";
        $db = new data_operator();
        $db->conn();
        $result = $db->fill_data($cmd);
        if($obj = $result->fetch_object())
        {
            return true ;
        }
        return false;
    }
}
?>
