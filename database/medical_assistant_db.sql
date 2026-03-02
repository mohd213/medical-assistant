-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 02, 2026 at 02:10 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `medical_assistant_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blogs`
--

INSERT INTO `blogs` (`id`, `user_id`, `title`, `content`, `image`, `created_at`, `updated_at`) VALUES
(4, 9, 'regsfvc', 'ewfadzcx', '/uploads/blogs/blog-1771719120922-755181008.png', '2026-02-22 00:12:00', '2026-02-22 00:12:00'),
(8, 15, 'lrgssss', 'masad', '/uploads/blogs/blog-1771795216709-245714311.png', '2026-02-22 21:20:16', '2026-02-22 21:20:29'),
(12, 11, 'ف4صثبي', 'صيشبيس', NULL, '2026-03-01 23:35:48', '2026-03-01 23:35:48');

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `subject` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `status` enum('new','read','replied') DEFAULT 'new',
  `admin_reply` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `user_id`, `name`, `email`, `subject`, `message`, `status`, `admin_reply`, `created_at`) VALUES
(1, NULL, 'محمد علي', 'mohammed@Ali.com', 'المرض', 'انا تعبان', 'new', NULL, '2026-02-22 00:25:00'),
(2, NULL, 'mohammed mohammed', 'mohammedad@gmail.com', 'ثفقلب', '75غثايبئئئئئ', 'new', NULL, '2026-02-22 09:47:50'),
(3, NULL, 'abed masad', 'Ajulyos88@hotmail.com', 'سوء في الاستخدام', 'lrgsssslrgsssslrgsssslrgsssslrgsssslrgsssslrgsssslrgsssslrgsssslrgsssslrgsssslrgsssslrgsssslrgsssslrgsssslrgsssslrgsssslrgsssslrgsssslrgsssslrgsssslrgssss', 'replied', 'تو الوضع في عين الاعتبار', '2026-02-22 21:23:39'),
(4, NULL, 'محمد عابد', 'test1@test.com', 'سوء في الاستخدام', 'التطبيق لا يعمل بدقة', 'read', 'تم', '2026-02-23 11:54:04'),
(5, NULL, 'mohammed mohammed', 'mohammedMasad@gmail.com', 'يسبلا', 'يسشسقفيبغلا', 'new', NULL, '2026-03-01 23:37:44');

-- --------------------------------------------------------

--
-- Table structure for table `follow_up_cases`
--

CREATE TABLE `follow_up_cases` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `patient_name` varchar(100) NOT NULL,
  `age` int(11) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `disease` text DEFAULT NULL,
  `medicine` text DEFAULT NULL,
  `surgery` text DEFAULT NULL,
  `healing_rate` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `follow_up_cases`
--

INSERT INTO `follow_up_cases` (`id`, `user_id`, `patient_name`, `age`, `gender`, `disease`, `medicine`, `surgery`, `healing_rate`, `notes`, `created_at`, `updated_at`) VALUES
(5, 10, 'mohammed', 11, 'ذكر', 'srfvxc', '20', 'ewfsdvc', '20', 'قلسيبر', '2026-02-22 10:16:06', '2026-02-22 10:16:06'),
(6, 15, 'محمد', 22, 'ذكر', 'صلع', 'انسولين', 'زراعة شعر', '22', 'lrgsssslrgsssslrgsssslrgsssslrgsssslrgsssslrgsssslrgsssslrgsssslrgsssslrgssss', '2026-02-22 21:23:00', '2026-02-22 21:23:00'),
(7, 16, 'محمد', 22, 'ذكر', 'صلع', 'انسولين', 'زراعة شعر', '59', 'adsfhgjbnvcbxz', '2026-02-23 11:53:26', '2026-02-23 11:53:26'),
(8, 18, 'mohammed', 11, 'ذكر', 'srfvxc', 'sfvxc', 'ewfsdvc', '20', 'DWAFESDGV', '2026-03-01 23:15:38', '2026-03-01 23:15:38'),
(11, 11, '6yrthgb', 11, 'ذكر', 'srfvxc', 'sfvxc', 'ewfsdvc', 'شيسبس', 'شسيبسي', '2026-03-01 23:40:10', '2026-03-01 23:40:10');

-- --------------------------------------------------------

--
-- Table structure for table `operations`
--

