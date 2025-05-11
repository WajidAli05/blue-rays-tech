import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Input, Select, DatePicker, Button, Tag, Space, Modal, Divider, Typography, Breadcrumb } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import NavBar from '../components/NavBar';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title } = Typography;

const OrdersPage = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [originalOrders] = useState([
    {
      key: '1',
      orderId: 'ORD1001',
      customer: {
        name: 'Ahmed Al-Balushi',
        email: 'ahmed@example.com',
        phone: '+968-92123456',
      },
      products: ['Wireless Headphones (x1)'],
      totalAmount: 55.49,
      paymentStatus: 'Unpaid',
      shippingStatus: 'Pending',
      orderDate: '2025-05-10 09:45',
      orderSource: 'physical'
    },
    {
      key: '2',
      orderId: 'ORD1002',
      customer: {
        name: 'Sara Al-Kindi',
        email: 'sara@example.com',
        phone: '+968-95123456',
      },
      products: ['Photography Course (x1)'],
      totalAmount: 25.0,
      paymentStatus: 'Paid',
      shippingStatus: 'N/A',
      orderDate: '2025-05-09 16:30',
      orderSource: 'digital'
    },
    {
      key: '3',
      orderId: 'ORD1003',
      customer: {
        name: 'Khalid Al-Harthy',
        email: 'khalid@example.com',
        phone: '+968-98123456',
      },
      products: ['Amazon eGift Card (x2)'],
      totalAmount: 20.0,
      paymentStatus: 'Paid',
      shippingStatus: 'N/A',
      orderDate: '2025-05-08 12:15',
      orderSource: 'affiliate'
    },
     {
      key: '4',
      orderId: 'ORD1001',
      customer: {
        name: 'Ahmed Al-Balushi',
        email: 'ahmed@example.com',
        phone: '+968-92123456',
      },
      products: ['Wireless Headphones (x1)'],
      totalAmount: 55.49,
      paymentStatus: 'Unpaid',
      shippingStatus: 'Pending',
      orderDate: '2025-05-10 09:45',
      orderSource: 'physical'
    },
    {
      key: '5',
      orderId: 'ORD1002',
      customer: {
        name: 'Sara Al-Kindi',
        email: 'sara@example.com',
        phone: '+968-95123456',
      },
      products: ['Photography Course (x1)'],
      totalAmount: 25.0,
      paymentStatus: 'Paid',
      shippingStatus: 'N/A',
      orderDate: '2025-05-09 16:30',
      orderSource: 'digital'
    },
    {
      key: '6',
      orderId: 'ORD1003',
      customer: {
        name: 'Khalid Al-Harthy',
        email: 'khalid@example.com',
        phone: '+968-98123456',
      },
      products: ['Amazon eGift Card (x2)'],
      totalAmount: 20.0,
      paymentStatus: 'Paid',
      shippingStatus: 'N/A',
      orderDate: '2025-05-08 12:15',
      orderSource: 'affiliate'
    }
  ]);

  const [orders, setOrders] = useState(originalOrders);

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      render: (customer) => (
        <div>
          <strong>{customer.name}</strong>
          <div>{customer.email}</div>
          <div>{customer.phone}</div>
        </div>
      )
    },
    {
      title: 'Products',
      dataIndex: 'products',
      key: 'products',
      render: (products) => products.join(', ')
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => `OMR ${amount.toFixed(2)}`
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status) => <Tag color={status === 'Paid' ? 'green' : 'volcano'}>{status}</Tag>
    },
    {
      title: 'Shipping Status',
      dataIndex: 'shippingStatus',
      key: 'shippingStatus',
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button onClick={() => showOrderDetails(record)}>View</Button>
          <Button disabled={record.shippingStatus !== 'Pending'}>Mark Shipped</Button>
          <Button disabled={record.paymentStatus !== 'Paid'}>Refund</Button>
          <Button disabled={record.paymentStatus === 'Paid'} danger>Cancel</Button>
        </Space>
      )
    }
  ];

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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
              title: <span className='breadcrum-title'>Orders Management</span>,
            },
            ]}
        />
      <div className="orders-container">
        <Divider plain style={{borderColor: 'white'}}><Title style={{color: 'white'}}>Orders Management</Title></Divider>

        <Space className="orders-filters">
          <Input
            placeholder="Search by Order ID, Customer, or Product"
            prefix={<SearchOutlined />}
            className="orders-search-input"
          />
          <RangePicker />
          <Select placeholder="Order Status" className="orders-select" allowClear>
            <Option value="Pending">Pending</Option>
            <Option value="Completed">Completed</Option>
            <Option value="Cancelled">Cancelled</Option>
          </Select>
          <Select placeholder="Product Type" className="orders-select" allowClear>
            <Option value="physical">Physical</Option>
            <Option value="digital">Digital</Option>
            <Option value="affiliate">Affiliate</Option>
          </Select>
          <Select placeholder="Payment Status" className="orders-select" allowClear>
            <Option value="Paid">Paid</Option>
            <Option value="Unpaid">Unpaid</Option>
            <Option value="Pending">Pending</Option>
          </Select>
        </Space>

        <Table
          columns={columns}
          dataSource={orders}
          pagination={{ pageSize: 5 }}
        />

        {/* Modal for viewing order details */}
        <Modal
          title={`Order Details: ${selectedOrder?.orderId}`}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={700}
        >
          {selectedOrder && (
            <div className="order-details">
              <p><strong>Customer:</strong> {selectedOrder.customer.name} ({selectedOrder.customer.email})</p>
              <p><strong>Products:</strong> {selectedOrder.products.join(', ')}</p>
              <p><strong>Total:</strong> OMR {selectedOrder.totalAmount.toFixed(2)}</p>
              <p><strong>Payment:</strong> {selectedOrder.paymentStatus}</p>
              <p><strong>Shipping:</strong> {selectedOrder.shippingStatus}</p>
              <p><strong>Order Date:</strong> {selectedOrder.orderDate}</p>
              <p><strong>Source:</strong> {selectedOrder.orderSource}</p>
              <p><strong>Notes:</strong> No additional notes.</p>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default OrdersPage;