import React, { useState } from 'react';
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
    const [origianlProducts , setOrigianlProducts] = useState([
        // Physical Products
        {
            product_id: 1,
            name: "Smartphone",
            category: "Electronics",
            product_type: "physical",
            sku: "SKU12345",
            brand: "TechCo",
            price: 699.99,
            stock_level: 150,
            units_sold: 350,
            total_sales_revenue: 244996.50,
            description: "Latest model with advanced features",
            availability: "In Stock",
            discount: 0.1,
            profit_margin: 0.25,
            gross_profit: 174.99,
            click_through_rate: 0.15,
            reviews_count: 1200,
            average_rating: 4.5,
            image_link: "https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
        },
        {
            product_id: 2,
            name: "Wireless Headphones",
            category: "Electronics",
            product_type: "physical",
            sku: "SKU67890",
            brand: "AudioWave",
            price: 199.99,
            stock_level: 200,
            units_sold: 1200,
            total_sales_revenue: 239988.00,
            description: "High-quality wireless sound",
            availability: "In Stock",
            discount: 0.15,
            profit_margin: 0.35,
            gross_profit: 69.99,
            click_through_rate: 0.12,
            reviews_count: 500,
            average_rating: 4.7,
            image_link: "https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
        },
    
        // Digital Products
        {
            product_id: 3,
            name: "Ebook: Python Programming",
            category: "Books & Education",
            product_type: "digital",
            sku: "SKU11223",
            brand: "LearnTech",
            price: 29.99,
            stock_level: 0, // No stock, because it's a digital product
            units_sold: 3000,
            total_sales_revenue: 89970.00,
            description: "Master Python programming from scratch",
            availability: "In Stock",
            discount: 0.25,
            profit_margin: 0.85,
            gross_profit: 25.50,
            click_through_rate: 0.2,
            reviews_count: 250,
            average_rating: 4.8,
            image_link: "https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp",
            link: "https://learntech.com/python-ebook",  // Digital product link
            file_type: "PDF"
        },
        {
            product_id: 4,
            name: "Online Course: Web Development Bootcamp",
            category: "Education",
            product_type: "digital",
            sku: "SKU33445",
            brand: "CodeAcademy",
            price: 99.99,
            stock_level: 0,
            units_sold: 2000,
            total_sales_revenue: 199980.00,
            description: "Complete bootcamp to become a web developer",
            availability: "In Stock",
            discount: 0.2,
            profit_margin: 0.80,
            gross_profit: 80.00,
            click_through_rate: 0.18,
            reviews_count: 750,
            average_rating: 4.9,
            image_link: "https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp",
            link: "https://codeacademy.com/web-development-course",  // Digital product link
            file_type: "Video"
        },
    
        // Affiliate Products
        {
            product_id: 5,
            name: "Fitness Tracker Watch",
            category: "Sports & Outdoors",
            product_type: "affiliate",
            sku: "SKU55678",
            brand: "FitTech",
            price: 149.99,
            stock_level: 0, // Affiliate products don't have stock
            units_sold: 300,
            total_sales_revenue: 44997.00,
            description: "Track your daily fitness goals with advanced features",
            availability: "In Stock",
            discount: 0.1,
            profit_margin: 0.2,
            gross_profit: 30.00,
            click_through_rate: 0.25,
            reviews_count: 450,
            average_rating: 4.4,
            image_link: "https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp",
            affiliate_program: "FitTech Affiliate Program",
            commission_percentage: 20
        },
        {
            product_id: 6,
            name: "Portable Solar Charger",
            category: "Outdoors",
            product_type: "affiliate",
            sku: "SKU66789",
            brand: "SolarTech",
            price: 89.99,
            stock_level: 0, // Affiliate products don't have stock
            units_sold: 500,
            total_sales_revenue: 44995.00,
            description: "Eco-friendly solar charger for outdoor adventures",
            availability: "In Stock",
            discount: 0.15,
            profit_margin: 0.25,
            gross_profit: 22.50,
            click_through_rate: 0.18,
            reviews_count: 350,
            average_rating: 4.6,
            image_link: "https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp",
            affiliate_program: "SolarTech Affiliate Program",
            commission_percentage: 15
        }
    ]);
    const [products, setProducts] = useState(origianlProducts);

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
    const updatedProducts = products.filter(product => product.product_id !== productId);
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
    setProducts(origianlProducts);
  } else {
    const filteredProducts = origianlProducts.filter(product => product.product_type === productType);
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
                 {/* select all products checkbox */}
                 <div>
                    <input type="checkbox" defaultChecked={false} className="checkbox checkbox-md" />
                    <span>Select All</span>
                </div>

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
                    <Button color="danger" variant="solid" ><DeleteOutlined /> Delete Selected </Button>
                </div>
               
                </div>
                {viewType === 'card' && (
                    <div className='product-card-container'>
                        {/* // Products view for admin in both card and table format */}
                        {products.map((product)=> (
                            <Link to={`/${product.sku}`} key={product.product_id}>
                                <ProductCard key={product.product_id} product={product} onEdit={handleEdit} onDelete={handleDelete}  />
                            </Link>
                        ))}
                    </div>
                )}
                {viewType === 'list' && (
                    <div className='product-list-container'>
                        {products.map((product) => (
                            <Link to={`/${product.sku}`} key={product.product_id}>
                                <ProductListItem
                                    key={product.product_id}
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