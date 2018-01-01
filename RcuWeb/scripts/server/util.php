<?php

class rcuconst
{
    public static $layout = array('colCount' => 6);
    public static $action = array('init' => 'init',
                  'chg' => 'chg', 'add' => 'add','get' =>'get' );
    public static $priority = array('opera' => 'opera',
                  'refresh' => 'refresh', 'setcmd' => 'setcmd','daymode' =>'daymode','nightmode' =>'nightmode',
                  'pollroom' => 'pollroom', 'pollfloor' => 'pollfloor' );
}

class util{
    public static function BinaryToBCD($nBin)
    {
        $nBin = $nBin & 0xFF ;
        $aHi = intval($nBin / 10);
        $aLo = intval($nBin % 10);
        $aHi = intval($aHi << 4);
        return intval($aHi + $aLo);
    }
    
    public static function getEnabledUserList($userlevel)
    {
        $cmd = "SELECT username, level FROM RCU_USER_INFO WHERE level > $userlevel AND level < 100 ORDER BY username, level DESC" ;
        $db = new data_operator();
        $db->conn();
        $result = $db->fill_data($cmd);
        $arr = array();
        while($obj = $result->fetch_object())
        {
            $username = $obj->username ;
            $level = $obj->level ;
            array_push($arr,array('username' => $username, 'level' => $level));
        }
        $db->disconn();
        return $arr ;
    }
    
    public static function getTitleDesc($name)
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
    
    public static function getValueDesc($param,$value)
    {
        $db = new data_operator();
        $db->conn();
        $cmd = "SELECT para_desc FROM RCU_PARA_DEFINE WHERE para_name = '$param' AND para_value = $value";
        $result = $db->fill_data($cmd);
        if($obj = $result->fetch_object())
        {
            $desc = $obj->para_desc ;
            $db->disconn();
            return $desc;
        }
        $db->disconn();
        return '' ;
    }
    
    public static function getArrayFromCmd($cmd)
    {
        $db = new data_operator();
        $db->conn();
        $result = $db->fill_data($cmd);
        $item = array();
        $i = 0;
        while ($row = $result->fetch_row()) 
        {
            array_push($item, $row[0]);
        }
        $db->disconn();
        
        return $item;
    }
    
    public static function getFloors($if_have)
    {
        $cmd = "SELECT DISTINCT FLOOR(room_id/100) AS floor FROM rcu_room_state WHERE if_have = $if_have ORDER BY floor";
        $floorColl = util::getArrayFromCmd($cmd);
        return $floorColl ;
    }
    
    public static function getRoomIDs($if_have,$floor)
    {
        $cmd = "SELECT room_id FROM rcu_room_state WHERE if_have = $if_have AND (FLOOR(room_id/100) = $floor) ORDER BY room_id";
        $roomidColl = util::getArrayFromCmd($cmd);
        return $roomidColl ;
    }
    
    public static function getRoomIDs_Cond($if_have,$cond)
    {
        $cmd = "SELECT room_id FROM rcu_room_state WHERE if_have = $if_have AND $cond ORDER BY room_id";
        $roomidColl = util::getArrayFromCmd($cmd);
        return $roomidColl ;
    }
    
    public static function getRoomNames($if_have,$floor)
    {
        $cmd = "SELECT room_name FROM rcu_room_state WHERE if_have = $if_have AND (FLOOR(room_id/100) = $floor) ORDER BY room_id";
        $roomidColl = util::getArrayFromCmd($cmd);
        return $roomidColl ;
    }
    
    public static function getRoomDescs($if_have,$floor)
    {
        $cmd = "SELECT room_desc FROM rcu_room_state WHERE if_have = $if_have AND (FLOOR(room_id/100) = $floor) ORDER BY room_id";
        $roomidColl = util::getArrayFromCmd($cmd);
        return $roomidColl ;
    }
    
    public static function getAllRowsFromCmd($cmd)
    {
        $db = new data_operator();
        $db->conn();
        $result = $db->fill_data($cmd);
        $item = array();
        $finfo = $result->fetch_fields();
        $fcnt = $result->field_count;
        $rowIndex = 0;
        while ($row = $result->fetch_row()) 
        {
            $rowArr = array();
            for($i = 0; $i < $fcnt; ++$i)
            {
                $val = $row[$i];
                array_push($rowArr,$row[$i]);
            }
            $item[$rowIndex++] = $rowArr;
        }
        $db->disconn();
        
        return $item;
    }
    
    public static function getRoomInfos($if_have,$floors)
    {
        $cmd = "SELECT room_id, room_name, room_desc FROM rcu_room_state WHERE if_have = $if_have AND FLOOR(room_id/100) in (" ;
        $len = count($floors);
        for($i = 0; $i < $len ; ++$i)
        {
            $cmd = $cmd . "$floors[$i]" ;
            if($i < $len - 1)
            {
            	$cmd = $cmd. "," ;
            }
        }
        $cmd = $cmd . ") ORDER BY room_id";
        $arr = util::getAllRowsFromCmd($cmd);
        $len = count($arr);
        $infos = array();
        for($i = 0; $i < $len ; ++$i)
        {
            $cell = array('roomid' => $arr[$i][0], 'roomname' => $arr[$i][1], 'roomdesc' => $arr[$i][2]);
            array_push($infos,$cell);
        }
        return $infos ;
    }
    
    public static function delRoom($roomid)
    {
        $cmd = "UPDATE rcu_room_state SET if_have = 0 WHERE room_id = $roomid";
        $db = new data_operator();
        $db->conn();
        $db->excute_cmd($cmd);
        $db->disconn();
    }
    
    public static function delFloor($floor)
    {
        $cmd = "UPDATE rcu_room_state SET if_have = 0 WHERE FLOOR(room_id/100) = $floor";
        $db = new data_operator();
        $db->conn();
        $db->excute_cmd($cmd);
        $db->disconn();
    }
    
    public static function getRoomIDTree($if_have)
    {
        $cmd = "SELECT room_id FROM rcu_room_state WHERE if_have = $if_have ORDER BY room_id";
        $db = new data_operator();
        $db->conn();
        $result = $db->fill_data($cmd);
        $idTree = array();
        $oldFloor = 0 ;
        $idx = -1 ;
        while ($obj = $result->fetch_object()) 
        {
            $id = $obj->room_id;
            $curFloor = intval($id/100);
            if($oldFloor != $curFloor)
            {
                $idSubTreeItems = array();
                $idSubTree = array('floor' => $curFloor, 'rooms' => $idSubTreeItems);
                array_push($idTree, $idSubTree);
                ++$idx;
            }
            array_push($idTree[$idx]['rooms'], $id);
            $oldFloor = $curFloor ;
        }
        $db->disconn();
            
        return $idTree ;
    }
    
    public static function getRoomNameTree($if_have)
    {
        $cmd = "SELECT room_name, room_id FROM rcu_room_state WHERE if_have = $if_have ORDER BY room_name,room_id";
        $db = new data_operator();
        $db->conn();
        $result = $db->fill_data($cmd);
        $nameTree = array();
        $oldFloor = 0 ;
        $oldName = '0000' ;
        $floorIdx = -1 ;
        $nameIdx = -1 ;
        while ($obj = $result->fetch_object()) 
        {
            $id = $obj->room_id;
            $name = $obj->room_name;
            $curFloor = intval($id/100);
            if($oldFloor != $curFloor)
            {
                $nameIdx = -1 ;
                $idSubTree = array('floor' => $curFloor, 'rooms' => array());
                array_push($nameTree, $idSubTree);
                ++$floorIdx;
            }
            if($oldName != $name)
            {
                array_push($nameTree[$floorIdx]['rooms'], array('name' => $name, 'ids' => array()));
                ++$nameIdx;
            }
            array_push($nameTree[$floorIdx]['rooms'][$nameIdx]['ids'], $id);
            $oldFloor = $curFloor ;
            $oldName = $name ;
        }
        $db->disconn();
            
        return $nameTree ;
    }
    
