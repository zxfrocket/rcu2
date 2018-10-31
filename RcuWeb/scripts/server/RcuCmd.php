<?php
class RcuCmd extends RcuObject
{
    protected function real_process()
    {
        switch($this->action)
        {
            case rcuconst::$action['chg']:
                $param = $this->options['param'];
                $username = $param['username'];//'admin'
                $cmdName = $param['cmd'] ;//"cmd_door_clock"
                $descPairs = $param['data']; //[{ name="door_clock", value="1"},{ name="xxxx_xxxx", value="0"},]
                $ids = $param['id'];//['101','102']
                $arr = $this->getWorkData($cmdName,$descPairs,$ids);
                /**
                 * arr是一个二维数组，$arr[i]表示一个房间的工单数据，这个数组是和RCU_WORK_DATA的数据一致的
                 * $arr[i]的格式类似于：AA BB 01 01 80 08 00 AA CC
                 */
                $this->writeDataIntoWork($username,$arr);
                $this->result = array('flag' => true, 'content' => array('data' => $arr));
                break;
            
        }
    }
    
    private function getHeadTailByteArr($name)
    {
        $db = new data_operator();
        $db->conn();
        $cmd = "SELECT fmt_val FROM RCU_CMD_FORMAT WHERE fmt_name ='$name' ORDER BY fmt_pos" ;
        $result = $db->fill_data($cmd);
        $arr = array();
        $i = 0 ;
        while($obj = $result->fetch_object())
        {
            $val = $obj->fmt_val ;
            $val = intval($val);
            $arr[$i++] = $val;
        }
        $db->disconn();
        return $arr ;
    }
    
    private function getIDByteArr($id)
    {
        $arr = array();
        $floor = intval($id / 100) ;
        $room = intval($id % 100) ;
        $arr[0] = $floor ;
        $arr[1] = $room ;
        return $arr ;
    }
    
    private function getCmdByteArr($name,&$val)
    {
        $db = new data_operator();
        $db->conn();
        $cmd = "SELECT cmd_id FROM RCU_CMD_DEFINE WHERE cmd_name ='$name'" ;
        $result = $db->fill_data($cmd);
        $arr = array();
        if($obj = $result->fetch_object())
        {
            $val = $obj->cmd_id ;
            $arr[0] = intval($val / 256) ;
            $arr[1] = intval($val % 256) ;
        }
        $db->disconn();
        
        return $arr ;
    }
    
    private function getCmdLen($name)
    {
        $db = new data_operator();
        $db->conn();
        $cmd = "SELECT cmd_len FROM RCU_CMD_LEN WHERE cmd_name ='$name' AND cmd_direct = 1" ;
        $result = $db->fill_data($cmd);
        $len = 0;
        if($obj = $result->fetch_object())
        {
            $len = intval($obj->cmd_len) ;
        }
        $db->disconn();
        
        return $len ;
    }
    
    private function setItemsIntoCmdArr($val,$item,&$arr)
    {
        $db = new data_operator();
        $db->conn();
        $unitID = $item['name'];
        $itemVal = intval($item['value']);
        $cmd = "SELECT begin_byte_pos,byte_len,begin_bit_pos,bit_len,data_form,data_change " .
                "FROM RCU_CMD_CONFIG WHERE unit_id ='$unitID' AND cmd_data = '$val' AND cmd_direct = 1" ;
        $result = $db->fill_data($cmd);
        if($obj = $result->fetch_object())
        {
            $pos = $obj->begin_byte_pos;
            $len = $obj->byte_len;
            $subPos = $obj->begin_bit_pos;
            $subLen = $obj->bit_len;
            $format = $obj->data_form;
            $change = $obj->data_change;//发送时，这个用不上
            $orgVal = 0 ;
            for($i = 0; $i < $len ; ++$i)
            {
                $n = 8 * ($len - 1 - $i);
                $orgVal += ($arr[$pos + $i] << $n);
            }
            /**
             * 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1 0
             * 有一个值为111(二进制),长度是3,假设它要占据应该占据4 3 2位置
             * 先左移13(16-3)位，让这个值位于15 14 13位置
             * 再右移11位(13-2)，让这个值位于4 3 2位置
             */
            $shiftTotalLen = $len * 8;
            $ml = $shiftTotalLen - $subLen;
            $mr = $ml - $subPos;
            $curVal = (($itemVal << $ml) >> $mr);
            $finalVal = $curVal | $orgVal ;
            for($i = 0; $i < $len ; ++$i)
            {
                $nr = 8 * ($len - 1 - $i) ;
                $arr[$pos + $i] = ($finalVal  >> $nr) & 0xFF ;
                if(1 == $format)
                {
                /*TODO: 无法应对BCD和二进制共享一个byte的情形，比如地热设置*/
                    $arr[$pos + $i] = util::BinaryToBCD($arr[$pos + $i]);
                }
            }
        }
        $db->disconn();
    }
    
