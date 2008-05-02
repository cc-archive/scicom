<?php
/*
Template Name: Blog
*/
?>

<?php get_header(); ?>


	<h1>Weblog</h1>

	<?php get_sidebar(); ?>
<?php
$paged = get_query_var('paged');
query_posts('cat=-0&paged='.$paged);
?>	
	<div id="column_2" class="column">
		<div class="padding">
<?php include (TEMPLATEPATH . '/searchform.php'); ?>

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



	<?php if (have_posts()) : ?>

		<?php while (have_posts()) : the_post(); ?>

			<div class="post" id="post-<?php the_ID(); ?>">
				<h2><a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title(); ?>"><?php the_title(); ?></a></h2>
				<small><?php the_time('F jS, Y') ?> <!-- by <?php the_author() ?> --></small>

				<div class="entry">
					<?php the_content('Read the rest of this entry &raquo;'); ?>
				</div>

				<p class="postmetadata">Posted in <?php the_category(', ') ?> | <?php edit_post_link('Edit', '', ' | '); ?>  <?php comments_popup_link('No Comments &#187;', '1 Comment &#187;', '% Comments &#187;'); ?></p>
			</div>

		<?php endwhile; ?>

		<div class="navigation">
			<div class="alignleft"><?php next_posts_link('&laquo; Previous Entries') ?></div>
			<div class="alignright"><?php previous_posts_link('Next Entries &raquo;') ?></div>
		</div>

	<?php else : ?>

		<h2 class="center">Not Found</h2>
		<p class="center">Sorry, but you are looking for something that isn't here.</p>
		<?php include (TEMPLATEPATH . "/searchform.php"); ?>

	<?php endif; ?>

	</div>

<?php get_footer(); ?>
