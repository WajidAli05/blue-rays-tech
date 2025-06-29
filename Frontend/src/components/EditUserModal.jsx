import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, message } from 'antd';

const EditUserModal = ({ visible, user, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        phone: user.phone,
        email: user.email,
      });
    }
  }, [user, form]);

  const handleFinish = (values) => {
    setLoading(true);

    fetch(`http://localhost:3001/api/v1/user/${user._id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.message || 'Update failed');
          });
        }
        return res.json();
      })
      .then((data) => {
        message.success('User updated successfully');
        onSuccess(data.user); // optional: return updated user
      })
      .catch((err) => {
        console.error(err);
        message.error(err.message || 'Failed to update user');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      open={visible}
      title="Edit User"
      okText="Update"
      cancelText="Cancel"
      onCancel={onCancel}
      confirmLoading={loading}
      onOk={() => form.submit()}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Full Name"
          rules={[{ required: true, message: 'Please enter the name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone"
          rules={[{ required: true, message: 'Please enter the phone number' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUserModal;