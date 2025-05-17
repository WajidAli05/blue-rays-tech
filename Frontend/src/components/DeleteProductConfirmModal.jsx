// components/DeleteProductConfirmModal.jsx
import React from 'react';
import { Modal } from 'antd';

const DeleteProductConfirmModal = ({
  open,
  onCancel,
  onConfirm,
  confirmLoading,
}) => {
  return (
    <Modal
      title="Confirm Delete"
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Yes, delete it"
      okType="danger"
      cancelText="Cancel"
      confirmLoading={confirmLoading}
    >
      <p>This action cannot be undone. Are you sure you want to delete this product?</p>
    </Modal>
  );
};

export default DeleteProductConfirmModal;