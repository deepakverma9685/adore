<header class="header fixed-top clearfix">
<!--logo start-->
<div class="brand">
    <a  class="logo">
	<img src="<?php echo base_url('assets/'.ADMIN.'/images/logo.png'); ?>" style="width:90px;">
    </a>
    <div class="sidebar-toggle-box">
        <div class="fa fa-bars"></div>
    </div>
</div>
<!--logo end-->

<div class="top-nav clearfix">
    <!--search & user info start-->
    <ul class="nav pull-right top-menu">
        <?php /* <li>
            <input type="text" class="form-control search" placeholder=" Search">
        </li> */ ?>
        <!-- user login dropdown start-->
        <li class="dropdown">
            <a data-toggle="dropdown" class="dropdown-toggle" href="#">
                <img alt="" src="images/2.png">
                <span class="username"><?php echo $this->session->userdata('dating_name'); ?></span>
                <b class="caret"></b>
            </a>
            <ul class="dropdown-menu extended logout">
                <li><a href="#"><i class=" fa fa-suitcase"></i>Change Password</a></li>
               <?php /*  <li><a href="#"><i class="fa fa-cog"></i> Settings</a></li> */ ?>
                <li><a href="<?php echo base_url(ADMIN.'/home/logout'); ?>"><i class="fa fa-key"></i> Log Out</a></li>
            </ul>
        </li>
        <!-- user login dropdown end -->
       
    </ul>
    <!--search & user info end-->
</div>
</header>
