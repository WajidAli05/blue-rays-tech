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
                                           'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAwFBMVEXZ5Oj///8UHzh509O9yc0AACng7O9XX2wGFjIAACW8xsvb5+qnqK4AEzFlaHTe6e0ACCyPmKB1fYcAACEAABzQ2t/09PWIi5O1wcUNEjB82dh0ystDdH0AACQAABqOkZrD0NNMVWPm5+m7vcPS09cAABecpq4lL0UYIzxSjpUSGzY3P1KytLoNEjHb3N9Oh495go1wdH9DSVo4QVQsM0hVW2kgNUhXl50/bng3X2xotbhsu76ksLYeMUZdoaUAABELADUDAAAIiUlEQVR4nO3da3uiOBQAYKFyExEs3tqpDmqLDrVdL+1cdtzd//+vFjvVhEsgQAKJT87XmWfgnRNOEJJDSyoQj92x9rySKYTTL3IehaKF+xdHG81xFUsPaABl2f3asPC192RYdGy0iVjC13eXLo8mEUc4ftKp++gR84WLN6UOHzVirnDj1pJAesQ8YXdWm48SMUfoD+oEUiFmCze1ZvAUA+LETOFjAqhbikE4YvMQ8SxmCUexG5hAceZbf9IhGu1ejEg6i1lCLXLswDj4LdW2TbKh3sZvJghnMUPYiVQZZ3VU7Rb5sBNCwsQM4Qoeo9OdScOXKiRLRAu7BnxMX6XiSxcSJaKFQVAHMF1IstwghcspOJ4xpgZECAlmESl8B7ej+pweECUkl0WUcORC/59Ds34hsSyihBtQZ5wtxRSihaSyiBLuwHEVmimMCL+/UMgiSri+VFL9nWYKYeHLw48peSJCOAK/6xWfzlSfFN493H8ziBMRwldQaFyP5iCNCe+/uaSJCOESKjRUB2lMeBPPYvVygxCCUhocahXeEM8iQti9XIdUp/sUIfEs5gu1moUhkWhFZVBIOIssChPESllkUkh0oLIpJJlFRoUEJw1WheTKDbNCYllkV3hz/xeRLDIsDIkkKirLwmQWy6zYYFqYIJbJIttCEllkXEig3LAuTJabollkXlh5oLIvrDppMCX8mSqsmMXmhduLUP+VLkxOGkWIzQvHzvlQwXeEsFIWmxf64OFzgABWymLjQvMIzl35G5XECllsXuiBU39JL6bViI0LW8Pny0ugYI0Wlp76GRDCL/J+ZBKjy0Axs8iAEC41KzSwbBabF3reGpx01pVY8lpkQQgNU3mKLqcpRJwsMiBsT+DrS/lNOIssCD0NWmgdvBTKYj6xeeGw3Z7AZx1kFtTiRCaE3q0Dn7Ty6wvBSYMJYbu9jqzVvVN+/r4PA5PoMy5snYTH6EwXGv95+Pfv319S4+bhrgCREaG3jV5dp4qjIJeU38X+buZAZUDofRB7jlw+ZhlEBoQfF2Lbm1chZgxUBoQfwzQkvlfZX4UmsiD0Pom7+LVIhMiC8M8wDYl9p8Iusqclu8JzEtve5KCU3oWrdBkWnpN4SqPslDQyLTQ9QGyPV0qpscq08FxOP42+ZhlO4U3jjAuHbTg87zjuHdaWk7/zLeBFCI3TM9Jrdya50Z4HnAhBPS0W3lznRtjK5/AuLEXkS1hmoHImLEHkTWgO8018C1uF08ih0Cxm5FB4MhYYq1wKT8jhEDOTvAo/Y5gfrXeuhRihakIohELYdAihEAph8yGEQiiEzYcQCqEQNh9CKIRC2HzULTRtFecBWc7jM9XGb2pUr9BUvf58rbjVQlnP+56Ka6xVqHbmg+LrC5IR6M5g3sE9aI1Ce0uwLbbubvEajNUoNPdk+5ore8aEZqW1k2nhzHGyWJtQ3ZHvTK/scA5ck9A+uulnWSncY34W6xKaKxrf9QhW+XNGTULbr7L0FR1GfsfGmoTqns7nE/R9/qHrEQ6hMhMYg2oBrcWTlSEbQhPathQEy1G1WEI9qI1J3pVYj9D2wVzoLtL/vQIBNRbNb51ak7APegbsKwMl6XBJotNnTmj1CAjBxxKEUAiFUAiFUAiFUAiFUAiFUAiFUAiFUAiZECKeWl2PcDF4vG7hwrKer1q4sHR5mnpSVyJcfDSHcEdXK/wDlK3dtQoX5/YeacXmGoQXoKynFJsrEC4s8HoppdjwL1xEOtAoiWLDvRDO4EmRKDa8CxfxHkKJYsOjcHkAQCu+bCNRbDgULmfO+c1pIoNystjwJ1zOwnPdI4HhH0aLDXfC5ccn2j+I6cB4seFNuPz8Bn1IRABleRYpNpwJz8Dwz+bItWHRYsOXEADDfwm9+C1SbLgSwsDMgH9G8STEBkZ+RnEkxAdG7mz4EZ7mQewI3vgTFgLKsnE5QV6ERYbonzM8FxtOhIWB4M6GD2FxICg2XAg3/1nFw3njR/j63isT2pIbYbUQQiGkKgwCAkKdvXXeR7DfwhlXBoJv6clK7s6nmvZbtKFNQc5qO64S2xW0PcXw2Nhv0bLhb6gEllMl4IeNwZqZfU/gQ5tEw7plZd+T2aax/TD84d/O3Z5X1/5DtUcjiVYP48h17bAclv2gQUYEzpCZHZZ0tsm6G4ytzvXt5VaPA7JZDAZHrOPWtx9fnegkr0VLn+Adts6eCsOeS8poub0hcz0VTkfr9AzDKfHTN/ZD2DB6uG0x6u7eYqqtSX97Wy22/UkLu7VJAx14TLt64HenET2GhFAIWQghFEIhbD6EUAg/hHOmhaW/UbK5CIMD00LQCMXYFBIuwUNeh2kheH5sFPsOKdQGx8198NxcmB50nq+FhCOQw/xGP82F7YMcJheMZwol8KBef2d3mEKFJlgjJCjhDjxzUTCeWzYTJtRlLHX7TZZwA5WaLatJhF+YoEopUjiCHvG6jCbR9KA1LambxLKEEvgYFrOTPnQVhtUCBUEKl1Pw/2MwOU7VLfRmdoqYDTOEEtT7TnZ99oiqD11IGQsI0MIu3NDS7bNGVPvwyyADcVOaKZQiC8+nO5Olid82d3ACghWakSHsRFbfOaujyorRVo+rSN/iQaeUUNIib1oC4+C3VNs2mw3bVlv+wYi8y7O0DEWWcBTbhRUojvbVn3SajIn/VXOU2HlZqLkwTyg9JhYy646S/71zqqE4iYa3iM4FOEKpW2ytdjMxQ92v4Qglv8Ra35pjhp4ocITsZzEPmCsM797oNHomEzrq2UUBobR4I99RnlQob/l9i/OFkjSe0Vm3VjWsGc5aTxyhtNCILbMgF5arYTWexhJK0mvvSWHpetSVpx7i2VpJYXiD090rrmIR+MxKtQh0KzyPfTfrNqac8IR87I6151WjwNWzNu4+YvPC+B9ZnL+W3hhUhQAAAABJRU5ErkJggg==' : 
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