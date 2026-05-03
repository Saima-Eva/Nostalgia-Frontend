import React from 'react'
import FindF from "../../Components/FindF/FindF";
import './FindFriend.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import api from '../../util/api';
const FindFlist = ({fndlist,setfndlist,fetchData}) => {
  const [searchText, setSearchText] = useState('');
  const [searchWithImages, setSearchWithImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const userData= JSON.parse(localStorage.getItem('userData'));
  const [fdlist,setfdlist] = useState([]);

const handleSearch = async (e) => {
    e.preventDefault();
    try {
      // API endpoint
      const url = `${api.url}:8000/searchfnd`
      const response = await axios.get(url, {
        params: {
          search: searchText,
          username: userData.username
        }
      });
      // Handle response data
      console.log('Response:', response.data);
      const searchResults = response.data.users || [];
      setfndlist(searchResults);
      setfdlist(searchResults);
      setSelectedOption(''); // Reset to show all search results
    } catch (error) {
      // Handle error
      console.error('Error:', error);
      alert('Search failed: ' + error.message);
    }
  };
  const [selectedOption, setSelectedOption] = useState('');

  const handleSelectChanged = React.useCallback((option, list) => {
    if(option === "requested"){
      setfdlist(list.filter((fnd)=>fnd && fnd.good===userData.username));
    } else if(option === "request"){
      setfdlist(list.filter((fnd)=>fnd.abedon===0 && fnd.status===1));
    } else if(option === "incoming"){
      setfdlist(list.filter((fnd)=>fnd && fnd.abedon !== 0 && fnd.status===1));
    } else {
      setfdlist(list);
    }
  }, [userData.username]);

  useEffect(() => {
    handleSelectChanged(selectedOption, fndlist);
  }, [fndlist, selectedOption, handleSelectChanged]);

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };
  const handleSelectChange = (event) => {
    const newOption = event.target.value;
    setSelectedOption(newOption);
    handleSelectChanged(newOption, fndlist);
  };

  return (
<div className='fndlist'>
  <h1>Find Friends</h1>
  <form onSubmit={handleSearch}>
      <div className="form-group">
        <div className="input-group">
          <input type="text" className="form-control" id="searchInput" placeholder="Search..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            <button className="btn btn-success" type="submit">Search</button>
        </div>
      </div>
      {/* <div className="form-group">
        <div className="form-check">
          <input type="checkbox" className="mt-2 form-check-input" id="searchWithImages" checked={searchWithImages} onChange={() => setSearchWithImages(!searchWithImages)} />
          <label className="mt-2 form-check-label" htmlFor="searchWithImages">Search with Images? </label>
          <input type="file" className="form-control-file" id="imageUpload" onChange={handleImageChange} />
      </div>
      </div> */}
    </form>
    <div className="d-flex flex-wrap mt-3 mb-3 gap-2">
      <h5 className='mt-2'> Sort By:</h5>
      <button 
        className={`btn ${selectedOption === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
        onClick={() => {
          setSelectedOption('all');
          handleSelectChanged('all', fndlist);
        }}
      >
        ALL
      </button>
      <button 
        className={`btn ${selectedOption === 'requested' ? 'btn-primary' : 'btn-outline-primary'}`}
        onClick={() => {
          setSelectedOption('requested');
          handleSelectChanged('requested', fndlist);
        }}
      >
        My Friends
      </button>
      <button 
        className={`btn ${selectedOption === 'request' ? 'btn-primary' : 'btn-outline-primary'}`}
        onClick={() => {
          setSelectedOption('request');
          handleSelectChanged('request', fndlist);
        }}
      >
        Requests I Sent
      </button>
      <button 
        className={`btn ${selectedOption === 'incoming' ? 'btn-primary' : 'btn-outline-primary'}`}
        onClick={() => {
          setSelectedOption('incoming');
          handleSelectChanged('incoming', fndlist);
        }}
      >
        Requests Sent to Me
      </button>
    </div>

    {fdlist.length === 0 && fndlist.length === 0 && <h1 className="mt-2 text-dark">Loading...</h1>}
    {fdlist.length === 0 && fndlist.length > 0 && <h1 className="mt-2 text-dark">No People Found</h1>}
    {fdlist.length>0 &&
    <div>
    <h1 className="mt-2 text-dark" rounded> People Matches You....</h1>
        {fdlist.length>0 && fdlist.map((fnd)=>(
             <div key={fnd.id} className="d-inline-flex p-4">

            <FindF 
            fnd={fnd}
            fetchData={fetchData}
            />
            </div>
        ))}
        </div>
}
    </div>   
  )
}

export default FindFlist;