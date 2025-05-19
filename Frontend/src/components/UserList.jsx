import React from 'react';
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { FullscreenOutlined } from '@ant-design/icons';

const UserList = ({ user, onEdit, onDelete, onViewDetails }) => {
  return (
    <ul className="user-list">
      {/* List Title */}      
        <li key={user?._id}>
          <div className='checkbox-image-container'>
            <input type="checkbox" defaultChecked={false} className="checkbox checkbox-xl" />
            <img 
              src={`http://localhost:3001/uploads/users/${user.image}`} 
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
          <div className="actions-container">
            {/* Edit Button */}

            {/* view user in details */}
             <button className='action-btn details-btn'>
                <FullscreenOutlined  onClick={() => onViewDetails(user?._id, user)} />    
            </button>    

             <button className='action-btn edit-btn'>
                <CiEdit onClick={() => onEdit(user)} />    
            </button>              

            {/* Delete Button */}
            <button className='action-btn delete-btn'>
                <MdDeleteOutline onClick={() => onDelete(user?._id)} />
            </button>
            
          </div>
        </li>
    </ul>
  );
};

export default UserList;