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
		   <form class="cmxform form-horizontal " id="Qesform" method="post" action="" >
				
				<div class="form-group ">
					<label for="cname" class="control-label col-lg-3">Question En</label>
					<div class="col-lg-6">
						<input class=" form-control" name="en_question" id="en_question"  type="text" value="<?php if(isset($specific->en_question)) echo $specific->en_question; ?>" required>
						<span id="en_question"></span>
					</div>					
				</div>
				<div class="form-group ">
					<label for="cname" class="control-label col-lg-3">Question Se</label>
					<div class="col-lg-6">
						<input class=" form-control" name="se_question" id="se_question"  type="text" value="<?php if(isset($specific->se_question)) echo $specific->se_question; ?>" required>
						<span id="se_question"></span>
					</div>					
				</div>
				
		
				<div class="form-group ">
					<label for="cname" class="control-label col-lg-3">Status</label>
					<div class="col-lg-6">
				     <select name="status" class="form-control m-bot15">
					   <option value="active" <?php  if(isset($specific->status) && ($specific->status == 'active') ) echo "selected"; ?> >Active</option>
					   <option value="inactive" <?php  if(isset($specific->status) && ($specific->status == 'inactive') ) echo "selected"; ?> >Inactive</option>
					   
					</select>
					</div>
				</div>
				<div class="form-group">
					<div class="col-lg-offset-3 col-lg-6">
						<button class="btn btn-primary" type="submit" >Save</button>
						<a href="<?php echo base_url(ADMIN.'/'.$this->classname.'/listing'); ?>" class="btn btn-default" type="button">Cancel</a>
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
