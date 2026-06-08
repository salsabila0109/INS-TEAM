-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 07, 2026 at 02:52 PM
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
-- Database: `foodies`
--

-- --------------------------------------------------------

--
-- Table structure for table `followers`
--

CREATE TABLE `followers` (
  `id` int(11) NOT NULL,
  `follower_id` int(11) NOT NULL,
  `following_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `followers`
--

INSERT INTO `followers` (`id`, `follower_id`, `following_id`, `created_at`) VALUES
(8, 23, 6, '2026-06-07 12:43:14');

-- --------------------------------------------------------

--
-- Table structure for table `recipes`
--

CREATE TABLE `recipes` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `serving` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `ingredients` longtext DEFAULT NULL,
  `steps` longtext DEFAULT NULL,
  `userId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `rating` decimal(2,1) DEFAULT NULL,
  `totalReviews` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `recipes`
--

INSERT INTO `recipes` (`id`, `title`, `serving`, `description`, `category`, `image`, `ingredients`, `steps`, `userId`, `createdAt`, `updatedAt`, `rating`, `totalReviews`) VALUES
(5, 'Dessert Coklat Puding Choco Oreo', '1', 'Dessert coklat yang sangat sederhana, creamy, dan manis dengan rasa coklat lembut dipadukan remahan biskuit. Cocok untuk pemula karena bahan sedikit dan langkahnya cepat tanpa oven.', 'Dessert', '1778933887053.jpg', '[\"1 bungkus kecil puding coklat instan (atau 1 sdm coklat bubuk + 1 sdt gula)\",\"150 ml susu cair atau air\",\"2 keping biskuit Oreo (diremukkan)\",\"1 sdt susu kental manis coklat (opsional)\"]', '[{\"text\":\"Campurkan bubuk puding coklat dengan susu cair/air dalam panci kecil, lalu aduk rata.\",\"images\":[\"1778933886962.png\"]},{\"text\":\"Masak dengan api kecil sambil diaduk hingga mulai mengental.\",\"images\":[\"1778933886979.png\"]},{\"text\":\"Tuang ke gelas atau mangkuk kecil, lalu taburkan remahan Oreo di atasnya.\",\"images\":[\"1778933886991.png\"]},{\"text\":\"Dinginkan sekitar 10–15 menit atau masukkan ke kulkas sebentar sebelum dimakan.\",\"images\":[\"1778933887000.png\",\"1778933887011.png\"]}]', 6, '2026-05-16 12:18:07', '2026-05-20 13:29:03', 5.0, 1),
(6, 'Nasi Goreng Telur', '1', 'Nasi goreng telur adalah makanan sederhana yang mudah dibuat di rumah. Rasanya gurih, sedikit manis, dan cocok dimakan saat sarapan maupun malam hari. Resep ini menggunakan bahan yang mudah ditemukan dan proses memasaknya cepat.', 'Makanan', '1779321271089.jpeg', '[\"1 piring nasi putih\",\"1 butir telur\",\"2 siung bawang putih\",\"3 siung bawang merah\",\"2 sdm kecap manis\",\"1 sdm minyak goreng\",\"Garam secukupnya\",\"Merica secukupnya\",\"Daun bawang (opsional)\"]', '[{\"text\":\"Iris bawang merah dan bawang putih.\",\"images\":[]},{\"text\":\"Panaskan minyak di wajan.\",\"images\":[]},{\"text\":\"Tumis bawang hingga harum.\",\"images\":[]},{\"text\":\"Masukkan telur, lalu orak-arik.\",\"images\":[]},{\"text\":\"Tambahkan nasi putih dan aduk rata.\",\"images\":[]},{\"text\":\"Masukkan kecap manis, garam, dan merica.\",\"images\":[]},{\"text\":\"Aduk hingga semua bahan tercampur merata.\",\"images\":[]},{\"text\":\"ambahkan daun bawang jika suka.\",\"images\":[]},{\"text\":\"Sajikan selagi hangat.\",\"images\":[]}]', 6, '2026-05-20 23:54:31', '2026-05-20 23:54:31', NULL, 0),
(7, 'Es Teh Lemon', '1', 'Es teh lemon adalah minuman segar dengan rasa manis dan sedikit asam. Cocok diminum saat cuaca panas dan sangat mudah dibuat.', 'Minuman', '1779321714303.jpeg', '[\"1 kantong teh\",\"1 buah lemon\",\"2 sdm gula\",\"Air panas secukupnya\",\"Es batu secukupnya\"]', '[{\"text\":\"Seduh teh dengan air panas\",\"images\":[]},{\"text\":\"Tambahkan gula lalu aduk hingga larut\",\"images\":[]},{\"text\":\"Peras lemon ke dalam teh.\",\"images\":[]},{\"text\":\"Tambahkan es batu.\",\"images\":[]},{\"text\":\"Sajikan dingin.\",\"images\":[]}]', 6, '2026-05-21 00:01:54', '2026-05-21 00:01:54', NULL, 0),
(8, 'Susu Cokelat Dingin', '2', 'Susu cokelat dingin memiliki rasa manis dan creamy. Minuman ini cocok untuk anak-anak maupun orang dewasa.', 'Minuman', '1779321906190.jpeg', '[\"2 gelas susu cair\",\"4 sdm cokelat bubuk atau sirup cokelat\",\"1/5 sdm gula (opsional)\",\"Es batu secukupnya\"]', '[{\"text\":\"Campurkan susu dan cokelat\",\"images\":[]},{\"text\":\"Tambahkan gula jika ingin lebih manis\",\"images\":[]},{\"text\":\"Aduk hingga tercampur rata.\",\"images\":[]},{\"text\":\"Masukkan es batu.\",\"images\":[]},{\"text\":\"Sajikan dingin.\",\"images\":[]}]', 6, '2026-05-21 00:05:06', '2026-05-21 00:05:06', NULL, 0),
(9, 'Roti Bakar Cokelat', '2', 'Roti bakar cokelat adalah camilan manis yang mudah dibuat dan cocok untuk sarapan atau teman minum teh.', 'Cemilan', '1779326014828.jpeg', '[\"4 lembar roti tawar\",\"Margarin secukupnya\",\"Cokelat meses\",\"Susu kental manis\"]', '[{\"text\":\"Oleskan margarin pada roti.\",\"images\":[]},{\"text\":\"Tambahkan cokelat meses dan susu kental manis\",\"images\":[]},{\"text\":\"Panggang di teflon hingga kecokelatan.\",\"images\":[]},{\"text\":\"Potong sesuai selera.\",\"images\":[]},{\"text\":\"Sajikan hangat.\",\"images\":[]}]', 6, '2026-05-21 01:13:34', '2026-05-24 13:45:48', NULL, 0),
(10, 'Ayam Geprek', '1', 'Ayam geprek adalah makanan favorit dengan ayam crispy yang dihancurkan bersama sambal pedas. Rasanya gurih, renyah, dan cocok dimakan dengan nasi hangat.', 'Makanan', '1779326410677.jpeg', '[\"1 potong ayam goreng crispy \",\"5 buah cabai merah \",\"2 buah cabai rawit\",\"1 siung bawang putih \",\"Garam secukupnya \",\"Nasi hangat\"]', '[{\"text\":\"Goreng ayam hingga crispy. \",\"images\":[]},{\"text\":\"Ulek cabai, bawang putih, dan garam.\",\"images\":[]},{\"text\":\"Masukkan ayam lalu geprek bersama sambal. \",\"images\":[]},{\"text\":\"Sajikan dengan nasi hangat.\",\"images\":[]}]', 6, '2026-05-21 01:20:10', '2026-05-21 01:20:10', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `recipeId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `recipeId`, `userId`, `rating`, `comment`, `createdAt`, `updatedAt`) VALUES
(1, 5, 23, 5, 'Resepnya mudah dan rasanya enak', '2026-05-20 13:29:03', '2026-05-20 13:29:03');

-- --------------------------------------------------------

--
-- Table structure for table `saved_recipes`
--

CREATE TABLE `saved_recipes` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `recipeId` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `saved_recipes`
--

INSERT INTO `saved_recipes` (`id`, `userId`, `recipeId`, `createdAt`, `updatedAt`) VALUES
(6, 23, 5, '2026-05-20 13:56:45', '2026-05-20 13:56:45'),
(8, 23, 8, '2026-05-21 00:24:21', '2026-05-21 00:24:21');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `bio` text DEFAULT NULL,
  `photo` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `createdAt`, `updatedAt`, `bio`, `photo`) VALUES
(6, 'Tim Foodies Hub ', 'foodieshub@gmail.com', '$2b$10$Sdc7wiR3ujtKnRHZFBu2jOyKu/1g0czsF/iSC0bpYhYAHM6AeoljO', '2026-05-05 11:45:07', '2026-06-07 12:05:38', 'akun milik tim foodies resim', 'http://localhost:5000/uploads/1779628211319.jfif'),
(20, 'tes', 'tes1@gmail.com', '$2b$10$CJSRlS2S0q/OibAmiplAieBu4rdb0iUmmmaK5rlmekXpdt2jZEwmK', '2026-05-14 12:38:37', '2026-05-14 12:38:37', NULL, NULL),
(21, 'wwe', 'tess@gmail.com', '$2b$10$XucgpaUurTNatye8hYaxPeJKD2d51v/W3BnPPIVwwew13LF/Bp9nm', '2026-05-15 01:30:48', '2026-05-15 01:30:48', NULL, NULL),
(22, 'Tes JWT', 'jwtTes@gmail.com', '$2b$10$R5a6YPEwXgxkdQEEjLLka.eDfeGoAiYHnjtNJiniQN3TIsmVS07Ca', '2026-05-16 12:19:08', '2026-05-16 12:22:17', 'JWT Tes', NULL),
(23, 'Tes FoodiesHub', 'TesFoodies@gmail.com', '$2b$10$n5gEeBNgfrF5PZFd6VVguubvcJ8PWkPHlSFUKsVdGMiDAos3C2Nje', '2026-05-20 13:12:01', '2026-05-20 13:41:49', 'Akun tes foodies', 'http://localhost:5000/uploads/1779284509857.jpg'),
(25, 'Lutfiah Latifah', 'lutfiah@gmail.com', '$2b$10$u.z4Dd87esV2xH0b6ISvPOr06g5ma0zJgripXzIbjA3E0eHLBdNta', '2026-05-27 10:51:56', '2026-05-27 10:52:47', '', 'http://localhost:5000/uploads/1779879167939.JPG');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `followers`
--
ALTER TABLE `followers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `follower_id` (`follower_id`,`following_id`),
  ADD KEY `following_id` (`following_id`);

--
-- Indexes for table `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `recipeId` (`recipeId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `saved_recipes`
--
ALTER TABLE `saved_recipes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_save` (`userId`,`recipeId`),
  ADD KEY `recipeId` (`recipeId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `followers`
--
ALTER TABLE `followers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `recipes`
--
ALTER TABLE `recipes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `saved_recipes`
--
ALTER TABLE `saved_recipes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `followers`
--
ALTER TABLE `followers`
  ADD CONSTRAINT `followers_ibfk_1` FOREIGN KEY (`follower_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `followers_ibfk_2` FOREIGN KEY (`following_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `recipes`
--
ALTER TABLE `recipes`
  ADD CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`recipeId`) REFERENCES `recipes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `saved_recipes`
--
ALTER TABLE `saved_recipes`
  ADD CONSTRAINT `saved_recipes_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `saved_recipes_ibfk_2` FOREIGN KEY (`recipeId`) REFERENCES `recipes` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
