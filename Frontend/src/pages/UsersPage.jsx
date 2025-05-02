import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import UserList from '../components/UserList';
import SearchBox from '../components/SearchBox';
import { Button } from 'antd';

const UsersPage = () => {
  // Step 1: Create an array of users
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Dio Lupa',
      email: 'dio_lupa@gmail.com',
      phone: '1234567890',
      image: 'https://img.daisyui.com/images/profile/demo/1@94.webp',
      description: 'Singer and songwriter',
      since: '2023-01-01',
      country: 'USA',
      job: 'Singer and songwriter',
    },
    {
      id: 2,
      name: 'Ellie Beilish',
      email: 'ellie_beilish@gmail.com',
      phone: '1234567890',
      image: 'https://img.daisyui.com/images/profile/demo/4@94.webp',
      description: 'Singer and musician',
      since: '2023-01-01',
      country: 'Pakistan',
      job: 'Singer and musician',
    },
    {
      id: 3,
      name: 'Sabrino Gardener',
      email: 'sabrino_gardener@gmail.com',
      phone: '1234567890',
      image: 'https://img.daisyui.com/images/profile/demo/3@94.webp',
      description: 'Songwriter and artist',
      since: '2023-01-01',
      country: 'USA',
      job: 'Songwriter and artist',
    },
    {
      id: 1,
      name: 'Dio Lupa',
      email: 'dio_lupa@gmail.com',
      phone: '1234567890',
      image: 'https://img.daisyui.com/images/profile/demo/1@94.webp',
      description: 'Singer and songwriter',
      since: '2023-01-01',
      country: 'USA',
      job: 'Singer and songwriter',
    },
    {
      id: 2,
      name: 'Ellie Beilish',
      email: 'ellie_beilish@gmail.com',
      phone: '1234567890',
      image: 'https://img.daisyui.com/images/profile/demo/4@94.webp',
      description: 'Singer and musician',
      since: '2023-01-01',
      country: 'Pakistan',
      job: 'Singer and musician',
    },
    {
      id: 3,
      name: 'Sabrino Gardener',
      email: 'sabrino_gardener@gmail.com',
      phone: '1234567890',
      image: 'https://img.daisyui.com/images/profile/demo/3@94.webp',
      description: 'Songwriter and artist',
      since: '2023-01-01',
      country: 'USA',
      job: 'Songwriter and artist',
    },
    {
      id: 1,
      name: 'Dio Lupa',
      email: 'dio_lupa@gmail.com',
      phone: '1234567890',
      image: 'https://img.daisyui.com/images/profile/demo/1@94.webp',
      description: 'Singer and songwriter',
      since: '2023-01-01',
      country: 'USA',
      job: 'Singer and songwriter',
    },
    {
      id: 2,
      name: 'Ellie Beilish',
      email: 'ellie_beilish@gmail.com',
      phone: '1234567890',
      image: 'https://img.daisyui.com/images/profile/demo/4@94.webp',
      description: 'Singer and musician',
      since: '2023-01-01',
      country: 'Pakistan',
      job: 'Singer and musician',
    },
    {
      id: 3,
      name: 'Sabrino Gardener',
      email: 'sabrino_gardener@gmail.com',
      phone: '1234567890',
      image: 'https://img.daisyui.com/images/profile/demo/3@94.webp',
      description: 'Songwriter and artist',
      since: '2023-01-01',
      country: 'USA',
      job: 'Songwriter and artist',
    },
  ]);

  // Step 2: Handle Edit action
  const handleEdit = (userId) => {
    console.log(`Edit user with ID: ${userId}`);
  };

  // Step 3: Handle Delete action
  const handleDelete = (userId) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    console.log(`Deleted user with ID: ${userId}`);
  };

  // Step 4: Handle Search functionality
  const handleSearch = (query) => {
    const filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.username.toLowerCase().includes(query.toLowerCase())
    );
    setUsers(filteredUsers);
  };

  return (
    <div>
      <NavBar />
      <div className='search-comp-container'>
        <Button type="primary" danger>
          Delete Selected
        </Button>
        <SearchBox users={users} onSearch={handleSearch} />
      </div>
      <div className='users-container'>
        {/* Use UserList Component */}
        <UserList users={users} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default UsersPage;