    public static function getSuiteNameTree($set_link)
    {
        $cmd = "SELECT DISTINCT suite_name, suite_id FROM rcu_room_state WHERE set_link = $set_link AND suite_id <> room_id ORDER BY suite_name,suite_id";
        $db = new data_operator();
        $db->conn();
        $result = $db->fill_data($cmd);
        $nameTree = array();
        $oldFloor = 0 ;
        $oldName = '0000' ;
        $floorIdx = -1 ;
        $nameIdx = -1 ;
        while ($obj = $result->fetch_object()) 
        {
            $id = $obj->suite_id;
            $name = $obj->suite_name;
            $curFloor = intval($id/100);
            if($oldFloor != $curFloor)
            {
                $nameIdx = -1 ;
                $idSubTree = array('floor' => $curFloor, 'rooms' => array());
                array_push($nameTree, $idSubTree);
                ++$floorIdx;
            }
            if($oldName != $name)
            {
                array_push($nameTree[$floorIdx]['rooms'], array('name' => $name, 'ids' => array()));
                ++$nameIdx;
            }
            array_push($nameTree[$floorIdx]['rooms'][$nameIdx]['ids'], $id);
            $oldFloor = $curFloor ;
            $oldName = $name ;
        }
        $db->disconn();
            
        return $nameTree ;
    }
    
    public static function getRoomIdCmdStr($roomids)
    {
        $len = count($roomids);
        $str = '';
        for($i = 0; $i < $len ; ++$i)
        {
            $str = $str . "$roomids[$i]" ;
            if($i < $len - 1)
            {
                $str = $str. "," ;
            }
        }
        return $str ;
    }
    
    //for Monitor begin
    private static function getGroupInfos()
    {
        $cmd = "SELECT group_desc FROM RCU_GROUP_DEFINE ORDER BY group_id";
        $db = new data_operator();
        $db->conn();
        $result = $db->fill_data($cmd);
        $groupInfos = array();
        while ($row = $result->fetch_row()) 
        {
            $desc = $row[0];
            array_push($groupInfos,  array());
        }
        $db->disconn();
        return $groupInfos ;
    }
    
    private static function getGroupStateName()
    {
        $groupInfos = util::getGroupInfos();
        $stateNameArr = array();
        $mapNameToGroup = array();
        $cmd = "SELECT group_id,state_name FROM RCU_GROUP_INFO ORDER BY group_id, state_pos";
        $db = new data_operator();
        $db->conn();
        $result = $db->fill_data($cmd);
        while ($row = $result->fetch_row()) 
        {
            $groupId = $row[0];
            $stateName = $row[1];
            array_push($groupInfos[$groupId],
                       array('name' => $stateName, 'value' => 0));
            array_push($stateNameArr, $stateName);
            /**
             * 比如$mapNameToGroup['card']['id'] = [0,0] 
             * 比如$mapNameToGroup['card']['pos'] = [0,1]
             * 上面的意思是：RCU_GROUP_INFO中
             * group_id, group_name, group_pos
             * 0           'card'     0
             * 0           'card'     1
             * 在页面上显示时，显示两个card信息，当然实际上不会的，
             * 这只是举个例子，即，某个state的内容，可以在页面上显示
             * 无数次，只要在RCU_GROUP_INFO中配置了即可
             */
            $len = count($groupInfos[$groupId]);
            $mapInfo = array('id' => $groupId, 'pos' => ($len - 1));
            if(!array_key_exists($stateName, $mapNameToGroup))
            {
                $mapNameToGroup[$stateName] = array();
            }
            array_push($mapNameToGroup[$stateName],$mapInfo);
        }
        $db->disconn();
        
        return array($groupInfos, $stateNameArr,$mapNameToGroup) ;
    }
    
    /**
     * $orderInfo = [a,b,c]
     * a = {'suiteid':101,'count':1}
     * b = {'suiteid':102,'count':4}
     */
    private static function getOrderSuiteidArr($orderInfo)
    {
        $arr = array();
        $len = count($orderInfo);
        for($i = 0; $i < $len ; ++$i)
        {
            $id = $orderInfo[$i]['suiteid'];
            array_push($arr,$id);
        }
        return $arr ;
    }
    
    /**
     * $oldArr = [a,b,c]
     * a = {'suiteid':101,'count':1}
     * b = {'suiteid':102,'count':4}
     * 如果 colCount=6，那么不管$oldArr中的元素是几个，
     * $newArr最多只返回6个
     */
    private static function getBestTopNOrder($oldArr)
    {
        $newArr = array();
        $len = count($oldArr);
        $remainLen = rcuconst::$layout['colCount'] ;
        for($i = 0; $i < $len && $remainLen > 0; ++$i)
        {
            $curElem = $oldArr[$i];
            $curCount = $curElem['count'];
            if($remainLen >= $curCount)
            {
                array_push($newArr,$curElem);
                $remainLen -= $curCount ;
            }
        }
        return $newArr ;
    }
    
