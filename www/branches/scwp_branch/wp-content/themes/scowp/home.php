<?php
/*
Template Name: Home
*/
?>

<?php get_header_home(); ?>

<table class="layouttable" cellspacing="0">
<tr>
<td id="leftcolumn">
<div id="divintrotext">
	<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
		<?php the_content(''); ?>
	<?php endwhile; endif; ?>
	<?php edit_post_link('Edit this entry.', '<p>', '</p>'); ?>

</div>

</td>

<td id="rightcolumn">
<div id="divcurrentpost">
<div id="divfactoid">
<h4>SC Blog</h4>
<?php query_posts('cat=-0&showposts=1'); 
      while (have_posts()) : the_post(); ?>
<p><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></p>

<?php the_excerpt(); ?>

 <?php endwhile; ?>

</td>
</tr>
</table>

	<?php get_footer_home(); ?>

