<?php


function the_permalink() {
	echo apply_filters('the_permalink', get_permalink());
}


function permalink_link() { // For backwards compatibility
	echo apply_filters('the_permalink', get_permalink());
}


function permalink_anchor($mode = 'id') {
	global $post;
	switch ( strtolower($mode) ) {
		case 'title':
			$title = sanitize_title($post->post_title) . '-' . $id;
			echo '<a id="'.$title.'"></a>';
			break;
		case 'id':
		default:
			echo '<a id="post-' . $post->ID . '"></a>';
			break;
	}
}


function get_permalink($id = 0) {
	$rewritecode = array(
		'%year%',
		'%monthnum%',
		'%day%',
		'%hour%',
		'%minute%',
		'%second%',
		'%postname%',
		'%post_id%',
		'%category%',
		'%author%',
		'%pagename%'
	);

	$post = &get_post($id);
	if ( $post->post_type == 'page' )
		return get_page_link($post->ID);
	elseif ($post->post_type == 'attachment')
		return get_attachment_link($post->ID);

	$permalink = get_option('permalink_structure');

	if ( '' != $permalink && 'draft' != $post->post_status ) {
		$unixtime = strtotime($post->post_date);

		$category = '';
		if ( strstr($permalink, '%category%') ) {
                        $cat_id=0;
                        $cats = get_the_category($post->ID);

                        while ($cat_id < count($cats)) {
                            $category = $cats[$cat_id]->category_nicename;
                            $parent=$cats[$cat_id]->category_parent;
                            if ( $parent ) {
                                $parent_category = get_category_parents($parent, FALSE, '/', TRUE);
                                # Skip over license-status categories
                                if ($parent_category != "license-status/") {
                                    $category = $parent_category . $category;
                                    break;
                                }
                            }
                            $cat_id++;
                        }

		}

		$authordata = get_userdata($post->post_author);
		$author = $authordata->user_nicename;
		$date = explode(" ",date('Y m d H i s', $unixtime));
		$rewritereplace =
		array(
			$date[0],
			$date[1],
			$date[2],
			$date[3],
			$date[4],
			$date[5],
			$post->post_name,
			$post->ID,
			$category,
			$author,
			$post->post_name,
		);
		return apply_filters('post_link', get_option('home') . str_replace($rewritecode, $rewritereplace, $permalink), $post);
	} else { // if they're not using the fancy permalink option
		$permalink = get_option('home') . '/?p=' . $post->ID;
		return apply_filters('post_link', $permalink, $post);
	}
}

// get permalink from post ID
function post_permalink($post_id = 0, $mode = '') { // $mode legacy
	return get_permalink($post_id);
}

// Respects page_on_front.  Use this one.
function get_page_link($id = false) {
	global $post;

	$id = (int) $id;
	if ( !$id )
		$id = (int) $post->ID;

	if ( 'page' == get_option('show_on_front') && $id == get_option('page_on_front') )
		$link = get_option('home');
	else
		$link = _get_page_link( $id );

	return apply_filters('page_link', $link, $id);
}

// Ignores page_on_front.  Internal use only.
function _get_page_link( $id = false ) {
	global $post, $wp_rewrite;

	if ( !$id )
		$id = (int) $post->ID;

	$pagestruct = $wp_rewrite->get_page_permastruct();

	if ( '' != $pagestruct && 'draft' != $post->post_status ) {
		$link = get_page_uri($id);
		$link = str_replace('%pagename%', $link, $pagestruct);
		$link = get_option('home') . "/$link/";
	} else {
		$link = get_option('home') . "/?page_id=$id";
	}

	return apply_filters( '_get_page_link', $link, $id );
}

