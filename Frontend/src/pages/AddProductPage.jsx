import React, { useState , useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import NavBar from '../components/NavBar';
import { PlusOutlined } from '@ant-design/icons';
import {
    Button,
    Form,
    Input,
    InputNumber,
    Segmented,
    Select,
    Upload,
    Radio,
    Typography,
    Divider,
    Space, 
    Switch,
    Breadcrumb,
    message,
} from 'antd';
import ProductListItem from '../components/ProductListItem';
import {Link} from 'react-router-dom';

const { Title } = Typography;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
    },
};  

// normFile function to handle the file upload event
const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

const AddProductPage = () => {
    //states
    const [productType, setProductType] = useState('physical');
    const [viewType, setViewType] = useState('card');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [affiliatePrograms, setAffiliatePrograms] = useState([]);
    const [fileTypes, setFileTypes] = useState([]);

    //fetch categories from the API
    useEffect(() => {
        fetch('http://localhost:3001/api/v1/category')
            .then((response) => response.json())
            .then((data) => {
                setCategories(data.data);
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
                message.error('Failed to fetch categories');
            });
    }, []);

    //fetch products from the API
    useEffect(() => {
        fetch('http://localhost:3001/api/v1/products')
            .then((data)=> data.json())
            .then((data) => {
                setProducts(data.data);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
                message.error('Failed to fetch products');
            }
        )
    }, []);

    //fetch affiliate programs from the API
    useEffect(() => {
        fetch('http://localhost:3001/api/v1/affiliate-program')
            .then((response) => response.json())
            .then((data) => {
                setAffiliatePrograms(data.data);
            })
            .catch((error) => {
                console.error('Error fetching affiliate programs:', error);
                message.error('Failed to fetch affiliate programs');
            });
    }, [])

    //fetch file types from the API
        useEffect(() => {
        fetch('http://localhost:3001/api/v1/file-types')
            .then((response) => response.json())
            .then((data) => {
                setFileTypes(data.data);
            })
            .catch((error) => {
                console.error('Error fetching affiliate programs:', error);
                message.error('Failed to fetch affiliate programs');
            });
    }, [])

    //for components from daisyUI
    // const fileTypes = [
    //     { label: 'PDF', key: 'pdf' },
    //     { label: 'ZIP', key: 'zip' },
    //     { label: 'MP4', key: 'mp4' },
    //     { label: 'MP3', key: 'mp3' },
    //     { label: 'JPG', key: 'jpg' },
    //     { label: 'PNG', key: 'png' },
    //     { label: 'GIF', key: 'gif' },
    //     { label: 'DOCX', key: 'docx' },
    //     { label: 'TXT', key: 'txt' },
    //     { label: 'EPUB', key: 'epub' },
    //     { label: 'EXE', key: 'exe' }
    //   ];      

    const [form] = Form.useForm();

    //sort Products Highest Price First and Lowest Price First
    const sortProducts = (products, order) => {
        const sortedProducts = [...products].sort((a, b) => {
            if (order === 'high') {
                return b.price - a.price; // High to Low
            } else {
                return a.price - b.price; // Low to High
            }
        });
        setProducts(sortedProducts);
        message.success(`Products sorted by ${order === 'high' ? 'Highest Price First' : 'Lowest Price First'}`);
    };    

    //togggle between card and list view
    const changeViewType = (value) => {
   setViewType(value ? 'list' : 'card');    
    }

      // Handle edit action
  const handleEdit = (productId) => {
    console.log('Edit product with ID:', productId);
  };
//detete product
  const handleDelete = (productId) => {
    const updatedProducts = products.filter(product => product.product_id !== productId);
    if (updatedProducts.length !== products.length) {
        setProducts(updatedProducts);
        message.success('Product deleted successfully!');
    } else {
        message.error('Product not found!');
    }
};

    return (
        <div>
            <NavBar />
            <Breadcrumb
                separator='>'
                items={[
                {
                    title: <Link to='/'><span className='breadcrum-title'>Home</span></Link>,
                },
                {
                    title: <span className='breadcrum-title'>Product Management</span>,
                },
                ]}
            />
            <Divider plain style={{borderColor: 'white'}}><Title style={{color: 'white'}}>Add a New Product</Title></Divider>
            <Form
                {...formItemLayout}
                form={form}
                variant={'outlined'}
                className='add-product-form'
                initialValues={{ variant: 'filled' }}
            >

                {/* Drop down to select type of product like physical, digital or affiliate */}
                <Form.Item
                    className='form-item'
                    label="Product Type"
                    name="variant"
                    rules={[{ required: true, message: 'Select a type!' }]}
                >
                    <Segmented
                        options={[
                            { label: 'Physical', value: 'physical' },
                            { label: 'Digital', value: 'digital' },
                            { label: 'Affiliate', value: 'affiliate' },
                        ]}
                        value={productType}
                        onChange={(value)=> setProductType(value)}
                    />
                </Form.Item>
                <Form.Item
                    className='form-item'
                    label="Category"
                    name="Select"
                    rules={[{ required: true, message: 'No category selected!' }]}
                >
                    <Select placeholder="Select a category" allowClear>
                        {categories.map((category) => (
                            <Select.Option key={category.key} value={category.key}>
                                {category.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item className='form-item' label="Product Name" name="Input" rules={[{ required: true, message: 'Product Name is empty!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item className='form-item' label="SKU" name="Input" rules={[{ required: true, message: 'SKU is empty!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item className='form-item' label="Brand" name="Input" rules={[{ required: true, message: 'Brand is empty!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item
                    className='form-item'
                    label="Price"
                    name="InputNumber"
                    rules={[{ required: true, message: 'Price is empty!' }]}
                >
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    className='form-item'
                    label="Stock"
                    name="InputNumber"
                    rules={[{ required: true, message: 'Stock is empty!' }]}
                >
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    className='form-item'
                    label="Discount %"
                    name="InputNumber"
                    rules={[{ required: false, message: 'Discount % is empty!' }]}
                >
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item className='form-item' label="Availibility" rules={[{ required: true, message: 'Select an option!' }]}>
                    <Radio.Group>
                        <Radio value="In Stock"> In Stock </Radio>
                        <Radio value="Out of Stock"> Out of Stock </Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    className='form-item'
                    label="Description"
                    name="TextArea"
                    rules={[{ required: true, message: 'Description is empty!' }]}
                >
                    <Input.TextArea />
                </Form.Item>

                {productType === 'digital' || productType === 'affiliate' && (
                    <Form.Item className='form-item' label="Link" name="Input" rules={[{ required: true, message: 'Link Name is empty!' }]}>
                        <Input />
                    </Form.Item>
                )}

                {productType === 'digital' && (
                    <Form.Item
                        className='form-item'
                            label="File Type"
                            name="Select"
                            rules={[{ required: true, message: 'No File Type selected!' }]}
                            >
                                <Select placeholder="Select File Type" allowClear>
                                    {fileTypes.map((fileType) => (
                                        <Select.Option key={fileType.key} value={fileType.key}>
                                            {fileType.label}
                                        </Select.Option>
                                            ))}
                                </Select>
                    </Form.Item>
                )}

                {productType === 'affiliate' && (
                    <Form.Item
                        className='form-item'
                        label="Commission %"
                        name="InputNumber"
                        rules={[{ required: true, message: 'Commission % is empty!' }]}
                    >
                    <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                )}

                {productType === 'affiliate' && (
                    <Form.Item
                        className='form-item'
                            label="Affiliate Program"
                            name="Select"
                            rules={[{ required: true, message: 'No Affiliate Program selected!' }]}
                            >
                                <Select placeholder="Select an Affiliate Program" allowClear>
                                    {affiliatePrograms.map((ap) => (
                                        <Select.Option key={ap.key} value={ap.key}>
                                            {ap.label}
                                        </Select.Option>
                                            ))}
                                </Select>
                    </Form.Item>
                )}

                {/* File Upload Section */}
                <Form.Item className='form-item' label="Upload" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: true, message: 'Please upload a file!' }]}>
                    <Upload action="/upload.do" listType="picture-card">
                        <button
                            style={{ color: 'inherit', cursor: 'inherit', border: 0, background: 'none' }}
                            type="button"
                        >
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </button>
                    </Upload>
                </Form.Item>

                <Form.Item className='form-item' wrapperCol={{ offset: 6, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Add Product
                    </Button>
                </Form.Item>
            </Form>

            <Divider plain style={{borderColor: 'white'}}><Title style={{color: 'white'}}>Product Listing</Title></Divider>

            <div>
                <div className='products-operation-div'>
                 {/* select all products checkbox */}
                 <div>
                    <input type="checkbox" defaultChecked={false} className="checkbox checkbox-md" />
                    <span>Select All</span>
                </div>

                <div>
                    <Space direction="vertical">
                        <Switch
                        checkedChildren="List"
                        unCheckedChildren="Card"
                        defaultChecked={viewType === 'list'}
                        onChange={changeViewType} 
                        />
                    </Space>
                    <Button color="primary" variant="filled" onClick={()=> sortProducts(products , 'high')} > High Price First </Button>
                    <Button color="primary" variant="filled" onClick={()=> sortProducts(products , 'low')}> Low Price First </Button>
                    <Button color="danger" variant="solid" > Delete Selected </Button>
                </div>
               
                </div>
                {viewType === 'card' && (
                    <div className='product-card-container'>
                        {/* // Products view for admin in both card and table format */}
                        {products.map((product)=> (
                            <Link to={`/${product.sku}`} key={product._id}>
                                <ProductCard key={product._id} product={product} onEdit={handleEdit} onDelete={handleDelete} />
                            </Link>
                        ))}
                    </div>
                )}
                {viewType === 'list' && (
                    <div className='product-list-container'>
                        {products.map((product) => (
                            <Link to={`/${product.sku}`} key={product.product_id}>
                                <ProductListItem
                                    key={product.product_id}
                                    product={product}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddProductPage;
