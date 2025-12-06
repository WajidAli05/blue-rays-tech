import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import UserList from '../components/UserList';
import SearchBox from '../components/SearchBox';
import EditUserModal from '../components/EditUserModal';
import { Breadcrumb } from 'antd';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UsersPage = () => {
  const navigate = useNavigate();

  // States
  const [originalUsersArray, setOriginalUsersArray] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);  

  // Fetch users
  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/users`, {
      credentials: 'include'
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
      })
      .then((data) => {
        setOriginalUsersArray(data.data);
        setAllUsers(data.data);
        setUsers(data.data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (userId) => {
    if (!userId) return console.error("User ID is required");

    fetch(`${API_BASE_URL}/user/${userId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(result => {
        if (result.status) {
          const updatedUsers = users.filter(user => user._id !== userId);
          setUsers(updatedUsers);
          setAllUsers(updatedUsers);
          setOriginalUsersArray(updatedUsers);
        } else {
          console.error(result.message || 'Failed to delete user');
        }
      })
      .catch(err => {
        console.error('Error deleting user:', err);
      });
  };

  const handleViewDetails = (userId) => {
    navigate(`/user/${userId}`);
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setUsers(allUsers);
    } else {
      const filteredUsers = allUsers.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      );
      setUsers(filteredUsers);
    }
  };


  return (
    <div>
      <NavBar />

      <Breadcrumb
        separator=">"
        items={[
          {
            title: <Link to="/"><span className="breadcrum-title">Home</span></Link>,
          },
          {
            title: <span className="breadcrum-title">User Management</span>,
          },
        ]}
      />

      <div className="search-comp-container">
        <SearchBox
          onSearch={handleSearch}
          placeholder="Search by name or email"
        />
      </div>

      <div className="users-container">
        {users.map((user) => (
          <UserList
            key={user._id}
            user={user}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      <EditUserModal
        visible={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        user={editingUser}
        onSuccess={() => {
          setIsEditModalOpen(false);
          navigate(0); // refresh
        }}
      />
    </div>
  );
};

export default UsersPage;