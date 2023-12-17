<?php
header("Content-Type: application/json");

// 引入数据库配置
require_once 'db_config.php';

// 获取 POST 数据
$data = json_decode(file_get_contents("php://input"), true);

// 检查数据是否有效
if (empty($data['difficulty'])) {
    echo json_encode(['error' => 'Invalid input']);
    exit;
}

// 提取数据
$difficulty = $mysqli->real_escape_string($data['difficulty']);

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
