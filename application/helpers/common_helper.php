<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');


// use for fast-debuging if no use can delete any time lastquery(), preprint(),sessiondata() 
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function lastquery($die="")
{
	 $CI =& get_instance();
	 echo $CI->db->last_query(); 
	 if($die!="")
	 die;
}

function preprint($data="")
{
	 echo "<pre>"; print_r($data); die;
}

function sessiondata()
{
	 $CI =& get_instance();
	 echo "<pre>"; print_r($CI->session->userdata()); die;
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


// mail function
function emailsend($to,$subject,$msg,$from,$file='',$filename='',$content='',$type='')
{
		$config = Array(
		'protocol' => 'smtp',
		'smtp_host' => 'ssl://smtp.googlemail.com',
		'smtp_port' => 465,
		'smtp_user' => 'harshan.shantiinfotech@gmail.com',
		'smtp_pass' => 'harshan123456',
		'mailtype' => 'html', 
		'charset' => 'iso-8859-1',
		'newline'   => "\r\n",
		);

		$CI = &get_instance();
		$CI->load->library('email', $config);
		$CI->email->initialize($config);
		$CI->email->set_mailtype("html");
		$CI->email->set_newline("\r\n");
		$CI->email->set_header('MIME-Version', '1.0');
		$CI->email->set_newline("\r\n");
		$CI->email->set_header('X-Priority', '1');
		$CI->email->set_newline("\r\n");
			
		//$list = array('harshan.shantiinfotech@gmail.com','harshankadam@outlook.com','nrathore45@yahoo.com');
		$CI->email->from(ADMIN_EMAIL_SEND, SITE_NAME);
		$CI->email->reply_to(ADMIN_EMAIL_SEND, SITE_NAME);
	
		//$CI->email->from(ADMIN_EMAIL_SEND, $from);
		$CI->email->to( $to );
		$CI->email->subject($subject);
		$CI->email->message($msg);
		//~ if($file!="")
			//~ $CI->email->attach( $file);
		if(!empty($file) && $type=='pdf')
		{
			for($i=0;$i<count($file);$i++)
			{
				$CI->email->attach($file[$i]);
			}
		}
		else
		{
			$CI->email->attach( $file);
		}
			
		$result = $CI->email->send();
			
		if ($result) {
			return true;
		} else {
			return false;
		}
		
}

// For pagination 
function pagination($url="",$tot="",$segment="",$perpage=ITEMS_PER_PAGE_FRONT)
{
	   $CI =& get_instance();
	   $config = array();
	   $config["base_url"] = base_url().$url;
	   $config["total_rows"] = $tot;
	   $config["per_page"] = $perpage;
	   $config['use_page_numbers'] = TRUE;
	   $config['num_links'] =   5;
	   $config['cur_tag_open'] = '<a class="active" style="background-color: #4A9DDD;">';
	   $config['cur_tag_close'] = '</a>';
	   $config['next_link'] = '  &raquo;';
	   $config['prev_link'] = '&laquo; ';
	   $config['first_link'] = '&raquo;';
	   $config['first_tag_open'] = '<li>';
	   $config['first_tag_close'] = '</li>';
	   $config['last_link'] = '&laquo;';
	   $config['last_tag_open'] = '<li>';
	   $config['last_tag_close'] = '</li>';
	   $config['next_tag_open'] = '<li>';
	   $config['next_tag_close'] = '</li>';
	   $config['prev_tag_open'] = '<li>';
	   $config['prev_tag_close'] = '</li>';
	   $config["uri_segment"] = $segment;
	   if($config["total_rows"] >=0)
	   {
		 $page_number = $CI->uri->segment($segment);
		 $page['offset']="0";
		 if(isset($page_number))
		 {
			 $CI->pagination->initialize($config);
			 $page['offset'] =(isset($page_number)&&is_numeric($page_number))?($page_number-1) *  $config["per_page"]:0;
		 }  
		 else
		 {    
			 $CI->pagination->initialize($config);
			 $page['offset'] =(isset($page_number)&&is_numeric($page_number))?($page_number-1) *  $config["per_page"]:0;
			   
		 } 
	  }
	  //~ $data = array();
	  //~ $data['offset'] =  $page['offset'];
	  //~ $data['per_page'] =  $config["per_page"];
	  return $page['offset'];
}

function validationErrorMsg()
{
	
	$CI =& get_instance();
	$fetch =   $CI->form_validation->error_array();
	foreach($fetch as $eval)
		$msg = $eval;
	
	$response_data = array();  
	$response_data["status"] = 0; 
	$response_data["response_message"] = $msg; 
		
	//~ echo json_encode($response_data);
	$CI->output->set_content_type('application/json')->set_output(json_encode($msg));
	//~ exit();
}


function generateRandomString2($length = 6) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

function GetUniqueCode($amount)
{
     $count=0;
		 while(true)
		 { 
			$count++; 
			$code = generateRandomString2(); 
			$code = "rl".$code.$amount;
			$SQL = "select * from coupons where code = '".$code."'";
		    $CI = get_instance();
		    $query = $CI->db->query($SQL);
		    if($query->num_rows() == 0)
		    	 	break;		
			
			$res = $query->row();
			if($count == 10)
			     break;

		 }
		return $code;	
}

// for get single row all colums are send coloms 
function getWhereRowSelect($table,$where,$select='*'){	
	 $CI =& get_instance();	
	$CI->db->select($select);
	$CI->db->where($where);
	$getdata = $CI->db->get($table);		
	$result = $getdata->row();
	return $result;
}

// for get multiple row all colums are send coloms 
function getSelect($table,$select='*'){	
	$CI =& get_instance();	
	$CI->db->select($select);
	$getdata = $CI->db->get($table);		
	$result = $getdata->result();
	return $result;
}

function date_to_path($date){
	return date("Y/m/d", strtotime($date))."/";
}

function array_insert(&$array, $stack){
	foreach($stack as $key=>$val)$array[$key] = $val;
	return $array;
}

function current_uri()
{
    $CI =& get_instance();
    $url = $CI->config->site_url($CI->uri->uri_string());
    return $_SERVER['QUERY_STRING'] ? $url.'?'.$_SERVER['QUERY_STRING'] : $url;
}

function array_except(&$array, $key){
	if(is_array($key)){
		foreach($key as $k)array_except($array, $k);
	}
	else	unset($array[$key]);
	return $array;
}

function get_https_content($url=NULL,$method="GET"){
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_VERBOSE, true);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:31.0) Gecko/20100101 Firefox/31.0');
	curl_setopt($ch, CURLOPT_URL,$url);
	return curl_exec($ch);
}

