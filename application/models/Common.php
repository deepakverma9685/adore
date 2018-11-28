<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Common extends CI_Model{ 
	public function __construct(){      parent::__construct();     }
	
	function insert($table, $data){
		$this->db->insert($table,$data);
		$num = $this->db->insert_id();
		if($num)
			return $num;
		else
			return FALSE;
	}

	function update($table,$where,$data){
		$this->db->where($where);
		$update = $this->db->update($table,$data);		
		if($update) 
			return TRUE;
		else 
			return FALSE;
	}
	
	// for get single row all colums are send coloms  // this function use on multiple places
    function getWhereRowSelect($table,$where,$select='*'){	
		//$this->db->order_by("id", "desc"); 
		$this->db->select($select);
		$this->db->where($where);
		$getdata = $this->db->get($table);		
		$result = $getdata->row();
		return $result;
	}
	
	// custom query 
	function custom_query($sql="")
	{
		 $result = $this->db->query($sql); 
		 return $result;
	}
	
	function delete($table,$where){
	    $this->db->where($where);
		$this->db->limit('1');
		$del = $this->db->delete($table);
		if($del){
			return true;
		}else{
			return false;
		}
	}
	
	function getAll($table){
		$data = $this->db->get($table);
		$get = $data->result();	
		$num = $data->num_rows();		
		if($num)
			return $get;
		else
			return false;
	}

	function getWhere($table,$where,$short="",$order="",$limit="",$offset="",$search=""){	
		$this->db->order_by($short,$order);
		$this->db->limit($limit,$offset); 
		$this->db->where($where);
		if($search!=""){
		  $this->db->like($table.'.title',$search);
		  }	
		$getdata = $this->db->get($table);	
		//echo $this->db->last_query();	
		$num = $getdata->num_rows();
		if($num> 0){ 
				$arr=$getdata->result();
				foreach ($arr as $rows)
				{
					$data[] = $rows;
				}
				$getdata->free_result();
				
				return $data;
		}else{ 
			return false;
		}		
	}
	
	function getWhereAll($table,$where,$select='*',$short="id",$order="desc")
	{	
		$this->db->select($select);
		$this->db->where($where);
		$this->db->order_by($short,$order);
		$getdata = $this->db->get($table);	
		$num = $getdata->num_rows();
		if($num> 0){ 
				$arr=$getdata->result();
				foreach ($arr as $rows)
				{
					$data[] = $rows;
				}
				$getdata->free_result();
				
				return $data;
		}else 
			return false;
				
	}
	
	function getWhereAllselect($table,$where,$select='*')
	{	
		$this->db->select($select);
		$this->db->where($where);
		$getdata = $this->db->get($table);	
		$num = $getdata->num_rows();
		if($num> 0){ 
				$arr=$getdata->result();
				foreach ($arr as $rows)
				{
					$data[] = $rows;
				}
				$getdata->free_result();
				
				return $data;
		}else 
			return false;
	}
	
 function join_two_orderby($tbl1,$tbl2 ,$field1,$field2,$where,$select,$orderby="",$groupby="",$limit=0,$offset=0){  
          $this->db->group_by($groupby); 
		  $this->db->select($select);
		  $this->db->from($tbl1);
		  $this->db->join($tbl2, $tbl1.'.'.$field1.'='.$tbl2.'.'.$field2);
		  $this->db->order_by($orderby, "desc");
			  $this->db->where($where);	
			  $this->db->limit($limit,$offset);	
		  $getdata  = $this->db->get();
		  $num = $getdata->num_rows();
		  if($num> 0){ 
			$arr=$getdata->result();
			foreach ($arr as $rows){
			 $data[] = $rows;
			}
			$getdata->free_result();
			return $data;
		  } else{ 
		   return false;
		  }
    }
                            
     
	function join_three_for_single($tbl1,$tbl2 ,$tbl3 ,$field1,$field2,$field3,$field4,$select,$where,$join_type){ 
          //$this->db->group_by($group_by);  
		  $this->db->select($select);
		  $this->db->from($tbl1);
		  $this->db->where($where);
		  $this->db->join($tbl2, $tbl1.'.'.$field1.'='.$tbl2.'.'.$field2,$join_type);
		  $this->db->join($tbl3, $tbl1.'.'.$field3.'='.$tbl3.'.'.$field4,$join_type);
		  
		  $getdata  = $this->db->get();
		  $num = $getdata->num_rows();
		  if($num> 0){ 
			$arr=$getdata->result();
			foreach ($arr as $rows){
			 $data = $rows;
			}
			$getdata->free_result();
			return $data;
		  } else{ 
		   return false;
		  }
 }
 
 function join_four_for_single($tbl1,$tbl2 ,$tbl3,$tbl4 ,$field1,$field2,$field3,$field4,$field5,$select,$where,$join_type){ 
          //$this->db->group_by($group_by);  
		  $this->db->select($select);
		  $this->db->from($tbl1);
		  $this->db->where($where);
		  $this->db->join($tbl2, $tbl1.'.'.$field1.'='.$tbl2.'.'.$field2,$join_type);
		  $this->db->join($tbl3, $tbl1.'.'.$field3.'='.$tbl3.'.'.$field4,$join_type);
		  $this->db->join($tbl4, $tbl1.'.'.$field1.'='.$tbl4.'.'.$field5,$join_type);
		  
		  $getdata  = $this->db->get();
		  $num = $getdata->num_rows();
		  if($num> 0){ 
			$arr=$getdata->result();
			foreach ($arr as $rows){
			 $data = $rows;
			}
			$getdata->free_result();
			return $data;
		  } else{ 
		   return false;
		  }
 }
 
function join_three_type_where($tbl1,$tbl2 ,$tbl3 ,$field1,$field2,$field3,$field4,$select,$where,$join_type,$group_by="",$sort="",$orderby="",$limit=0,$offset=0,$where_in=''){ 
	        
	    if($where_in!='')foreach($where_in as $k=>$v)$this->db->where_in($k,explode(',',$v));  
				  
	      $this->db->group_by($group_by);  
		  $this->db->select($select);
		  $this->db->from($tbl1);
		  $this->db->where($where);
		  $this->db->join($tbl2, $tbl1.'.'.$field1.'='.$tbl2.'.'.$field2,$join_type);
		  $this->db->join($tbl3, $tbl1.'.'.$field3.'='.$tbl3.'.'.$field4,$join_type);
		  $this->db->order_by($sort,$orderby);
		  $this->db->limit($limit,$offset);
		  $getdata  = $this->db->get();
		  $num = $getdata->num_rows();
		  if($num> 0){ 
			$arr=$getdata->result();
			foreach ($arr as $rows){
			 $data[] = $rows;
			}
			$getdata->free_result();
		 //echo $this ->db->last_query();die;	
			return $data;
		  } else{ 
		   return false;
		  }
 }
 
function join3whereNlimit($tbl1,$tbl2 ,$tbl3 ,$field1,$field2,$field3,$field4,$select,$where,$join_type,$sort="",$orderby="",$limit=0,$offset=0,$group_by=""){ 
	      $this->db->group_by($group_by);  
		  $this->db->select($select);
		  $this->db->from($tbl1);
		  $this->db->where($where);
		  $this->db->join('user u1', $tbl1.'.'.$field1.'='.$tbl2.'.'.$field2,$join_type);
		  $this->db->join('user u2', $tbl1.'.'.$field3.'='.$tbl3.'.'.$field4,$join_type);
		  $this->db->order_by($sort,$orderby);
		  $this->db->limit($limit,$offset);
		  $getdata  = $this->db->get();
		  $num = $getdata->num_rows();
		  if($num> 0)
			  return $getdata->result();
		  else 
		      return false;
} 
 
 
 
function getWhereSingle($table,$where){	
		//$this->db->order_by("id", "desc"); 
		$this->db->where($where);
		$getdata = $this->db->get($table);		
		$num = $getdata->num_rows();
		if($num> 0){ 
				$arr=$getdata->result();
				foreach ($arr as $rows)
				{
					$data = $rows;
				}
				$getdata->free_result();
				return $data;
		}else{ 
			return false;
		}		
	}	

function getWhere_count($table,$where,$select){	
		$this->db->select($select);
		$this->db->where($where);
		$getdata = $this->db->get($table);		
		$num = $getdata->num_rows();
		if($num> 0){ 
				$arr=$getdata->result();
				foreach ($arr as $rows)
				{
					$data = $rows;
				}
				$getdata->free_result();
				return $data;
		}else{ 
			return false;
		}		
	}



function join_two($tbl1,$tbl2 ,$field1,$field2,$where,$select,$group_by=""){   
	      $this->db->group_by($group_by);
		  $this->db->select($select);
		  $this->db->from($tbl1);
		  $this->db->join($tbl2, $tbl1.'.'.$field1.'='.$tbl2.'.'.$field2);
		  $this->db->where($where);		
		  $getdata  = $this->db->get();
		  $num = $getdata->num_rows();
		  if($num> 0) { 
			$arr=$getdata->result();
			//~ foreach ($arr as $rows){
			 //~ $data = $rows;
			//~ }
			//~ $getdata->free_result();
			return $arr;
		  } else{ 
		   return false;
		  }
 }	

	function join_three_type_with_where($tbl1,$tbl2 ,$tbl3 ,$field1,$field2,$field3,$field4,$where,$select,$join_type){   
		  $this->db->select($select);
		  $this->db->from($tbl1);
		  $this->db->join($tbl2, $tbl1.'.'.$field1.'='.$tbl2.'.'.$field2,$join_type);
		  $this->db->join($tbl3, $tbl1.'.'.$field3.'='.$tbl3.'.'.$field4,$join_type);
		  $this->db->where($where);
		  $getdata  = $this->db->get();
		  $num = $getdata->num_rows();
		  if($num> 0){ 
			$arr=$getdata->result();
			foreach ($arr as $rows){
			 $data[] = $rows;
			}
			$getdata->free_result();
			return $data;
		  }  else{ 
		   return false;
		  }
    }
    
	function join_two_type_limit($tbl1,$tbl2 ,$field1,$field2,$where,$select,$join_type,$orderby,$start,$end){   
		  $this->db->select($select);
		  $this->db->from($tbl1);
		  $this->db->join($tbl2, $tbl1.'.'.$field1.'='.$tbl2.'.'.$field2,$join_type);
		  $this->db->where($where);		
		  $this->db->order_by($orderby, "DESC"); 
		  $this->db->limit($end,$start);
		  $getdata  = $this->db->get();
		  $num = $getdata->num_rows();
		  if($num> 0){ 
			$arr=$getdata->result();
			foreach ($arr as $rows){
			 $data[] = $rows;
			}
			$getdata->free_result();
			return $data;
		  } else{ 
		   return false;
		  }
 }
 
 //~  shrikant
 
 function join_two_type_limit_asc($tbl1,$tbl2 ,$field1,$field2,$where,$select,$join_type,$orderby,$start,$end){   
		  $this->db->select($select);
		  $this->db->from($tbl1);
		  $this->db->join($tbl2, $tbl1.'.'.$field1.'='.$tbl2.'.'.$field2,$join_type);
		  $this->db->where($where);		
		  $this->db->order_by($orderby, "desc"); 
		  $this->db->limit($end,$start);
		  $getdata  = $this->db->get();
		  $num = $getdata->num_rows();
		  if($num> 0){ 
			$arr=$getdata->result();
			foreach ($arr as $rows){
			 $data[] = $rows;
			}
			$getdata->free_result();
			return $data;
		  } else{ 
		   return false;
		  }
   }
   
   function login($email="",$password="")
    {
		$this->db->select('*');
		$this->db->from('user');
		$this->db->where('email',$email);
		$this->db->where('password',$password);
		$this->db->where('access','admin');
		$this->db->where('status=','active');	
		$getdata = $this->db->get();
		$num = $getdata->num_rows();
		if($num > 0) 
		    return $getdata->row();
	    else
			return false;
	}

}
