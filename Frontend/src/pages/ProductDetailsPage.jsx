import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumb, Row, Col, Button, Rate, Card, Typography, Divider, Image, Descriptions, Spin } from 'antd';
import NavBar from '../components/NavBar';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const ProductDetailsPage = () => {
  const { sku } = useParams();
  const [p, setP] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3001/api/v1/product/${sku}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) {
          const product = data.data;
          setP(product);
          if (product.image_link?.length > 0) {
            setSelectedImage(`http://localhost:3001/${product.image_link[0].replace(/\\/g, '/')}`);
          }
        }
      })
      .catch((error) => console.error('Error fetching product data:', error));
  }, [sku]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleDelete = () => {
    alert('Product deleted');
  };

  const handleEdit = () => {
    alert('Product edit mode');
  };

  if (!p) return <Spin tip="Loading product..." fullscreen />;

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
            src={selectedImage}
            alt={p.name}
            preview={{ visible: previewVisible, onVisibleChange: setPreviewVisible }}
            onClick={() => setPreviewVisible(true)}
          />
          <Row gutter={16} style={{ marginTop: '15px' }}>
            {p.image_link?.map((imagePath, index) => (
              <Col key={index}>
                <Image
                  width={60}
                  height={60}
                  src={`http://localhost:3001/${imagePath.replace(/\\/g, '/')}`}
                  alt={`product-thumbnail-${index}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleImageClick(`http://localhost:3001/${imagePath.replace(/\\/g, '/')}`)}
                />
              </Col>
            ))}
          </Row>
        </Col>

        {/* Product Info */}
        <Col xs={24} sm={12} lg={14}>
          <Card bordered={false}>
            <Title level={2}>{p.name}</Title>
            <Paragraph strong style={{ fontSize: 24, color: '#ff4d4f' }}>
              ${p.price.toFixed(2)}
              {p.discount > 0 && (
                <span style={{ textDecoration: 'line-through', marginLeft: '10px', fontSize: 18 }}>
                  ${(p.price / (1 - p.discount / 100)).toFixed(2)}
                </span>
              )}
            </Paragraph>
            <Paragraph type="secondary">Category: {p.category}</Paragraph>
            <Paragraph type="secondary">Availability: {p.availability} ({p.stock_level} units available)</Paragraph>
            <Rate disabled allowHalf defaultValue={p.average_rating || 0} />
            <Paragraph>{p.reviews_count} reviews</Paragraph>

            <Divider />
            <Title level={4}>Product Specifications</Title>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Brand">{p.brand}</Descriptions.Item>
              <Descriptions.Item label="Product Type">{p.product_type}</Descriptions.Item>
              <Descriptions.Item label="SKU">{p.sku}</Descriptions.Item>
              <Descriptions.Item label="Units Sold">{p.units_sold}</Descriptions.Item>
              <Descriptions.Item label="Total Sales Revenue">${p.total_sales_revenue.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="Profit Margin">{(p.profit_margin * 100).toFixed(2)}%</Descriptions.Item>
              <Descriptions.Item label="Gross Profit">${p.gross_profit.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="Click-through Rate">{(p.click_through_rate * 100).toFixed(2)}%</Descriptions.Item>
            </Descriptions>

            <Row gutter={16} style={{ marginTop: '20px' }}>
              <Col>
                <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>Edit Product</Button>
              </Col>
              <Col>
                <Button type="primary" danger icon={<DeleteOutlined />} onClick={handleDelete}>Delete Product</Button>
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
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetailsPage;