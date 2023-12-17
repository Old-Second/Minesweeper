import React, {useEffect} from 'react';
import '../App.css';
import Cell from './Cell';
import {Cell as CellType, Difficulty} from '../Minesweeper.tsx';
import {message} from "antd";


interface GameBoardProps {
  grid: CellType[][];
  setGrid: React.Dispatch<React.SetStateAction<CellType[][]>>;
  difficulty: Difficulty;
  setFlaggedCount: React.Dispatch<React.SetStateAction<number>>;
  customRows: number;
  customCols: number;
  isGameStarted: boolean;
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
  gameOver: boolean;
  setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  winProcessed: boolean;
  setWinProcessed: React.Dispatch<React.SetStateAction<boolean>>;
  setWin: React.Dispatch<React.SetStateAction<boolean>>;
  seconds: number;
  setSeconds: React.Dispatch<React.SetStateAction<number>>;
  difficultySettings: {
    [Difficulty.Beginner]: { rows: number; cols: number; mines: number };
    [Difficulty.Intermediate]: { rows: number; cols: number; mines: number };
    [Difficulty.Advanced]: { rows: number; cols: number; mines: number };
  };
}

const GameBoard: React.FC<GameBoardProps> = ({
                                               grid, setGrid,
                                               difficulty,
                                               setFlaggedCount,
                                               customRows, customCols,
                                               isGameStarted, setGameStarted,
                                               gameOver, setGameOver,
                                               winProcessed, setWinProcessed,
                                               setWin,
                                               seconds, setSeconds,
                                               difficultySettings
                                             }) => {
  
  
  // 游戏计时
  useEffect(() => {
    if (isGameStarted && !gameOver) {
      const interval = setInterval(() => {
        setSeconds((prevSeconds: number) => (prevSeconds + 1) % 1000);
      }, 1000);
      
      // 在组件卸载或游戏结束时清除间隔
      return () => clearInterval(interval);
    }
  }, [isGameStarted, gameOver]);
  
  const difficultyNames: { [key in Difficulty]: string } = {
    [Difficulty.Beginner]: '初级',
    [Difficulty.Intermediate]: '中级',
    [Difficulty.Advanced]: '高级',
    [Difficulty.Custom]: '自定义',
  };
  
  // 检查玩家是否获胜
  const checkWin = () => {
    const win = grid.every((row) =>
      row.every((cell) => cell.isRevealed || cell.isMine)
    );
    
    if (win && !winProcessed) {
      setGameOver(true);
      setWin(true);
      
      // 标记游戏获胜已处理
      setWinProcessed(true);
      
      const currentDifficulty = difficultyNames[difficulty] || '未知';
      message.success(`恭喜你，你赢了！当前难度为${currentDifficulty}，用时${seconds}秒`);
    }
  };
  
  // 揭示单元格
  const revealCell = (cell: CellType) => {
    if (gameOver || cell.isFlagged || cell.isRevealed) return;
    
    if (!isGameStarted) {
      setGameStarted(true);
    }
    
    const newGrid = [...grid];
    if (cell.isMine) {
      // 游戏结束，揭示所有地雷
      setGameOver(true);
      newGrid.forEach((row) => {
        row.forEach((c) => {
          if (c.isMine) {
            c.isRevealed = true;
          }
        });
      });
      // 根据当前等级获得等级名称
      const currentDifficulty = difficultyNames[difficulty] || '未知';
      message.error(`很遗憾，你失败了！当前难度为${currentDifficulty}`);
      setGrid(newGrid);
    } else {
      // 揭示所选单元格
      newGrid[cell.x][cell.y].isRevealed = true;
      // 如果所选单元格没有邻居地雷，dfs递归揭示邻居单元格
      if (newGrid[cell.x][cell.y].neighborCount === 0) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const neighborRow = cell.x + i;
            const neighborCol = cell.y + j;
            if (
              neighborRow >= 0 &&
              neighborRow < newGrid.length &&
              neighborCol >= 0 &&
              neighborCol < newGrid[0].length
            ) {
              revealCell(newGrid[neighborRow][neighborCol]);
            }
          }
        }
      }
    }
    setGrid(newGrid);
    checkWin();
  };
  
  // 标记/取消标记单元格
  const flagCell = (e: React.MouseEvent, cell: CellType) => {
    e.preventDefault();
    if (gameOver || cell.isRevealed) return;
    
    // 标记选中的单元格
    const newGrid = [...grid];
    newGrid[cell.x][cell.y].isFlagged = !newGrid[cell.x][cell.y].isFlagged;
    setGrid(newGrid);
    
    // 更新标记的数量
    const newFlaggedCount = newGrid.reduce(
      (count, row) =>
        count + row.filter((c) => c.isFlagged && !c.isRevealed).length,
      0
    );
    setFlaggedCount(newFlaggedCount);
  };
  
  return (
    <div className="grid-container" style={{
      // 动态设置网格样式，根据难度和自定义参数进行调整
      gridTemplateRows: `repeat(${difficulty === Difficulty.Custom ? customRows : difficultySettings[difficulty].rows}, 1fr)`,
      gridTemplateColumns: `repeat(${difficulty === Difficulty.Custom ? customCols : difficultySettings[difficulty].cols}, 1fr)`
    }}>
      {/* 渲染每个单元格 */}
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            revealCell={() => revealCell(cell)}
            flagCell={(e) => flagCell(e, cell)}
          />
        ))
      )}
    </div>
  )
};

export default GameBoard;