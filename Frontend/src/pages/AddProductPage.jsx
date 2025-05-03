import React from 'react';
import DropDownMenu from '../components/DropDownMenu';
import NavBar from '../components/NavBar';
import { PlusOutlined } from '@ant-design/icons';
import {
    Button,
    Cascader,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Mentions,
    Segmented,
    Select,
    TreeSelect,
    Upload,
    Radio
} from 'antd';
const { RangePicker } = DatePicker;

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

    const [form] = Form.useForm();

    // to modify the form based on product type selected
    const [productType, setProductType] = React.useState('physical');

    return (
        <div>
            <NavBar />
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

                {/* File Upload Section */}
                <Form.Item className='form-item' label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
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
        </div>
    );
};

export default AddProductPage;