function get_attachment_link($id = false) {
	global $post, $wp_rewrite;

	$link = false;

	if (! $id) {
		$id = (int) $post->ID;
	}

	$object = get_post($id);
	if ( $wp_rewrite->using_permalinks() && ($object->post_parent > 0) && ($object->post_parent != $id) ) {
		$parent = get_post($object->post_parent);
		if ( 'page' == $parent->post_type )
			$parentlink = _get_page_link( $object->post_parent ); // Ignores page_on_front
		else
			$parentlink = get_permalink( $object->post_parent );
		if (! strstr($parentlink, '?') )
			$link = trim($parentlink, '/') . '/' . $object->post_name . '/';
	}

	if (! $link ) {
		$link = get_bloginfo('home') . "/?attachment_id=$id";
	}

	return apply_filters('attachment_link', $link, $id);
}

function get_year_link($year) {
	global $wp_rewrite;
	if ( !$year )
		$year = gmdate('Y', time()+(get_option('gmt_offset') * 3600));
	$yearlink = $wp_rewrite->get_year_permastruct();
	if ( !empty($yearlink) ) {
		$yearlink = str_replace('%year%', $year, $yearlink);
		return apply_filters('year_link', get_option('home') . trailingslashit($yearlink), $year);
	} else {
		return apply_filters('year_link', get_option('home') . '/?m=' . $year, $year);
	}
}

function get_month_link($year, $month) {
	global $wp_rewrite;
	if ( !$year )
		$year = gmdate('Y', time()+(get_option('gmt_offset') * 3600));
	if ( !$month )
		$month = gmdate('m', time()+(get_option('gmt_offset') * 3600));
	$monthlink = $wp_rewrite->get_month_permastruct();
	if ( !empty($monthlink) ) {
		$monthlink = str_replace('%year%', $year, $monthlink);
		$monthlink = str_replace('%monthnum%', zeroise(intval($month), 2), $monthlink);
		return apply_filters('month_link', get_option('home') . trailingslashit($monthlink), $year, $month);
	} else {
		return apply_filters('month_link', get_option('home') . '/?m=' . $year . zeroise($month, 2), $year, $month);
	}
}

function get_day_link($year, $month, $day) {
	global $wp_rewrite;
	if ( !$year )
		$year = gmdate('Y', time()+(get_option('gmt_offset') * 3600));
	if ( !$month )
		$month = gmdate('m', time()+(get_option('gmt_offset') * 3600));
	if ( !$day )
		$day = gmdate('j', time()+(get_option('gmt_offset') * 3600));

	$daylink = $wp_rewrite->get_day_permastruct();
	if ( !empty($daylink) ) {
		$daylink = str_replace('%year%', $year, $daylink);
		$daylink = str_replace('%monthnum%', zeroise(intval($month), 2), $daylink);
		$daylink = str_replace('%day%', zeroise(intval($day), 2), $daylink);
		return apply_filters('day_link', get_option('home') . trailingslashit($daylink), $year, $month, $day);
	} else {
		return apply_filters('day_link', get_option('home') . '/?m=' . $year . zeroise($month, 2) . zeroise($day, 2), $year, $month, $day);
	}
}

function get_feed_link($feed='rss2') {
	global $wp_rewrite;
	$do_perma = 0;
	$feed_url = get_option('siteurl');
	$comment_feed_url = $feed_url;

	$permalink = $wp_rewrite->get_feed_permastruct();
	if ( '' != $permalink ) {
		if ( false !== strpos($feed, 'comments_') ) {
			$feed = str_replace('comments_', '', $feed);
			$permalink = $wp_rewrite->get_comment_feed_permastruct();
		}

		if ( 'rss2' == $feed )
			$feed = '';

		$permalink = str_replace('%feed%', $feed, $permalink);
		$permalink = preg_replace('#/+#', '/', "/$permalink/");
		$output =  get_option('home') . $permalink;
	} else {
		if ( false !== strpos($feed, 'comments_') )
			$feed = str_replace('comments_', 'comments-', $feed);

		$output = get_option('home') . "/?feed={$feed}";
	}

	return apply_filters('feed_link', $output, $feed);
}

