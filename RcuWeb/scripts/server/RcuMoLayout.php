<?php
class RcuMoLayout extends RcuObject
{
    protected function real_process()
    {
        switch($this->action)
        {
            case rcuconst::$action['chg']:
                $param = $this->options['param'];
                $roomid = $param['roomid'];
                /**
                 * 根据从客户端传来的键值对"roomid"，返回room的layout背景、各个device对应的位置
                 */
                 //roomtype信息已经在RcuCommon中得到了
                 //$roomType = $this->getRoomType($roomid);
                 $lightState = $this->getLightState($roomid);
                 $lightName = $this->getLightName($roomid);
                 $info = $this->getDeviceInfo($roomid);
                 $this->result = array('flag' => true, 'content' => array('roomid' => $roomid , 
                                       //'roomtype' => $roomType, 
                                       'lightstate' => $lightState, 'lightname' => $lightName, 'info' => $info));
                break;
            case rcuconst::$action['add']:
                 $param = $this->options['param'];
                 $roomid = $param['roomid'];
                 $info = $param['info'];;
                 $this->removeDevicePosition($roomid);
                 $this->addDevicePosition($roomid,$info);
                
                 $this->result = array('flag' => true, 'content' => array('roomid' => $roomid));
                break;
        }
    }
    
    /*private function getRoomType($id)
    {
        $cmd = "SELECT b.type_desc AS 'desc', b.type_image AS 'path' FROM rcu_room_state a, rcu_roomtype_desc b " .
                "WHERE a.room_id = $id AND a.room_type = b.room_type";
        $db = new data_operator();
        $db->conn();
        $result = $db->fill_data($cmd);
        $item = 0;
        if ($obj = $result->fetch_object()) {
           $desc = $obj->desc;
           $path = $obj->path;
           $item = array('desc' => $desc, 'path' => $path);
        }
        $db->disconn();
        
        return $item;
    }*/
    
    private function getLightState($id)
    {
        $cmd = "SELECT light_state_1, light_state_2, light_state_3, light_state_4, " .
                    "light_state_5, light_state_6, light_state_7, light_state_8, " .
                    "light_state_9, light_state_10, light_state_11, light_state_12, " .
                    "light_state_13, light_state_14, light_state_15, light_state_16, " .
                    "light_state_17, light_state_18, light_state_19, light_state_20, " .
                    "light_state_21, light_state_22, light_state_23, light_state_24, " .
                    "light_state_25, light_state_26, light_state_27, light_state_28, " .
                    "light_state_29, light_state_30, light_state_31, light_state_32 " . 
                    "FROM rcu_room_state WHERE room_id = $id";
                    
        $db = new data_operator();
        $db->conn();
        $result = $db->fill_data($cmd);
        $fcnt = $result->field_count;
        $item = array();
        if ($row = $result->fetch_row()) 
        {
            for($i = 0; $i < $fcnt; ++$i)
            {
                $val = $row[$i];
                array_push($item,$val);
            }
        }
        $db->disconn();
        
        return $item;
    }
    
    private function getLightName($id)
    {
        $cmd = "SELECT light_name FROM rcu_light_name WHERE room_id = $id ORDER BY light_index";
                    
        $db = new data_operator();
        $db->conn();
        $result = $db->fill_data($cmd);
        $fcnt = $result->field_count;
        $item = array();
        while ($row = $result->fetch_row()) 
        {
            array_push($item,$row[0]);
        }
        $db->disconn();
        
        return $item;
    }
    
    private function removeDevicePosition($id)
    {
        $cmd1 = "DELETE FROM rcu_bulb_position WHERE room_id = $id";
        $cmd2 = "DELETE FROM rcu_band_position WHERE room_id = $id";
        $db = new data_operator();
        $db->conn();
        $db->excute_cmd($cmd1);
        $db->excute_cmd($cmd2);
        $db->disconn();
    }
    
    private function addDevicePosition($id,$info)
    {
        $cnt = count($info);
        $db = new data_operator();
        $db->conn();
        for($i = 0; $i< $cnt ; ++$i)
        {
            $type = $info[$i]['type'];
            $index = $info[$i]['index'];
            $pt = $info[$i]['pt'];
            if($type == 'bulb')
            {
                $x = $pt['left'];
                $y = $pt['top'];
                $w = $pt['width'];
                $h = $pt['height'];
                $cmd = "INSERT INTO rcu_bulb_position(room_id,idx,loc,x,y,w,h) VALUES($id,$index,$i,$x,$y,$w,$h)";
                $db->excute_cmd($cmd);
            }
            else if($type == 'band')
            {
                $len = count($pt);
                for($j = 0; $j < $len ; ++$j)
                {
                    $x = $pt[$j][0];
                    $y = $pt[$j][1];
                    $cmd = "INSERT INTO rcu_band_position(room_id,idx,loc,pos,x,y) VALUES($id,$index,$i,$j,$x,$y)";
                    $db->excute_cmd($cmd);
                }
            }
        }
        $db->disconn();
    }
    
    private function getDeviceInfo($id)
    {
        $info = array();
        /**
         * 选择灯泡
         */
        $db = new data_operator();
        $db->conn();
        $cmd = "SELECT idx, x, y, w, h FROM rcu_bulb_position WHERE room_id = $id ORDER BY idx, loc";
        $result = $db->fill_data($cmd);
        while ($obj = $result->fetch_object()) 
        {
            $idx = $obj->idx ;
            $x = $obj->x ;
            $y = $obj->y ;
            $w = $obj->w ;
            $h = $obj->h ;
            $item = array('index' => $idx, 'type' => 'bulb', 'pt' => array('left' => $x, 'top' => $y, 
                          'width' => $w, 'height' => $h));
            array_push($info,$item);
        }
        /**
         * 选择灯带
         * 首先得到灯带的个数
         */
        $cmd = "SELECT DISTINCT loc FROM rcu_band_position WHERE room_id = $id ORDER BY loc";
        $result = $db->fill_data($cmd);
        $locArr = array();
        while ($obj = $result->fetch_object()) 
        {
            $loc = $obj->loc ;
            array_push($locArr,$loc);
        }
        /**
         * 其次再得到各个灯带的点坐标
         */
        $cnt = count($locArr);
        for($i = 0; $i < $cnt; ++$i)
        {
            $loc = $locArr[$i];
            $cmd = "SELECT idx, x, y FROM rcu_band_position WHERE room_id = $id AND loc = $loc ORDER BY pos";
            $result = $db->fill_data($cmd);
            $pt = array();
            $idx = 0;
            while ($obj = $result->fetch_object()) 
            {
                $p = array();
                $x = $obj->x ;
                $y = $obj->y ;
                $idx = $obj->idx ;
                array_push($p,$x);
                array_push($p,$y);
                array_push($pt,$p);
             }
             $item = array('index' => $idx, 'type' => 'band', 'pt' => $pt);
             array_push($info,$item);
        }
        $db->disconn();
        return $info ;
    }
}
?>
