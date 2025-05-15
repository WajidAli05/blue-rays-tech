import React from 'react';
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";

const ProductListItem = ({ product, onEdit, onDelete }) => {
  return (
    <ul className="product-list">
      {/* Single Product Item */}
      <li key={product.product_id}>
        <div className='checkbox-image-container'>
          <input type="checkbox" defaultUnchecked className="checkbox checkbox-md" />
          <img src={`http://localhost:3001/${product.image_link[0]}`} alt={`${product.name} image`} />
        </div>
        <div>
          <div>{product.name}</div>
          <small>{product.category}</small>
        </div>
        <div>
          <div>{`Price: $${product.price}`}</div>
          <small>Stock: {product.stock_level}</small>
        </div>
        <div>
          <div>{`Sales: $${product.total_sales_revenue}`}</div>
          <small>{`Discount: ${(product.discount ).toFixed(0)}%`}</small>
        </div>
        <div className="actions-container">
          {/* Edit Button */}
          <button className='action-btn edit-btn'>
            <CiEdit onClick={() => onEdit(product.product_id)} />    
          </button>              

          {/* Delete Button */}
          <button className='action-btn delete-btn'>
            <MdDeleteOutline onClick={() => onDelete(product.product_id)} />
          </button>
        </div>
      </li>
    </ul>
  );
};

export default ProductListItem;
