<?php
class RcuUserChgLevel extends RcuObject
{
    protected function real_process()
    {
        switch($this->action)
        {
            case rcuconst::$action['chg']:
                $param = $this->options['param'];
                $username = $param['username'];
                $oldlevel = $param['oldlevel'];
                $newlevel = $param['newlevel'];
                if(!$this->matchUserAndLevel($username,$oldlevel))
                {
                    $this->result = array('flag' => false);
                }
                else
                {
                    $cmd = "UPDATE RCU_USER_INFO SET level = '$newlevel' WHERE username = '$username' AND level < 100" ;
                    $db = new data_operator();
                    $db->conn();
                    $db->excute_cmd($cmd);
                    $db->disconn();
                    $this->result = array('flag' => true,'content' => array('level' => $newlevel));
                }
                break;
            
        }
    }
    
    private function matchUserAndLevel($username,$oldlevel)
    {
        $cmd = "SELECT username FROM RCU_USER_INFO WHERE username = '$username' and level = '$oldlevel' AND level < 100";
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
