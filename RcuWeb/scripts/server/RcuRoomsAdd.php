<?php
class RcuRoomsAdd extends RcuObject
{
    protected function real_process()
    {
        switch($this->action)
        {
            case rcuconst::$action['chg']:
                $param = $this->options['param'];
                $yes = $param['yes'];//字符串"101, 102, 103"
                $no = $param['no'];//字符串"201, 202, 203"
                if($yes != '')
                {
                    $this->updateRoomHave(1, $yes);
                }
                if($no != '')
                {
                    $this->updateRoomHave(0, $no);
                }
                $this->result = array('flag' => true);
                break;
            
        }
    }
    
    private function updateRoomHave($if_have, $str)
    {
        $cmd = "UPDATE rcu_room_state SET if_have = $if_have WHERE room_id in ($str)";
        $db = new data_operator();
        $db->conn();
        $db->excute_cmd($cmd);
        $db->disconn();
    }
    
}
?>
