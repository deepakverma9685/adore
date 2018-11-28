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
     <?php echo ($segment4 == '')?'Add Question':'Edit Question'; ?>
    </div>
       <?php if($this->session->flashdata('pages_success')){ ?>
		<div class="alert alert-success center">
		<?php echo $this->session->flashdata('pages_success'); ?>
		</div>
		<?php } ?>
		 <?php if($this->session->flashdata('pages_error')){ ?>
		 <div class="alert alert-danger center">
		 <?php echo $this->session->flashdata('pages_error'); ?>
         </div>
         <?php } ?>
    <div>
		
		<br><br>
		   <form class="cmxform form-horizontal " id="Qesform" method="post" action="" >
				
				<div class="form-group ">
					<label for="cname" class="control-label col-lg-3">En Title</label>
					<div class="col-lg-6">
						<input class=" form-control" name="en_title" id="en_title"  type="text" value="<?php if(isset($specific->en_title)) echo $specific->en_title; ?>" required>
						<span id="en_titile"></span>
					</div>					
				</div>
				<div class="form-group ">
					<label for="cname" class="control-label col-lg-3">En Description</label>
					<div class="col-lg-6">
						 <textarea rows="4" cols="50" name="en_description"><?php if(isset($specific->en_description)) echo $specific->en_description; ?>
						 </textarea> 
						<span id="en_description"></span>
					</div>					
				</div>

				<div class="form-group ">
					<label for="cname" class="control-label col-lg-3">Se Title</label>
					<div class="col-lg-6">
						<input class=" form-control" name="se_title" id="se_title"  type="text" value="<?php if(isset($specific->se_title)) echo $specific->se_title; ?>" required>
						<span id="se_title"></span>
					</div>					
				</div>
				<div class="form-group ">
					<label for="cname" class="control-label col-lg-3">Se Description</label>
					<div class="col-lg-6">
						 <textarea rows="4" cols="50" name="se_description"><?php if(isset($specific->se_description)) echo $specific->se_description; ?>
						 </textarea> 
						<span id="se_description"></span>
					</div>					
				</div>

				<div class="form-group">
					<div class="col-lg-offset-3 col-lg-6">
						<button class="btn btn-primary" type="submit" >Save</button>
						<?php /* <a href="<?php echo base_url(ADMIN.'/'.$this->classname.'/listing'); ?>" class="btn btn-default" type="button">Cancel</a> */ ?>
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