CREATE TABLE `operations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `patient_name` varchar(100) NOT NULL,
  `operation_type` varchar(200) NOT NULL,
  `hospital` varchar(200) NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `operation_date` date DEFAULT NULL,
  `operation_time` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `operations`
--

INSERT INTO `operations` (`id`, `user_id`, `patient_name`, `operation_type`, `hospital`, `department`, `operation_date`, `operation_time`, `notes`, `created_at`, `updated_at`) VALUES
(2, 9, 'wrsdzc', 'سيب', 'w4trsdv', 'سيرؤ', '0546-12-31', '05:44', '35yergsfvxc', '2026-02-22 00:12:27', NULL),
(4, 15, 'محمد', 'زاعة شعر', 'الاقصى', 'تجميل', '2026-03-12', '05:16', 'lrgsssslrgsssslrgsssslrgssss', '2026-02-22 21:21:21', NULL),
(5, 16, 'محمد', 'زاعة شعر', 'الاقصى', 'تجميل', '2026-03-12', '00:22', 'eqfaddgb', '2026-02-23 11:51:16', NULL),
(8, 11, 'فصقسي', 'ثصبي', '3فصقبسي', '4فصبيس', '2026-02-28', '15:48', NULL, '2026-02-28 13:47:50', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `specialization` varchar(100) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `profile_img` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `email`, `password`, `phone`, `specialization`, `role`, `profile_img`, `created_at`, `updated_at`) VALUES
(7, 'محمد', 'مسعد', 'mwla21@gmail.com', '$2b$10$mrIrXB3Zp9JDKPtjmFFZsOaO6g1shGPQ4B2tNipZ6QSgI3TceuiEO', '0594545902', 'باطني', 'user', NULL, '2026-02-21 22:19:10', NULL),
(9, 'محمد', 'علي', 'mohammed@Ali.com', '$2b$10$1u7uIH61oaL0Pfl0chfx4OUR2fTEmLqHaLxy99Ik4M6ClMMNF4hKu', '0594545902', 'باطني', 'user', NULL, '2026-02-22 00:11:05', '2026-02-22 10:15:17'),
(10, 'mwla213', 'mwla213', 'mwla213@gmail.com', '$2b$10$q5wxz/XZz1qO4.r9RbdFYuvUbvLSnE.qQVJQb7LLiWFH2xkE.sjMW', '0594545902', 'باطني', 'user', '/uploads/profiles/profile-1771851974620-918567984.png', '2026-02-22 00:34:56', '2026-02-26 22:45:01'),
(11, 'mohammed', 'mohammed', 'mohammedMasad@gmail.com', '$2b$10$L6TGjO5R5fKlRwIdmjbvk.QOB/TSIfQRH8vzd.lPZ1W4.I.ky0aQq', '0597869993', 'جلدية', 'user', '/uploads/profiles/profile-1772408905058-267020295.jpg', '2026-02-22 09:33:40', '2026-03-01 23:48:25'),
(13, 'mohammed', 'mwla213', 'MMMM@gmail.com', '$2b$10$KKWJ6zcAA.8tDwIcXaVY/evR07fcz.mVcKeUIMhEsmwVH35DL8Kii', '0597869993', 'باطني', 'user', NULL, '2026-02-22 13:38:49', NULL),
(15, 'abed', 'masad', 'Ajulyos88@hotmail.com', '$2b$10$16py.yy.LnDbZgYxwprg/.WH8OSlK/zVfj30kAsEh3LA9P68fEwdG', '0591234567', 'جلدية', 'user', NULL, '2026-02-22 21:19:18', NULL),
(16, 'محمد', 'عابد', 'test1@test.com', '$2b$10$YvU9liXMSay.YaOe/0NZduMDAsJPuSGnI0bkF4f8ZChmskSLIsm9W', '0591234567', 'باطني', 'user', '/uploads/profiles/profile-1771852283803-207123844.png', '2026-02-23 11:49:34', '2026-02-26 22:44:46'),
(17, 'رائد', 'عابد', 'raed@raed.com', '$2b$10$iulMrhDq7xWh.bqRmP.wZehpAiAxtaw7BhebgKpI3SH3h6mZY6a8W', '0597869993', 'باطني', 'user', '/uploads/profiles/profile-1771852712225-278381239.png', '2026-02-23 13:15:09', '2026-02-23 13:18:32'),
(18, 'Mohammed', 'Abed Masad', 'Mohammed@Mohammed.com', '$2b$10$uNMSu27mO9CaEiS4NQQMju/l8F2uvalnKtBoyqErGCpE4QQESk4J2', '0597869993', 'أنف وأذن وحنجرة', 'user', '/uploads/profiles/profile-1772406680083-466996378.jpg', '2026-02-26 23:09:12', '2026-03-01 23:14:32'),
(19, 'mohammed', 'masad', 'test1@122.com', '$2b$10$RYN0rJso/PmgNQltOusRcOB2CPRyzmgK.LwDT/usheAUBjszcjjmu', '059-273-6604', 'أنف وأذن وحنجرة', 'admin', NULL, '2026-03-01 13:01:40', '2026-03-02 00:08:55'),
(20, 'mohammed', 'mohammed', 'mohammed@gmail.com', '$2b$10$B5EpIQvnTSL99Pm1/zfFTedhoXnJN3ors96DpCDnaH5n4ids1sBHG', '0597869993', 'باطني', 'admin', '/uploads/profiles/profile-1772411139441-463251082.jpg', '2026-03-02 00:05:19', '2026-03-02 00:25:39'),
(21, 'محمد', 'تحمد', '12222@gmail.com', '$2b$10$p44ymF.q0A7CmMCYmOLYyustzrG/CrsWqtnanJnbE2fMN66XWHPqC', '0597869993', 'باطني', 'user', '/uploads/profiles/profile-1772413751476-177161326.jpg', '2026-03-02 00:50:20', '2026-03-02 01:09:11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `blogs_ibfk_1` (`user_id`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contact_messages_ibfk_1` (`user_id`);

--
-- Indexes for table `follow_up_cases`
--
ALTER TABLE `follow_up_cases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `follow_up_cases_ibfk_1` (`user_id`);

--
-- Indexes for table `operations`
--
ALTER TABLE `operations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `operations_ibfk_1` (`user_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `password_resets_ibfk_1` (`email`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blogs`
--
ALTER TABLE `blogs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `follow_up_cases`
--
ALTER TABLE `follow_up_cases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `operations`
--
ALTER TABLE `operations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `blogs`
--
ALTER TABLE `blogs`
  ADD CONSTRAINT `blogs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD CONSTRAINT `contact_messages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `follow_up_cases`
--
ALTER TABLE `follow_up_cases`
  ADD CONSTRAINT `follow_up_cases_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `operations`
--
ALTER TABLE `operations`
  ADD CONSTRAINT `operations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
