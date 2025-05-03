import React from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Card, Rate, Divider } from 'antd';
const { Meta } = Card;

const ProductCard = ({ product }) => {
  return (
    <Card
      className="product-card"
      hoverable
      cover={<img alt={product.name} src={product.image_link} />}
      actions={[
        <EditOutlined key="edit" />,
        <DeleteOutlined key="delete" />,
      ]}
    >
        
      <Meta title={product.name} description={product.description} />

      {/* divider */}
      <Divider plain><p>Details</p></Divider>

      <div className="product-detailed-info" style={{ marginTop: '16px' }}>
        {/* Display all props that haven't been shown yet */}
        
        {/* Category */}
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
          <p>{(product.discount * 100).toFixed(0)}%</p>
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

        {/* Average Rating */}
        <div>
          <small>Average Rating</small>
          <Divider type="horizontal" />
          <p>{product.average_rating} <Rate allowHalf disabled value={product.average_rating} /></p>
        </div>

        <Divider type="vertical" style={{ height: '100%' }} />

        {/* Total Sales Revenue */}
        <div>
          <small>Total Sales Revenue</small>
          <Divider type="horizontal" />
          <p>${product.total_sales_revenue}</p>
        </div>

        <Divider type="vertical" style={{ height: '100%' }} />
      </div>
    </Card>
  );
};

export default ProductCard;
