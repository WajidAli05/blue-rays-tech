import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import {
  Breadcrumb,
  Card,
  Col,
  Row,
  Avatar,
  Button,
  Descriptions,
  Divider,
  Typography,
  List,
  Popconfirm,
  Modal,
  Input,
  message,
  Spin,
} from 'antd';
import {
  EditOutlined,
  FieldTimeOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { Link, useParams, useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const UserDetailsPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditingUser, setIsEditingUser] = useState(false);

  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Fetch user info
  useEffect(() => {
    if (!userId) {
      navigate('/user-not-found');
      return;
    }

    fetch(`http://localhost:3001/api/v1/user/${userId}`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.status) {
          setUser(data.data);
        } else {
          message.error(data.message || 'Failed to fetch user');
        }
      })
      .catch((err) => {
        message.error('Error fetching user');
        console.error(err);
      });
  }, [userId, navigate]);

  //fetch history
  const fetchPurchaseHistoryOfUser = () => {
        if (user) {
      setUserDetails(user);

      // Fetch purchase history using email
      if (user.email) {
        setLoadingOrders(true);
        fetch(`http://localhost:3001/api/v1/user/${user.email}/orders`, {
          method: 'GET',
          credentials: 'include',
        })
          .then((res) => res.json())
          .then((data) => {
            if (data?.status && Array.isArray(data.data)) {
              setPurchaseHistory(data.data);
            } else {
              setPurchaseHistory([]);
            }
          })
          .catch((err) => {
            console.error('Error fetching purchase history:', err);
            setPurchaseHistory([]);
          })
          .finally(() => setLoadingOrders(false));
      }
    }
  }

  // Sync userDetails when user loads
  useEffect(() => {
    fetchPurchaseHistoryOfUser();
  }, [user]);


// Handle delete
const handleDelete = (orderId) => {
  fetch(`http://localhost:3001/api/v1/${orderId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data?.status) {
        message.success('Order deleted successfully');
        fetchPurchaseHistoryOfUser();
      } else {
        message.error(data.message || 'Failed to delete order');
      }
    })
    .catch((err) => {
      message.error('Error deleting order');
      console.error(err);
    });
};


  const showModal = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleEditUser = () => {
    if (isEditingUser) {
      // Save updates to backend
      fetch(`http://localhost:3001/api/v1/user/${userDetails._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: userDetails.name,
          email: userDetails.email,
          phone: userDetails.phone,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status) {
            message.success('User updated successfully');
            setUser(data.data);
          } else {
            message.error(data.message || 'Failed to update user');
          }
        })
        .catch((err) => {
          message.error('Error updating user');
          console.error(err);
        });
    }
    setIsEditingUser(!isEditingUser);
  };

  if (!userDetails) {
    return (
      <div className="loading-div">
        <Spin size="large" tip="Loading user..." fullscreen />
      </div>
    );
  }

  return (
    <div className="user-details-page">
      <NavBar />

      <Breadcrumb
        separator=">"
        items={[
          { title: <Link to="/"><span className="breadcrum-title">Home</span></Link> },
          { title: <Link to="/users"><span className="breadcrum-title">User Management</span></Link> },
          { title: <span className="breadcrum-title">{userDetails.name}</span> },
        ]}
      />

      <Row gutter={24} className="user-details-row">
        {/* Left Column: User Info */}
        <Col span={8}>
          <Card
            className="user-profile-card"
            cover={
              <Avatar
                className="user-avatar"
                size={150}
                src={`http://localhost:3001/uploads/users/${userDetails?.image}`}
              />
            }
          >
            <Title level={3} className="user-name">
              {isEditingUser ? (
                <Input
                  value={userDetails.name}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, name: e.target.value })
                  }
                />
              ) : (
                userDetails.name
              )}
            </Title>
            <Text className="user-job">Singer and songwriter</Text>
            <Divider />
            <Descriptions column={1} className="user-description">
              <Descriptions.Item
                label={
                  <span>
                    <PhoneOutlined className="user-icon" />
                    Phone
                  </span>
                }
              >
                {isEditingUser ? (
                  <Input
                    value={userDetails.phone}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, phone: e.target.value })
                    }
                  />
                ) : (
                  userDetails.phone
                )}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span>
                    <MailOutlined className="user-icon" />
                    Email
                  </span>
                }
              >
                {isEditingUser ? (
                  <Input
                    value={userDetails.email}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, email: e.target.value })
                    }
                  />
                ) : (
                  userDetails.email
                )}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span>
                    <EnvironmentOutlined className="user-icon" />
                    Country
                  </span>
                }
              >
                {userDetails?.country}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span>
                    <FieldTimeOutlined className="user-icon" />
                    Member Since
                  </span>
                }
              >
                {new Date(userDetails?.since).toLocaleDateString()}
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

        {/* Right Column: Purchase History */}
        <Col span={16}>
          <Card
            title={
              <span>
                <ShoppingCartOutlined className="purchase-history-icon" /> Purchase
                History
              </span>
            }
            className="purchase-history-card"
          >
            {loadingOrders ? (
              <Spin tip="Loading purchase history..." />
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={purchaseHistory}
                renderItem={(order) => (
                  <List.Item
                    actions={[
                      <Popconfirm
                        title="Are you sure you want to delete this order?"
                        onConfirm={() => handleDelete(order._id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button icon={<DeleteOutlined />} type="primary" danger>
                          Delete
                        </Button>
                      </Popconfirm>,
                      <Button type="default" onClick={() => showModal(order)}>
                        View Details
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={<strong>Order #{order._id.slice(-6)}</strong>}
                      description={`Date: ${new Date(order.createdAt).toLocaleDateString()} | Total: $${order.amount.toFixed(
                        2
                      )}`}
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Order Details Modal */}
      <Modal
        title="Order Details"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[<Button key="back" onClick={handleCancel}>Close</Button>]}
      >
        {selectedOrder && (
          <div>
            <h4>Order ID: {selectedOrder._id}</h4>
            <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <Divider />
            {selectedOrder.items.map((product) => (
              <div key={product._id}>
                <p><strong>Product:</strong> {product.name}</p>
                <p><strong>Quantity:</strong> {product.quantity}</p>
                <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
                <Divider />
              </div>
            ))}
            <h3>Total: ${selectedOrder.amount.toFixed(2)}</h3>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserDetailsPage;