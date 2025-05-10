import React, { useState } from 'react';
import { Input } from 'antd';

const { Search } = Input;

const SearchBox = ({ users, onSearch, placeholder }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);  // Trigger the search with the query value
  };

  // The onSearch handler will trigger the parent onSearch function
  const onSearchHandler = (value) => {
    onSearch(value); 
  };

  return (
    <div className="search-container">
      <Search placeholder={placeholder} className='search-input' onSearch={onSearch} enterButton />
    </div>
  );
};

export default SearchBox;
