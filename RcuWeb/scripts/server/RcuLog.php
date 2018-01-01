<?php
class RcuLog extends RcuObject
{
    protected function real_process()
    {
        switch($this->action)
        {
        case rcuconst::$action['init']:
        case rcuconst::$action['get']:
            $param = $this->options['param'];
            $logtype = $param['logtype'];
            $arr = $this->getLog($logtype);
            $this->result = array('flag' => true, 'content' => array('logtype' => $logtype,'data' => $arr));
            break;
        }
    }
    
    private function getLog($logtype)
    {
        $cond = '';
        switch($logtype)
        {
        case '0':
            $cond = '(a.log_type = 0 OR a.log_type = 1) AND (b.log_type = 0 OR b.log_type = 1)';
            break;
        case '1':
            break;
        case '2':
            break;
        case '3':
            break;
        }
        $db = new data_operator();
        $db->conn();
        $cmd = "SELECT log_id, username, type_mean, log_time, log_data FROM RCU_ALL_LOG a, RCU_DATA_DIRECTION b WHERE a.log_type = b.log_type AND $cond ORDER BY log_id DESC limit 500";
        
        //debug::pl($cmd,'info');
        $result = $db->fill_data($cmd);
        $arr = array();
        while($obj = $result->fetch_object())
        {
            $cell = array();
            array_push($cell,$obj->log_id);
            array_push($cell,$obj->username);
            array_push($cell,$obj->type_mean);
            array_push($cell,$obj->log_time);
            array_push($cell,$obj->log_data);
            array_push($arr,$cell);
        }
        $db->disconn();
        return $arr;
    }
}
?>
