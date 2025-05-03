import React from 'react'
import DropDownMenu from '../components/DropDownMenu'
import NavBar from '../components/NavBar'
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
    ]
    const [form] = Form.useForm();
    const variant = Form.useWatch('variant', form);

  return (
    <div>
        <NavBar />
        <Form
            {...formItemLayout}
            form={form}
            variant={'outlined'}
            style={{ maxWidth: 600 }}
            initialValues={{ variant: 'filled' }}
            >

            <Form.Item label="Input" name="Input" rules={[{ required: true, message: 'Please input!' }]}>
                <Input />
            </Form.Item>

            <Form.Item
                label="InputNumber"
                name="InputNumber"
                rules={[{ required: true, message: 'Please input!' }]}
            >
                <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                label="TextArea"
                name="TextArea"
                rules={[{ required: true, message: 'Please input!' }]}
            >
                <Input.TextArea />
            </Form.Item>

            <Form.Item
                label="Mentions"
                name="Mentions"
                rules={[{ required: true, message: 'Please input!' }]}
            >
                <Mentions />
            </Form.Item>

            <Form.Item
                label="Select"
                name="Select"
                rules={[{ required: true, message: 'Please input!' }]}
            >
                <Select />
            </Form.Item>

            <Form.Item
                label="Cascader"
                name="Cascader"
                rules={[{ required: true, message: 'Please input!' }]}
            >
                <Cascader />
            </Form.Item>

            <Form.Item
                label="TreeSelect"
                name="TreeSelect"
                rules={[{ required: true, message: 'Please input!' }]}
            >
                <TreeSelect />
            </Form.Item>

            <Form.Item
                label="DatePicker"
                name="DatePicker"
                rules={[{ required: true, message: 'Please input!' }]}
            >
                <DatePicker />
            </Form.Item>

            <Form.Item
                label="RangePicker"
                name="RangePicker"
                rules={[{ required: true, message: 'Please input!' }]}
            >
                <RangePicker />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                <Button type="primary" htmlType="submit">
                Submit
                </Button>
            </Form.Item>
        </Form>
    </div>
  )
}

export default AddProductPage
