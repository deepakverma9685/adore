<?php $this->load->view(ADMIN.'/common/head'); ?>
<section id="container">
<!--header start-->
<?php $this->load->view(ADMIN.'/common/header'); ?>
<!--header end-->
<!--sidebar start-->
<aside>
    <div id="sidebar" class="nav-collapse">
        <!-- sidebar menu start-->
        <?php $this->load->view(ADMIN.'/common/sidebar'); ?> 
        <!-- sidebar menu end-->
    </div>
</aside>
<!--sidebar end-->
<!--main content start-->
<section id="main-content">
	<section class="wrapper">
		<div class="table-agile-info">
 <div class="panel panel-default">
    <div class="panel-heading">
    Dating Question List
    </div>
    <div>
	  
		<?php if($this->session->flashdata('ques_success')){ ?>
		<div class="alert alert-success">
		<?php echo $this->session->flashdata('ques_success'); ?>
		</div>
		<?php } ?>
      <table class="table" ui-jq="footable" ui-options='{
        "paging": {
          "enabled": true
        },
        "filtering": {
          "enabled": true
        },
        "sorting": {
          "enabled": true
        }}'>
        <thead>
          <tr>
            <th data-breakpoints="xs">ID</th>
            <th>Qes. En</th>
            <th>Qes. Se </th>
            <th>Created On</th>
            <th>Updated On</th>
            <th>Status</th>
           <th data-breakpoints="xs">Action</th>
          </tr>
        </thead>
        <tbody>
          <?php if(isset($list) && !empty($list)){ 
				    foreach($list as $row){ 
		  ?>
			  <tr data-expanded="true">
				<td><?php echo $row->id; ?></td>
				<td><?php echo $row->en_question; ?></td>
				<td><?php echo $row->se_question; ?></td>
				<td><?php echo $row->created_on; ?></td>
				<td><?php echo $row->updated_on; ?></td>
				
				 <td><a href="<?php echo base_url(ADMIN.'/'.$this->classname.'/status_action/'.$row->id.'/'.$row->status);  ?>" ><?php echo ucfirst($row->status); ?></a></td>
				<td> <a href="<?php echo base_url(ADMIN.'/'.$this->classname.'/input/'.$row->id); ?>"><i class="fa fa-eye text-success text-active"></i></a>&nbsp;&nbsp;&nbsp;<a href="<?php echo base_url(ADMIN.'/'.$this->classname.'/status_action/'.$row->id.'/'.'deleted'); ?>" onClick="return confirm('Are you sure about deleting this record?')" title="Delete"><i class="fa fa-times text-danger text"></i></a>
				
				</td>
			  </tr>
         <?php } }else
                echo "<tr data-expanded='true' style='text-align:center;font-weight:bold;'><td colspan='7' > No Listing Yet</td></tr>";   
          ?>
         
        </tbody>
      </table>
       <div class="pull-right">                
          <ul class="pagination pagination">
			<?php 
			   if(($this->pagination->create_links()))
			 {
				echo $this->pagination->create_links(); 
			 }
		  ?>
		<ul>
		</div>
		
      
    </div>
  </div>
</div>
<?php $this->load->view(ADMIN.'/common/copy_rights'); ?>

<!--main content end-->
</section>
<?php $this->load->view(ADMIN.'/common/footer'); ?>
