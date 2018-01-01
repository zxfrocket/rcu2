<?php
class RcuCommon extends RcuObject
{
    protected function real_process()
    {
        if($this->action == rcuconst::$action['init'])
        {
            
            /**
             * descs = {"state":{"card":{"1":'有卡'}}，"group":{"0":'常用'}}
             * descs['state']['card']['1'] = 有卡
             * descs['state']['card']['meaning'] = 房卡状态
             * descs['state']['card']['type'] = 0 // 0显示图片，1显示text
             * descs['group']['1']
             * 
             */
            $descs = $this->getCommonDescs();
            $this->result = array('flag' => true, 'content' => array('descs' => $descs));//TODO 可以content改为与'chg'的相同
        }
        else if($this->action == rcuconst::$action['chg'])
        {
            $param = $this->options['param'];
            $name = $param['name'];
            if("usercoll" == $name)
            {
                $level = $param['level'];
                $cell = $this->getLowerUserColl($level);
                $pair = array('name' => 'usercoll','desc' => $cell);
                $arr = array();
                array_push($arr,$pair);
                $this->result = array('flag' => true, 'content' => $arr);
            }
            else if("cfgvalue" == $name)
            {
                $param = $this->options['param'];
                $subname = $param['subname'];
                $cfgValue = $this->getConfigValue($subname);
                $pair = array('name' => 'cfgvalue','desc' => $cfgValue);
                $arr = array();
                array_push($arr,$pair);
                $this->result = array('flag' => true, 'content' => $arr);
            }
        }
    }
    
    private function getGroupDescs()
    {
        $cmd = "SELECT group_id, group_desc FROM RCU_GROUP_DEFINE ORDER BY group_id";
        $db = new data_operator();
        $db->conn();
        $result = $db->fill_data($cmd);
        $groupdescs = array();
        while ($row = $result->fetch_row()) 
        {
            $id = $row[0];
            $desc = $row[1];
            $groupdescs[$id] = $desc;
        }
        $db->disconn();
        
        return $groupdescs ;
    }
    
    private function getStateDescs()
    {
        $cmd = "SELECT b.state_name AS sn, b.state_type AS st, a.title_name AS tn,  c.para_value AS pv, c.para_desc AS pd " .
                "FROM RCU_TITLE_DEFINE a, RCU_GROUP_INFO b , RCU_PARA_DEFINE c " .
                "WHERE a.title_id = b.state_name AND a.title_desc = c.para_name";
        $db = new data_operator();
        $db->conn();
        $result = $db->fill_data($cmd);
        $statedescs = array();
        while ($obj = $result->fetch_object()) 
        {
            if(!array_key_exists($obj->sn, $statedescs))
            {
                $statedescs[$obj->sn]['meaning'] = $obj->tn ;
                $statedescs[$obj->sn]['type'] = $obj->st ;
            }
            $statedescs[$obj->sn][$obj->pv] = $obj->pd;
        }
        $db->disconn();
        
        return $statedescs ;
    }
    
    private function getFirstFloor()
    {
        $floor = 1 ;
        $cmd = "SELECT MIN(FLOOR(room_id/100)) AS floor FROM RCU_ROOM_STATE WHERE if_have = 1";
        $db = new data_operator();
        $db->conn();
        $result = $db->fill_data($cmd);
        if ($row = $result->fetch_row()) 
        {
            $floor = $row[0];
        }
        $db->disconn();
        
        return $floor ;
    }
    
    private function getLowestLevel()
    {
        $level = 0;
        $cmd = "SELECT MAX(para_value) FROM RCU_PARA_DEFINE WHERE para_name = 'p_user_role'";
        $db = new data_operator();
        $db->conn();
        $result = $db->fill_data($cmd);
        if ($row = $result->fetch_row()) 
        {
            $level = $row[0];
        }
        $db->disconn();
        return $level ;
    }
    
    private function getToolBarItems($name)
    {
        $cmd = "SELECT item_name, item_desc FROM RCU_TOOLBAR_ITEMS WHERE tool_name = '$name' ORDER BY item_pos";
        $db = new data_operator();
        $db->conn();
        $result = $db->fill_data($cmd);
        $infos = array();
        while ($row = $result->fetch_row()) 
        {
            $name = $row[0];
            $desc = $row[1];
            $infos[$name] = $desc ;
        }
        $db->disconn();
        return $infos ;
    }
    
