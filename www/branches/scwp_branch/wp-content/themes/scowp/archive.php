<?php get_header(); ?>


		<?php if (have_posts()) : ?>

		 <?php $post = $posts[0]; // Hack. Set $post so that the_date() works. ?>
<?php /* If this is a category archive */ if (is_category()) { ?>
		<h1 class="pagetitle">Blog archive for the &#8216;<?php echo single_cat_title(); ?>&#8217; Category</h1>

 	  <?php /* If this is a daily archive */ } elseif (is_day()) { ?>
		<h1 class="pagetitle">Blog archive for <?php the_time('F jS, Y'); ?></h1>

	 <?php /* If this is a monthly archive */ } elseif (is_month()) { ?>
		<h1 class="pagetitle">Blog archive for <?php the_time('F, Y'); ?></h1>

		<?php /* If this is a yearly archive */ } elseif (is_year()) { ?>
		<h1 class="pagetitle">Blog archive for <?php the_time('Y'); ?></h1>

	  <?php /* If this is an author archive */ } elseif (is_author()) { ?>
		<h1 class="pagetitle">Blog author Archive</h1>

		<?php /* If this is a paged archive */ } elseif (isset($_GET['paged']) && !empty($_GET['paged'])) { ?>
		<h1 class="pagetitle">Blog Archives</h1>

		<?php } ?>

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




		<div class="navigation">
			<div class="alignleft"><?php next_posts_link('&laquo; Previous Entries') ?></div>
			<div class="alignright"><?php previous_posts_link('Next Entries &raquo;') ?></div>
		</div>

		<?php while (have_posts()) : the_post(); ?>
		<div class="post">
			<h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
			<p class="whenwho"><a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title(); ?>"><?php the_time('F jS, Y') ?></a> by <?php the_author() ?></p>

				<div class="entry">
					<?php the_content() ?>
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
		<?php include (TEMPLATEPATH . '/searchform.php'); ?>

	<?php endif; ?>
		</div>
	</div>
<?php edit_post_link('Edit this entry.', '<p>', '</p>'); ?>

<?php get_footer(); ?>
