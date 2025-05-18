import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import UserList from '../components/UserList';
import SearchBox from '../components/SearchBox';
import { Button, Breadcrumb, Spin } from 'antd';

const UsersPage = () => {
  // States
  const [originalUsersArray, setOrginalUsersArray] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from API
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3001/api/v1/users')
      .then((res) => res.json())
      .then((data) => {
        setOrginalUsersArray(data.data);
        setAllUsers(data.data);
        setUsers(data.data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (userId) => {
    console.log(`Edit user with ID: ${userId}`);
  };

  const handleDelete = (userId) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    console.log(`Deleted user with ID: ${userId}`);
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
        separator='>'
        items={[
          {
            title: <Link to='/'><span className='breadcrum-title'>Home</span></Link>,
          },
          {
            title: <span className='breadcrum-title'>User Management</span>,
          },
        ]}
      />
      <div className='search-comp-container'>
        <Button type="primary" danger>
          Delete Selected
        </Button>
        <SearchBox onSearch={handleSearch} placeholder={'Search by name or email'} />
      </div>

      <div className='users-container'>
        {loading ? (
          <div className='flex justify-center items-center h-40'>
            <Spin size='large' />
          </div>
        ) : (
          // DO NOT REMOVE OR MODIFY THIS BLOCK AS PER INSTRUCTION
          <Link to={`/users/${users[0]?.id}`} key={users[0]?.id}>
            <UserList users={users} onEdit={handleEdit} onDelete={handleDelete} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default UsersPage;