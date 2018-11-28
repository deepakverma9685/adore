<?php
	$segment1 = $this->uri->segment(1);
	$segment2 = $this->uri->segment(2);
	$segment3 = $this->uri->segment(3);
	$segment4 = $this->uri->segment(4);
?>
<div class="leftside-navigation">
		<ul class="sidebar-menu" id="nav-accordion">
			
			<li>
				<a class="<?php echo ($segment2 == 'dashboard' && $segment3 == '' )?'active':''; ?>" href="<?php echo base_url(ADMIN.'/dashboard'); ?>">
					<i class="fa fa-dashboard"></i>
					<span>Dashboard</span>
				</a>
			</li>
			<li>
				<a class="<?php echo ($segment2 == 'user' && $segment3 == 'listing' )?'active':''; ?>" href="<?php echo base_url(ADMIN.'/user/listing'); ?>">
					<i class="fa fa-dashboard"></i>
					<span>User List</span>
				</a>
			</li>
			<li class="sub-menu">
				<a href="javascript:;" class="<?php echo ($segment2 == 'dating' && ( $segment3 == 'all' || $segment3 == 'cancel' || $segment3 == 'meet'|| $segment3 == 'new') )?'active':''; ?>">
					<i class="fa fa-book"></i>
					<span>All Dating</span>
				</a>
				<ul class="sub">
				<a href="<?php echo base_url(ADMIN.'/dating/all'); ?>" class="<?php echo ($segment3 == 'all')?'active':''; ?>">
					<i class="fa fa-bullhorn"></i><span>All</span></a>
				<a href="<?php echo base_url(ADMIN.'/dating/new'); ?>" class="<?php echo ($segment3 == 'new')?'active':''; ?>">
					<i class="fa fa-bullhorn"></i><span>New</span></a>
				<a href="<?php echo base_url(ADMIN.'/dating/meet'); ?>" class="<?php echo ($segment3 == 'meet')?'active':''; ?>">
					<i class="fa fa-bullhorn"></i><span>Meet</span></a>
				<a href="<?php echo base_url(ADMIN.'/dating/cancel'); ?>" class="<?php echo ($segment3 == 'cancel')?'active':''; ?>">
					<i class="fa fa-bullhorn"></i><span>Cancel</span></a>
				</ul>
			</li>
			<li>
				<a class="<?php echo ($segment2 == 'report_user' && $segment3 == 'listing' )?'active':''; ?>" href="<?php echo base_url(ADMIN.'/report_user/listing'); ?>">
					<i class="fa fa-dashboard"></i>
					<span>Spam Reports</span>
				</a>
			</li>
			<li>
				<a href="javascript:;" class="<?php echo ($segment2 == 'dating_ques')?'active':''; ?>">
					<i class="fa fa-book"></i>
					<span>Dating Questions</span>
				</a>
				<ul class="sub">
				<a class="<?php echo ($segment2 == 'dating_ques' && $segment3 == 'input' )?'active':''; ?>" href="<?php echo base_url(ADMIN.'/dating_ques/input'); ?>">
					<i class="fa fa-dashboard"></i>
					<span>Add Question</span>
				</a>
				<a class="<?php echo ($segment2 == 'dating_ques' && $segment3 == 'listing' )?'active':''; ?>" href="<?php echo base_url(ADMIN.'/dating_ques/listing'); ?>">
					<i class="fa fa-dashboard"></i>
					<span>Questions List</span>
				</a>
				</ul>
			</li>
			<li>
				<a class="<?php echo ($segment2 == 'pages' && $segment4 == 'tnc' )?'active':''; ?>" href="<?php echo base_url(ADMIN.'/pages/input/tnc'); ?>">
					<i class="fa fa-dashboard"></i>
					<span>Terms &amp; Condition</span>
				</a>
			</li>
			<?php /* <li>
				<a class="<?php echo ($segment2 == 'pages' && $segment3 == 'about' )?'active':''; ?>" href="<?php echo base_url(ADMIN.'/report_user/listing'); ?>">
					<i class="fa fa-dashboard"></i>
					<span>About Dating-App</span>
				</a>
			</li>
			*/ ?>
			
             
		</ul>
</div>
