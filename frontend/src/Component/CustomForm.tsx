import React from 'react';
import '../App.css';
import {Form, Input, Button, Space} from 'antd';

// 自定义难度的类型
type CustomDifficultyType = {
  customRows?: number;
  customCols?: number;
  customMines?: number;
};

interface CustomFormProps {
  setCustomRows: (rows: number) => void;
  setCustomCols: (cols: number) => void;
  setCustomMines: (mines: number) => void;
}

const CustomForm: React.FC<CustomFormProps> = ({setCustomRows, setCustomCols, setCustomMines}) => (
  <Space>
    {/* 自定义难度表单 */}
    <Form
      name="custom"
      initialValues={{remember: true}}
      onFinish={(e) => {
        // 提交表单时，调用相应的回调函数设置自定义难度参数
        setCustomRows(e.customRows);
        setCustomCols(e.customCols);
        setCustomMines(e.customMines);
      }}
      autoComplete="off"
      layout="inline"
    >
      <Form.Item<CustomDifficultyType> label="行数" name="customRows"
                                       rules={[{required: true, message: '请输入行数!'}]}>
        <Input style={{width: 120}}/>
      </Form.Item>
      <Form.Item<CustomDifficultyType> label="列数" name="customCols"
                                       rules={[{required: true, message: '请输入列数!'}]}>
        <Input style={{width: 120}}/>
      </Form.Item>
      <Form.Item<CustomDifficultyType> label="雷数" name="customMines"
                                       rules={[{required: true, message: '请输入雷数!'}]}>
        <Input style={{width: 120}}/>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          确定
        </Button>
      </Form.Item>
    </Form>
  </Space>
);

export default CustomForm;
