<?php
class RcuMoTemp extends RcuObject
{
    protected function real_process()
    {
        switch($this->action)
        {
            case rcuconst::$action['chg']:
            case rcuconst::$action['add']:
                $param = $this->options['param'];
                $roomid = $param['roomid'];
                $from = $param['from'];
                $to = $param['to'];
                $index = $param['index'];
                
                $arr = $this->getTempInfo($roomid,$from,$to,$index);
                $this->result = array('flag' => true, 'content' => array('roomid' => $roomid,'data' => $arr));
                break;
        }
    }
    
    private function getTempInfo($roomid,$from,$to,$index)
    {
//(('sec' | 'second' | 'min' | 'minute' | 'hour' | 'day' | 'fortnight' | 'forthnight' | 'month' | 'year') 's'?) | 'weeks' | daytext
        $begin = 0;
        $end = 0;
        $begin = new DateTime($from);
        $end = new DateTime($to);
        $beginStr = $begin->format('Y-m-d H:i:s');
        $endStr = $end->format('Y-m-d H:i:s');
        $arr = $this->getEffectTempArr($roomid,$beginStr,$endStr,$index);
        
        return $arr;
    }
    
    private function getPreviewTemp($roomid,$preTimeStr,$index)
    {
        $tbName = 'RCU_TEMP_RECORD';
        if($index == 1)
        {
           $tbName = 'RCU_TEMP_RECORD1';
        }
        else if($index == 2)
        {
           $tbName = 'RCU_TEMP_RECORD2';
        }
        $cmd = "SELECT room_temp FROM $tbName WHERE room_id = $roomid AND date_time < '$preTimeStr' ORDER BY date_time DESC limit 1" ;
        $db = new data_operator();
        $db->conn();
        $cell = 0 ;
        $result = $db->fill_data($cmd);
        if ($obj = $result->fetch_object()) {
           $temp = $obj->room_temp;
           $cell = array('time' => $preTimeStr, 'temp' => $temp);
        }
        $db->disconn();
        return $cell ;
    }
    
    private function getEffectTempArr($roomid,$beginStr,$endStr,$index)
    {
        $effectArr = array();
        //得到begin时间的前一个时间的温度，作为$effectArr的第一个值
        $firstTemp = $this->getPreviewTemp($roomid,$beginStr,$index);
        array_push($effectArr,$firstTemp);
        $tbName = 'RCU_TEMP_RECORD';
        if($index == 1)
        {
           $tbName = 'RCU_TEMP_RECORD1';
        }
        else if($index == 2)
        {
           $tbName = 'RCU_TEMP_RECORD2';
        }
        $cmd = "SELECT date_time, room_temp FROM $tbName WHERE room_id = $roomid AND date_time between '$beginStr' AND '$endStr' ORDER BY date_time" ;
        $db = new data_operator();
        $db->conn();
        $result = $db->fill_data($cmd);
        while ($obj = $result->fetch_object()) {
           $time = $obj->date_time;
           $temp = $obj->room_temp;
           $cell = array('time' => $time, 'temp' => $temp);
           array_push($effectArr,$cell);
        }
        $db->disconn();
        //得到end时间的前一个时间的温度，作为$effectArr的最后一个值
        $lastTemp = $this->getPreviewTemp($roomid,$endStr,$index);
        array_push($effectArr,$lastTemp);
        //返回值类似于[{'time' => $time, 'temp' => $temp},{}]
        return $effectArr ;
    }
}