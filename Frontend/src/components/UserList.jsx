import React from 'react';
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { FullscreenOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';

const UserList = ({ user, onEdit, onDelete, onViewDetails }) => {
  return (
    <ul className="user-list">
      <li key={user?._id}>
        <div className='checkbox-image-container'>
          <img 
            src={`https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80`} 
            alt={`${user?.name}'s profile`} 
          />
        </div>
        <div>
          <div>{user.name}</div>
          <small>{user?.email}</small>
        </div>
        <div>
          <div>{`Phone: ${user?.phone}`}</div>
          <small> {user?.country}</small>
        </div>
        <div>
          <div>{`Since: ${user?.since.slice(0,10)}`}</div>
          <small>{user?.job}</small>
        </div>

        <div>
          <div>{`Last Updated: ${new Date(user?.updatedAt).toLocaleDateString()}`}</div>
          <small>{user?.role}</small>
        </div>
        <div className="actions-container">
          {/* View Details */}
          <button className='action-btn details-btn'>
            <FullscreenOutlined onClick={() => onViewDetails(user?._id, user)} />    
          </button>    

          {/* Edit */}
          <button className='action-btn edit-btn'>
            <CiEdit onClick={() => onEdit(user)} />    
          </button>              

          {/* Delete with Confirmation */}
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => onDelete(user._id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }} // Make "Yes" button red
          >
            <button className='action-btn delete-btn'>
              <MdDeleteOutline />
            </button>
          </Popconfirm>
        </div>
      </li>
    </ul>
  );
};

export default UserList;