    private static function haveThisSuiteId($id,$arr)
    {
        $len = count($arr);
        for($i = 0; $i < $len; ++$i)
        {
            $curElem = $arr[$i];
            $curSuiteId = $curElem['suiteid'] ;
            if($curSuiteId == $id)
            {
                return true ;
            }
        }
        return false ;
    }
    
    /**
     * $oldArr和$topNArr的数据结构与getBestTopNOrder函数
     * 的参数的数据结构一样
     * 从$oldArr中，找出TopN中的元素，将这些元素排除在外，
     * 只返回$oldArr中，在TopN之外的元素
     */
    private static function getNewOrderRemoveTopN($oldArr,$topNArr)
    {
        $newArr = array();
        $len = count($oldArr);
        for($i = 0; $i < $len; ++$i)
        {
            $curElem = $oldArr[$i];
            $curSuiteId = $curElem['suiteid'];
            if(!util::haveThisSuiteId($curSuiteId,$topNArr))
            {
                array_push($newArr,$curElem);
            }
        }
        return $newArr ;
    }
    
    /**
     * $orderInfo = [1,1,2,4]
     * [101] = 1
     * [102] = 1
     * [103] = 2
     * [105] = 4
     */
    private static function getFinalSuite($oldInfos,$orderInfo)
    {
        $keys = array_keys($orderInfo) ;
        $values = array_values($orderInfo);
        $len = count($orderInfo);
        $tmpInfo = array();
        
        for($i = 0; $i < $len ; ++$i)
        {
            $curSuiteId = $keys[$i];
            $curCount = $values[$i];
            $cell = array('suiteid' => $curSuiteId, 'count' => $curCount);
            array_push($tmpInfo,$cell);
        }
        
        $suiteidArr = array();//[101,102,103,105]
        $newOrderInfo = array();
        do
        {
            $newOrderInfo = util::getBestTopNOrder($tmpInfo);
            $tmpInfo = util::getNewOrderRemoveTopN($tmpInfo,$newOrderInfo);
            $oneArr = util::getOrderSuiteidArr($newOrderInfo);
            $suiteidArr = array_merge($suiteidArr,$oneArr);
        }while(count($tmpInfo) > 0);
        
        $newInfos = array() ;
        $len = count($suiteidArr);
        for($i = 0; $i < $len ; ++$i)
        {
            $id = $suiteidArr[$i];
            array_push($newInfos,$oldInfos[$id]);
        }
        
        return $newInfos ;
    }
    
    private static function getSuiteInfos($roomids)
    {
        $cmd = "SELECT suite_id, room_id FROM RCU_ROOM_STATE WHERE room_id in ( " .
                util::getRoomIdCmdStr($roomids) .
                ") ORDER BY suite_id, room_id";
        $db = new data_operator();
        $db->conn();
        $result = $db->fill_data($cmd);
        $info = array() ;
        $orderArr = array();
        $mapRoomIdToSuiteId = array();
        while ($row = $result->fetch_row()) 
        {
            $suiteId = $row[0] ;
            $roomId = $row[1] ;
            if(!array_key_exists($suiteId, $info))
            {
                $info[$suiteId] = array('suiteid' => $suiteId,'suiteinfos' => array());
                $orderArr[$suiteId] = 0 ;
            }
            $mapRoomIdToSuiteId[$roomId] = $suiteId;
            $info[$suiteId]['suiteinfos'][$roomId] = array();
            ++$orderArr[$suiteId] ;
        }
        $db->disconn();
        return array($info, $mapRoomIdToSuiteId,$orderArr) ;
    }
    
