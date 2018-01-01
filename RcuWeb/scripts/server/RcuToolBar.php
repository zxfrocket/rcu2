<?php
class RcuToolBar extends RcuObject
{
    protected function real_process()
    {
        if($this->action == rcuconst::$action['init'])
        {
            $param = $this->options['param'];
            $level = $param['level'];
            $infos = $this->getToolBarInfos($level);
            $this->result = array('flag' => true, 'content' => array('infos' => $infos));
        }
    }
    
    private function getToolItemInfos($name,$level)
    {
        $cmd = "SELECT item_name FROM RCU_TOOLBAR_ITEMS WHERE tool_name = '$name' AND lowest_level >= $level ORDER BY item_pos";
        $db = new data_operator();
        $db->conn();
        $result = $db->fill_data($cmd);
        $infos = array();
        while ($row = $result->fetch_row()) 
        {
            $name = $row[0];
            array_push($infos,$name) ;
        }
        $db->disconn();
        return $infos ;
    }
    
    private function getToolBarInfos($level)
    {
        $cmd = "SELECT tool_name FROM RCU_TOOLBAR_DEFINE WHERE lowest_level >= $level ORDER BY tool_pos";
        $db = new data_operator();
        $db->conn();
        $result = $db->fill_data($cmd);
        $infos = array();
        while ($row = $result->fetch_row()) 
        {
            $cell = array('name' => $row[0],'items' => $this->getToolItemInfos($row[0],$level));
            array_push($infos,$cell);
        }
        $db->disconn();
        return $infos ;
    }
    
}
?>
