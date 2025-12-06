import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Input,
  List,
  Typography,
  message,
  Space,
  Modal,
  Tag,
  Divider,
  Breadcrumb
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import NavBar from '../components/NavBar';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const { Title } = Typography;

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [newText, setNewText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  
  // State for delete confirmation modal
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchAnnouncements = () => {
    fetch(`${API_BASE_URL}/announcement`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setAnnouncements(data.data.announcement);
        } else {
          message.error('Failed to load announcements');
        }
      })
      .catch(() => {
        message.error('Network error');
      });
  };

  const handleAdd = () => {
    if (!newText.trim()) return message.warning('Message cannot be empty');

    fetch(`${API_BASE_URL}/announcement`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: newText }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          message.success('Announcement added');
          setNewText('');
          fetchAnnouncements();
        } else {
          message.error('Failed to add announcement');
        }
      })
      .catch(() => message.error('Request failed'));
  };

  // Open delete confirmation modal
  const handleDelete = (id) => {
    setItemToDelete(id);
    setDeleteModalVisible(true);
  };

  // Confirm deletion
  const confirmDelete = () => {
    if (!itemToDelete) return;
    
    fetch(`${API_BASE_URL}/announcement/${itemToDelete}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          message.success('Deleted successfully');
          fetchAnnouncements();
        } else {
          message.error(data.message || 'Failed to delete');
        }
        // Close modal and reset state
        setDeleteModalVisible(false);
        setItemToDelete(null);
      })
      .catch(() => {
        message.error('Network error');
        // Close modal and reset state even on error
        setDeleteModalVisible(false);
        setItemToDelete(null);
      });
  };

  // Cancel deletion
  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setItemToDelete(null);
  };

  const handleDeactivate = (id) => {
    fetch(`${API_BASE_URL}/announcement/deactivate/${id}`, {
      method: 'PATCH',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          message.success('Announcement deactivated');
          fetchAnnouncements();
        } else {
          message.error('Failed to deactivate announcement');
        }
      })
      .catch(() => message.error('Network error'));
  };

  const handleActivate = (id) => {
    fetch(`${API_BASE_URL}/announcement/activate/${id}`, {
      method: 'PATCH',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          message.success('Announcement activated');
          fetchAnnouncements();
        } else {
          message.error('Failed to activate announcement');
        }
      })
      .catch(() => message.error('Network error'));
  };

  const handleUpdate = (messageId) => {
    if (!editingText.trim()) return message.warning('Message cannot be empty');

    fetch(`${API_BASE_URL}/announcement/${messageId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: editingText }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          message.success('Updated successfully');
          setEditingId(null);
          fetchAnnouncements();
        } else {
          message.error(data.message || 'Update failed');
        }
      })
      .catch(() => message.error('Network error'));
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <>
      <NavBar />
      <Breadcrumb
        separator=">"
        items={[
          {
            title: (
              <Link to="/">
                <span className="breadcrum-title">Home</span>
              </Link>
            ),
          },
          {
            title: <span className="breadcrum-title">Announcement Management</span>,
          },
        ]}
      />
      <Divider plain style={{ borderColor: 'white' }}>
        <Title style={{ color: 'white' }}>Announcement Management</Title>
      </Divider>
      <div className="announcement-wrapper">
        <div className="announcement-content">
          {/* Form */}
          <div className="announcement-form">
            <Space.Compact style={{ width: '100%' }}>
              <Input
                placeholder="Enter announcement message"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
              />
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                Add
              </Button>
            </Space.Compact>
          </div>

          {/* List */}
          <List
            header={<h3>All Announcements</h3>}
            dataSource={announcements}
            bordered
            renderItem={(item) => (
              <List.Item
                className="announcement-item"
                actions={[
                  item.isActive ? (
                    <Button type="link" onClick={() => handleDeactivate(item._id)}>
                      Deactivate
                    </Button>
                  ) : (
                    <Button type="link" onClick={() => handleActivate(item._id)}>
                      Activate
                    </Button>
                  ),
                  editingId === item._id ? (
                    <>
                      <Button
                        type="link"
                        icon={<CheckOutlined />}
                        onClick={() => handleUpdate(item._id)}
                      />
                      <Button
                        type="link"
                        icon={<CloseOutlined />}
                        onClick={() => {
                          setEditingId(null);
                          setEditingText('');
                        }}
                      />
                    </>
                  ) : (
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => {
                        setEditingId(item._id);
                        setEditingText(item.message);
                      }}
                    >
                      Edit
                    </Button>
                  ),
                  <Button
                    type="link"
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => handleDelete(item._id)}
                  />,
                ].filter(Boolean)}
              >
                <div style={{ flex: 1 }}>
                  {editingId === item._id ? (
                    <Input
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                    />
                  ) : (
                    <>
                      <Typography.Text>{item.message}</Typography.Text>
                      {item.isActive ? (
                        <Tag color="green" style={{ marginLeft: '10px' }}>
                          Active
                        </Tag>
                      ) : (
                        <Tag color="default" style={{ marginLeft: '10px' }}>
                          Inactive
                        </Tag>
                      )}
                    </>
                  )}
                </div>
              </List.Item>
            )}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        open={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={cancelDelete}
        okText="Yes, Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
        centered
      >
        <p>Are you sure you want to delete this announcement?</p>
        <p style={{ color: '#666', fontSize: '14px' }}>This action cannot be undone.</p>
      </Modal>
    </>
  );
};

export default Announcements;