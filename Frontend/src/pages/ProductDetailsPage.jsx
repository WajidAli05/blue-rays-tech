import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Breadcrumb, Row, Col, Button, Rate, Card, Typography, Divider, Image,
  Descriptions, Spin, message
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import NavBar from '../components/NavBar';
import EditProductModal from '../components/EditProductModal';
import DeleteProductConfirmModal from '../components/DeleteProductConfirmModal';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const { Title, Paragraph } = Typography;

const safeToFixed = (val, digits = 2) => typeof val === 'number' ? val.toFixed(digits) : '0.00';

const ProductDetailsPage = () => {
  const { sku } = useParams();
  const [p, setP] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!sku) {
      message.error("Invalid product identifier");
      return;
    }

    fetch(`${API_BASE_URL}/product/${sku}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) {
          const product = data.data;
          setP(product);

          if (product.image_link?.length > 0) {
            const firstImage = product.image_link[0];
            const imageURL = firstImage.startsWith('http')
              ? firstImage
              : `https://backend.blueraystechnologies.com/${firstImage.replace(/\\/g, '/')}`;
            setSelectedImage(imageURL);
          }
        } else {
          message.error(data.message || 'Product not found');
        }
      })
      .catch((error) => {
        console.error('Error fetching product data:', error);
        message.error('Failed to load product');
      });
  }, [sku]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleEdit = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

const handleDeleteConfirm = () => {
  setDeleteLoading(true);

  fetch(`${API_BASE_URL}/product/${sku}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
    },
  })
    .then(res => res.json())
    .then(result => {
      if (result.status) {
        message.success('Product deleted successfully');
        navigate('/products-listing');
      } else {
        message.error(result.message || 'Failed to delete product');
      }
    })
    .catch(error => {
      console.error('Delete error:', error);
      message.error('Something went wrong while deleting the product');
    })
    .finally(() => {
      setDeleteLoading(false);
      setDeleteModalOpen(false);
    });
};

  if (!p) {
    return (
      <div style={{ padding: 50 }}>
        <Spin tip="Loading product..." size="large" />
        <Paragraph>Fetching product details...</Paragraph>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <Breadcrumb
        separator=">"
        items={[
          { title: <Link to="/"><span className="breadcrum-title">Home</span></Link> },
          { title: <Link to="/add-product"><span className="breadcrum-title">Product Management</span></Link> },
          { title: <span className="breadcrum-title">{p.name}</span> },
        ]}
      />

      <Row gutter={24} style={{ padding: '20px 50px' }}>
        {/* Product Image */}
        <Col xs={24} sm={12} lg={10}>
          <Image
            width="100%"
            src={selectedImage || 'https://via.placeholder.com/400'}
            alt={p.name}
            preview={{ visible: previewVisible, onVisibleChange: setPreviewVisible }}
            onClick={() => setPreviewVisible(true)}
          />
          <Row gutter={16} style={{ marginTop: '15px' }}>
            {p.image_link?.map((imagePath, index) => {
              const imageURL = imagePath.startsWith('http')
                ? imagePath
                : `http://31.97.100.169:3001/${imagePath.replace(/\\/g, '/')}`;
              return (
                <Col key={index}>
                  <Image
                    width={60}
                    height={60}
                    src={imageURL}
                    alt={`product-thumbnail-${index}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleImageClick(imageURL)}
                  />
                </Col>
              );
            })}
          </Row>
        </Col>

        {/* Product Info */}
        <Col xs={24} sm={12} lg={14}>
          <Card bordered={false}>
            <Title level={2}>{p.name}</Title>
            <Paragraph strong style={{ fontSize: 24 }}>
              ${(p.price * (1 - p.discount / 100)).toFixed(2)}
              {p.discount > 0 && (
                <span style={{ textDecoration: 'line-through', marginLeft: '10px', fontSize: 18, color: '#ff4d4f' }}>
                  ${p.price.toFixed(2)}
                </span>
              )}
            </Paragraph>
            <Paragraph type="secondary">Category: {p.category}</Paragraph>
            <Paragraph type="secondary">Availability: {p.availability} ({p.stock_level} units available)</Paragraph>
            
            {/* TODO:  */}
            {/* <Rate disabled allowHalf defaultValue={p.average_rating || 0} />
            <Paragraph>{p.reviews_count} reviews</Paragraph> */}

            <Divider />
            <Title level={4}>Product Specifications</Title>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Brand">{p.brand}</Descriptions.Item>
              <Descriptions.Item label="Product Type">{p.product_type}</Descriptions.Item>
              <Descriptions.Item label="Availability">{p.availability}</Descriptions.Item>
              <Descriptions.Item label="SKU">{p.sku}</Descriptions.Item>
              <Descriptions.Item label="Units Sold">{p.units_sold ?? 0}</Descriptions.Item>
              <Descriptions.Item label="Sub Category">{p.sub_category}</Descriptions.Item>
              <Descriptions.Item label="Added On">{new Date(p.createdAt).toLocaleDateString()}</Descriptions.Item>
              <Descriptions.Item label="Last Updated">{new Date(p.updatedAt).toLocaleDateString()}</Descriptions.Item>
              <Descriptions.Item label="Discount Rate">
                {p.discount !== undefined ? `${(p.discount * 100).toFixed(2)}%` : 'N/A'}
              </Descriptions.Item>
            </Descriptions>

            <Row gutter={16} style={{ marginTop: '20px' }}>
              <Col>
                <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>Edit Product</Button>
              </Col>
              <Col>
                <Button type="primary" danger icon={<DeleteOutlined />} onClick={handleDeleteClick}>Delete Product</Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={24}>
        <Col span={24}>
          <Card title="Product Description" bordered={false}>
            <Paragraph>{p.description}</Paragraph>
            {p.product_type === 'affiliate' && p.affiliate_link && (
              <Button type="link" href={p.affiliate_link} target="_blank">
                View Affiliate Product
              </Button>
            )}
          </Card>
        </Col>
      </Row>

      <EditProductModal
        open={open}
        setOpen={setOpen}
        confirmLoading={confirmLoading}
        setConfirmLoading={setConfirmLoading}
        p={p}
        setP={setP}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />

      <DeleteProductConfirmModal
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        confirmLoading={deleteLoading}
      />
    </div>
  );
};

export default ProductDetailsPage;