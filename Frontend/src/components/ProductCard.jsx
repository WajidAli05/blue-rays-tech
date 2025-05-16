import React from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Card, Rate, Divider } from 'antd';
const { Meta } = Card;

const ProductCard = ({ product, onDelete }) => {
  return (
    <Card
      className="product-card"
      hoverable
      cover={<img alt={product.name} src={`http://localhost:3001/${product.image_link[0]}`} />}
      actions={[
        <EditOutlined key="edit" />,
        // Call onDelete when the delete icon is clicked
        <DeleteOutlined key="delete" onClick={() => onDelete(product.product_id)} />
      ]}
    >
      <Meta title={product.name} description={product.description} />

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

        {/* Click-through Rate */}
        <div>
          <small>Click-through Rate</small>
          <Divider type="horizontal" />
          <p>{(product.click_through_rate * 100).toFixed(2)}%</p>
        </div>

        <Divider type="vertical" style={{ height: '100%' }} />

        {/* Profit Margin */}
        <div>
          <small>Profit Margin</small>
          <Divider type="horizontal" />
          <p>{(product.profit_margin * 100).toFixed(0)}%</p>
        </div>

        <Divider type="vertical" style={{ height: '100%' }} />

        {/* Gross Profit */}
        <div>
          <small>Gross Profit</small>
          <Divider type="horizontal" />
          <p>${product.gross_profit}</p>
        </div>

        <Divider type="vertical" style={{ height: '100%' }} />

        {/* Reviews Count */}
        <div>
          <small>Reviews Count</small>
          <Divider type="horizontal" />
          <p>{product.reviews_count}</p>
        </div>

        <Divider type="vertical" style={{ height: '100%' }} />

        {/* Total Sales Revenue */}
        <div>
          <small>Total Sales Revenue</small>
          <Divider type="horizontal" />
          <p>${product.total_sales_revenue}</p>
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