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
    Spam Reports
    </div>
    <div>
	  
		<?php if($this->session->flashdata('report_success')){ ?>
		<div class="alert alert-success">
		<?php echo $this->session->flashdata('report_success'); ?>
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
            <th>Report For</th>
            <th>Report By </th>
            <th>Report on </th>
            <th>Reason</th>
            <th>Description</th>
           <th data-breakpoints="xs">Action</th>
          </tr>
        </thead>
        <tbody>
          <?php if(isset($list) && !empty($list)){ 
				    foreach($list as $row){ 
		  ?>
			  <tr data-expanded="true">
				<td><?php echo $row->id; ?></td>
				<td><?php echo ucfirst($row->user); ?></td>
				<td><?php echo ucfirst($row->reportedby); ?></td>
				<td><?php echo $row->created_on; ?></td>
				<td><?php echo $row->report_reason; ?></td>
				<td><?php echo $row->reason_disc; ?></td>
			
				<?php /* <td><a href="<?php echo base_url(ADMIN.'/'.$this->classname.'/status_action/'.$row->id.'/'.$row->status);  ?>" ><?php echo ucfirst($row->status); ?></a></td> */ ?>
				<td><?php /* <a href="<?php echo base_url(ADMIN.'/'.$this->classname.'/input/'.$row->id); ?>"><i class="fa fa-eye text-success text-active"></i></a>&nbsp;&nbsp;&nbsp;*/ ?><a href="<?php echo base_url(ADMIN.'/'.$this->classname.'/status_action/'.$row->id.'/'.'deleted'); ?>" onClick="return confirm('Are you sure about deleting this record?')" title="Delete"><i class="fa fa-times text-danger text"></i></a>
				
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
