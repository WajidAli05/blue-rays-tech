import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, Select, Typography, Divider, message, Card, Breadcrumb } from 'antd';
import { PlusOutlined, ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate, Link, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import NavBar from '../components/NavBar';

const { Title } = Typography;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddBlogPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id } = useParams();
    const [submitting, setSubmitting] = useState(false);
    const [loadingData, setLoadingData] = useState(false);

    useEffect(() => {
        if (id) {
            const fetchBlog = async () => {
                setLoadingData(true);
                try {
                    const response = await fetch(`${API_BASE_URL}/blogs?role=admin`, { credentials: 'include' });
                    const result = await response.json();
                    if (result.status) {
                        const blog = result.data.find(b => b._id === id);
                        if (blog) form.setFieldsValue({ ...blog, featured_image: [{ uid: '-1', status: 'done', url: blog.featured_image }] });
                    }
                } catch (error) { message.error("Load failed"); } 
                finally { setLoadingData(false); }
            };
            fetchBlog();
        }
    }, [id, form]);

    const handleManualSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);
            const formData = new FormData();
            Object.keys(values).forEach(key => {
                if (key !== 'featured_image') formData.append(key, values[key]);
            });
            if (values.featured_image?.[0]?.originFileObj) {
                formData.append('featured_image', values.featured_image[0].originFileObj);
            }

            const res = await fetch(id ? `${API_BASE_URL}/blog/${id}` : `${API_BASE_URL}/blog`, {
                method: id ? 'PUT' : 'POST',
                body: formData,
                credentials: 'include',
            });

            if ((await res.json()).status) {
                message.success("Success!");
                navigate('/blogs');
            }
        } catch (e) { message.error("Please fill required fields"); } 
        finally { setSubmitting(false); }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#3a8ee6' }}>
            <NavBar />
            <div style={{ flex: 1, padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '100%', maxWidth: '1200px' }}>
                    <Breadcrumb 
                        style={{ marginBottom: '20px' }}
                        items={[
                            { title: <Link to="/" style={{color: 'white'}}>Home</Link> },
                            { title: <Link to="/blogs" style={{color: 'white'}}>Blog Management</Link> },
                            { title: <span style={{color: 'white'}}>{id ? 'Edit Blog' : 'Add Blog'}</span> }
                        ]} 
                    />

                    {/* --- Updated Title with full-width dividers --- */}
                    <div style={{ display: 'flex', alignItems: 'center', margin: '40px 0', width: '100%' }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.5)' }}></div>
                        <Title level={1} style={{ color: 'white', margin: '0 20px', fontWeight: 600, fontSize: '36px' }}>
                            {id ? 'Edit Blog Post' : 'Create New Blog Post'}
                        </Title>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.5)' }}></div>
                    </div>

                    <Card style={{ borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} loading={loadingData}>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
                            <Link to="/blogs"><Button icon={<ArrowLeftOutlined />}>Back to List</Button></Link>
                        </div>
                        
                        <Form form={form} layout="vertical" initialValues={{ status: 'draft', author: 'Admin' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginBottom: '30px' }}>
                                <div>
                                    <Form.Item name="title" label={<b>Post Title</b>} rules={[{ required: true }]}>
                                        <Input size="large" placeholder="Enter title" />
                                    </Form.Item>
                                    <Form.Item name="content" label={<b>Content Body</b>} rules={[{ required: true }]}>
                                        <ReactQuill theme="snow" style={{ height: '400px', marginBottom: '50px' }} />
                                    </Form.Item>
                                </div>
                                <div>
                                    <Form.Item name="status" label={<b>Publishing Status</b>}>
                                        <Select options={[{label:'Draft', value:'draft'}, {label:'Published', value:'published'}]} />
                                    </Form.Item>
                                    <Form.Item name="author" label={<b>Author</b>}><Input /></Form.Item>
                                    <Form.Item name="featured_image" label={<b>Featured Image</b>} valuePropName="fileList" getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}>
                                        <Upload listType="picture-card" maxCount={1} beforeUpload={() => false}>
                                            <PlusOutlined />
                                        </Upload>
                                    </Form.Item>
                                </div>
                            </div>
                            
                            {/* --- Submit Button relocated to bottom center --- */}
                            <Divider />
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button 
                                    type="primary" 
                                    size="large" 
                                    icon={<SaveOutlined />} 
                                    loading={submitting} 
                                    onClick={handleManualSubmit}
                                    style={{ width: '100%', maxWidth: '300px' }} // Optional max-width for cleaner look
                                >
                                    {id ? 'Save Changes' : 'Publish Post'}
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AddBlogPage;