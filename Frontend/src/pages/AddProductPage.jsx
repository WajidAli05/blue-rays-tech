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
    Modal
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
    const [submitting, setSubmitting] = useState(false);

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

    //create a form instance (Library : Ant Design)
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
    const updatedProducts = products.filter(product => product._id !== productId);
    if (updatedProducts.length !== products.length) {
        setProducts(updatedProducts);
        message.success('Product deleted successfully!');
    } else {
        message.error('Product not found!');
    }
};

//handle form submission
const handleFormSubmit = (values) => {
  setSubmitting(true);
  const formData = new FormData();

  formData.append('name', values.name);
  formData.append('category', values.category);
  formData.append('product_type', values.product_type);
  formData.append('sku', values.sku);
  formData.append('brand', values.brand || '');
  formData.append('price', values.price);
  formData.append('stock_level', values.stock_level);
  formData.append('units_sold', values.units_sold || '');
  formData.append('total_sales_revenue', values.total_sales_revenue || '');
  formData.append('description', values.description);
  formData.append('availability', values.availability || '');
  formData.append('discount', values.discount || '');
  formData.append('profit_margin', values.profit_margin || '');
  formData.append('gross_profit', values.gross_profit || '');
  formData.append('click_through_rate', values.click_through_rate || '');
  formData.append('reviews_count', values.reviews_count || '');
  formData.append('average_rating', values.average_rating || '');

  if (values.link) formData.append('link', values.link);
  if (values.file_type) formData.append('file_type', values.file_type);
  if (values.commission) formData.append('commission', values.commission);
  if (values.affiliate_program) formData.append('affiliate_program', values.affiliate_program);

  if (values.upload && Array.isArray(values.upload)) {
    values.upload.forEach((file) => {
      if (file.originFileObj) {
        formData.append('image_link', file.originFileObj);
      }
    });
  }

  fetch('http://localhost:3001/api/v1/product', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data.status) {
        Modal.error({
          title: 'Submission Failed',
          content: data.message || 'Product submission failed.',
        });
      } else {
        Modal.success({
          title: 'Success',
          content: data.message || 'Product added successfully!',
        });
        form.resetFields();
        setProductType('physical');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      Modal.error({
        title: 'Server Error',
        content: 'Something went wrong. Please try again later.',
      });
    })
    .finally(() => {
      setSubmitting(false);
    });
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
                initialValues={{ product_type: 'physical' }}
                onFinish={handleFormSubmit}
            >
                {/* Product Type */}
                <Form.Item
                    className='form-item'
                    label="Product Type"
                    name="product_type"
                    rules={[{ required: true, message: 'Select a type!' }]}
                >
                    <Segmented
                        options={[
                            { label: 'Physical', value: 'physical' },
                            { label: 'Digital', value: 'digital' },
                            { label: 'Affiliate', value: 'affiliate' },
                        ]}
                        value={productType}
                        onChange={(value) => {
                            setProductType(value);
                            form.setFieldValue('product_type', value);
                        }}
                    />
                </Form.Item>

                {/* Category */}
                <Form.Item
                    className='form-item'
                    label="Category"
                    name="category"
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

                {/* Basic Fields */}
                <Form.Item className='form-item' label="Product Name" name="name" rules={[{ required: true, message: 'Product Name is empty!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item className='form-item' label="SKU" name="sku" rules={[{ required: true, message: 'SKU is empty!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item className='form-item' label="Brand" name="brand" rules={[{ required: true, message: 'Brand is empty!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item className='form-item' label="Price" name="price" rules={[{ required: true, message: 'Price is empty!' }]}>
                    <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>

                <Form.Item className='form-item' label="Stock" name="stock_level" rules={[{ required: true, message: 'Stock is empty!' }]}>
                    <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>

                <Form.Item className='form-item' label="Discount %" name="discount">
                    <InputNumber style={{ width: '100%' }} min={0} max={100} />
                </Form.Item>

                <Form.Item className='form-item' label="Availability" name="availability" rules={[{ required: true, message: 'Select an option!' }]}>
                    <Radio.Group>
                        <Radio value="In Stock">In Stock</Radio>
                        <Radio value="Out of Stock">Out of Stock</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    className='form-item'
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Description is empty!' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>

                {/* Conditional Fields */}
                {(productType === 'digital' || productType === 'affiliate') && (
                    <Form.Item className='form-item' label="Link" name="link" rules={[{ required: true, message: 'Link is required!' }]}>
                        <Input />
                    </Form.Item>
                )}

                {productType === 'digital' && (
                    <Form.Item
                        className='form-item'
                        label="File Type"
                        name="file_type"
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
                    <>
                        <Form.Item
                            className='form-item'
                            label="Commission %"
                            name="commission"
                            rules={[{ required: true, message: 'Commission % is empty!' }]}
                        >
                            <InputNumber style={{ width: '100%' }} min={0} max={100} />
                        </Form.Item>

                        <Form.Item
                            className='form-item'
                            label="Affiliate Program"
                            name="affiliate_program"
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
                    </>
                )}

                {/* Upload Section */}
            <Form.Item
                className='form-item'
                label="Upload"
                name="upload"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[{ required: productType === 'affiliate' ? false : true, message: 'Please upload at least one file!' }]}
                >
                <Upload
                    listType="picture-card"
                    beforeUpload={() => false}
                    multiple
                    accept={
                    productType === 'physical'
                        ? 'image/*'
                        : '*'  // allow any file type
                    }
                >
                    <button
                    style={{ color: 'inherit', cursor: 'pointer', border: 0, background: 'none' }}
                    type="button"
                    >
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                    </button>
                </Upload>
            </Form.Item>

                {/* Submit Button */}
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
                            <Link to={`/${product.sku}`} key={product._id}>
                                <ProductListItem
                                    key={product._id}
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
