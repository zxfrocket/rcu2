<?php
require_once('RcuCmd.php');
class RcuRoomsMerge extends RcuObject
{
    protected function real_process()
    {
        switch($this->action)
        {
            case rcuconst::$action['chg']:
                $param = $this->options['param'];
                $username = $param['username'];
                
                if(array_key_exists('yes',$param))
                {
                  $yes = $param['yes'];//数组"101, 102, 103"
                  $this->updateSuiteLink(1, $yes, $username);
                }
                
                if(array_key_exists('no',$param))
                {
                    $no = $param['no'];//数组"201, 202, 203"
                    $this->updateSuiteLink(0, $no, $username);
                }
                
                $this->result = array('flag' => true);
                break;
            
        }
    }
    
    private function updateSuiteLink($set_link, $arr, $username)
    {
        $len = count($arr);
        $ids = array();
        for($i = 0; $i < $len; ++$i)
        {
            $cmd = "SELECT room_id from rcu_room_state WHERE suite_id = $arr[$i] AND set_link <> $set_link";
            $db = new data_operator();
            $db->conn();
            $result = $db->fill_data($cmd);
            while ($obj = $result->fetch_object()) 
            {
                $id = $obj->room_id;
                array_push($ids,$id);
            }
            $db->disconn();
        }
        
        /*发送link命令*/
        $cmdInst = new RcuCmd($this->options);
        $cmdName = 'cmd_link_set' ;
        $link = array('name' => 'set_link', 'value' => $set_link);
        $descPairs = array();
        array_push($descPairs, $link);
        $len = count($ids);
        if($len > 0)
        {
            $arrTemp = $cmdInst->getWorkData($cmdName,$descPairs,$ids);
            $cmdInst->writeDataIntoWork($username,$arrTemp);
        }
    }
    
}
?>
