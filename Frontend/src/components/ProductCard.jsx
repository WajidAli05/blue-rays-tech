import React from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Card, Divider } from 'antd';
const { Meta } = Card;

const ProductCard = ({ product, onDelete }) => {
  return (
    <Card
      className="product-card"
      hoverable
      cover={<img alt={product.name} src={!product.image_link || product.image_link.length === 0 ? 
                                           'http://localhost:3001/placeholder.jpg' : 
                                           product.image_link[0]
      } />}
    >
    <Meta
      title={product.name}
      description={
        product.description
          ? product.description.split(/\s+/).slice(0, 20).join(' ') +
            (product.description.split(/\s+/).length > 20 ? '...' : '')
          : ''
      }
    />
      <Divider plain><p>Details</p></Divider>

      <div className="product-detailed-info" style={{ marginTop: '16px' }}>
        {/* Display all props that haven't been shown yet */}
        <div>
          <small>Category</small>
          <Divider type="horizontal" />
          <p>{product.category}</p>
        </div>

        <Divider type="vertical" style={{ height: '100%' }} />

        {/* Brand */}
        <div>
          <small>Brand</small>
          <Divider type="horizontal" />
          <p>{product.brand}</p>
        </div>

        <Divider type="vertical" style={{ height: '100%' }} />

        {/* Availability */}
        <div>
          <small>Availability</small>
          <Divider type="horizontal" />
          <p>{product.availability}</p>
        </div>

        <Divider type="vertical" style={{ height: '100%' }} />

        {/* Discount */}
        <div>
          <small>Discount</small>
          <Divider type="horizontal" />
          <p>{product.discount != null ? product.discount.toFixed(0) : 0}%</p>
        </div>

        <Divider type="vertical" style={{ height: '100%' }} />

        {/* Product Type */}
        <div>
          <small>Product Type</small>
          <Divider type="horizontal" />
          <p>{product.product_type}</p>
        </div>

        <Divider type="vertical" style={{ height: '100%' }} />

        {/* sku */}
        <div>
          <small>SKU</small>
          <Divider type="horizontal" />
          <p>{product.sku}</p>
        </div>

        <Divider type="vertical" style={{ height: '100%' }} />

        {/* Added at */}
        <div>
          <small>Added at</small>
          <Divider type="horizontal" />
          <p>{new Date(product.createdAt).toLocaleDateString()}</p>
        </div>

        <Divider type="vertical" style={{ height: '100%' }} />

        {/* Total units sold */}
        <div>
          <small>Total units sold</small>
          <Divider type="horizontal" />
          <p>{product.units_sold}</p>
        </div>

        {product.product_type === 'digital' && (
                  <div>
                    <small>Link</small>
                    <Divider type="horizontal" />
                    <p>{product.link}</p>
                </div>
        )}
        {product.product_type === 'digital' && (
                  <div>
                    <small>File Type</small>
                    <Divider type="horizontal" />
                    <p>{product.file_type}</p>
                </div>
        )}
        {product.product_type === 'affiliate' && (
                  <div>
                    <small>Commission</small>
                    <Divider type="horizontal" />
                    <p>{product.commission_percentage}%</p>
                </div>
        )}
        {product.product_type === 'affiliate' && (
                  <div>
                    <small>Program</small>
                    <Divider type="horizontal" />
                    <p>${product.affiliate_program}</p>
                </div>
        )}

        <Divider type="vertical" style={{ height: '100%' }} />
      </div>
    </Card>
  );
};

export default ProductCard;