<?php
class RcuUserDel extends RcuObject
{
    protected function real_process()
    {
        switch($this->action)
        {
            case rcuconst::$action['chg']:
                $param = $this->options['param'];
                $username = $param['username'];
                if(!$this->existUsername($username))
                {
                    $this->result = array('flag' => false);
                }
                else
                {
                    $cmd = "DELETE FROM RCU_USER_INFO WHERE username = '$username' AND level < 100" ;
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
