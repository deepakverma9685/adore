<?php 
$items_per_page =PER_PAGE_10;
if(isset($total_row)){   
$total_rating_count = count($total_row);
if ($total_rating_count >= 0)
	$total_pages = ceil($total_rating_count / $items_per_page); ?>
	<div class="tableBtm">
		<div class="paginationCont">
			<span>Page <?php echo isset($_GET['page'])?$_GET['page']:1;?> of <?php echo $total_pages;?></span>
			<div class="pagination">
			<?php
			$current_page = isset($_GET['page'])?$_GET['page']:1;
			$query_string = $this->input->server('QUERY_STRING')?preg_replace("/&page=\d+/","","&{$this->input->server('QUERY_STRING')}"):"";
			$start = floor(($current_page - 1)/ADMIN_PAGINATOR)*ADMIN_PAGINATOR+1;
			$end = ($start+ADMIN_PAGINATOR>$total_pages)?$total_pages:$start+ADMIN_PAGINATOR;
			$page_no = "?page=";
			if($start>1) echo "<a class='older' href='$page_no".($start-1)."$query_string'>&nbsp;</a>";
			for($i=$start;$i<=$end;$i++)
			{
				$class = ($i == $current_page)?"class='active'":"";
				$href = ($i == $current_page)?"javascript:void(0)":"$page_no$i$query_string";
				echo "<a $class href='$href'>$i</a>";
			}
			if($end<$total_pages)echo "<a class='newer' href='".$page_no.($end+1)."$query_string'>&nbsp;</a>";
			?>
			</div>
		</div>
	</div>
<?php } ?>
