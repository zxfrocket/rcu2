<?php
class RcuConfig extends RcuObject
{
    protected function real_process()
    {
        switch($this->action)
        {
            case rcuconst::$action['chg']:
                $param = $this->options['param'];
                $infos = $param['infos'];
                $len = count($infos);
                $arr = array();
                for($i = 0; $i < $len ; ++$i)
                {
                    $info = $infos[$i];
                    $name = $info['name'];
                    $val = $info['value'];
                    $this->updateConfigValue($name,$val);
                    $cell = array('name' => $name,'value' => $val);
                    array_push($arr,$cell);
                }
                $this->result = array('flag' => true, 'content' => array('infos' => $arr));
                break;
        }
    }
    
    public static function updateConfigValue($name,$val)
    {
        $cmd = "UPDATE RCU_CONFIG_PARAM SET cfg_value = $val WHERE cfg_name = '$name'";
        $db = new data_operator();
        $db->conn();
        $db->excute_cmd($cmd);
        $db->disconn();
    }
}