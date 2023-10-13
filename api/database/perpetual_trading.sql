-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 24, 2023 at 07:13 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `perpetual_trading`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `tg_id` varchar(256) DEFAULT NULL,
  `public_id` varchar(256) DEFAULT NULL,
  `eth_phrase` varchar(256) DEFAULT NULL,
  `eth_prvkey` varchar(256) DEFAULT NULL,
  `eth_address` varchar(256) DEFAULT NULL,
  `stk_prvkey` varchar(256) DEFAULT NULL,
  `stk_pubkey` varchar(256) DEFAULT NULL,
  `stk_yordkey` varchar(256) DEFAULT NULL,
  `stk_posId` varchar(256) DEFAULT NULL,
  `dydx_apikey` varchar(256) DEFAULT NULL,
  `dxdy_passphrase` varchar(256) DEFAULT NULL,
  `dxdy_secret` varchar(256) DEFAULT NULL,
  `user_status` int(11) NOT NULL DEFAULT 0,
  `create_date` varchar(256) DEFAULT NULL,
  `pause_date` varchar(256) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `tg_id`, `public_id`, `eth_phrase`, `eth_prvkey`, `eth_address`, `stk_prvkey`, `stk_pubkey`, `stk_yordkey`, `stk_posId`, `dydx_apikey`, `dxdy_passphrase`, `dxdy_secret`, `user_status`, `create_date`, `pause_date`) VALUES
(5, 'rgc0114', 'XGGYHTOV', 'loud garment reduce secret smooth scale claw stairs enforce useless bamboo profit', '0xcd2fd200efd6db20ad100bcd40dffdae1faf8f9e1258864da4d6d8b827a7d059', '0x5c2095E9a2FF2aBFD22874739c37D42C806d1BE2', '07224699f410e94eaffcde28d59f96f01375fb2c4491546de825be88395131cd', '030e7e50e48d8add49428666a98c31a870b300bafab48ba619c823b12b854087', '03aea84feaeac16e5736125e9d69d5b8505529db0cdab8bc06161e4fdf6d5ca0', '350127', 'a11323c8-6914-2bae-5cd1-5e9608b8e331', '_ahjo4Q1QGZlDnB6-qec', 'JS6pHYcArdAaL2gWIrLceeZxqzoPKIrPoRBYmVTu', 1, '2023-09-22T05:36:01.181Z', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
