<?php

class debug{
    public static $flag = false ;
    
    public static function start()
    {
        if(debug::$flag)
        {
            require_once('../../third/FirePHPCore/fb.php');
            ob_start();
        }
    }
    
    public static function pl($var, $type, $str)
    {
        if(debug::$flag)
        {
            if($type == 'war')
            {
                fb($var,FirePHP::WARN);
            }
            else if($type == 'inf')
            {
                fb($var,FirePHP::INFO);
            }
            else if($type == 'err')
            {
                fb($var,$str,FirePHP::ERROR);
            }
            else
            {
                fb($var);
            }
        }
        
    }
}
    
?>
