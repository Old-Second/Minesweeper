import React, {useState} from 'react';
import '../App.css';
import {Button, Space} from 'antd';
import {Difficulty} from "../Minesweeper.tsx";

interface DifficultySelectionProps {
  setDifficulty: (difficulty: Difficulty) => void,
}

const DifficultySelection: React.FC<DifficultySelectionProps> = ({setDifficulty}) => {
  const [selected, setSelected] = useState<Difficulty>(Difficulty.Beginner);
  return (
    <div>
      难度：
      <Space>
        {/* 切换难度按钮 */}
        <Button
          type={selected === Difficulty.Beginner ? "primary" : "default"}
          onClick={() => {
            setDifficulty(Difficulty.Beginner)
            setSelected(Difficulty.Beginner)
          }}>初级</Button>
        <Button
          type={selected === Difficulty.Intermediate ? "primary" : "default"}
          onClick={() => {
            setDifficulty(Difficulty.Intermediate)
            setSelected(Difficulty.Intermediate)
          }}>中级</Button>
        <Button
          type={selected === Difficulty.Advanced ? "primary" : "default"}
          onClick={() => {
            setDifficulty(Difficulty.Advanced)
            setSelected(Difficulty.Advanced)
          }}>高级</Button>
        <Button
          type={selected === Difficulty.Custom ? "primary" : "default"}
          onClick={() => {
            setDifficulty(Difficulty.Custom)
            setSelected(Difficulty.Custom)
          }}>自定义</Button>
      </Space>
      <br/><br/>
    </div>
  )
};

export default DifficultySelection;
