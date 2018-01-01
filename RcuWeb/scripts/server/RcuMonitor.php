<?php
class RcuMonitor extends RcuObject
{
    protected function real_process()
    {
        switch($this->action)
        {
        case rcuconst::$action['init']:
        case rcuconst::$action['add']:
        case rcuconst::$action['chg']:
        case rcuconst::$action['get']:
            $param = $this->options['param'];
            $if_have = $param['if_have'];
            $floor = $param['floor'];
            /**
             * roomids is [101,102,103....]
             */
            $roomids = util::getRoomIDs($if_have,$floor);
            
            /**
             * $infos = [a, b, c];
             * a = {suiteid:suiteid,suiteinfos:[a1,a2,a3]}
             * a1(其实就是$oneroomInfos) = {roomid:101,roomName:'0101',roomdesc:'标准间',
             * houseinfos:{"moinfos":moinfos,"opinfos":opinfos}}
             * moinfos = {groupInfos:[x, y, z],sliderinfos:{pos:0}}
             * x = [x1,x2,x3]
             * x1 = {name:card,value:1,desc:有卡}
             */
            $infos = util::getMonitorInfos($roomids);
            $this->result = array('flag' => true, 'content' => array('floor' => $floor,'infos' => $infos));
            break;
        }
    }
}
?>
