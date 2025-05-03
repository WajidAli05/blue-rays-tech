import React from 'react';
import ProductCard from '../components/ProductCard';
import NavBar from '../components/NavBar';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
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
    Dropdown, 
    message
} from 'antd';
import ProductListItem from '../components/ProductListItem';

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
    const categories = [
        { label: 'Electronics', key: '1' },
        { label: 'Clothing', key: '2' },
        { label: 'Books', key: '3' },
        { label: 'Home & Kitchen', key: '4' },
        { label: 'Sports & Outdoors', key: '5' },
        { label: 'Toys & Games', key: '6' },
        { label: 'Health & Beauty', key: '7' },
        { label: 'Automotive', key: '8' },
        { label: 'Grocery', key: '9' },
        { label: 'Pet Supplies', key: '10' },
        { label: 'Office Supplies', key: '11' },
        { label: 'Music', key: '12' },
        { label: 'Video Games', key: '13' },
        { label: 'Movies & TV', key: '14' },
        { label: 'Collectibles', key: '15' },
        { label: 'Handmade', key: '16' },
        { label: 'Arts & Crafts', key: '17' },
        { label: 'Baby Products', key: '18' },
        { label: 'Jewelry', key: '19' },
        { label: 'Shoes', key: '20' }
    ];

    const fileTypes = [
        { label: 'PDF', key: 'pdf' },
        { label: 'ZIP', key: 'zip' },
        { label: 'MP4', key: 'mp4' },
        { label: 'MP3', key: 'mp3' },
        { label: 'JPG', key: 'jpg' },
        { label: 'PNG', key: 'png' },
        { label: 'GIF', key: 'gif' },
        { label: 'DOCX', key: 'docx' },
        { label: 'TXT', key: 'txt' },
        { label: 'EPUB', key: 'epub' },
        { label: 'EXE', key: 'exe' }
      ];      

      const affiliatePrograms = [
        { label: 'Amazon Associates', key: 'amazon' },
        { label: 'ShareASale', key: 'shareasale' },
        { label: 'Rakuten Marketing', key: 'rakuten' },
        { label: 'CJ Affiliate', key: 'cj_affiliate' },
        { label: 'ClickBank', key: 'clickbank' },
        { label: 'eBay Partner Network', key: 'ebay' },
        { label: 'PartnerStack', key: 'partnerstack' },
        { label: 'Bluehost Affiliate Program', key: 'bluehost' },
        { label: 'Shopify Affiliate Program', key: 'shopify' },
        { label: 'Fiverr Affiliate Program', key: 'fiverr' },
        { label: 'Wix Affiliate Program', key: 'wix' },
        { label: 'Awin', key: 'awin' },
        { label: 'FlexOffers', key: 'flexoffers' },
        { label: 'Target Affiliate Program', key: 'target' },
        { label: 'Udemy Affiliate Program', key: 'udemy' },
        { label: 'Envato Affiliate Program', key: 'envato' },
        { label: 'HostGator Affiliate Program', key: 'hostgator' },
        { label: 'SiteGround Affiliate Program', key: 'siteground' },
        { label: 'Adobe Affiliate Program', key: 'adobe' }
    ];    

    const [form] = Form.useForm();

    // to modify the form based on product type selected
    const [productType, setProductType] = useState('physical');
    const [viewType, setViewType] = useState('card');
    const [products, setProducts] = useState([
        {
          product_id: 1,
          name: "Smartphone",
          category: "Electronics",
          brand: "TechCo",
          price: 699.99,
          stock_level: 150,
          units_sold: 350,
          total_sales_revenue: 244996.50,
          description: "Latest model with advanced features",
          availability: "In Stock",
          discount: 0.1,
          profit_margin: 0.25,
          gross_profit: 174.99,
          click_through_rate: 0.15,
          reviews_count: 1200,
          average_rating: 4.5,
          affiliate_performance: null,
          image_link: "https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
        },
        {
          product_id: 2,
          name: "Wireless Headphones",
          category: "Electronics",
          brand: "AudioWave",
          price: 199.99,
          stock_level: 200,
          units_sold: 1200,
          total_sales_revenue: 239988.00,
          description: "High-quality wireless sound",
          availability: "In Stock",
          discount: 0.15,
          profit_margin: 0.35,
          gross_profit: 69.99,
          click_through_rate: 0.12,
          reviews_count: 500,
          average_rating: 4.7,
          affiliate_performance: null,
          image_link: "https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
        },
        {
          product_id: 3,
          name: "Ebook: Python Programming",
          category: "Books & Education",
          brand: "LearnTech",
          price: 29.99,
          stock_level: 0, // No stock, because it's a digital product
          units_sold: 3000,
          total_sales_revenue: 89970.00,
          description: "Master Python programming from scratch",
          availability: "In Stock",
          discount: 0.25,
          profit_margin: 0.85,
          gross_profit: 25.50,
          click_through_rate: 0.2,
          reviews_count: 250,
          average_rating: 4.8,
          affiliate_performance: {
            clicks: 5000,
            conversions: 450,
            commission_per_sale: 5.00
          },
          image_link: "https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
        },
        {
          product_id: 4,
          name: "Gaming Laptop",
          category: "Electronics",
          brand: "GigaTech",
          price: 1499.99,
          stock_level: 80,
          units_sold: 150,
          total_sales_revenue: 224998.50,
          description: "High-performance laptop for gaming",
          availability: "In Stock",
          discount: 0.1,
          profit_margin: 0.3,
          gross_profit: 449.99,
          click_through_rate: 0.18,
          reviews_count: 800,
          average_rating: 4.6,
          affiliate_performance: null,
          image_link: "https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
        }
      ]);

    const changeViewType = (value) => {
   setViewType(value ? 'list' : 'card');    
    }

      // Handle edit action
  const handleEdit = (productId) => {
    console.log('Edit product with ID:', productId);
  };

  // Handle delete action
  const handleDelete = (productId) => {
    setProducts(products.filter(product => product.product_id !== productId));
    console.log('Deleted product with ID:', productId);
  };

    return (
        <div>
            <NavBar />
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
                {console.log(productType)}

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

                <Form.Item className='form-item' label="SKU" name="Input" rules={[{ required: true, message: 'Please input!' }]}>
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
                    rules={[{ required: true, message: 'Please input!' }]}
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
                <Space direction="vertical">
                    <Switch
                    checkedChildren="List"
                    unCheckedChildren="Card"
                    defaultChecked={viewType === 'list'} // Default checked based on initial viewType
                    onChange={changeViewType} // Apply changeViewType function on toggle
                    />
                </Space>
                </div>
                {viewType === 'card' && (
                    <div className='product-card-container'>
                        {/* // Products view for admin in both card and table format */}
                        <ProductCard product={products[0]} />
                        <ProductCard product={products[1]} />
                        <ProductCard product={products[2]} />
                        <ProductCard product={products[3]} />
                        <ProductCard product={products[0]} />
                        <ProductCard product={products[1]} />
                    </div>
                )}
                {viewType === 'list' && (
                    <div className='product-list-container'>
                        {products.map((product) => (
                            <ProductListItem
                                key={product.product_id}
                                product={product}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddProductPage;
