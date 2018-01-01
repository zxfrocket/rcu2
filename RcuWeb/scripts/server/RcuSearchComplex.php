<?php
class RcuSearchComplex extends RcuObject
{
    protected function real_process()
    {
        switch($this->action)
        {
            case rcuconst::$action['chg']:
                $param = $this->options['param'];
                $cond = $param['cond'];
                
                $roomids = util::getRoomIDs_Cond(1,$cond);
                $arr = util::getSearchResult($roomids);
                $this->result = array('flag' => true, 'content' => array('data' => $arr));
                break;
        }
    }
    
}