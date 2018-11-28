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
		<!-- //market-->
		<div class="market-updates">
			 <div class="col-md-4 market-update-gd">
				<div class="market-update-block clr-block-2">
					<div class="col-md-4 market-update-right">
						<i class="fa fa-eye"> </i>
					</div>
					 <div class="col-md-8 market-update-left">
					 <h4>Spam Reports</h4>
					<h3><?php echo (isset($spam_reports->count))?$spam_reports->count:0; ?></h3> 
					<!-- <p>Other hand, we denounce</p> -->
				  </div>
				  <div class="clearfix"> </div>
				</div>
			</div> 
			<div class="col-md-4 market-update-gd">
				<div class="market-update-block clr-block-1">
					<div class="col-md-4 market-update-right">
						<i class="fa fa-users" ></i>
					</div>
					<div class="col-md-8 market-update-left">
					<h4>Registred Users</h4>
					<h3><?php echo (isset($users->count))?$users->count:0; ?></h3>
					<!--	<p>Other hand, we denounce</p> -->
					</div>
				  <div class="clearfix"> </div>
				</div>
			</div> 
			 <div class="col-md-4 market-update-gd">
				<div class="market-update-block clr-block-3">
					<div class="col-md-4 market-update-right">
						<i class="fa fa-usd"></i>
					</div>
					<div class="col-md-8 market-update-left">
						<h4>No. Of All Dating</h4>
					<h3><?php echo (isset($dating->count))?$dating->count:0; ?></h3>
					<!-- 	
						<p>Other hand, we denounce</p> -->
					</div>
				  <div class="clearfix"> </div>
				</div>
			</div>  
		<?php /* <div class="col-md-3 market-update-gd">
				<div class="market-update-block clr-block-4">
					<div class="col-md-4 market-update-right">
						<i class="fa fa-shopping-cart" aria-hidden="true"></i>
					</div>
					<div class="col-md-8 market-update-left">
						<h4>Orders</h4>
						<!-- <h3>1,500</h3>
						<p>Other hand, we denounce</p> -->
					</div>
				  <div class="clearfix"> </div>
				</div>
			</div>
		   <div class="clearfix"> </div>
		</div>	*/ ?>

<?php $this->load->view(ADMIN.'/common/copy_rights'); ?>
<!--main content end-->
</section>
<?php $this->load->view(ADMIN.'/common/footer'); ?>
