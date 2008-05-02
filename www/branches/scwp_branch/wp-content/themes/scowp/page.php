<?php get_header(); ?>

<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
	<h1><?php the_title(); ?></h1>

	<?php get_sidebar(); ?>
	
	<div id="column_2" class="column">
		<div class="padding">
<?php
if (wp_list_pages("child_of=".$post->ID."&echo=0")) { ?>
<ul id="nav_menu">
<?php
wp_list_pages("title_li=&depth=1&child_of=".$post->ID."&sort_column=menu_order"); ?>
</ul>
<?php } ?>

<?php 

  $center_values = get_post_custom_values('sc_center_content');
  if ($center_values)
     foreach ($center_values as $center) echo $center; 

?>
		</div>
	</div>
	
	<div id="column_1" class="column">
		<div class="padding">
			<div class="post" id="post-<?php the_ID(); ?>">
				<?php the_content('<p class="serif">Read the rest of this page &raquo;</p>'); ?>

				<?php wp_link_pages(array('before' => '<p><strong>Pages:</strong> ', 'after' => '</p>', 'next_or_number' => 'number')); ?>
			</div>
		</div>
	</div>

<?php endwhile; endif; ?>
<?php edit_post_link('Edit this entry.', '<p>', '</p>'); ?>

<?php get_footer(); ?>
