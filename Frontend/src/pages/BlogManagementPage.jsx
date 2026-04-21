import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, message, Popconfirm, Typography, Image, Card, Breadcrumb } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';

const { Title } = Typography;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BlogManagementPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/blogs?role=admin`, { credentials: 'include' });
            const data = await response.json();
            if (data.status) setBlogs(data.data);
        } catch (error) {
            message.error("Failed to fetch blog posts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBlogs(); }, []);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/blog/${id}`, { method: 'DELETE', credentials: 'include' });
            if ((await response.json()).status) {
                message.success("Post deleted");
                setBlogs(blogs.filter(b => b._id !== id));
            }
        } catch (error) { message.error("Error deleting post"); }
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'featured_image',
            key: 'image',
            render: (url) => <Image src={url} width={50} className="rounded" />,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text) => <b>{text}</b>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <Tag color={status === 'published' ? 'green' : 'orange'}>{status.toUpperCase()}</Tag>,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Link to={`/edit-blog/${record._id}`}><Button icon={<EditOutlined />} type="text" /></Link>
                    <Popconfirm title="Delete post?" onConfirm={() => handleDelete(record._id)}>
                        <Button icon={<DeleteOutlined />} type="text" danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#3a8ee6' }}>
            <NavBar />
            <div style={{ flex: 1, padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '100%', maxWidth: '1200px' }}>
                    <Breadcrumb 
                        style={{ marginBottom: '20px' }}
                        items={[{ title: <Link to="/" style={{color: 'white'}}>Home</Link> }, { title: <span style={{color: 'white'}}>Blog Management</span> }]} 
                    />
                    
                    {/* --- Updated Title with full-width dividers --- */}
                    <div style={{ display: 'flex', alignItems: 'center', margin: '40px 0', width: '100%' }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.5)' }}></div>
                        <Title level={1} style={{ color: 'white', margin: '0 20px', fontWeight: 600, fontSize: '36px' }}>
                            Blog Management
                        </Title>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.5)' }}></div>
                    </div>

                    <Card style={{ borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                            <Link to="/add-blog">
                                <Button type="primary" icon={<PlusOutlined />} size="large">Add New Post</Button>
                            </Link>
                        </div>
                        <Table columns={columns} dataSource={blogs} rowKey="_id" loading={loading} />
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default BlogManagementPage;