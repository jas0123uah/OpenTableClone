import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getSearch } from '../../store/search_results';
import { useHistory } from 'react-router';
import './navbarsearch.css';

const NavBarSearch = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(searchTerm);
    await dispatch(getSearch(searchTerm));
    history.push('/search-results');
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="searchh">
        <input
          type="text"
          id="splash-searchh"
          value={searchTerm}
          placeholder="Search"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="searchInput"
        ></input>
        <div className="icon-divv">
          <i className="fas fa-search" onClick={handleSubmit}></i>
        </div>
      </div>
    </form>
  );
};

export default NavBarSearch;
