<?php
class RcuAlert extends RcuObject
{
    protected function real_process()
    {
        switch($this->action)
        {
            case rcuconst::$action['init']:
            case rcuconst::$action['get']:
                $param = $this->options['param'];
                $alerttype = $param['alerttype'];
                $cond = '' ;
                //0 温度报警
                switch($alerttype)
                {
                case '0':
                    $cond = $this->getTempAlertCond();
                    break;
                }
                
                $roomids = util::getRoomIDs_Cond(1,$cond);
                $arr = array();
                if(count($roomids) > 0)
                {
                    $arr = util::getSearchResult($roomids);
                }
                $this->result = array('flag' => true, 'content' => array('alerttype'=>$alerttype, 'data' => $arr));
                break;
        }
    }
    
    private function getTempAlertCond()
    {
        $db = new data_operator();
        $db->conn();
        $cmd = "SELECT cfg_value FROM RCU_CONFIG_PARAM WHERE cfg_name = 'config_min_temp' ";
        $result = $db->fill_data($cmd);
        $min = 0 ;
        if ($obj = $result->fetch_object()) 
        {
            $min = $obj->cfg_value ;
        }
        $db->disconn();
        
        $db = new data_operator();
        $db->conn();
        $cmd = "SELECT cfg_value FROM RCU_CONFIG_PARAM WHERE cfg_name = 'config_max_temp' ";
        $result = $db->fill_data($cmd);
        $max = 50 ;
        if ($obj = $result->fetch_object()) 
        {
            $max = $obj->cfg_value ;
        }
        $db->disconn();
        
        return "room_temp <= $min OR room_temp >= $max OR waiter = 1";
    }
}