import React from 'react';
import '../App.css';
import {Cell as CellType} from '../Minesweeper.tsx';
import flag from '../assets/flag.png';
import explosiveMine from '../assets/explosive-mine.png';
import block from '../assets/block.png';
import emptyBlock from "../assets/empty-block.png";
import n1 from "../assets/1.png";
import n2 from "../assets/2.png";
import n3 from "../assets/3.png";
import n4 from "../assets/4.png";
import n5 from "../assets/5.png";
import n6 from "../assets/6.png";
import n7 from "../assets/7.png";
import n8 from "../assets/8.png";

const numberImages = [emptyBlock, n1, n2, n3, n4, n5, n6, n7, n8];

interface CellProps {
  cell: CellType;
  revealCell: () => void;
  flagCell: (e: React.MouseEvent) => void;
}

const Cell: React.FC<CellProps> = ({cell, revealCell, flagCell}) => (
  <img
    className={`cell ${cell.isRevealed ? 'revealed' : ''}`}
    onClick={revealCell} // 单击揭示单元格
    onContextMenu={flagCell} // 右键标记单元格
    src={`
      ${cell.isFlagged // 如果该方块被标记为地雷，则显示一个旗
      ? flag
      : !cell.isRevealed
        ? block
        : cell.isRevealed && !cell.isMine // 如果该方块被揭露且不是地雷，则显示周围地雷的数量或空白
          ? numberImages[cell.neighborCount]
          : cell.isRevealed && cell.isMine // 如果该方块被揭露且是地雷，则显示一个炸弹
            ? explosiveMine
            : ''}
    `}
    alt="mine"
  />
);

export default Cell;
