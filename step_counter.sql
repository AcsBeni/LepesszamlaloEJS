-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Dec 19. 23:24
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `step_counter`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `steps`
--

CREATE TABLE `steps` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `steps` int(11) NOT NULL CHECK (`steps` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `steps`
--

INSERT INTO `steps` (`id`, `user_id`, `date`, `steps`) VALUES
(2, 1, '2024-11-02', 10),
(3, 1, '2024-11-03', 12001),
(4, 1, '2024-11-04', 9800),
(5, 1, '2024-11-05', 15020),
(6, 1, '2024-11-06', 7600),
(7, 1, '2024-11-07', 13450),
(8, 2, '2024-11-01', 6400),
(9, 2, '2024-11-02', 7200),
(10, 2, '2024-11-03', 8100),
(11, 2, '2024-11-04', 9000),
(12, 2, '2024-11-05', 10050),
(13, 2, '2024-11-06', 11200),
(14, 2, '2024-11-07', 9800),
(18, 3, '2025-12-13', 215),
(19, 3, '2025-12-28', 40),
(20, 5, '2025-12-16', 4100),
(21, 5, '2025-12-06', 5160);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`) VALUES
(1, 'Kiss Ádám', 'adam@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8vC7jRkQJzYkG7kY7K7HkG7kG7kG7', '2024-10-01 08:15:00'),
(2, 'Nagy Anna', 'anna@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8vC7jRkQJzYkG7kY7K7HkG7kG7kG7', '2024-10-05 12:30:00'),
(3, 'Tsana', 'valaki@gmail.c', '7110eda4d09e062aa5e4a390b0a572ac0d2c0220', '2025-12-19 13:55:19'),
(4, 'Tsanab', 'valaki@gmail.co', '3d218d0a55df312f3902df5b33f6b788db896f73', '2025-12-19 13:56:40'),
(5, 'Ben', 'Hello@gmail.com', 'd6cfc61c43b384da5bfc0042fb7c6ff87a273658', '2025-12-19 22:09:25'),
(7, 'tesztelés', 'Tesztemail@gmail.com', '40bd001563085fc35165329ea1ff5c5ecbdbbeef', '2025-12-19 22:20:41'),
(8, 'ewfw', 'fafafa@gmail.com', 'd6cfc61c43b384da5bfc0042fb7c6ff87a273658', '2025-12-19 22:22:17');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `steps`
--
ALTER TABLE `steps`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_date` (`user_id`,`date`),
  ADD KEY `idx_steps_user_id` (`user_id`),
  ADD KEY `idx_steps_date` (`date`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `steps`
--
ALTER TABLE `steps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `steps`
--
ALTER TABLE `steps`
  ADD CONSTRAINT `fk_steps_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
