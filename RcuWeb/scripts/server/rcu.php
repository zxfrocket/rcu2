<?php
    require_once('util.php');
    require_once('data_operator.php');
    require_once('RcuObject.php');
    //DEBUG
    $debugFlag = true ;
    if($debugFlag)
    {
        require_once('debug.php');
        debug::$flag = $debugFlag;
        debug::start();
    }
    $options = $_POST["options"];
    //echo json_encode($options); 
    $requireFile = $options['requesInfo']['requireFile'];
    require_once($requireFile);
    $className = $options['requesInfo']['procClass'];
    $obj = new $className($options);
    $obj->process();
    $obj->response();
    
?>
