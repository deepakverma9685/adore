<?php $this->load->view(ADMIN.'/common/head'); 
$segment4 = $this->uri->segment(4);
//~ preprint($specific); 
?>
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
     <?php echo 'View user Details'; ?>
    </div>
    <?php if($this->session->flashdata('success_pages')){ ?>
		<div class="alert alert-success center">
		<?php echo $this->session->flashdata('success_pages'); ?>
		</div>
		<?php }else if($this->session->flashdata('exist')){ ?>
			<div class="alert alert-danger text-center">
		<?php echo $this->session->flashdata('exist'); ?>
		</div>
		<?php } ?>
    <div>
		
		<br><br>
		   <form class="cmxform form-horizontal " id="adduserform" method="post" action="<?php echo base_url(ADMIN.'/users/input');?>" >
				<div class="form-group ">
					<label for="cname" class="control-label col-lg-3">Name</label>
					<div class="col-lg-6">
						<?php if(isset($specific->name)) echo ucfirst($specific->name); ?>
						<?php /* <input class=" form-control" name="first_name" id="first_name"  type="text" value="<?php if(isset($specific->first_name)) echo $specific->first_name; ?>" >
						<span id="first_nameErr"></span> */ ?>
					</div>					
				</div>
				
				<div class="form-group ">
					<label for="cname" class="control-label col-lg-3">Email</label>
					<div class="col-lg-6">
						<?php if(isset($specific->email)) echo ucfirst($specific->email); ?>
						<?php /* <input class=" form-control" name="email" id="email"  type="text" value="<?php if(isset($specific->email)) echo $specific->email; ?>" >
						 <span id="emailErr"></span> */ ?> 
					</div>					
				</div>
				<div class="form-group ">
					<label for="cname" class="control-label col-lg-3">Phone no</label>
					<div class="col-lg-6">
						<?php if(isset($specific->phone)) echo $specific->phone; ?>
					</div>					
				</div>
				
				<div class="form-group ">
					<label for="cname" class="control-label col-lg-3">Status</label>
					<div class="col-lg-6">
				     <?php if(isset($specific->status)) echo ucfirst($specific->status); ?>
					</div>
				</div>
				<div class="form-group">
					<div class="col-lg-offset-3 col-lg-6">
						<!-- <button class="btn btn-primary" type="button" id="addUser">Save</button> -->
						<a href="<?php echo base_url(ADMIN.'/user/listing'); ?>" class="btn btn-default" type="button">Back</a>
					</div>
				</div>
				
			</form>
		<br><br>	
    </div>
  </div>
</div>
<?php $this->load->view(ADMIN.'/common/copy_rights'); ?>

<!--main content end-->
</section>
<?php $this->load->view(ADMIN.'/common/footer'); ?>
<script>

</script>
