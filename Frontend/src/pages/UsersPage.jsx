import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import UserList from '../components/UserList';
import SearchBox from '../components/SearchBox';
import { Button } from 'antd';

const UsersPage = () => {
  const originalUsersArray = [
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
      phone: '1234567891',
      image: 'https://img.daisyui.com/images/profile/demo/4@94.webp',
      description: 'Singer and musician',
      since: '2023-02-01',
      country: 'Pakistan',
      job: 'Singer and musician',
    },
    {
      id: 3,
      name: 'Sabrino Gardener',
      email: 'sabrino_gardener@gmail.com',
      phone: '1234567892',
      image: 'https://img.daisyui.com/images/profile/demo/3@94.webp',
      description: 'Songwriter and artist',
      since: '2023-03-01',
      country: 'USA',
      job: 'Songwriter and artist',
    },
    {
      id: 4,
      name: 'Lana Ray',
      email: 'lana_ray@gmail.com',
      phone: '1234567893',
      image: 'https://img.daisyui.com/images/profile/demo/2@94.webp',
      description: 'Pop singer',
      since: '2023-04-01',
      country: 'UK',
      job: 'Pop singer',
    },
    {
      id: 5,
      name: 'Mark Ronson',
      email: 'mark_ronson@gmail.com',
      phone: '1234567894',
      image: 'https://img.daisyui.com/images/profile/demo/5@94.webp',
      description: 'Music producer',
      since: '2023-05-01',
      country: 'Canada',
      job: 'Producer',
    },
    {
      id: 6,
      name: 'Taylor Swift',
      email: 'taylor_swift@gmail.com',
      phone: '1234567895',
      image: 'https://img.daisyui.com/images/profile/demo/6@94.webp',
      description: 'Singer-songwriter',
      since: '2023-06-01',
      country: 'USA',
      job: 'Singer-songwriter',
    },
    {
      id: 7,
      name: 'Zayn Malik',
      email: 'zayn_malik@gmail.com',
      phone: '1234567896',
      image: 'https://img.daisyui.com/images/profile/demo/7@94.webp',
      description: 'Singer and model',
      since: '2023-07-01',
      country: 'UK',
      job: 'Singer and model',
    },
    {
      id: 8,
      name: 'Ariana Grande',
      email: 'ariana_grande@gmail.com',
      phone: '1234567897',
      image: 'https://img.daisyui.com/images/profile/demo/8@94.webp',
      description: 'Actress and singer',
      since: '2023-08-01',
      country: 'USA',
      job: 'Actress and singer',
    },
    {
      id: 9,
      name: 'Charlie Puth',
      email: 'charlie_puth@gmail.com',
      phone: '1234567898',
      image: 'https://img.daisyui.com/images/profile/demo/9@94.webp',
      description: 'Singer-songwriter',
      since: '2023-09-01',
      country: 'USA',
      job: 'Singer-songwriter',
    },
    {
      id: 10,
      name: 'Camila Cabello',
      email: 'camila_cabello@gmail.com',
      phone: '1234567899',
      image: 'https://img.daisyui.com/images/profile/demo/10@94.webp',
      description: 'Pop singer',
      since: '2023-10-01',
      country: 'Cuba',
      job: 'Pop singer',
    },
  ];

  const [allUsers] = useState(originalUsersArray);
  const [users, setUsers] = useState(originalUsersArray);

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
      <div className='search-comp-container'>
        <Button type="primary" danger>
          Delete Selected
        </Button>
        <SearchBox onSearch={handleSearch} placeholder={'Search by name or email'}/>
      </div>
      <div className='users-container'>
        <UserList users={users} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default UsersPage;