    private function getToolBarDesc()
    {
        $cmd = "SELECT tool_name, tool_desc FROM RCU_TOOLBAR_DEFINE ORDER BY tool_pos";
        $db = new data_operator();
        $db->conn();
        $result = $db->fill_data($cmd);
        $infos = array();
        while ($row = $result->fetch_row()) 
        {
            $name = $row[0];
            $desc = $row[1];
            $items = $this->getToolBarItems($name);
            $infos[$name] = array('desc' => $desc, 'items' => $items) ;
        }
        $db->disconn();
        return $infos ;
    }
    
    private function getLevelDesc()
    {
        $cmd = "SELECT para_value, para_desc FROM RCU_PARA_DEFINE WHERE para_name = 'p_user_role' ORDER BY para_value";
        $db = new data_operator();
        $db->conn();
        $result = $db->fill_data($cmd);
        $infos = array();
        while ($row = $result->fetch_row()) 
        {
            $level = $row[0];
            $desc = $row[1];
            array_push($infos,array('level' => $level, 'desc' => $desc));
        }
        $db->disconn();
        return $infos ;
    }
    
    private function getLowerUserColl($level)
    {
        $cmd = "SELECT username, level FROM RCU_USER_INFO WHERE level > $level AND level < 100 ORDER BY username";
        $db = new data_operator();
        $db->conn();
        $result = $db->fill_data($cmd);
        $infos = array();
        while ($row = $result->fetch_row()) 
        {
            $username = $row[0];
            $curlevel = $row[1];
            array_push($infos,array('username' => $username, 'level' => $curlevel));
        }
        $db->disconn();
        return $infos ;
    }
    
    private function getCmdList()
    {
        $cmd = 'SELECT cmd_name,cmd_mean FROM RCU_CMD_DEFINE WHERE cmd_id <> 0 ORDER BY cmd_id';
        $db = new data_operator();
        $db->conn();
        $result = $db->fill_data($cmd);
        $cmdList = array();
        while ($obj = $result->fetch_object()) 
        {
            $name = $obj->cmd_name ;
            $desc = $obj->cmd_mean ;
            /**
             * 获取cmd item的内容
             */
            $item = $this->getCmdItem($name);
            /**
             * 保存结果
             */
            $curCmd = array('name' => $name, 'desc' => $desc, 'item' => $item);
            array_push($cmdList, $curCmd);
        }
        $db->disconn();
        
        return $cmdList ;
    }
    
    private function getCmdItem($name)
    {
        $db = new data_operator();
        $db->conn();
        $cmd = "SELECT cmd_item FROM RCU_CMD_CONTENT WHERE cmd_name = '$name' ORDER BY cmd_pos";
        $result = $db->fill_data($cmd);
        $itemArr= array();
        while($obj = $result->fetch_object())
        {
            $desc = 'null';
            $data = 'null';
            $arr = $this->getTitleDesc($obj->cmd_item) ;
            if(2 == count($arr))
            {
                $desc = $arr[0];
                $data = $this->getCmdItemData($arr[1]) ;
            }
            $item = array('name' => $obj->cmd_item, 'desc' => $desc, 'data' => $data);
            array_push($itemArr, $item);
        }
        $db->disconn();
        return $itemArr ;
    } 
    
    private function getCmdItemData($name)
    {
        $db = new data_operator();
        $db->conn();
        $cmd = "SELECT para_value,para_desc FROM RCU_PARA_DEFINE WHERE para_name = '$name' ORDER BY para_value";
        $result = $db->fill_data($cmd);
        $arr = array();
        while($obj = $result->fetch_object())
        {
            $val = $obj->para_value ;
            $desc = $obj->para_desc ;
            $item = array('value' => $val, 'desc' => $desc);
            array_push($arr, $item);
        }
        $db->disconn();
        return $arr ;
    }
    
    private function getTitleDesc($name)
    {
        $db = new data_operator();
        $db->conn();
        $cmd = "SELECT title_name,title_desc FROM RCU_TITLE_DEFINE WHERE title_id = '$name'";
        $result = $db->fill_data($cmd);
        $arr = array();
        if($obj = $result->fetch_object())
        {
            $name = $obj->title_name ;
            $desc = $obj->title_desc ;
            array_push($arr, $name);
            array_push($arr, $desc);
            //debug::pl($arr,'info');
        }
        $db->disconn();
        return $arr ;
    }
    
