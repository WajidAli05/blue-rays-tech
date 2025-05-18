import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserDeleteOutlined, ArrowLeftOutlined, ReloadOutlined } from '@ant-design/icons';

const UserNotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="user-not-found-wrapper">
      <Result
        icon={<UserDeleteOutlined className="user-not-found-icon spin-pulse" />}
        title="User Not Found"
        subTitle="Sorry, the user you are looking for does not exist or has been removed."
        extra={[
          <Button 
            type="primary" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(-1)} 
            key="back"
          >
            Go Back
          </Button>,
          <Button 
            icon={<ReloadOutlined />} 
            onClick={() => window.location.reload()} 
            key="reload"
          >
            Refresh
          </Button>,
        ]}
      />
    </div>
  );
};

export default UserNotFoundPage;