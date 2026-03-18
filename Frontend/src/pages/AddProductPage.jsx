import React, { useState, useEffect } from 'react';
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
    Modal,
} from 'antd';
import ProductListItem from '../components/ProductListItem';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
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

const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

const AddProductPage = () => {
    const [productType, setProductType] = useState('physical');
    const [viewType, setViewType] = useState('card');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [affiliatePrograms, setAffiliatePrograms] = useState([]);
    const [fileTypes, setFileTypes] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [subcategories, setSubcategories] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/category`, {
            method: 'GET',
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                setCategories(data.data);
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
                message.error('Failed to fetch categories');
            });
    }, []);

    useEffect(() => {
        fetch(`${API_BASE_URL}/products`, {
            method: 'GET',
            credentials: 'include',
        })
            .then((data) => data.json())
            .then((data) => {
                setProducts(data.data);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
                message.error('Failed to fetch products');
            });
    }, []);

    useEffect(() => {
        fetch(`${API_BASE_URL}/affiliate-program`, {
            method: 'GET',
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                setAffiliatePrograms(data.data);
            })
            .catch((error) => {
                console.error('Error fetching affiliate programs:', error);
                message.error('Failed to fetch affiliate programs');
            });
    }, []);

    useEffect(() => {
        fetch(`${API_BASE_URL}/file-types`, {
            method: 'GET',
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                setFileTypes(data.data);
            })
            .catch((error) => {
                console.error('Error fetching file types:', error);
                message.error('Failed to fetch file types');
            });
    }, []);

    const [form] = Form.useForm();

    const sortProducts = (products, order) => {
        const sortedProducts = [...products].sort((a, b) => {
            if (order === 'high') {
                return b.price - a.price;
            } else {
                return a.price - b.price;
            }
        });
        setProducts(sortedProducts);
        message.success(
            `Products sorted by ${order === 'high' ? 'Highest Price First' : 'Lowest Price First'}`
        );
    };

    const changeViewType = (value) => {
        setViewType(value ? 'list' : 'card');
    };

    const handleEdit = (productId) => {
        console.log('Edit product with ID:', productId);
    };

    const handleDelete = (productId) => {
        const updatedProducts = products.filter((product) => product._id !== productId);
        if (updatedProducts.length !== products.length) {
            setProducts(updatedProducts);
            message.success('Product deleted successfully!');
        } else {
            message.error('Product not found!');
        }
    };

    const fetchSubcategories = (categoryId) => {
        if (!categoryId) {
            setSubcategories([]);
            return;
        }

        fetch(`${API_BASE_URL}/categories/${categoryId}/subcategories`, {
            method: 'GET',
            credentials: 'include',
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch subcategories');
                }
                return res.json();
            })
            .then((data) => {
                const formatted = (data.data || []).map((sub) => ({
                    label: sub,
                    value: sub,
                }));
                setSubcategories(formatted);
            })
            .catch((err) => {
                console.error('Error fetching subcategories:', err);
                setSubcategories([]);
            });
    };

    const handleCategoryChange = (value) => {
        form.setFieldsValue({ sub_category: undefined });
        fetchSubcategories(value);
    };

    const handleProductTypeChange = (value) => {
        setProductType(value);
        form.setFieldValue('product_type', value);
    };

    // ─── Manual submit: bypasses onFinish entirely ───
    const handleManualSubmit = async () => {
        // Step 1: Determine which fields to validate based on current product type
        const currentType = productType;
        const fieldsToValidate = ['name', 'sku', 'category', 'sub_category', 'description', 'product_type'];

        if (currentType !== 'affiliate') {
            fieldsToValidate.push('brand', 'price', 'stock_level', 'availability');
        }
        if (currentType === 'digital' || currentType === 'affiliate') {
            fieldsToValidate.push('link');
        }
        if (currentType === 'digital') {
            fieldsToValidate.push('file_type');
        }
        if (currentType !== 'affiliate') {
            fieldsToValidate.push('upload');
        }

        // Step 2: Validate only the relevant fields
        try {
            await form.validateFields(fieldsToValidate);
        } catch (errorInfo) {
            console.log('Validation failed:', errorInfo);
            message.error('Please fix the highlighted errors before submitting.');
            return;
        }

        // Step 3: Read ALL values from the form store
        const allValues = form.getFieldsValue(true);

        console.log('All form values:', allValues);

        setSubmitting(true);

        // Step 4: Build FormData
        const formData = new FormData();

        formData.append('name', allValues.name || '');
        formData.append('product_type', currentType);
        formData.append('description', allValues.description || '');
        formData.append('sku', allValues.sku || '');

        // Map category _id back to label
        const selectedCategory = categories.find((cat) => cat._id === allValues.category);
        const categoryLabel = selectedCategory ? selectedCategory.label : (allValues.category || '');
        formData.append('category', categoryLabel);
        formData.append('sub_category', allValues.sub_category || '');

        // Non-affiliate fields
        if (currentType !== 'affiliate') {
            formData.append('brand', allValues.brand || '');
            formData.append('price', allValues.price ?? '');
            formData.append('stock_level', allValues.stock_level ?? '');
            formData.append('units_sold', allValues.units_sold || '');
            formData.append('total_sales_revenue', allValues.total_sales_revenue || '');
            formData.append('availability', allValues.availability || '');
            formData.append('discount', allValues.discount || '');
            formData.append('profit_margin', allValues.profit_margin || '');
            formData.append('gross_profit', allValues.gross_profit || '');
            formData.append('click_through_rate', allValues.click_through_rate || '');
            formData.append('reviews_count', allValues.reviews_count || '');
            formData.append('average_rating', allValues.average_rating || '');
        }

        // Affiliate-specific
        if (allValues.link) formData.append('affiliate_link', allValues.link);
        if (allValues.commission != null) formData.append('commission_rate', allValues.commission);
        if (allValues.affiliate_program) formData.append('affiliate_program', allValues.affiliate_program);

        // Digital-specific
        if (allValues.file_type) formData.append('file_type', allValues.file_type);

        // File uploads
        if (allValues.upload && Array.isArray(allValues.upload)) {
            allValues.upload.forEach((file) => {
                if (file.originFileObj) {
                    formData.append('image_link', file.originFileObj);
                }
            });
        }

        // Debug: log what we're actually sending
        console.log('FormData being sent:', [...formData.entries()]);

        // Step 5: Send to backend
        try {
            const response = await fetch(`${API_BASE_URL}/product`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            const data = await response.json();

            console.log('Backend response:', data);

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
                setSubcategories([]);

                // Refresh product list
                try {
                    const prodRes = await fetch(`${API_BASE_URL}/products`, {
                        method: 'GET',
                        credentials: 'include',
                    });
                    const prodData = await prodRes.json();
                    if (prodData.data) setProducts(prodData.data);
                } catch (e) {
                    console.error('Error refreshing products:', e);
                }
            }
        } catch (error) {
            console.error('Fetch error:', error);
            Modal.error({
                title: 'Server Error',
                content: 'Something went wrong. Please try again later.',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
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
                        title: <span className="breadcrum-title">Product Management</span>,
                    },
                ]}
            />
            <Divider plain style={{ borderColor: 'white' }}>
                <Title style={{ color: 'white' }}>Add a New Product</Title>
            </Divider>

            {/*
                NOTE: No onFinish handler. We use a manual submit button with onClick.
                This avoids ALL Ant Design onFinish/preserve issues entirely.
                All fields stay mounted (using display:none) so values are never lost.
            */}
            <Form
                {...formItemLayout}
                form={form}
                variant="outlined"
                className="add-product-form"
                initialValues={{ product_type: 'physical' }}
            >
                {/* ─── Product Type ─── */}
                <Form.Item
                    className="form-item"
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
                        onChange={handleProductTypeChange}
                    />
                </Form.Item>

                {/* ─── Common Fields (all product types) ─── */}
                <Form.Item
                    className="form-item"
                    label="Product Name"
                    name="name"
                    rules={[{ required: true, message: 'Product Name is empty!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    className="form-item"
                    label="SKU"
                    name="sku"
                    rules={[{ required: true, message: 'SKU is empty!' }]}
                >
                    <Input />
                </Form.Item>

                {/* ─── Category (all product types) ─── */}
                <Form.Item
                    className="form-item"
                    label="Category"
                    name="category"
                    rules={[{ required: true, message: 'No category selected!' }]}
                >
                    <Select placeholder="Select a category" allowClear onChange={handleCategoryChange}>
                        {categories.map((category) => (
                            <Select.Option key={category.key || category._id} value={category._id}>
                                {category.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* ─── Sub Category (all product types) ─── */}
                <Form.Item
                    className="form-item"
                    label="Sub Category"
                    name="sub_category"
                    rules={[{ required: true, message: 'No sub category selected!' }]}
                >
                    <Select placeholder="Select a sub category" allowClear>
                        {subcategories.map((sub) => (
                            <Select.Option key={sub.value} value={sub.value}>
                                {sub.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* ─── Non-affiliate only fields ─── */}
                {/* Using display:none keeps fields in DOM so values are never lost */}
                <div style={{ display: productType !== 'affiliate' ? 'block' : 'none' }}>
                    <Form.Item
                        className="form-item"
                        label="Brand"
                        name="brand"
                        rules={[{ required: productType !== 'affiliate', message: 'Brand is empty!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        className="form-item"
                        label="Price"
                        name="price"
                        rules={[{ required: productType !== 'affiliate', message: 'Price is empty!' }]}
                    >
                        <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>

                    <Form.Item
                        className="form-item"
                        label="Stock"
                        name="stock_level"
                        rules={[{ required: productType !== 'affiliate', message: 'Stock is empty!' }]}
                    >
                        <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>

                    <Form.Item className="form-item" label="Discount %" name="discount">
                        <InputNumber style={{ width: '100%' }} min={0} max={100} />
                    </Form.Item>

                    <Form.Item
                        className="form-item"
                        label="Availability"
                        name="availability"
                        rules={[{ required: productType !== 'affiliate', message: 'Select an option!' }]}
                    >
                        <Radio.Group>
                            <Radio value="In Stock">In Stock</Radio>
                            <Radio value="Out of Stock">Out of Stock</Radio>
                        </Radio.Group>
                    </Form.Item>
                </div>

                {/* ─── Link field (digital + affiliate) ─── */}
                <div style={{ display: (productType === 'digital' || productType === 'affiliate') ? 'block' : 'none' }}>
                    <Form.Item
                        className="form-item"
                        label="Link"
                        name="link"
                        rules={[{
                            required: productType === 'digital' || productType === 'affiliate',
                            message: 'Link is required!'
                        }]}
                    >
                        <Input />
                    </Form.Item>
                </div>

                {/* ─── Digital-only field ─── */}
                <div style={{ display: productType === 'digital' ? 'block' : 'none' }}>
                    <Form.Item
                        className="form-item"
                        label="File Type"
                        name="file_type"
                        rules={[{ required: productType === 'digital', message: 'No File Type selected!' }]}
                    >
                        <Select placeholder="Select File Type" allowClear>
                            {fileTypes.map((fileType) => (
                                <Select.Option key={fileType.key} value={fileType.key}>
                                    {fileType.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>

                {/* ─── Affiliate-only fields ─── */}
                <div style={{ display: productType === 'affiliate' ? 'block' : 'none' }}>
                    <Form.Item
                        className="form-item"
                        label="Commission %"
                        name="commission"
                    >
                        <InputNumber style={{ width: '100%' }} min={0} max={100} />
                    </Form.Item>

                    <Form.Item
                        className="form-item"
                        label="Affiliate Program"
                        name="affiliate_program"
                    >
                        <Select placeholder="Select Affiliate Program" allowClear>
                            {affiliatePrograms.map((program) => (
                                <Select.Option key={program._id} value={program._id}>
                                    {program.name || program.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>

                {/* ─── Description (all product types) ─── */}
                <Form.Item
                    className="form-item"
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Description is empty!' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>

                {/* ─── Upload (required for physical + digital, optional for affiliate) ─── */}
                <Form.Item
                    className="form-item"
                    label="Upload"
                    name="upload"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[
                        {
                            required: productType !== 'affiliate',
                            message: 'Please upload at least one file!',
                        },
                    ]}
                >
                    <Upload
                        listType="picture-card"
                        beforeUpload={() => false}
                        multiple
                        accept={productType === 'physical' ? 'image/*' : '*'}
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

                {/* ─── Submit (manual onClick, NOT htmlType="submit") ─── */}
                <Form.Item className="form-item" wrapperCol={{ offset: 6, span: 16 }}>
                    <Button type="primary" loading={submitting} onClick={handleManualSubmit}>
                        Add Product
                    </Button>
                </Form.Item>
            </Form>

            {/* ─── Product Listing ─── */}
            <Divider plain style={{ borderColor: 'white' }}>
                <Title style={{ color: 'white' }}>Product Listing</Title>
            </Divider>

            <div>
                <div className="products-operation-div">
                    <div>
                        <Space direction="vertical">
                            <Switch
                                checkedChildren="List"
                                unCheckedChildren="Card"
                                defaultChecked={viewType === 'list'}
                                onChange={changeViewType}
                            />
                        </Space>
                        <Button color="primary" variant="filled" onClick={() => sortProducts(products, 'high')}>
                            High Price First
                        </Button>
                        <Button color="primary" variant="filled" onClick={() => sortProducts(products, 'low')}>
                            Low Price First
                        </Button>
                    </div>
                </div>

                {viewType === 'card' && (
                    <div className="product-card-container">
                        {products.map((product) => (
                            <Link to={`/${product.sku}`} key={product._id}>
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            </Link>
                        ))}
                    </div>
                )}

                {viewType === 'list' && (
                    <div className="product-list-container">
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