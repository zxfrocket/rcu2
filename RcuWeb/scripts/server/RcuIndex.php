<?php
class RcuIndex extends RcuObject
{
    protected function real_process()
    {
        if($this->action == rcuconst::$action['init'])
        {
            $idTreeYes = util::getRoomNameTree('1');
            $idTreeNo = util::getRoomNameTree('0');
            $this->result = array('flag' => true, 
            'content' => array('idTreeYes' => $idTreeYes,'idTreeNo' => $idTreeNo));
        }
        else if($this->action == rcuconst::$action['chg'])
        {
            $param = $this->options['param'];
            $name = $param['name'];
            if("suit" == $name)
            {
                $suiteTreeYes = util::getSuiteNameTree('1');
                $suiteTreeNo = util::getSuiteNameTree('0');
                
                $this->result = array('flag' => true, 
                'content' => array('suiteTreeYes' => $suiteTreeYes,'suiteTreeNo' => $suiteTreeNo));
            }
        }
    }
    
}
?>
