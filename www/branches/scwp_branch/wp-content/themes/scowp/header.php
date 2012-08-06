<!--

+----------------------------------------------------------------------+
| Science Commons                                                      |
| sciencecommons.org                                                   |
+----------------------------------------------------------------------+
| Copyright (c) 2007 Creative Commons                                  |
+----------------------------------------------------------------------+
| VERSION: 1                                                           |
+----------------------------------------------------------------------+
| AUTHOR(S): Wade Preston Shearer                                      |
+----------------------------------------------------------------------+
| DATE: 2007/04/14                                                     |
+----------------------------------------------------------------------+
| SECTION:                                                             |
+----------------------------------------------------------------------+
| MODULE:                                                              |
+----------------------------------------------------------------------+
| FILE: global template                                                |
+----------------------------------------------------------------------+
| NOTES:                                                               |
+----------------------------------------------------------------------+

-->

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" <?php language_attributes(); ?>>

<head profile="http://gmpg.org/xfn/11">
<meta http-equiv="Content-Type" content="<?php bloginfo('html_type'); ?>; charset=<?php bloginfo('charset'); ?>" />

<title><?php bloginfo('name'); ?> <?php if ( is_single() ) { ?> &raquo; Blog Archive <?php } ?> <?php wp_title(); ?></title>

<meta name="generator" content="WordPress <?php bloginfo('version'); ?>" /> <!-- leave this for stats -->

<link rel="stylesheet" href="<?php bloginfo('stylesheet_url'); ?>" type="text/css" media="screen" />
<link rel="alternate" type="application/rss+xml" title="<?php bloginfo('name'); ?> RSS Feed" href="<?php bloginfo('rss2_url'); ?>" />
<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />

<style type="text/css" media="screen">
div#header
{
	background-image: url('/wp-content/themes/scowp/images/header_bg_<?php echo rand(1,5); ?>.jpg');
}
#deprecated_banner
{
	background-color: #FF8080;
	text-align: center;
	font-weight: bold;
	padding: 1ex;
}
</style>
<?php wp_head(); ?>
</head>
<body>

<div id="deprecated_banner">
	<div>Science Commons was <a href="http://creativecommons.org/science">re-integrated</a> with Creative Commons. This content is no longer maintained and remains only for reference.</div>
</div>

<div id="header">
	<a id="logo" class="imagelink" href="/" />home</a>
</div>

<div id="main">
	<div class="rule"></div>