    public function getWorkData($cmdName,$descPairs,$ids)
    {
        $totalArr = array();
        /**
         * get command lenght(一般来说，这个值都是13)
         */
        $cmdLen = $this->getCmdLen($cmdName);
        /**
         * get head in the cmd arr
         */
        $headArr = $this->getHeadTailByteArr('head');
        $headLen = count($headArr);
        /**
         * get tail in the cmd arr
         */
        $tailArr = $this->getHeadTailByteArr('tail');
        $tailLen = count($tailArr);
        /**
         * get cmd array
         */
        $cmdVal = 0 ;
        $cmdArr = $this->getCmdByteArr($cmdName,$cmdVal);
        /**
         * 每个房间发送一次命令
         * 除了ID需要每次都重新得到，其余的值都是固定的，所以在
         * 这个循环之外就得到好了
         */
        $idCount = count($ids);
        for($k = 0; $k < $idCount; ++$k)
        {
            $arr = array();
            for($i = 0; $i < $cmdLen ; ++$i)
            {
                $arr[$i] = 0 ;
            }
            $items = $descPairs ;//{ name="door_clock", value="1"}
            /**
             * record head in the cmd arr
             */
            for($i = 0; $i < $headLen; ++$i)
            {
                $arr[$i] = $headArr[$i];
            }
            /**
             * record tail in the cmd arr
             */
            for($i = 0; $i < $tailLen; ++$i)
            {
                $arr[$cmdLen - $tailLen + $i] = $tailArr[$i];
            }
            /**
             * add cmd into $items
             */
            array_push($items,array('name' => 'cmd1', 'value' => $cmdArr[0]));
            array_push($items,array('name' => 'cmd2', 'value' => $cmdArr[1]));
            /**
             * add roomid into $items
             */
            $idArr = $this->getIDByteArr($ids[$k]);
            array_push($items,array('name' => 'floorNo', 'value' => $idArr[0]));
            array_push($items,array('name' => 'roomNo', 'value' => $idArr[1]));
            $itemLen = count($items);
            for($j = 0; $j < $itemLen; ++$j)
            {
                $itemArr[$j] = $this->setItemsIntoCmdArr($cmdVal,$items[$j],$arr);
            }
            $totalArr[$k] = array('id' => $ids[$k], 'cmd' => $cmdVal, 'data' => $arr);
        }
        return $totalArr ;
    }
    
    private function getMaxOrderID($db)
    {
        $maxID = 0 ;
        $cmd = "SELECT max(order_id) FROM RCU_WORK_ORDER";
        $result = $db->fill_data($cmd);
        if($row = $result->fetch_row())
        {
            $maxID = $row[0];
        }
        
        return intval($maxID);
    }
    
    private function writeIntoWorkOrder($db, $username,$id,$cmd)
    {
        $orderType = 1 ;
        $priVal = 10000 ;
        //刷新命令
        if($cmd == 0x8008)
        {
            $orderType = 0;
            $priVal = util::getWorkOrderPriority($db, rcuconst::$priority['refresh']);
        }
        //入住设置(只是在数据库设置上，不发送)
        //北京大饭店后来改成发送了
        // else if($cmd == 0xA88A)
        // {
        //     $orderType = 2;
        //     $priVal = util::getWorkOrderPriority($db, rcuconst::$priority['setcmd']);
        // }
        else
        {
            $orderType = 1 ;
            $priVal = util::getWorkOrderPriority($db, rcuconst::$priority['setcmd']);
        }
        $cmdStr = "INSERT INTO RCU_WORK_ORDER(username,pri_val,create_time,order_state,order_type,room_id,cmd) VALUES('$username',$priVal,now(),0,$orderType,$id,$cmd)"; 
        $db->excute_cmd($cmdStr);
    }
    
    private function writeIntoWorkData($db, $maxID,$data)
    {
        $subCnt = count($data);
        for($j = 0; $j < $subCnt ; ++$j)
        {
            $curVal = $data[$j];
            $cmd = "INSERT INTO RCU_WORK_DATA(data_id,data_pos,data_val) VALUES($maxID,$j,$curVal)"; 
            $db->excute_cmd($cmd);
        }
    }
    
    public function writeDataIntoWork($username,$arr)
    {
        /**
         * 工单相关的表有两个RCU_WORK_ORDER和RCU_WORK_DATA,
         * 先写入RCU_WORK_ORDER，再写入RCU_WORK_DATA
         */
        $cnt = count($arr);
        for($i = 0; $i < $cnt ; ++$i)
        {
            $db = new data_operator();
            $db->conn();
            $id = $arr[$i]['id'];
            $cmd = $arr[$i]['cmd'];
            $data = $arr[$i]['data'];
            /**
             * 先写入RCU_WORK_ORDER
             */
            $this->writeIntoWorkOrder($db, $username,$id,$cmd);
            /**
             * 得到order_id
             */
            $maxID = $this->getMaxOrderID($db);
            /**
             * 再将数据写入RCU_WORK_DATA
             */
            $this->writeIntoWorkData($db, $maxID,$data);
            
            $db->disconn();
        }
        
    }
}
?>