function edit_post_link($link = 'Edit This', $before = '', $after = '') {
	global $post;

	if ( is_attachment() )
		return;

	if( $post->post_type == 'page' ) {
		if ( ! current_user_can('edit_page', $post->ID) )
			return;
		$file = 'page';
	} else {
		if ( ! current_user_can('edit_post', $post->ID) )
			return;
		$file = 'post';
	}

	$location = get_option('siteurl') . "/wp-admin/{$file}.php?action=edit&amp;post=$post->ID";
	echo $before . "<a href=\"$location\">$link</a>" . $after;
}

function edit_comment_link($link = 'Edit This', $before = '', $after = '') {
	global $post, $comment;

	if( $post->post_type == 'page' ){
		if ( ! current_user_can('edit_page', $post->ID) )
			return;
	} else {
		if ( ! current_user_can('edit_post', $post->ID) )
			return;
	}

	$location = get_option('siteurl') . "/wp-admin/comment.php?action=editcomment&amp;c=$comment->comment_ID";
	echo $before . "<a href='$location'>$link</a>" . $after;
}

// Navigation links

function get_previous_post($in_same_cat = false, $excluded_categories = '') {
	global $post, $wpdb;

	if( !is_single() || is_attachment() )
		return null;

	$current_post_date = $post->post_date;

	$join = '';
	if ( $in_same_cat ) {
		$join = " INNER JOIN $wpdb->post2cat ON $wpdb->posts.ID= $wpdb->post2cat.post_id ";
		$cat_array = get_the_category($post->ID);
		$join .= ' AND (category_id = ' . intval($cat_array[0]->cat_ID);
		for ( $i = 1; $i < (count($cat_array)); $i++ ) {
			$join .= ' OR category_id = ' . intval($cat_array[$i]->cat_ID);
		}
		$join .= ')';
	}

	$sql_exclude_cats = '';
	if ( !empty($excluded_categories) ) {
		$blah = explode(' and ', $excluded_categories);
		foreach ( $blah as $category ) {
			$category = intval($category);
			$sql_cat_ids = " OR pc.category_ID = '$category'";
		}
		$posts_in_ex_cats = $wpdb->get_col("SELECT p.ID FROM $wpdb->posts p LEFT JOIN $wpdb->post2cat pc ON pc.post_id=p.ID WHERE 1 = 0 $sql_cat_ids GROUP BY p.ID");
		$posts_in_ex_cats_sql = 'AND ID NOT IN (' . implode($posts_in_ex_cats, ',') . ')';
	}

	$join  = apply_filters( 'get_previous_post_join', $join, $in_same_cat, $excluded_categories );
	$where = apply_filters( 'get_previous_post_where', "WHERE post_date < '$current_post_date' AND post_type = 'post' AND post_status = 'publish' $posts_in_ex_cats_sql", $in_same_cat, $excluded_categories );
	$sort  = apply_filters( 'get_previous_post_sort', 'ORDER BY post_date DESC LIMIT 1' );

	return @$wpdb->get_row("SELECT ID, post_title FROM $wpdb->posts $join $where $sort");
}

