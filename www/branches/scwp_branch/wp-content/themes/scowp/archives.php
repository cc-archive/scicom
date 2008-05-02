<?php
/*
Template Name: Archives
*/
?>

<?php get_header(); ?>


	<h1>Archives</h1>

	<?php get_sidebar(); ?>
	
	<div id="column_2" class="column">
		<div class="padding">
				<p><a href="<?php bloginfo('rss2_url'); ?>">Subscribe to RSS</a></p>
				<div class="spacer_ver_medium"></div>
				<p>Archives
				<ul id="archives_list">
				<?php wp_get_archives('type=monthly&show_post_count=1'); ?>
				</ul>
				</p>
		</div>
	</div>
	
	<div id="column_1" class="column">
		<div class="padding">

<?php include (TEMPLATEPATH . '/searchform.php'); ?>

<h2>Archives by Month:</h2>
	<ul>
		<?php wp_get_archives('type=monthly'); ?>
	</ul>

<h2>Archives by Subject:</h2>
	<ul>
		 <?php wp_list_categories(); ?>
	</ul>

		</div>
	</div>
<?php edit_post_link('Edit this entry.', '<p>', '</p>'); ?>

<?php get_footer(); ?>
