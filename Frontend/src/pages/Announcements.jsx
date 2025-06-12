import React, { useEffect, useState } from 'react';
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
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import NavBar from '../components/NavBar';

const { Title } = Typography;

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [newText, setNewText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const fetchAnnouncements = () => {
    fetch('http://localhost:3001/api/v1/announcement', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setAnnouncements(data.data.messages);
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

    fetch('http://localhost:3001/api/v1/announcement', {
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

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this message?',
      onOk: () => {
        fetch(`http://localhost:3001/api/v1/announcement/${id}`, {
          method: 'DELETE',
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status) {
              message.success('Deleted successfully');
              fetchAnnouncements();
            } else {
              message.error('Failed to delete');
            }
          })
          .catch(() => message.error('Network error'));
      },
    });
  };

  const handleDeactivate = (id) => {
    fetch(`http://localhost:3001/api/v1/announcement/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isActive: false }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          message.success('Deactivated');
          fetchAnnouncements();
        } else {
          message.error('Failed to deactivate');
        }
      })
      .catch(() => message.error('Network error'));
  };

  const handleUpdate = (id) => {
    if (!editingText.trim()) return message.warning('Message cannot be empty');

    fetch(`http://localhost:3001/api/v1/announcement/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: editingText }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          message.success('Updated successfully');
          setEditingId(null);
          fetchAnnouncements();
        } else {
          message.error('Update failed');
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
    <Divider plain style={{borderColor: 'white'}}><Title style={{color: 'white'}}>Announcement Management</Title></Divider>
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
                item.isActive && (
                    <Button type="link" onClick={() => handleDeactivate(item._id)}>
                    Deactivate
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
                        setEditingText(item.text);
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
                    <Typography.Text>{item.text}</Typography.Text>{' '}
                    {item.isActive ? (
                        <Tag color="green">Active</Tag>
                    ) : (
                        <Tag color="default">Inactive</Tag>
                    )}
                    </>
                )}
                </div>
            </List.Item>
            )}
        />
        </div>
    </div>
    </>
  );
};

export default Announcements;