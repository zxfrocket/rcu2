<?php
class RcuUserChgPass extends RcuObject
{
    protected function real_process()
    {
        switch($this->action)
        {
            case rcuconst::$action['chg']:
                $param = $this->options['param'];
                $username = $param['username'];
                $oldpass = $param['oldpass'];
                $newpass = $param['newpass'];
                if(!$this->matchUserAndPass($username,$oldpass))
                {
                    $this->result = array('flag' => false);
                }
                else
                {
                    $cmd = "UPDATE RCU_USER_INFO SET password = '$newpass' WHERE username = '$username' AND level < 100" ;
                    $db = new data_operator();
                    $db->conn();
                    $db->excute_cmd($cmd);
                    $db->disconn();
                    $this->result = array('flag' => true,'content' => array('password' => $newpass));
                }
                break;
            
        }
    }
    
    private function matchUserAndPass($username,$password)
    {
        $cmd = "SELECT username FROM RCU_USER_INFO WHERE username = '$username' and password = '$password' AND level < 100";
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
