import React from 'react';
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";

const UserList = ({ users, onEdit, onDelete }) => {
  return (
    <ul className="user-list">
      {/* List Title */}      
      {/* User List */}
      {users.map(user => (
        <li key={user.id}>
          <div className='checkbox-image-container'>
            <input type="checkbox" defaultUnchecked className="checkbox checkbox-xl" />
            <img src={user.image} alt={`${user.name}'s profile`} />
          </div>
          <div>
            <div>{user.name}</div>
            <small>{user.email}</small>
          </div>
          <div>
            <div>{`Phone: ${user.phone}`}</div>
            <small> {user.country}</small>
          </div>
          <div>
            <div>{`Since: ${user.since}`}</div>
            <small>{user.job}</small>
          </div>
          <div className="actions-container">
            {/* Edit Button */}

             <button className='action-btn edit-btn'>
                <CiEdit onClick={() => onEdit(user.id)} />    
            </button>              

            {/* Delete Button */}
            <button className='action-btn delete-btn'>
                <MdDeleteOutline onClick={() => onDelete(user.id)} />
            </button>
            
          </div>
        </li>
      ))}
    </ul>
  );
};

export default UserList;