function get_next_post($in_same_cat = false, $excluded_categories = '') {
	global $post, $wpdb;

	if( !is_single() || is_attachment() )
		return null;

	$current_post_date = $post->post_date;

	$join = '';
	if ( $in_same_cat ) {
		$join = " INNER JOIN $wpdb->post2cat ON $wpdb->posts.ID= $wpdb->post2cat.post_id ";
		$cat_array = get_the_category($post->ID);
		$join .= ' AND (category_id = ' . intval($cat_array[0]->cat_ID);
		for ( $i = 1; $i < (count($cat_array)); $i++ ) {
			$join .= ' OR category_id = ' . intval($cat_array[$i]->cat_ID);
		}
		$join .= ')';
	}

	$sql_exclude_cats = '';
	if ( !empty($excluded_categories) ) {
		$blah = explode(' and ', $excluded_categories);
		foreach ( $blah as $category ) {
			$category = intval($category);
			$sql_cat_ids = " OR pc.category_ID = '$category'";
		}
		$posts_in_ex_cats = $wpdb->get_col("SELECT p.ID from $wpdb->posts p LEFT JOIN $wpdb->post2cat pc ON pc.post_id = p.ID WHERE 1 = 0 $sql_cat_ids GROUP BY p.ID");
		$posts_in_ex_cats_sql = 'AND ID NOT IN (' . implode($posts_in_ex_cats, ',') . ')';
	}

	$join  = apply_filters( 'get_next_post_join', $join, $in_same_cat, $excluded_categories );
	$where = apply_filters( 'get_next_post_where', "WHERE post_date > '$current_post_date' AND post_type = 'post' AND post_status = 'publish' $posts_in_ex_cats_sql AND ID != $post->ID", $in_same_cat, $excluded_categories );
	$sort  = apply_filters( 'get_next_post_sort', 'ORDER BY post_date ASC LIMIT 1' );

	return @$wpdb->get_row("SELECT ID, post_title FROM $wpdb->posts $join $where $sort");
}


function previous_post_link($format='&laquo; %link', $link='%title', $in_same_cat = false, $excluded_categories = '') {

	if ( is_attachment() )
		$post = & get_post($GLOBALS['post']->post_parent);
	else
		$post = get_previous_post($in_same_cat, $excluded_categories);

	if ( !$post )
		return;

	$title = apply_filters('the_title', $post->post_title, $post);
	$string = '<a href="'.get_permalink($post->ID).'">';
	$link = str_replace('%title', $title, $link);
	$link = $pre . $string . $link . '</a>';

	$format = str_replace('%link', $link, $format);

	echo $format;
}

function next_post_link($format='%link &raquo;', $link='%title', $in_same_cat = false, $excluded_categories = '') {
	$post = get_next_post($in_same_cat, $excluded_categories);

	if ( !$post )
		return;

	$title = apply_filters('the_title', $post->post_title, $post);
	$string = '<a href="'.get_permalink($post->ID).'">';
	$link = str_replace('%title', $title, $link);
	$link = $string . $link . '</a>';
	$format = str_replace('%link', $link, $format);

	echo $format;
}

function get_pagenum_link($pagenum = 1) {
	global $wp_rewrite;

	$qstr = $_SERVER['REQUEST_URI'];

	$page_querystring = "paged";
	$page_modstring = "page/";
	$page_modregex = "page/?";
	$permalink = 0;

	$home_root = parse_url(get_option('home'));
	$home_root = $home_root['path'];
	$home_root = trailingslashit($home_root);
	$qstr = preg_replace('|^'. $home_root . '|', '', $qstr);
	$qstr = preg_replace('|^/+|', '', $qstr);

	$index = $_SERVER['PHP_SELF'];
	$index = preg_replace('|^'. $home_root . '|', '', $index);
	$index = preg_replace('|^/+|', '', $index);

	// if we already have a QUERY style page string
	if ( stristr( $qstr, $page_querystring ) ) {
		$replacement = "$page_querystring=$pagenum";
		$qstr = preg_replace("/".$page_querystring."[^\d]+\d+/", $replacement, $qstr);
		// if we already have a mod_rewrite style page string
	} elseif ( preg_match( '|'.$page_modregex.'\d+|', $qstr ) ) {
		$permalink = 1;
		$qstr = preg_replace('|'.$page_modregex.'\d+|',"$page_modstring$pagenum",$qstr);

		// if we don't have a page string at all ...
		// lets see what sort of URL we have...
	} else {
		// we need to know the way queries are being written
		// if there's a querystring_start (a "?" usually), it's definitely not mod_rewritten
		if ( stristr( $qstr, '?' ) ) {
			// so append the query string (using &, since we already have ?)
			$qstr .=	'&amp;' . $page_querystring . '=' . $pagenum;
			// otherwise, it could be rewritten, OR just the default index ...
		} elseif( '' != get_option('permalink_structure') && ! is_admin() ) {
			$permalink = 1;
			$index = $wp_rewrite->index;
			// If it's not a path info permalink structure, trim the index.
			if ( !$wp_rewrite->using_index_permalinks() ) {
				$qstr = preg_replace("#/*" . $index . "/*#", '/', $qstr);
			} else {
				// If using path info style permalinks, make sure the index is in
				// the URL.
				if ( strpos($qstr, $index) === false )
					$qstr = '/' . $index . $qstr;
			}

			$qstr =	trailingslashit($qstr) . $page_modstring . $pagenum;
		} else {
			$qstr = $index . '?' . $page_querystring . '=' . $pagenum;
		}
	}

	$qstr = preg_replace('|^/+|', '', $qstr);
	if ( $permalink )
		$qstr = trailingslashit($qstr);
	$qstr = preg_replace('/&([^#])(?![a-z]{1,8};)/', '&#038;$1', trailingslashit( get_option('home') ) . $qstr );

	// showing /page/1/ or ?paged=1 is redundant
	if ( 1 === $pagenum ) {
		$qstr = str_replace('page/1/', '', $qstr); // for mod_rewrite style
		$qstr = remove_query_arg('paged', $qstr); // for query style
	}
	return $qstr;
}

