<?php
class RcuRoomsRename extends RcuObject
{
    protected function real_process()
    {
        switch($this->action)
        {
            case rcuconst::$action['get']:
                $data = $this->getRoomNames();
                $this->result = array('flag' => true, 'data' => $data);
                break;
            case rcuconst::$action['chg']:
                $param = $this->options['param'];
                $roomid = $param['roomid'];
                $newname = $param['newname'];
                $this->updateRoomName($roomid,$newname);
                $this->result = array('flag' => true,'content' => array('roomid' => $roomid, 'newname' => $newname));
                break;
            
        }
    }
    
    private function updateRoomName($roomid,$newname)
    {
        $db = new data_operator();
        $db->conn();
        $cmd = "UPDATE rcu_room_state SET room_name = '$newname' WHERE room_id = $roomid";
        $db->excute_cmd($cmd);
        $db->disconn();
    }
    
    private function getRoomNames()
    {
        $db = new data_operator();
        $db->conn();
        $cmd = "SELECT room_id, room_name FROM rcu_room_state WHERE if_have = '1' ORDER BY room_id";
        $result = $db->fill_data($cmd);
        $arr = array();
        while ($row = $result->fetch_row()) 
        {
            $cell= array();
            array_push($cell, $row[0]);
            array_push($cell, $row[1]);
            array_push($cell, '<input type=\'textbox\'></input>');
            array_push($cell, '<input type=\'button\' value=\'确定\' class=\'wnd-rcu-rename-ok\' roomid=\'' . $row[0] . '\'></input>');
            array_push($arr, $cell);
        }
        $db->disconn();
        return $arr;
    }
    
}
?>