function assets($path = ""){
	return base_url("assets")."/$path";
}
function admin_assets($path = ""){
	return base_url("assets/admin")."/$path";
}

function admin_url($path = ""){
	//return base_url("admin")."/$path";
	return base_url("backend")."/$path";
}

function admin_views($views=null, $data=null){
	$ci =& get_instance();
	if($views)$ci->load->view("admin/$views", $data);
}

function get_sortlink($str, $db_column){
	$link = "<a href='";
	$link.="?sort_by=$db_column&sort_order=";
	$link.=(isset($_GET['sort_order']) && isset($_GET['sort_by']) && $_GET['sort_order']=="asc" && $_GET['sort_by']==$db_column)?"desc":"asc";
	foreach($_GET as $key=>$val)if($key!='sort_by' && $key!='sort_order')$link.="&$key=$val";
	$link.="'". ((isset($_GET['sort_order']) && isset($_GET['sort_by']) && $_GET['sort_by'] == $db_column)?" class='{$_GET['sort_order']}'":"") .">$str</a>";
	return $link;
}

//getting ip address
function get_client_ip() {
			$ipaddress = '';
			if (isset($_SERVER['HTTP_CLIENT_IP']))
				$ipaddress = $_SERVER['HTTP_CLIENT_IP'];
			else if(isset($_SERVER['HTTP_X_FORWARDED_FOR']))
				$ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
			else if(isset($_SERVER['HTTP_X_FORWARDED']))
				$ipaddress = $_SERVER['HTTP_X_FORWARDED'];
			else if(isset($_SERVER['HTTP_FORWARDED_FOR']))
				$ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
			else if(isset($_SERVER['HTTP_FORWARDED']))
				$ipaddress = $_SERVER['HTTP_FORWARDED'];
			else if(isset($_SERVER['REMOTE_ADDR']))
				$ipaddress = $_SERVER['REMOTE_ADDR'];
			else
				$ipaddress = 'UNKNOWN';
			return $ipaddress;
}
