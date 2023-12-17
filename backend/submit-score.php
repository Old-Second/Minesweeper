<?php
header("Content-Type: application/json");

// 引入数据库配置
require_once 'db_config.php';

// 获取 POST 数据
$data = json_decode(file_get_contents("php://input"), true);

// 检查数据是否有效
if (empty($data['username']) || empty($data['time_taken']) || empty($data['difficulty'])) {
    echo json_encode(['error' => 'Invalid input']);
    exit;
}

// 提取数据
$username = $mysqli->real_escape_string($data['username']);
$time_taken = intval($data['time_taken']);
$difficulty = $mysqli->real_escape_string($data['difficulty']);

// 获取当前用户的过往成绩
$pastScoreSql = "SELECT time_taken, user_rank FROM scores WHERE username = '$username' AND difficulty = '$difficulty'";
$result = $mysqli->query($pastScoreSql);

if ($result->num_rows > 0) {
    // 如果之前有记录，与之前的成绩对比，更新排名
    $row = $result->fetch_assoc();
    $pastTimeTaken = intval($row['time_taken']);
    $userRank = intval($row['user_rank']);

    // 如果当前成绩更好，更新记录
    if ($time_taken < $pastTimeTaken) {
        // 更新成绩和排名
        $mysqli->query("UPDATE scores SET time_taken = $time_taken WHERE username = '$username' AND difficulty = '$difficulty'");
        $mysqli->query("SET @rank=0");
        $mysqli->query("UPDATE scores SET user_rank = (@rank := @rank + 1) WHERE difficulty = '$difficulty' ORDER BY time_taken ASC");

        // 返回更新后的排行榜数据
    } else {
        // 返回排行榜数据，不更新
    }
} else {
    // 如果之前没有记录，插入新记录
    $mysqli->query("INSERT INTO scores (username, time_taken, difficulty, user_rank) VALUES ('$username', $time_taken, '$difficulty', 0)");
    $mysqli->query("SET @rank=0");
    $mysqli->query("UPDATE scores SET user_rank = (@rank := @rank + 1) WHERE difficulty = '$difficulty' ORDER BY time_taken ASC");
}

// 获取排行榜数据
$leaderboardSql = "SELECT username, time_taken, user_rank FROM scores WHERE difficulty = '$difficulty' ORDER BY time_taken ASC";
$result = $mysqli->query($leaderboardSql);
$leaderboardData = [];

// 逐行获取数据
while ($row = $result->fetch_assoc()) {
    $leaderboardData[] = [
        "username" => $row['username'],
        "time_taken" => intval($row['time_taken']),
        "rank" => intval($row['user_rank'])
    ];
}

// 关闭数据库连接
$mysqli->close();

// 返回排行榜数据
echo json_encode($leaderboardData);
?>
