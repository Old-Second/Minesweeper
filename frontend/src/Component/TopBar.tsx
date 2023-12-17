import React from 'react';
import '../App.css';
import {Difficulty} from '../Minesweeper.tsx';
import haha from '../assets/haha.png';
import dead from '../assets/dead.png';
import smile from '../assets/smile.png';
import d0 from '../assets/d0.svg';
import d1 from '../assets/d1.svg';
import d2 from '../assets/d2.svg';
import d3 from '../assets/d3.svg';
import d4 from '../assets/d4.svg';
import d5 from '../assets/d5.svg';
import d6 from '../assets/d6.svg';
import d7 from '../assets/d7.svg';
import d8 from '../assets/d8.svg';
import d9 from '../assets/d9.svg';

// 数字图像数组
const digitImages = [d0, d1, d2, d3, d4, d5, d6, d7, d8, d9];

interface TopBarProps {
  difficulty: Difficulty;
  customRows: number;
  customCols: number;
  customMines: number;
  flaggedCount: number;
  gameOver: boolean;
  setGameOver: (gameOver: boolean) => void;
  win: boolean;
  setWin: (win: boolean) => void;
  seconds: number;
  initializeGrid: (rows: number, cols: number, mines: number) => void;
  difficultySettings: {
    [Difficulty.Beginner]: { rows: number; cols: number; mines: number };
    [Difficulty.Intermediate]: { rows: number; cols: number; mines: number };
    [Difficulty.Advanced]: { rows: number; cols: number; mines: number };
  };
}

const TopBar: React.FC<TopBarProps> = ({
                                         difficulty,
                                         customRows, customCols, customMines,
                                         flaggedCount,
                                         gameOver, setGameOver,
                                         win, setWin,
                                         seconds,
                                         initializeGrid,
                                         difficultySettings,
                                       }) => {
  // 重新开始游戏
  const restartGame = () => {
    setGameOver(false);
    setWin(false);
    if (difficulty === Difficulty.Custom) {
      initializeGrid(customRows, customCols, customMines);
    } else {
      const {rows, cols, mines} = difficultySettings[difficulty] || {};
      initializeGrid(rows, cols, mines);
    }
  };
  
  
  return (
    <div className="topbar">
      {/* 显示剩余地雷数的数字面板 */}
      <div className="num-panel">
        {renderDigits(difficulty === Difficulty.Custom ? customMines : difficultySettings[difficulty].mines - flaggedCount, digitImages)}
      </div>
      {/* 游戏状态图像，点击重新开始游戏 */}
      <img src={gameOver ? (win ? haha : dead) : smile} alt="status" onClick={restartGame} className={'status'}/>
      {/* 显示经过的秒数的数字面板 */}
      <div className="num-panel">
        {renderDigits(seconds, digitImages)}
      </div>
    </div>
  )
};

// 渲染数字
const renderDigits = (value: number, digitImages: string[]) => (
  // 将数字拆分并显示相应的数字图像
  Array.from(String(value).padStart(3, '0')).map((digit, index) => (
    <img
      key={index}
      src={digitImages[parseInt(digit, 10)]}
      alt={`Digit ${digit}`}
      style={{height: '30px', margin: '3px 1.5px'}}
    />
  ))
);

export default TopBar;
