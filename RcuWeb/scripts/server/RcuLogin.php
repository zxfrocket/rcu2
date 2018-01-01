<?php
class RcuLogin extends RcuObject
{
    protected function real_process()
    {
        switch($this->action)
        {
            case rcuconst::$action['chg']:
                $param = $this->options['param'];
                $username = $param['username'];
                $password = $param['password'];
                
                $cmd = "SELECT login_count, last_time, level, password FROM RCU_USER_INFO " .
                    "WHERE username = '$username' AND password = '$password' AND level < 100";
                $db = new data_operator();
                $db->conn();
                $result = $db->fill_data($cmd);
                if($obj = $result->fetch_object())
                {
                    $count = $obj->login_count ;
                    $last = $obj->last_time ;
                    $level = $obj->level ;
                    $password = $obj->password ;
                    $this->resetUserInfo($username,$count);
                    $this->result = array('flag' => true, 'content' => array('userInfo' => array('userName' => $username, 
                    'loginCount' => $count, 'lastTime' => $last, 'userLevel' => $level, 'password' => $password)));
                }
                else
                {
                    $this->result = array('flag' => false);
                }
                $db->disconn();
            break;
        }
    }
    
    private function resetUserInfo($username,$count)
    {
        $curCount = $count + 1 ; 
        $cmd = "UPDATE RCU_USER_INFO SET login_count = $curCount, last_time = now() WHERE username = '$username' AND level < 100";
        $db = new data_operator();
        $db->conn();
        $db->excute_cmd($cmd);
        $db->disconn();
    }
    
}
?>