    public static function getMonitorInfos($roomids)
    {
        $tempArr = util::getSuiteInfos($roomids);
        $infos = $tempArr[0];
        $mapRoomIdToSuiteId = $tempArr[1];
        $orderArr = $tempArr[2];
        $tmpArr = util::getGroupStateName();
        $groupInfos = $tmpArr[0];
        $stateNameArr = $tmpArr[1];
        $mapNameToGroup = $tmpArr[2];
        //get cmd string
        $len = count($stateNameArr);
        $cmd = "SELECT room_id, room_name, room_desc, ";
        for($i = 0; $i < $len ; ++$i)
        {
            $cmd = $cmd . "$stateNameArr[$i]" ;
            if($i < $len - 1)
            {
                $cmd = $cmd. "," ;
            }
        }
        $cmd = $cmd . " FROM rcu_room_state WHERE room_id in (" ;
        $cmd = $cmd . util::getRoomIdCmdStr($roomids);
        $cmd = $cmd . ") ORDER BY room_id";
        //get every state value
        $db = new data_operator();
        $db->conn();
        $result = $db->fill_data($cmd);
        $finfo = $result->fetch_fields();
        $fcnt = $result->field_count;
        $rowIndex = 0;
        while ($row = $result->fetch_row()) 
        {
            for($i = 3; $i < $fcnt; ++$i)
            {
                $key = $finfo[$i]->name;
                $val = $row[$i];
                $mapLen = count($mapNameToGroup[$key]);
                for($j = 0; $j < $mapLen ; ++$j)
                {
                    $groupId = $mapNameToGroup[$key][$j]['id'];
                    $pos = $mapNameToGroup[$key][$j]['pos'];
                    $groupInfos[$groupId][$pos]['value'] = $val;
                }
            }
            //moinfos = {groupInfos:[x, y, z],sliderinfos:{pos:0}}
            $monifos = array('groupInfos' => $groupInfos, 'sliderinfos' => array('pos' => 0));
            $oneroomInfos = array('roomid' => $row[0],'roomname' => $row[1],'roomdesc' => $row[2],
                          'houseinfos' => array('moinfos' => $monifos, 'opinfos' => array()));
            $suiteId = $mapRoomIdToSuiteId[$row[0]];
            $infos[$suiteId]['suiteinfos'][$row[0]] = $oneroomInfos ;
        }
        $db->disconn();
        
        $orderInfos = util::getFinalSuite($infos,$orderArr);
        
        reset($orderInfos);
        $finalInfos = array();
        while (list($key, $val) = each($orderInfos)) 
        {
            reset($val['suiteinfos']);
            $subFinalInfos = array();
            while (list($subkey, $subval) = each($val['suiteinfos'])) 
            {
                array_push($subFinalInfos,$subval);
            }
            $val['suiteinfos'] = $subFinalInfos ;
            array_push($finalInfos,$val);
        }
        return $finalInfos ;
    }
    
    public static function getStateNames()
    {
        $cmd = "SELECT state_name FROM RCU_GROUP_INFO WHERE state_name <> 'holder' ORDER BY group_id, state_pos";
        $db = new data_operator();
        $db->conn();
        $result = $db->fill_data($cmd);
        $stnames = array();
        while ($obj = $result->fetch_object()) 
        {
            array_push($stnames, $obj->state_name);
        }
        $db->disconn();
        
        return $stnames ;
    }
    
    public static function getSearchResult($roomids)
    {
        $stateNameArr = util::getStateNames();
        $len = count($stateNameArr);
        $db = new data_operator();
        $db->conn();
        $cmd = "SELECT room_id, room_name, room_desc, ";
        for($i = 0; $i < $len ; ++$i)
        {
            $cmd = $cmd . "$stateNameArr[$i]" ;
            if($i < $len - 1)
            {
                $cmd = $cmd. "," ;
            }
        }
        $cmd = $cmd . " FROM rcu_room_state WHERE room_id in (" ;
        $cmd = $cmd . util::getRoomIdCmdStr($roomids);
        $cmd = $cmd . ") ORDER BY room_id";
        //debug::pl($cmd,'info');
        $result = $db->fill_data($cmd);
        $arr = array();
        $fcnt = $result->field_count;
        while ($row = $result->fetch_row()) 
        {
            $cell = array();
            array_push($cell,$row[0]);
            array_push($cell,$row[1]);
            //TODO 房间类型先不写，等程序中加入了修改房价类型的内容过后，再写
            //array_push($cell,$row[2]);
            for($i = 3; $i < $fcnt; ++$i)
            {
                array_push($cell,$row[$i]);
            }
            array_push($arr,$cell);
        }
        $db->disconn();
        return $arr;
    }
    //end monitor
    
    public static function getWorkOrderPriority($db, $priID)
    {
        $priVal = 1000 ;
        $cmd = "SELECT pri_val FROM RCU_WORK_PRIORITY WHERE pri_id = '$priID'";
        $result = $db->fill_data($cmd);
        if ($obj = $result->fetch_object()) 
        {
            $priVal = $obj->pri_val ;
        }
        
        return $priVal ;
    }
}
?>
