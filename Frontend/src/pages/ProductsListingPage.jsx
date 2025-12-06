import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import NavBar from '../components/NavBar';
import {
    Button,
    Typography,
    Divider,
    Space, 
    Switch,
    Breadcrumb,
    message,
    Menu
} from 'antd';
import ProductListItem from '../components/ProductListItem';
import {Link} from 'react-router-dom';
import { 
  UnorderedListOutlined, 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  DeleteOutlined, 
  ClearOutlined, 
  ProductOutlined, 
  FileOutlined, 
  LinkOutlined } from '@ant-design/icons';
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const { Title } = Typography;

// For producy type menu
const items = [
  {
    key: 'product-type',
    label: 'Product Type',
    icon: <UnorderedListOutlined />,
    children: [
      { key: 'clear', label: 'Clear', icon: <ClearOutlined /> },
      { key: 'physical', label: 'Physical', icon: <ProductOutlined /> },
      { key: 'digital', label: 'Digital', icon: <FileOutlined /> },
      { key: 'affiliate', label: 'Affiliate', icon: <LinkOutlined /> },
    ],
  },
];

const ProductsListingPage = () => { 

    // to modify the form based on product type selected
    const [viewType, setViewType] = useState('card');
    const [originalProducts, setOriginalProducts] = useState([]);
    const [products, setProducts] = useState(originalProducts);

    //fetch products from the API
    useEffect(() => {
        fetch(`${API_BASE_URL}/products`)
            .then((data)=> data.json())
            .then((data) => {
                setOriginalProducts(data.data);
                setProducts(data.data);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
                message.error('Failed to fetch products');
            }
        )
    }, []);

    //sort Products Highest Price First and Lowest Price First
    const sortProducts = (products, order) => {
        const sortedProducts = [...products].sort((a, b) => {
            if (order === 'high') {
                return b.price - a.price; // High to Low
            } else {
                return a.price - b.price; // Low to High
            }
        });
        setProducts(sortedProducts);
        message.success(`Products sorted by ${order === 'high' ? 'Highest Price First' : 'Lowest Price First'}`);
    };    

    const changeViewType = (value) => {
   setViewType(value ? 'list' : 'card');    
    }

      // Handle edit action
  const handleEdit = (productId) => {
    console.log('Edit product with ID:', productId);
  };

  const handleDelete = (productId) => {
    const updatedProducts = products.filter(product => product._id !== productId);
    if (updatedProducts.length !== products.length) {
        setProducts(updatedProducts);
        message.success('Product deleted successfully!');
    } else {
        message.error('Product not found!');
    }
};

const onClickProductTypeSelect = e => {
  const productType = e.key;
  if (productType === 'clear') {
    setProducts(originalProducts);
  } else {
    const filteredProducts = originalProducts.filter(
    product => product.product_type?.toLowerCase() === productType.toLowerCase()
    );
    setProducts(filteredProducts);
  }
};

    return (
        <div>
            <NavBar />
            <Breadcrumb
                separator='>'
                items={[
                {
                    title: <Link to='/'><span className='breadcrum-title'>Home</span></Link>,
                },
                {
                    title: <span className='breadcrum-title'>Product Management</span>,
                },
                ]}
            />

            <Divider plain style={{borderColor: 'white'}}><Title style={{color: 'white'}}>Product Listing</Title></Divider>

            <div>
                <div className='products-operation-div'>
                <div>
                    <Space direction="vertical">
                        <Switch
                        checkedChildren="List"
                        unCheckedChildren="Card"
                        defaultChecked={viewType === 'list'}
                        onChange={changeViewType} 
                        />
                    </Space>
                    {/* menu for selecting type of product: physical, digial and affiliate */}
                    <Menu className='product-type-menu' onSelect={onClickProductTypeSelect} mode="vertical" items={items} />
                    <Button color="primary" variant="filled" onClick={()=> sortProducts(products , 'high')} ><ArrowUpOutlined /> High Price First </Button>
                    <Button color="primary" variant="filled" onClick={()=> sortProducts(products , 'low')}><ArrowDownOutlined /> Low Price First </Button>
                </div>
               
                </div>

                {viewType === 'card' && (
                    <div className='product-card-container'>
                        {/* // Products view for admin in both card and table format */}
                        {products.map((product)=> (
                            <Link to={`/${product.sku}`} key={product._id}>
                                <ProductCard 
                                    product={product} 
                                    onEdit={handleEdit} 
                                    onDelete={handleDelete}  
                                />
                            </Link>
                        ))}
                    </div>
                )}
                {viewType === 'list' && (
                    <div className='product-list-container'>
                        {products.map((product) => (
                            <Link to={`/${product.sku}`} key={product._id}>
                                <ProductListItem
                                    product={product}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsListingPage;