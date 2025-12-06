import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  Input,
  Select,
  DatePicker,
  Button,
  Tag,
  Space,
  Modal,
  Divider,
  Typography,
  Breadcrumb,
  message,
  Popconfirm,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import NavBar from "../components/NavBar";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title } = Typography;

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [productTypeFilter, setProductTypeFilter] = useState(null);
  const [paymentFilter, setPaymentFilter] = useState(null);
  const [dateRange, setDateRange] = useState(null);

  // Fetch orders
  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/all-orders`, {
      method: "GET",
      credentials: "include", // token in cookie
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status) {
          setOrders(result.data || []);
          setFilteredOrders(result.data || []);
        } else {
          message.error(result.message || "Failed to fetch orders");
        }
        setLoading(false);
      })
      .catch((err) => {
        message.error("Error fetching orders: " + err.message);
        setLoading(false);
      });
  }, []);

  // Delete order handler
  const handleDelete = (orderId) => {
    fetch(`${API_BASE_URL}/${orderId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status) {
          message.success("Order deleted successfully");
          setOrders((prev) => prev.filter((order) => order._id !== orderId));
          setFilteredOrders((prev) => prev.filter((order) => order._id !== orderId));
        } else {
          message.error(result.message || "Failed to delete order");
        }
      })
      .catch((err) => {
        message.error("Error deleting order: " + err.message);
      });
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Customer",
      dataIndex: "customerEmail",
      key: "customerEmail",
      render: (email) => <strong>{email}</strong>,
    },
    {
      title: "Products",
      dataIndex: "items",
      key: "items",
      render: (items) =>
        items?.map((item) => `${item.name} (x${item.quantity})`).join(", "),
    },
    {
      title: "Total Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `USD ${(amount / 100).toFixed(2)}`,
    },
    {
      title: "Payment Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "paid" ? "green" : "volcano"}>{status}</Tag>
      ),
    },
    {
      title: "Order Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => showOrderDetails(record)}>View</Button>
          <Popconfirm
            title="Are you sure you want to delete this order?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
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
        separator=">"
        items={[
          {
            title: (
              <Link to="/">
                <span className="breadcrum-title">Home</span>
              </Link>
            ),
          },
          { title: <span className="breadcrum-title">Orders Management</span> },
        ]}
      />

      <div className="orders-container">
        <Divider plain style={{ borderColor: "white" }}>
          <Title style={{ color: "white" }}>Orders Management</Title>
        </Divider>

        {/* Filters and Table stay the same */}
        <Table
          columns={columns}
          dataSource={filteredOrders}
          loading={loading}
          pagination={{ pageSize: 5 }}
          rowKey="_id"
        />

        {/* Modal for viewing order details */}
        <Modal
          title={`Order Details: ${selectedOrder?._id}`}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={700}
        >
          {selectedOrder && (
            <div className="order-details">
              <p>
                <strong>Customer:</strong> {selectedOrder.customerEmail}
              </p>
              <p>
                <strong>Products:</strong>{" "}
                {selectedOrder.items
                  ?.map((item) => `${item.name} (x${item.quantity})`)
                  .join(", ")}
              </p>
              <p>
                <strong>Total:</strong> USD{" "}
                {(selectedOrder.amount / 100).toFixed(2)}
              </p>
              <p>
                <strong>Status:</strong> {selectedOrder.status}
              </p>
              <p>
                <strong>Order Date:</strong>{" "}
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Currency:</strong> {selectedOrder.currency}
              </p>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default OrdersPage;