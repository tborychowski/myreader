--
-- Database: `myreader`
--


--
-- Table structure for table `items`
--

CREATE TABLE IF NOT EXISTS `items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `source_id` int(11) NOT NULL,
  `item_id` varchar(250) NOT NULL,
  `datetime` datetime NOT NULL,
  `title` varchar(200) NOT NULL,
  `content` text NOT NULL,
  `url` varchar(200) NOT NULL,
  `is_unread` tinyint(1) NOT NULL DEFAULT '1',
  `is_starred` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `items_item_id_unique` (`item_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin2 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `sources`
--

CREATE TABLE IF NOT EXISTS `sources` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `tag` varchar(25) NOT NULL,
  `url` varchar(200) NOT NULL,
  `real_url` varchar(200) NOT NULL,
  `icon` int(11) NOT NULL,
  `last_error` varchar(200) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sources_url_unique` (`url`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin2 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin2 AUTO_INCREMENT=1 ;
