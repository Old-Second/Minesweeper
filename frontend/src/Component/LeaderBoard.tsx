import React, {useState, useEffect} from 'react';
import {Select, Table, Input, message, Form, Button} from 'antd';
import {Difficulty} from "../Minesweeper.tsx";

const apiUrl = '/api/';

interface LeaderboardData {
  rank: number;
  username: string;
  time_taken: string;
}

interface ColumnData extends LeaderboardData {
  key: string;
  isCurrentUser: boolean;
}

interface LeaderboardProps {
  win: boolean;
  seconds: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({win, seconds}) => {
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Beginner);
  const [username, setUsername] = useState<string>(getStoredUsername());
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData[]>([]);
  
  const [loading, setLoading] = useState<boolean>(false);
  
  // 当选择的难度发生变化时获取排行榜数据
  useEffect(() => {
    setLoading(true)
    // 发送请求获取排行榜数据
    fetch(`${apiUrl}leaderboard.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        difficulty: difficulty,
      }),
    })
      .then((response) => response.json())
      .then((data) => setLeaderboardData(data))
      .then(() => setLoading(false))
      .catch((error) => console.error('Error fetching leaderboard data:', error));
  }, [difficulty]);
  
  // 当游戏胜利时，提交分数
  useEffect(() => {
    setLoading(true)
    if (win) {
      // 发送用户名和用时
      fetch(`${apiUrl}submit-score.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          time_taken: seconds,
          difficulty: difficulty,
        }),
      })
        .then(response => response.json())
        .then((data) => {
          setLeaderboardData(data)
          message.success('分数已提交！');
        })
        .then(() => setLoading(false))
        .catch(error => {
          console.error('Error submitting score:', error);
          message.error('提交分数时出现错误！');
        });
    }
  }, [win])
  
  const columns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      // 高亮显示当前用户
      render: (text: string, record: ColumnData) => (record.isCurrentUser ?
        <strong style={{color: 'red'}}>{text}</strong> : text),
    },
    {
      title: '用时（秒）',
      dataIndex: 'time_taken',
      key: 'time_taken',
    },
  ];
  
  // 处理用户名变化
  const handleUsernameChange = (e: string) => {
    const newUsername = e.trim();
    setUsername(newUsername);
    localStorage.setItem('username', newUsername);
    message.success('用户名已更新！');
  };
  
  // 获取存储的用户名
  function getStoredUsername(): string {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      return storedUsername;
    } else {
      // 生成随机用户名
      const randomUsername = `用户${Math.random().toString(36).slice(2, 2 + Math.floor(Math.random() * (8 - 3 + 1)) + 3)}`;
      localStorage.setItem('username', randomUsername);
      return randomUsername;
    }
  }
  
  return (
    <div className={'leaderboard'}>
      {/* 用户名输入表单 */}
      <Form
        name="username"
        initialValues={{remember: true}}
        layout="inline"
        // onValuesChange={(_, allValues) => {
        //   handleUsernameChange(allValues.username)
        // }}
        onFinish={(e) => {
          handleUsernameChange(e.username)
        }}
      >
        <Form.Item<string> label="用户名" name="username" initialValue={username}>
          <Input placeholder="输入用户名" style={{width: 120}}/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            确定
          </Button>
        </Form.Item>
      </Form>
      <h2>排行榜</h2>
      <Select value={difficulty} onChange={setDifficulty} style={{marginBottom: 16}}>
        <Select.Option value={Difficulty.Beginner}>初级</Select.Option>
        <Select.Option value={Difficulty.Intermediate}>中级</Select.Option>
        <Select.Option value={Difficulty.Advanced}>高级</Select.Option>
      </Select>
      {/* 排行榜表格 */}
      <Table
        dataSource={leaderboardData.map((row, index) => ({
          ...row,
          key: String(index),
          isCurrentUser: row.username === username
        }))}
        columns={columns}
        pagination={false}
        loading={loading}
        virtual
        scroll={{x: 'max-content', y: 550}}
      />
    </div>
  );
};

export default Leaderboard;
