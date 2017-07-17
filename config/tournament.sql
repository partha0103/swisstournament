CREATE TABLE `user`
  (
     `id`       INT(10) NOT NULL auto_increment,
     `username` VARCHAR(30) NOT NULL,
     `password` VARCHAR(300) DEFAULT NULL,
     `flag`     INT(10) DEFAULT '0',
     PRIMARY KEY (`id`),
     UNIQUE KEY `id` (`id`),
     UNIQUE KEY `username` (`username`)
  )


CREATE TABLE `tournaments` (
      `user_id` int(10) NOT NULL,
      `id`      int(10) NOT NULL auto_increment,
      `NAME`    varchar(30) DEFAULT NULL,
      `status`  varchar(30) DEFAULT 'Yet to start',
      `winner`  varchar(30) DEFAULT 'Tournament yet to be finished',
      PRIMARY KEY (`id`),
      UNIQUE KEY `NAME` (`NAME`),
      KEY `user_id` (`user_id`),
      CONSTRAINT `tournaments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `USER` (`id`)



CREATE TABLE `players` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `user_id` int(10) NOT NULL,
  `tournament_id` int(10) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `user_id` (`user_id`),
  KEY `FK_tournament_id` (`tournament_id`),
  CONSTRAINT `FK_tournament_id` FOREIGN KEY (`tournament_id`) REFERENCES `tournaments` (`id`),
  CONSTRAINT `players_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
)


CREATE TABLE `matches` (
  `tournament_id` int(10) NOT NULL,
  `player1_id` int(10) NOT NULL,
  `player2_id` int(10) NOT NULL,
  `winner_id` int(10) NOT NULL,
  `round` int(4) DEFAULT '0',
  `r_status` varchar(30) DEFAULT 'Not started',
  PRIMARY KEY (`player1_id`,`player2_id`)
)



CREATE algorithm=undefined definer=`root`@`localhost` sql security definer VIEW `matchs_count` ASSELECT    `players`.`tournament_id`     AS `tournament_id`,
          `players`.`id`                AS `player_id`,
          count(`matches`.`player1_id`) AS `matches`
FROM      (`players`
LEFT JOIN `matches`
ON       (((
                                        `players`.`id` = `matches`.`player1_id`)
                    OR        (
                                        `players`.`id` = `matches`.`player2_id`))))
GROUP BY  `players`.`id`



CREATE algorithm=undefined definer=`root`@`localhost` sql security definer VIEW `win_count` ASSELECT    `players`.`tournament_id`    AS `tournament_id`,
          `players`.`id`               AS `player_id`,
          count(`matches`.`winner_id`) AS `wins`
FROM      (`players`
LEFT JOIN `matches`
ON       ((
                              `players`.`id` = `matches`.`winner_id`)))
GROUP BY  `players`.`id`
ORDER BY  count(`matches`.`winner_id`) DESC
