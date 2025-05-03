import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, message, Space, Menu } from 'antd';

const DropDownMenu = ({ categories }) => {
  const [category, setCategory] = useState('Select Category');

  // Generate the items dynamically from the categories array
  const items = categories.map((category) => ({
    label: category.label,
    key: category.key,
  }));

  // Handle item selection from the dropdown
  const onClick = ({ key }) => {
    const selectedCategory = categories.find((category) => category.key === key);
    setCategory(selectedCategory.label);
    message.info(`Click on item ${selectedCategory.label}`);
  };

  return (
    <Dropdown overlay={<Menu items={items} onClick={onClick} />}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          {category} 
          <DownOutlined />
        </Space>
      </a>
    </Dropdown>
  );
};

export default DropDownMenu;
