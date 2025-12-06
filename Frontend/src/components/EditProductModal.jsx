import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Segmented, Select, Upload, Button, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditProductModal = ({ open, setOpen, confirmLoading, setConfirmLoading, p, setP, handleOk, handleCancel }) => {
  const [productType, setProductType] = useState(p.product_type);
  const [categories, setCategories] = useState([]);
  const [affiliatePrograms, setAffiliatePrograms] = useState([]);
  const [fileTypes, setFileTypes] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  const [form] = Form.useForm();

  // Prepare default fileList from existing image paths
  useEffect(() => {
    if (p?.image_link && Array.isArray(p.image_link)) {
      const formattedImages = p.image_link.map((url, index) => ({
        uid: `-${index}`, // negative to distinguish from new files
        name: url.split('/').pop(),
        status: 'done',
        url,
        thumbUrl: `http://31.97.100.169:3001/${url}`,
      }));
      setExistingImages(formattedImages);
    }
    form.setFieldsValue(p);
    setProductType(p.product_type);
  }, [p, form]);

  //fetch categories
  useEffect(() => {
    fetch(`${API_BASE_URL}/category`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.data)
      })
      .catch(() => message.error('Failed to fetch categories'));
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/affiliate-program`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => setAffiliatePrograms(data.data))
      .catch(() => message.error('Failed to fetch affiliate programs'));
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/file-types`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => setFileTypes(data.data))
      .catch(() => message.error('Failed to fetch file types'));
  }, []);

  const normFile = (e) => Array.isArray(e) ? e : e?.fileList;

  //form submission
const handleFormSubmit = (values) => {
  setSubmitting(true);
  const formData = new FormData();

  // Always include SKU to identify the product
  formData.append('sku', p.sku);

  Object.entries(values).forEach(([key, value]) => {
    if (key === 'upload') return; // handled separately
    if (value !== undefined) {
      formData.append(key, value);
    }
  });

  // Get Upload file list: mix of existing (url) + new (originFileObj)
  const currentFileList = values.upload || [];

  const retainedImagePaths = currentFileList
    .filter(file => file.url) // existing images
    .map(file => file.url.replace('http://31.97.100.169:3001/', ''));

  retainedImagePaths.forEach(path => {
    formData.append('retained_images[]', path);
  });

  currentFileList
    .filter(file => file.originFileObj) // new files
    .forEach(file => {
      formData.append('image_link', file.originFileObj);
    });

  fetch(`${API_BASE_URL}/product`, {
    method: 'PUT',
    body: formData,
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
    },
  })
    .then(res => res.json())
    .then((data) => {
      if (!data.status) {
        Modal.error({ title: 'Update Failed', content: data.message || 'Product update failed.' });
        return;
      }

      Modal.success({ title: 'Success', content: data.message || 'Product updated successfully!' });
      form.resetFields();
      setProductType('physical');
      setP(data.data);
      setOpen(false);

      if (deletedImages.length > 0) {
        return fetch(`${API_BASE_URL}/product/image`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ images: deletedImages }),
        })
          .then(res => res.json())
          .then(delData => {
            if (!delData.status) {
              console.error('Image deletion failed:', delData.message);
            }
            setDeletedImages([]);
          })
          .catch(err => {
            console.error("Failed to delete old images:", err);
          });
      } else {
        setDeletedImages([]);
      }
    })
    .catch(() => {
      Modal.error({ title: 'Server Error', content: 'Something went wrong. Please try again later.' });
    })
    .finally(() => {
      setSubmitting(false);
    });
};


  const handleRemove = (file) => {
  if (file?.url) {
    const relativePath = file.url.replace('http://31.97.100.169:3001/', '');
    setDeletedImages(prev => [...prev, relativePath]);
  }
};

  return (
    <Modal
      title="Edit Product"
      open={open}
      onOk={() => form.submit()}
      confirmLoading={submitting}
      onCancel={handleCancel}
    >
      <Form form={form} onFinish={handleFormSubmit} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
        <Form.Item label="Product Type" name="product_type">
          <Segmented
            block
            options={['physical', 'digital', 'affiliate']}
            value={productType}
            onChange={(val) => {
              setProductType(val);
              form.setFieldValue('product_type', val);
            }}
            disabled
          />
        </Form.Item>

        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Category" name="category" rules={[{ required: true }]}>
        <Select 
            options={categories.map(c => ({
            label: String(c.label), 
            value: String(c._id)
            }))} 
            placeholder="Select a category"
        />
        </Form.Item>

        <Form.Item label="SKU" name="sku">
          <Input disabled />
        </Form.Item>

        <Form.Item label="Brand" name="brand"><Input /></Form.Item>
        <Form.Item label="Price" name="price" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item>
        <Form.Item label="Stock Level" name="stock_level"><InputNumber style={{ width: '100%' }} /></Form.Item>
        <Form.Item label="Description" name="description"><Input.TextArea /></Form.Item>
        <Form.Item label="Availability" name="availability"><Input /></Form.Item>
        <Form.Item label="Discount" name="discount"><InputNumber style={{ width: '100%' }} /></Form.Item>

        {productType === 'digital' && (
          <>
        <Form.Item label="File Type" name="file_type">
            <Select 
                options={fileTypes.map(f => ({
                label: String(f.label), 
                value: String(f._id)
                }))} 
                placeholder="Select a file type"
            />
        </Form.Item>
            <Form.Item label="Upload" name="upload" valuePropName="fileList" getValueFromEvent={normFile}>
              <Upload
                listType="picture"
                defaultFileList={existingImages}
                beforeUpload={() => false}
                multiple
              >
                <Button icon={<PlusOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
          </>
        )}

        {productType === 'affiliate' && (
          <>
            <Form.Item label="Link" name="link"><Input /></Form.Item>
            <Form.Item label="Commission" name="commission"><InputNumber style={{ width: '100%' }} /></Form.Item>
            <Form.Item label="Affiliate Program" name="affiliate_program">
                <Select 
                    options={affiliatePrograms.map(p => ({
                    label: String(p.label), 
                    value: String(p._id)
                    }))} 
                    placeholder="Select an affiliate program"
                />
            </Form.Item>
          </>
        )}

        {productType === 'physical' && (
          <Form.Item label="Images" name="upload" valuePropName="fileList" getValueFromEvent={normFile}>
            <Upload
                listType="picture"
                defaultFileList={existingImages}
                beforeUpload={() => false}
                multiple
                onRemove={handleRemove}
            >
            <Button icon={<PlusOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default EditProductModal;