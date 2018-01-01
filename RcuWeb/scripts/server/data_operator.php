<?php
class data_operator extends mysqli 
{
    private $host = '';
    private $user = '';
    private $pass = '';
    private $db = '';
    private $data = null;
    private $needCommit = false ;
    
    //TODO 在php中，改写绝大多数的数据库操作调用函数，让他们与RcuCmd.php中写入工单的操作一样，保证事务的完整。
    //TODO java中的操作也一样,保证事务的完整。
    public function conn() 
    {
        $this->host = 'localhost';
        $this->user = 'rcu_admin';
        $this->pass = 'rcu_admin';
        $this->db = 'rcu';
        parent::init();

        if (!parent::options(MYSQLI_INIT_COMMAND, 'SET AUTOCOMMIT = 0')) 
        {
            die('Setting MYSQLI_INIT_COMMAND failed');
        }

        if (!parent::options(MYSQLI_OPT_CONNECT_TIMEOUT, 5)) 
        {
            die('Setting MYSQLI_OPT_CONNECT_TIMEOUT failed');
        }

        if (!parent::real_connect($this->host, $this->user, $this->pass, $this->db)) 
        {
            die('Connect Error (' . mysqli_connect_errno() . ') '
                    . mysqli_connect_error());
        }
        parent::query("set character set 'utf8'");//读库
        parent::query("set names 'utf8'");//写库 
    }
    
    public function disconn() {
        if($this->needCommit)
        {
            if(!parent::commit())
            {
                die('commit database failed.');
            }
        }
        if(!parent::close())
        {
            die('close database failed.');
        }
    }
    
    public function excute_cmd($str_cmd)
    {
        if(!(TRUE === parent::query($str_cmd)))
        {
            die('excute_cmd[' . $str_cmd . '] failed.');
        }
        $this->needCommit = true;
    }
    
    public function fill_data($str_cmd)
    {
        $data = null ;
        if(!($data = parent::query($str_cmd,MYSQLI_USE_RESULT)))
        {
            die('fill_data[' . $str_cmd . '] failed.');
        }
        return $data ;
    }
    
}
?>