    public static function getIDRoomTypeMap($if_have)
    {
        $cmd = "SELECT room_id,room_type FROM rcu_room_state WHERE if_have = $if_have ORDER BY room_id";
        $db = new data_operator();
        $db->conn();
        $result = $db->fill_data($cmd);
        $map = array();
        while ($obj = $result->fetch_object()) 
        {
            $id = $obj->room_id;
            $type = $obj->room_type;
            $map[$id] = $type ;
        }
        $db->disconn();
            
        return $map ;
    }
    
    public static function getRoomTypeDescMap()
    {
        $cmd = "SELECT room_type,type_desc,type_image,width,height FROM RCU_ROOMTYPE_DESC ORDER BY room_type";
        $db = new data_operator();
        $db->conn();
        $result = $db->fill_data($cmd);
        $map = array();
        while ($obj = $result->fetch_object()) 
        {
            $type = $obj->room_type;
            $desc = $obj->type_desc;
            $path = $obj->type_image;
            $width = $obj->width;
            $height = $obj->height;
            $map[$type] = array('desc' => $desc, 'path' => $path, 'width' => $width, 'height' => $height) ;
        }
        $db->disconn();
            
        return $map ;
    }
    
    public static function getConfigMap()
    {
        $cmd = "SELECT cfg_name, cfg_value, cfg_text FROM RCU_CONFIG_DEFINE ORDER BY cfg_name, cfg_value";
        $db = new data_operator();
        $db->conn();
        $result = $db->fill_data($cmd);
        $map = array();
        while ($obj = $result->fetch_object()) 
        {
            $name = $obj->cfg_name;
            $val = $obj->cfg_value;
            $txt = $obj->cfg_text;
            $cell = array('value' => $val, 'text' => $txt) ;
            if(!array_key_exists($name,$map))
            {
                $arr = array();
                array_push($arr,$cell);
                $map[$name] = $arr ;
            }
            else
            {
                array_push($map[$name],$cell) ;
            }
        }
        $db->disconn();
            
        return $map ;
    }
    
    public static function getConfigVals()
    {
    	$cmd = "SELECT cfg_name, cfg_value FROM RCU_CONFIG_PARAM";
        $db = new data_operator();
        $db->conn();
        $result = $db->fill_data($cmd);
        $vals = array();
        while ($obj = $result->fetch_object()) 
        {
            $name = $obj->cfg_name;
            $val = $obj->cfg_value;
            $vals[$name] = $val;
        }
        $db->disconn();
            
        return $vals ;
    }
    
    public static function getConfigValue($subname)
    {
        $cmd = "SELECT cfg_value FROM RCU_CONFIG_PARAM WHERE cfg_name = '$subname'";
        $db = new data_operator();
        $db->conn();
        $result = $db->fill_data($cmd);
        $map = array();
        if ($obj = $result->fetch_object()) 
        {
            $val = $obj->cfg_value;
            $map = array($subname => $val);
        }
        $db->disconn();
            
        return $map ;
    }
    
    private function getCommonDescs()
    {
        $moDesc = array('state' => array(),'group' => array());
        $groupdescs = $this->getGroupDescs();
        $statedescs = $this->getStateDescs();
        $stnames = util::getStateNames();
        $firstfloor = $this->getFirstFloor();
        $lowestlevel = $this->getLowestLevel();
        $toolbar = $this->getToolBarDesc();
        $level = $this->getLevelDesc();
        $cmdList = $this->getCmdList();
        $idTypeMap = $this->getIDRoomTypeMap(1);
        $typeDescMap = $this->getRoomTypeDescMap(1);
        $configMap = $this->getConfigMap();
        $configVals = $this->getConfigVals();
        $moDesc['group'] = $groupdescs;
        $moDesc['state'] = $statedescs;
        $moDesc['stnames'] = $stnames;
        $moDesc['first'] = $firstfloor;
        $moDesc['lowest'] = $lowestlevel;
        $moDesc['toolbar'] = $toolbar;
        $moDesc['level'] = $level;
        $moDesc['cmd'] = $cmdList;
        $moDesc['idtype'] = $idTypeMap;
        $moDesc['typedesc'] = $typeDescMap;
        $moDesc['config']['map'] = $configMap;
        $moDesc['config']['vals'] = $configVals;
        
        return $moDesc ;
    }
    
}
?>
