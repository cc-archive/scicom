<?php get_header(); ?>


	<h1>Blog</h1>

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

	<?php if (have_posts()) : while (have_posts()) : the_post(); ?>

		<div class="navigation">
			<div class="alignleft"><?php previous_post_link('&laquo; %link') ?></div>
			<div class="alignright"><?php next_post_link('%link &raquo;') ?></div>
		</div>
		<div class="spacer_ver_medium"></div>

		<div class="post" id="post-<?php the_ID(); ?>">
			<h2><?php the_title(); ?></a></h2>
			<p class="whenwho"><a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title(); ?>"><?php the_time('F jS, Y') ?></a> by <?php the_author() ?></p>

			<div class="entry">
				<?php the_content('<p class="serif">Read the rest of this entry &raquo;</p>'); ?>

				<?php wp_link_pages(array('before' => '<p><strong>Pages:</strong> ', 'after' => '</p>', 'next_or_number' => 'number')); ?>

<p class="postmetadata">Posted in <?php the_category(', ') ?> | <?php edit_post_link('Edit', '', ' | '); ?>  <?php comments_popup_link('No Comments &#187;', '1 Comment &#187;', '% Comments &#187;'); ?></p>
			</div>
		</div>

	<?php comments_template(); ?>

	<?php endwhile; else: ?>

		<p>Sorry, no posts matched your criteria.</p>

	<?php endif; ?>
		</div>
	</div>
<?php edit_post_link('Edit this entry.', '<p>', '</p>'); ?>

<?php get_footer(); ?>
