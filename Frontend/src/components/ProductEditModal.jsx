import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, InputNumber, Radio, Select, Segmented, Rate } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const ProductEditModal = ({ product, onSave, categories, fileTypes, affiliatePrograms, open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const [productType, setProductType] = useState(product?.product_type || 'physical');
  const [form] = Form.useForm();

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        product_id: product.product_id || '',
        name: product.name || '',
        category: product.category || '',
        brand: product.brand || '',
        product_type: product.product_type || 'physical',
        sku: product.sku || '',
        price: product.price || 0,
        stock_level: product.stock_level || 0,
        units_sold: product.units_sold || 0,
        total_sales_revenue: product.total_sales_revenue || 0,
        description: product.description || '',
        availability: product.availability || 'In Stock',
        discount: product.discount || 0,
        profit_margin: product.profit_margin || 0,
        gross_profit: product.gross_profit || 0,
        click_through_rate: product.click_through_rate || 0,
        reviews_count: product.reviews_count || 0,
        average_rating: product.average_rating || 0,
        affiliate_performance: product.affiliate_performance || 0,
        image_link: product.image_link || '',
      });
      setProductType(product.product_type || 'physical'); // Set product type
    }
  }, [product, form]);

  const showLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);  // Simulate form submission loading
    }, 2000); // Adjust time as necessary
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <Modal
      title={<p>Edit Product</p>}
      visible={open}
      footer={[
        <Button key="cancel" onClick={() => setOpen(false)}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={() => { form.submit(); showLoading(); }} loading={loading}>
          Save Product
        </Button>
      ]}
      onCancel={() => setOpen(false)}
    >
      <Form
        form={form}
        name="edit-product-form"
        onFinish={(values) => {
          onSave(values);  // Handle the form submission
        }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        initialValues={{
          variant: product?.product_type || 'physical',
        }}
      >
        {/* Product Type Selection */}
        <Form.Item
          label="Product Type"
          name="product_type"
          rules={[{ required: true, message: 'Please select a product type!' }]}
        >
          <Segmented
            options={[
              { label: 'Physical', value: 'physical' },
              { label: 'Digital', value: 'digital' },
              { label: 'Affiliate', value: 'affiliate' },
            ]}
            value={productType}
            onChange={(value) => setProductType(value)}
          />
        </Form.Item>

        {/* Category Selection */}
        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: 'Please select a category!' }]}
        >
          <Select placeholder="Select a category" allowClear>
            {categories?.map((category) => (
              <Select.Option key={category.key} value={category.key}>
                {category.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Product Name */}
        <Form.Item
          label="Product Name"
          name="name"
          rules={[{ required: true, message: 'Product Name is required!' }]}
        >
          <Input />
        </Form.Item>

        {/* SKU */}
        <Form.Item
          label="SKU"
          name="sku"
          rules={[{ required: true, message: 'SKU is required!' }]}
        >
          <Input />
        </Form.Item>

        {/* Price */}
        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: 'Price is required!' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        {/* Stock Level */}
        <Form.Item
          label="Stock Level"
          name="stock_level"
          rules={[{ required: true, message: 'Stock level is required!' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        {/* Discount */}
        <Form.Item label="Discount %" name="discount">
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        {/* Availability */}
        <Form.Item
          label="Availability"
          name="availability"
          rules={[{ required: true, message: 'Please select availability!' }]}
        >
          <Radio.Group>
            <Radio value="In Stock">In Stock</Radio>
            <Radio value="Out of Stock">Out of Stock</Radio>
          </Radio.Group>
        </Form.Item>

        {/* Description */}
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Description is required!' }]}
        >
          <Input.TextArea />
        </Form.Item>

        {/* For Digital and Affiliate Products */}
        {(productType === 'digital' || productType === 'affiliate') && (
          <Form.Item
            label="Link"
            name="link"
            rules={[{ required: true, message: 'Link is required!' }]}
          >
            <Input />
          </Form.Item>
        )}

        {/* For Digital Products: File Type */}
        {productType === 'digital' && (
          <Form.Item
            label="File Type"
            name="file_type"
            rules={[{ required: true, message: 'Please select a file type!' }]}
          >
            <Select placeholder="Select file type" allowClear>
              {fileTypes?.map((fileType) => (
                <Select.Option key={fileType.key} value={fileType.key}>
                  {fileType.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {/* For Affiliate Products: Commission Percentage */}
        {productType === 'affiliate' && (
          <Form.Item
            label="Commission %"
            name="commission_percentage"
            rules={[{ required: true, message: 'Commission percentage is required!' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        )}

        {/* For Affiliate Products: Affiliate Program */}
        {productType === 'affiliate' && (
          <Form.Item
            label="Affiliate Program"
            name="affiliate_program"
            rules={[{ required: true, message: 'Please select an affiliate program!' }]}
          >
            <Select placeholder="Select an affiliate program" allowClear>
              {affiliatePrograms?.map((program) => (
                <Select.Option key={program.key} value={program.key}>
                  {program.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {/* Submit Button */}
        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save Product
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductEditModal;