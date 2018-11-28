<?php
class User_model extends CI_Model {

	function __construct() { parent::__construct();  }

    function login($email="",$password="")
    {
		$this->db->select('*');
		$this->db->from('user');
		$this->db->where('email',$email);
		$this->db->where('password',$password);
		$this->db->where('status=','active');	
		$getdata = $this->db->get();
		$num = $getdata->num_rows();
		if($num > 0) 
		    return $getdata->row();
	    else
			return false;
	}
}
?>
