-- 创建数据库
CREATE DATABASE IF NOT EXISTS minesweeper;

-- 切换到指定数据库
USE minesweeper;

-- 创建 scores 表
CREATE TABLE IF NOT EXISTS scores
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    username   VARCHAR(255) NOT NULL,
    time_taken INT          NOT NULL,
    difficulty VARCHAR(50)  NOT NULL,
    user_rank  INT DEFAULT 0
);
