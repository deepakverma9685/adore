<?php
class home extends Ci_controller{
	public $classname = __CLASS__;
	
	function __construct() {
		parent::__construct();
		$this->db->cache_off();		
		if($this->session->userdata('dating_access')!='admin' && $this->session->userdata('dating_access')!='') redirect('/', 'refresh');
	}
  
    // login || check login 
 	function index()
	{  
		if(isset($_POST['email']))
		{
			extract($_POST); 
			$password = md5($password);  
			$user = $this->common->login($email,$password);
			//~ $response = 0; // Invalid email or password  
			if(!empty($user))
			{
				$loginData = array(
					'dating_uid'   => $user->id,
					'dating_name' => $user->name,
					'dating_email' => $user->email,
					'dating_access' => $user->access
				);
				$this->session->set_userdata($loginData);
				redirect(base_url(ADMIN."/dashboard"));
			}
			else
			    $this->session->set_flashdata('login_error','Invalid email or password'); 			   
		}
		if($this->session->userdata('dating_uid')=='')
     		$this->load->view(ADMIN.'/login');
		else
			redirect(base_url(ADMIN."/dashboard"));
	}
	
	// logout 
    public function logout()
	{
		 $this->session->sess_destroy();
			 redirect(base_url());	
	}
	
	public function d404()
	{
		$this->load->view('d404');
	}
	
}
?>