function get_next_posts_page_link($max_page = 0) {
	global $paged, $pagenow;

	if ( !is_single() ) {
		if ( !$paged )
			$paged = 1;
		$nextpage = intval($paged) + 1;
		if ( !$max_page || $max_page >= $nextpage )
			return get_pagenum_link($nextpage);
	}
}

function next_posts($max_page = 0) {
	echo clean_url(get_next_posts_page_link($max_page));
}

function next_posts_link($label='Next Page &raquo;', $max_page=0) {
	global $paged, $wpdb, $wp_query;
	if ( !$max_page ) {
		$max_page = $wp_query->max_num_pages;
	}
	if ( !$paged )
		$paged = 1;
	$nextpage = intval($paged) + 1;
	if ( (! is_single()) && (empty($paged) || $nextpage <= $max_page) ) {
		echo '<a href="';
		next_posts($max_page);
		echo '">'. preg_replace('/&([^#])(?![a-z]{1,8};)/', '&#038;$1', $label) .'</a>';
	}
}

function get_previous_posts_page_link() {
	global $paged, $pagenow;

	if ( !is_single() ) {
		$nextpage = intval($paged) - 1;
		if ( $nextpage < 1 )
			$nextpage = 1;
		return get_pagenum_link($nextpage);
	}
}

function previous_posts() {
	echo clean_url(get_previous_posts_page_link());
}

function previous_posts_link($label='&laquo; Previous Page') {
	global $paged;
	if ( (!is_single())	&& ($paged > 1) ) {
		echo '<a href="';
		previous_posts();
		echo '">'. preg_replace('/&([^#])(?![a-z]{1,8};)/', '&#038;$1', $label) .'</a>';
	}
}

function posts_nav_link($sep=' &#8212; ', $prelabel='&laquo; Previous Page', $nxtlabel='Next Page &raquo;') {
	global $wp_query;
	if ( !is_singular() ) {
		$max_num_pages = $wp_query->max_num_pages;
		$paged = get_query_var('paged');

		//only have sep if there's both prev and next results
		if ($paged < 2 || $paged >= $max_num_pages) {
			$sep = '';
		}

		if ( $max_num_pages > 1 ) {
			previous_posts_link($prelabel);
			echo preg_replace('/&([^#])(?![a-z]{1,8};)/', '&#038;$1', $sep);
			next_posts_link($nxtlabel);
		}
	}
}

?>
