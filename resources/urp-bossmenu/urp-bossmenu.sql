-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.22-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for urp
CREATE DATABASE IF NOT EXISTS `urp` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `urp`;

-- Dumping structure for table urp.society
CREATE TABLE IF NOT EXISTS `society` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `societyname` varchar(100) NOT NULL DEFAULT '',
  `societymoney` int(11) NOT NULL,
  `societyitems` longtext NOT NULL DEFAULT '[]',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Dumping data for table urp.society: ~2 rows (approximately)
/*!40000 ALTER TABLE `society` DISABLE KEYS */;
INSERT INTO `society` (`id`, `societyname`, `societymoney`, `societyitems`) VALUES
	(1, 'police', 1399, '[[],[{},{},{}]]'),
	(2, 'ambulance', 0, '[[],[{},{},{}]]');
/*!40000 ALTER TABLE `society` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
