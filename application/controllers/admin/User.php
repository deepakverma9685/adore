<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class user extends CI_Controller {
    public $classname = __CLASS__;
	# This controller is use for blog functionalities 
	
	public function __construct()
	{
		parent::__construct();
			if($this->session->userdata('dating_access') !='admin') redirect(base_url()); 
	}
	
	public function index(){  redirect(base_url($this->classname.'/listing')); }
	
    // load view of all athlete list 
	public function listing()
	{ 	
		$limit = PER_PAGE_10;
		
		$sort = (isset($_GET['sort']) and !empty($_GET['sort']))?$_GET['sort']:'id';
		$orderby = (isset($_GET['orderby']) and !empty($_GET['orderby']))?$_GET['orderby']:'desc';
		$search = (isset($_GET['search']) and !empty($_GET['search']))?$_GET['search']:'';
		 
	    $where = array('status !='=>'deleted','access'=>'user');
	    
	    $count = $this->common->getWhereRowSelect($this->classname,$where,'count(id) as count'); 
	    $url = ADMIN.'/'.$this->classname.'/listing';
		$offset = pagination($url,$count->count,4,$limit);
	    
	    $data['list'] = $this->common->getWhere($this->classname,$where,$sort,$orderby,$limit,$offset,$search);
        //~ lastquery();
	    //~ preprint($data); 
        admin_views("{$this->classname}/listing", $data); 
    }
	
	public function input($id='')
	{ 
		$data = array(); 
		if($id !='')
		$data['specific'] = $this->common->getWhereRowSelect($this->classname,array('id'=>$id),'*');  
		admin_views("{$this->classname}/input", $data);	
	}
	
	// active/inactive or delete 
	public function status_action($id="",$status="")
	{
		if($status!='deleted'){ $status = ($status == 'active')?'inactive':'active'; }
		//~ $status = ($status == 'active')?'inactive':'active'; 
		$data = array('status'=>$status);
		$where = array('id'=>$id);
		$this->common->update($this->classname,$where,$data);
		$this->session->set_flashdata('user_success','User '.$status.' successfully');	
		redirect($_SERVER['HTTP_REFERER']);
	}
}
