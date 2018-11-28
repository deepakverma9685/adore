<?php
class dashboard extends Ci_controller{
	public $classname = __CLASS__;
	
	function __construct() {
		parent::__construct();
		$this->db->cache_off();		
		if($this->session->userdata('dating_access')!='admin') redirect('/', 'refresh');
	}
  
 	function index()
 	{  
		$data['users'] = $this->common->getWhereRowSelect('user',array('access'=>'user','status !='=>'deleted'),'count(id) as count'); 
		$data['spam_reports'] = $this->common->getWhereRowSelect('report_user',array('status !='=>'deleted'),'count(id) as count'); 
		$data['dating'] = $this->common->getWhereRowSelect('user',array('status !='=>'deleted'),'count(id) as count'); 
     	$this->load->view(ADMIN.'/dashboard',$data);
	}
}
?>
