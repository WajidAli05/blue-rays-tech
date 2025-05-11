import React from 'react';
import NavBar from '../components/NavBar';
import { Breadcrumb, Card, Col, Row, Avatar, Button, Descriptions, Divider, Typography, List, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import { EditOutlined, MessageOutlined, FieldTimeOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined, DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const UserDetailsPage = () => {
  const user = {
    id: 1,
    name: 'Dio Lupa',
    email: 'dio_lupa@gmail.com',
    phone: '1234567890',
    image: 'https://img.daisyui.com/images/profile/demo/1@94.webp',
    description: 'Singer and songwriter with a passion for creating soulful music.',
    since: '2023-01-01',
    country: 'USA',
    job: 'Singer and songwriter',
    purchaseHistory: [
      {
        orderId: 'ORD001',
        product: 'Acoustic Guitar',
        quantity: 1,
        totalAmount: '$500',
        orderDate: '2023-05-01',
      },
      {
        orderId: 'ORD002',
        product: 'Songwriting Masterclass - Online Course',
        quantity: 1,
        totalAmount: '$150',
        orderDate: '2023-04-15',
      },
      {
        orderId: 'ORD003',
        product: 'Studio Microphone',
        quantity: 2,
        totalAmount: '$250',
        orderDate: '2023-03-28',
      },
      {
        orderId: 'ORD004',
        product: 'Sound Mixing Software',
        quantity: 1,
        totalAmount: '$120',
        orderDate: '2023-02-10',
      },
    ],
  };

  const handleDelete = (orderId) => {
    const order = user.purchaseHistory.find(item => item.orderId === orderId);
    order ? console.log(`Deleting order with ID: ${orderId}`) : console.log(`Order with ID: ${orderId} not found`); 
  };

  return (
    <div className="user-details-page">
      <NavBar />

            <Breadcrumb
             separator='>'
                    items={[
                      {
                        title: <Link to='/'><span className='breadcrum-title'>Home</span></Link>,
                      },
                      {
                        title: <Link to='/users'><span className='breadcrum-title'>User Management</span></Link>,
                      },
                      {
                        title: <span className='breadcrum-title'>{user.name}</span>,
                      },
                    ]}
        />

      <Row gutter={24} className="user-details-row">
        {/* Left Column: Profile Information */}
        <Col span={8}>
          <Card
            hoverable
            className="user-profile-card"
            cover={<Avatar className='user-avatar' size={150} src={user.image} />}
          >
            <Title level={3} className="user-name">{user.name}</Title>
            <Text className="user-job">{user.job}</Text>
            <Divider />
            <Descriptions bordered column={1} className="user-description">
              <Descriptions.Item label={<span><PhoneOutlined className="user-icon" />Phone</span>}>
                {user.phone}
              </Descriptions.Item>
              <Descriptions.Item label={<span><MailOutlined className="user-icon" />Email</span>}>
                {user.email}
              </Descriptions.Item>
              <Descriptions.Item label={<span><EnvironmentOutlined className="user-icon" />Country</span>}>
                {user.country}
              </Descriptions.Item>
              <Descriptions.Item label={<span><FieldTimeOutlined className="user-icon" />Member Since</span>}>
                {user.since}
              </Descriptions.Item>
            </Descriptions>
            <Button type="primary" icon={<EditOutlined />} className="edit-user-button">
              Edit User
            </Button>
          </Card>
        </Col>

        {/* Right Column: About Section */}
        <Col span={16}>
          <Card title="About User" bordered={false} className="user-about-card">
            <Text>{user.description}</Text>
            <Divider />
            <Button type="primary" icon={<EditOutlined />} className="edit-description-button">
              Edit Description
            </Button>
            <Button type="default" icon={<MessageOutlined />} className="send-message-button">
              Send Message
            </Button>
            <Divider />
            {/* User Purchase History */}
            <Card title={<span><ShoppingCartOutlined className="purchase-history-icon" />Purchase History</span>} bordered={false} className="purchase-history-card">
              <List
                itemLayout="horizontal"
                dataSource={user.purchaseHistory}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Popconfirm
                        title="Are you sure you want to delete this order?"
                        onConfirm={() => handleDelete(item.orderId)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button icon={<DeleteOutlined />} type="danger" className="delete-order-button">
                          Delete
                        </Button>
                      </Popconfirm>,
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <span>
                          <strong>{item.product}</strong> ({item.quantity} items)
                        </span>
                      }
                      description={`Order ID: ${item.orderId} | Date: ${item.orderDate} | Total: ${item.totalAmount}`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserDetailsPage;