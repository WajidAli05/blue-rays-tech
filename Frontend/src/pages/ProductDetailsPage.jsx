// import React from 'react';
// import { useParams, Link } from 'react-router-dom';
// import NavBar from '../components/NavBar';
// import { Breadcrumb } from 'antd';

// const ProductDetailsPage = () => {
//   const { sku } = useParams();

//   return (
//     <div>
//       <NavBar />
//       <Breadcrumb
//         items={[
//           {
//             title: <Link to='/'><span className='breadcrum-title'>Home</span></Link>,
//           },
//           {
//             title: <a href='/add-product'><span className='breadcrum-title'>Add Product & Product Listing</span></a>,
//           },
//           {
//             title: <span className='breadcrum-title'>Product Details</span>,
//           },
//         ]}
//       />
//     </div>
//   );
// };

// export default ProductDetailsPage;`

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumb, Row, Col, Button, Rate, Card, Typography, Divider, InputNumber, Image, Descriptions } from 'antd';
import NavBar from '../components/NavBar';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const ProductDetailsPage = () => {
  const { sku } = useParams();

  // Placeholder product data (you can fetch this data based on `sku`)
  const product = {
    name: "Smartphone",
    category: "Electronics",
    sku: 'SKU00112',
    price: 699.99,
    discount: 0.1,
    availability: "In Stock",
    stockLevel: 150,
    description: "Latest model with advanced features, offering a high-resolution camera, long-lasting battery, and seamless user experience.",
    rating: 4.5,
    reviewsCount: 1200,
    imageLink: "https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp",
    images: [
      "https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp",
      "https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp",
      "https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
    ],
    specifications: {
      brand: "TechCo",
      productType: "Physical",
      sku: "SKU12345",
      unitsSold: 350,
      totalSalesRevenue: 244996.50,
      profitMargin: 25,
      grossProfit: 174.99,
      clickThroughRate: 0.15,
    },
  };

  const [selectedImage, setSelectedImage] = useState(product.imageLink);
  const [previewVisible, setPreviewVisible] = useState(false);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handlePreviewClose = () => {
    setPreviewVisible(false);
  };

  const handleDelete = () => {
    // Handle delete product
    alert('Product deleted');
  };

  const handleEdit = () => {
    // Handle edit product
    alert('Product edit mode');
  };

  return (
    <div>
      {/* Header and Navigation */}
      <NavBar />
      <Breadcrumb
        items={[
          {
            title: <Link to='/'><span className='breadcrum-title'>Home</span></Link>,
          },
          {
            title: <Link to='/admin/products'><span className='breadcrum-title'>Product Management</span></Link>,
          },
          {
            title: <span className='breadcrum-title'>{product.name}</span>,
          },
        ]}
      />

      {/* Main Product Details Section */}
      <Row gutter={24} style={{ padding: '20px 50px' }}>
        {/* Product Image */}
        <Col xs={24} sm={12} lg={10}>
          <Image
            width="100%"
            src={selectedImage}
            alt={product.name}
            preview={{ visible: previewVisible, onVisibleChange: setPreviewVisible }}
            onClick={() => setPreviewVisible(true)}
          />
          <Row gutter={16} style={{ marginTop: '15px' }}>
            {product.images.map((image, index) => (
              <Col key={index}>
                <Image
                  width={60}
                  height={60}
                  src={image}
                  alt={`product-thumbnail-${index}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleImageClick(image)}
                />
              </Col>
            ))}
          </Row>
        </Col>

        {/* Product Information */}
        <Col xs={24} sm={12} lg={14}>
          <Card bordered={false}>
            <Title level={2}>{product.name}</Title>
            <Paragraph strong style={{ fontSize: 24, color: '#ff4d4f' }}>
              ${product.price.toFixed(2)}
              {product.discount > 0 && (
                <span style={{ textDecoration: 'line-through', marginLeft: '10px', fontSize: 18 }}>
                  ${ (product.price / (1 - product.discount)).toFixed(2) }
                </span>
              )}
            </Paragraph>
            <Paragraph type="secondary">Category: {product.category}</Paragraph>
            <Paragraph type="secondary">Availability: {product.availability} ({product.stockLevel} units available)</Paragraph>
            <Rate disabled defaultValue={product.rating} />
            <Paragraph>{product.reviewsCount} reviews</Paragraph>

            {/* Product Management Controls */}
            <Row gutter={16} style={{ marginTop: '20px' }}>
              <Col>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                >
                  Edit Product
                </Button>
              </Col>
              <Col>
                <Button
                  type="danger"
                  icon={<DeleteOutlined />}
                  onClick={handleDelete}
                >
                  Delete Product
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Product Specifications */}
      <Row gutter={24}>
        <Col span={24}>
          <Card title="Product Specifications" bordered={false}>
            <Descriptions bordered>
              <Descriptions.Item label="Brand">{product.specifications.brand}</Descriptions.Item>
              <Descriptions.Item label="Product Type">{product.specifications.productType}</Descriptions.Item>
              <Descriptions.Item label="SKU">{product.specifications.sku}</Descriptions.Item>
              <Descriptions.Item label="Units Sold">{product.specifications.unitsSold}</Descriptions.Item>
              <Descriptions.Item label="Total Sales Revenue">${product.specifications.totalSalesRevenue.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="Profit Margin">{product.specifications.profitMargin}%</Descriptions.Item>
              <Descriptions.Item label="Gross Profit">${product.specifications.grossProfit.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="Click-through Rate">{(product.specifications.clickThroughRate * 100).toFixed(2)}%</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Product Description */}
      <Row gutter={24}>
        <Col span={24}>
          <Card title="Product Description" bordered={false}>
            <Paragraph>{product.description}</Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetailsPage;