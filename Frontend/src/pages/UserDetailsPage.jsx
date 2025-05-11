import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import { Breadcrumb, Card, Col, Row, Avatar, Button, Descriptions, Divider, Typography, List, Popconfirm, Modal, Input } from 'antd';
import { Link } from 'react-router-dom';
import { EditOutlined, MessageOutlined, FieldTimeOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined, DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const UserDetailsPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: 'Dio Lupa',
    email: 'dio_lupa@gmail.com',
    phone: '1234567890',
    description: 'Singer and songwriter with a passion for creating soulful music.',
  });
  const [userDescription, setUserDescription] = useState('Singer and songwriter with a passion for creating soulful music.');

  const [purchaseHistory, setPurchaseHistory] = useState([
    {
      orderId: 'ORD001',
      products: [
        { productName: 'Acoustic Guitar', quantity: 1, totalAmount: '$500' },
        { productName: 'Songwriting Masterclass - Online Course', quantity: 1, totalAmount: '$150' },
      ],
      orderDate: '2023-05-01',
    },
    {
      orderId: 'ORD002',
      products: [
        { productName: 'Studio Microphone', quantity: 2, totalAmount: '$250' },
      ],
      orderDate: '2023-04-15',
    },
    {
      orderId: 'ORD003',
      products: [
        { productName: 'Sound Mixing Software', quantity: 1, totalAmount: '$120' },
      ],
      orderDate: '2023-03-28',
    },
  ]);

  const handleDelete = (orderId) => {
    const updatedPurchaseHistory = purchaseHistory.filter(order => order.orderId !== orderId);
    setPurchaseHistory(updatedPurchaseHistory);
    console.log(`Order with ID: ${orderId} has been deleted.`);
  };

  const showModal = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleEditUser = () => {
    setIsEditingUser(!isEditingUser);
  };

  const handleEditDescription = () => {
    setIsEditingDescription(!isEditingDescription);
  };

  const handleSaveUserDetails = () => {
    setUserDetails({ ...userDetails });
    setIsEditingUser(false);
  };

  const handleSaveDescription = () => {
    setUserDescription(userDescription);
    setIsEditingDescription(false);
  };

  return (
    <div className="user-details-page">
      <NavBar />

      <Breadcrumb separator=">" items={[ 
        { title: <Link to='/'><span className='breadcrum-title'>Home</span></Link> },
        { title: <Link to='/users'><span className='breadcrum-title'>User Management</span></Link> },
        { title: <span className='breadcrum-title'>{userDetails.name}</span> },
      ]} />

      <Row gutter={24} className="user-details-row">
        {/* Left Column: Profile Information */}
        <Col span={8}>
          <Card className="user-profile-card" cover={<Avatar className='user-avatar' size={150} src="https://img.daisyui.com/images/profile/demo/1@94.webp" />}>
            <Title level={3} className="user-name">
              {isEditingUser ? (
                <Input
                  value={userDetails.name}
                  onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                />
              ) : userDetails.name}
            </Title>
            <Text className="user-job">Singer and songwriter</Text>
            <Divider />
            <Descriptions bordered column={1} className="user-description">
              <Descriptions.Item label={<span><PhoneOutlined className="user-icon" />Phone</span>}>
                {isEditingUser ? (
                  <Input
                    value={userDetails.phone}
                    onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
                  />
                ) : userDetails.phone}
              </Descriptions.Item>
              <Descriptions.Item label={<span><MailOutlined className="user-icon" />Email</span>}>
                {isEditingUser ? (
                  <Input
                    value={userDetails.email}
                    onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                  />
                ) : userDetails.email}
              </Descriptions.Item>
              <Descriptions.Item label={<span><EnvironmentOutlined className="user-icon" />Country</span>}>
                USA
              </Descriptions.Item>
              <Descriptions.Item label={<span><FieldTimeOutlined className="user-icon" />Member Since</span>}>
                2023-01-01
              </Descriptions.Item>
            </Descriptions>
            <Button
              type="primary"
              icon={<EditOutlined />}
              className="edit-user-button"
              onClick={handleEditUser}
            >
              {isEditingUser ? 'Save' : 'Edit User'}
            </Button>
          </Card>
        </Col>

        {/* Right Column: About Section */}
        <Col span={16}>
          <Card title="About User" bordered={false} className="user-about-card">
            {isEditingDescription ? (
              <Input.TextArea
                value={userDescription}
                onChange={(e) => setUserDescription(e.target.value)}
                rows={4}
              />
            ) : (
              <Text>{userDescription}</Text>
            )}
            <Divider />
            <Button
              type="primary"
              icon={<EditOutlined />}
              className="edit-description-button"
              onClick={handleEditDescription}
            >
              {isEditingDescription ? 'Save' : 'Edit Description'}
            </Button>
            <Button type="default" icon={<MessageOutlined />} className="send-message-button">
              Send Message
            </Button>
            <Divider />
            {/* User Purchase History */}
            <Card title={<span><ShoppingCartOutlined className="purchase-history-icon" />Purchase History</span>} bordered={false} className="purchase-history-card">
              <List
                itemLayout="horizontal"
                dataSource={purchaseHistory}
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
                      <Button
                        type="default"
                        onClick={() => showModal(item)}
                      >
                        View Details
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={<span><strong>{item.orderId}</strong></span>}
                      description={`Date: ${item.orderDate} | Total: ${item.products.reduce((sum, product) => sum + parseFloat(product.totalAmount.replace('$', '')), 0)}`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Card>
        </Col>
      </Row>

      {/* Modal for Order Details */}
      <Modal
        title="Order Details"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[<Button key="back" onClick={handleCancel}>Close</Button>]}
      >
        {selectedOrder && (
          <div>
            <h4>Order ID: {selectedOrder.orderId}</h4>
            <p><strong>Order Date:</strong> {selectedOrder.orderDate}</p>
            {selectedOrder.products.map((product, index) => (
              <div key={index}>
                <p><strong>Product:</strong> {product.productName}</p>
                <p><strong>Quantity:</strong> {product.quantity}</p>
                <p><strong>Total Amount:</strong> {product.totalAmount}</p>
                <Divider />
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserDetailsPage;