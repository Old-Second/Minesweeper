import {useState, useEffect, useMemo} from 'react';
import './App.css';
import GameBoard from "./Component/GameBoard";
import DifficultySelection from "./Component/DifficultySelection";
import CustomForm from "./Component/CustomForm";
import TopBar from "./Component/TopBar";
// import Leaderboard from "./Component/LeaderBoard.tsx";

// 定义单元格的结构
export interface Cell {
  x: number;
  y: number;
  isMine: boolean;
  neighborCount: number;
  isRevealed: boolean;
  isFlagged: boolean;
}

// 定义难度级别
export enum Difficulty {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
  Custom = 'custom',
}

// 每个级别的难度设置
const difficultySettings = {
  [Difficulty.Beginner]: {rows: 9, cols: 9, mines: 10},
  [Difficulty.Intermediate]: {rows: 16, cols: 16, mines: 40},
  [Difficulty.Advanced]: {rows: 16, cols: 30, mines: 99},
};


function Minesweeper() {
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Beginner);
  const [customRows, setCustomRows] = useState<number>(9);
  const [customCols, setCustomCols] = useState<number>(9);
  const [customMines, setCustomMines] = useState<number>(10);
  
  const [grid, setGrid] = useState<Cell[][]>([]);
  const memoizedGrid = useMemo(() => grid, [grid]);
  const [flaggedCount, setFlaggedCount] = useState<number>(0);
  const [seconds, setSeconds] = useState(0);
  
  const [isGameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [winProcessed, setWinProcessed] = useState(false);
  
  
  // 当难度或自定义设置更改时初始化网格
  useEffect(() => {
    if (difficulty === Difficulty.Custom) {
      initializeGrid(customRows, customCols, customMines);
    } else {
      const {rows, cols, mines} = difficultySettings[difficulty] || {};
      initializeGrid(rows, cols, mines);
    }
  }, [difficulty, customRows, customCols, customMines]);
  
  
  // 初始化网格
  const initializeGrid = (rows: number, cols: number, mines: number) => {
    setGameStarted(false);
    
    // 创建默认单元格
    const createDefaultCell = (x: number, y: number) => ({
      x,
      y,
      isMine: false,
      neighborCount: 0,
      isRevealed: false,
      isFlagged: false,
    });
    
    // 创建新网格
    const newGrid = Array.from({length: rows}, (_, row) =>
      Array.from({length: cols}, (_, col) => createDefaultCell(row, col))
    );
    
    // 生成随机的地雷位置
    const minePositions = new Set();
    while (minePositions.size < mines) {
      const randomRow = Math.floor(Math.random() * newGrid.length);
      const randomCol = Math.floor(Math.random() * newGrid[0].length);
      minePositions.add(`${randomRow}-${randomCol}`);
    }
    
    // 在网格中设置地雷
    (minePositions as Set<string>).forEach((position) => {
      const [randomRow, randomCol] = position.split("-").map(Number);
      newGrid[randomRow][randomCol].isMine = true;
    });
    
    // 计算单元格的邻居雷数
    newGrid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (!cell.isMine) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const neighborRow = rowIndex + i;
              const neighborCol = colIndex + j;
              if (
                neighborRow >= 0 &&
                neighborRow < newGrid.length &&
                neighborCol >= 0 &&
                neighborCol < newGrid[0].length &&
                newGrid[neighborRow][neighborCol].isMine
              ) {
                count++;
              }
            }
          }
          cell.neighborCount = count;
        }
      });
    });
    
    // 重置标记的数量，秒数，并设置新的网格
    setFlaggedCount(0);
    setWinProcessed(false);
    setSeconds(0);
    setGrid(newGrid);
  };
  
  
  return (
    <div className={'container'}>
      <div className="app">
        <h1>扫雷游戏</h1>
        <DifficultySelection setDifficulty={setDifficulty}/>
        {difficulty === Difficulty.Custom && (
          <CustomForm setCustomRows={setCustomRows} setCustomCols={setCustomCols} setCustomMines={setCustomMines}/>
        )}
        <div className="box">
          <TopBar
            difficulty={difficulty}
            customCols={customCols} customRows={customRows} customMines={customMines}
            flaggedCount={flaggedCount}
            gameOver={gameOver} setGameOver={setGameOver}
            win={win} setWin={setWin}
            seconds={seconds}
            initializeGrid={initializeGrid}
            difficultySettings={difficultySettings}
          />
          <GameBoard
            grid={memoizedGrid} setGrid={setGrid}
            difficulty={difficulty}
            setFlaggedCount={setFlaggedCount}
            customRows={customRows} customCols={customCols}
            isGameStarted={isGameStarted} setGameStarted={setGameStarted}
            gameOver={gameOver} setGameOver={setGameOver}
            winProcessed={winProcessed} setWinProcessed={setWinProcessed}
            setWin={setWin}
            seconds={seconds} setSeconds={setSeconds}
            difficultySettings={difficultySettings}/>
        </div>
      </div>
      {/*<Leaderboard win={win} seconds={seconds}></Leaderboard>*/}
    </div>
  );
}

export default Minesweeper;