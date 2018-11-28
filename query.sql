ALTER TABLE `user` CHANGE `ac_del_reason` `ac_del_reason` ENUM('','r2','r3','other','r1') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL;

ALTER TABLE `user` CHANGE `dating_type` `dating_movie` TINYINT NOT NULL;

ALTER TABLE `user` ADD `dating_dinner` TINYINT NOT NULL AFTER `dating_movie`;

ALTER TABLE `user` ADD `dating_other` TINYINT NOT NULL AFTER `dating_dinner`;

ALTER TABLE `user` ADD `for_men` TINYINT NOT NULL AFTER `longitude`, ADD `for_women` TINYINT NOT NULL AFTER `for_men`;

ALTER TABLE `user` ADD `address` VARCHAR(255) NOT NULL AFTER `longitude`;

-----------------------------------------------------------------------------------------------

ALTER TABLE `user` ADD `prof_pic` TEXT NOT NULL AFTER `dating_other`;

------------------------------------------------------------------------

ALTER TABLE `user` ADD `access` ENUM('user','admin') NOT NULL AFTER `phone`;

INSERT INTO `user` (`id`, `first_name`, `last_name`, `name`, `email`, `phone`, `access`, `password`, `dob`, `gender`, `about`, `dating_movie`, `dating_dinner`, `dating_other`, `prof_pic`, `prof_pic1`, `prof_pic2`, `prof_pic3`, `prof_pic4`, `min_age`, `max_age`, `latitude`, `longitude`, `address`, `for_men`, `for_women`, `ac_pause`, `ac_del_reason`, `ac_del_other_disc`, `created_on`, `updated_on`, `updated_by`, `status`) VALUES (NULL, '', '', 'Dating Admin', 'admin@dating.com', '', 'admin', '25d55ad283aa400af464c76d713c07ad', '2018-10-01', '', 'Dating Admin', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2018-10-01 00:00:00', '', '', 'active');

------------------------------------------------------------------------

ALTER TABLE `report_user` CHANGE `report_reason` `report_reason` ENUM('inappropriate','bad_language','inappropriate_pics','other') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL;


------------------------------------------------------------------------
03-10-18

ALTER TABLE `dating_ques` CHANGE `question` `se_question` TEXT CHARACTER SET utf8 COLLATE utf8_bin NOT NULL;

ALTER TABLE `dating_ques` ADD `en_question` TEXT CHARACTER SET utf8 COLLATE utf8_bin NOT NULL AFTER `se_question`;


INSERT INTO `pages` (`id`, `page_name`, `en_titile`, `en_description`, `se_title`, `se_description`, `created_by`, `created_on`, `updated_by`, `updated_on`, `status`) VALUES (NULL, 'tnc', 'tnc', 'test', 'tnc se', 'test se', '2', '2018-10-05', '2', '2018-10-05', 'active');


ALTER TABLE `pages` CHANGE `en_titile` `en_title` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL;


------------------------------------------------------------------------

11-10-2018

ALTER TABLE `user` ADD `login_with` ENUM('','fb','gplus') NOT NULL AFTER `access`;

ALTER TABLE `user` ADD `block` TINYINT NOT NULL AFTER `status`;

ALTER TABLE `user` ADD `dating_other_disc` TEXT NOT NULL AFTER `dating_other`;



