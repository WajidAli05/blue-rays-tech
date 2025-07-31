import React from 'react';
// import { CiEdit } from "react-icons/ci";
// import { MdDeleteOutline } from "react-icons/md";

const ProductListItem = ({ product }) => {
  return (
    <ul className="product-list">
      {/* Single Product Item */}
      <li key={product._id}>
        <div className='checkbox-image-container'>
          <img
            src={`http://localhost:3001/${
                                           !product.image_link?.[0] ? 
                                           'placeholder.jpg' : 
                                           product.image_link[0]
             }`}
            alt={`${product.name ?? 'Product'} image`}
          />
        </div>
        <div>
          <div>{product.name ?? 'Product'}</div>
          <small>{product.category ?? 'Category'}</small>
        </div>
        <div>
          <div>{`Price: $${product.price ?? 0}`}</div>
          <small>Stock: {product.stock_level ?? 0}</small>
        </div>
        <div>
          <div>{`Sales: $${product.total_sales_revenue ?? 0}`}</div>
          <small>{`Discount: ${product.discount != null ? product.discount.toFixed(0) : 0}%`}</small>
        </div>
        <div>
          <div>{`Added On: ${new Date(product.createdAt).toLocaleDateString() ?? 'Unknown'}`}</div>
          <small>{`Last Updated On: ${new Date(product.updatedAt).toLocaleDateString() ?? 'Unknown'}`}</small>
        </div>
        <div>
          <div>{`Product Type: ${product.product_type ?? 'Unknown'}`}</div>
          <small>{`Sub Category: ${product.sub_category ?? 'Unknown'}`}</small>
        </div>
        {/* TODO: */}
        {/* <div className="actions-container"> */}
          {/* Edit Button */}
          {/* <button className='action-btn edit-btn'>
            <CiEdit onClick={() => onEdit(product._id)} />    
          </button>               */}

          {/* Delete Button */}
          {/* <button className='action-btn delete-btn'>
            <MdDeleteOutline onClick={() => onDelete(product._id)} />
          </button> */}
        {/* </div> */}
      </li>
    </ul>
  );
};

export default ProductListItem;
