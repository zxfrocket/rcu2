<?php
class RcuObject
{
    protected $result = null ;
    protected $options = null ;
    protected $action = null ;
    public function __construct($options)
    {
        $this->options = $options ;
        $this->action = $options['requesInfo']['action'] ;
    }
    public function process()
    {
        $this->real_process();
    }
    protected function real_process()
    {
    }
    public function response()
    {
        $this->result['action'] = $this->action;
        echo json_encode($this->result);
    }
}
?>
