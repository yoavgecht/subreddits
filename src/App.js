import "./App.css";
import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate'; //React paginate plugin
import axios from 'axios';

function App({ hideLoader }) {
  const [loading, setLoading] = useState(true)
  const [subReddits, setSubReddits] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [error, setError] = useState('')

  // how many subreddits to show for each page
  const subRedditsPerPage = 5;


  // if the user is on page 4 it means he saw 20 subreddits
  const subRedditsVisited = pageNumber * subRedditsPerPage;


const API_URL = 'https://www.reddit.com/r/Futurology.json'

//fetching the subreddits from the end point on page load
useEffect(() => {
  axios.get(API_URL).then(res => {
    setSubReddits(res.data.data.children);
    console.log(res.data.data.children);
    setLoading(false);
  }).catch(
    function (error) {
      setLoading(false);
      setError(error.message);
      if (error.response) {
        // Request made and server responded
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
    }
  )
}, []);


//subReddits.slice(subRedditsVisited, subRedditsVisited + subRedditsPerPage).map see below
//We want to display the subreddits starting from the subreddits already visited
//if we are on 4th page we want to display the reddits starting from 4th page
//for example subRedditsVisited = 20 to subRedditsVisited + subRedditsPerPage =====> 25


const displaySubReddits = subReddits
  .slice(subRedditsVisited, subRedditsVisited + subRedditsPerPage).map(({data}) => {
   const date = new Date(data.created).toLocaleDateString();
   return (
    <div key={data.id} className="subreddit-item">
      <a href={`${data.url}`}>
          <div className="subreddit-ups">ups: {data.ups}</div>
          <div className="subreddit-content">
            <div className="subreddit-title"><h3>{data.title}</h3></div>
            <img src={`${data.thumbnail}`} alt={data.title}/>
            <div>Posted by {data.author} at {date}</div>
          </div>
        </a>
    </div>
   )
}) 

  const pageCount = Math.ceil(subReddits.length / subRedditsPerPage);

  const changePage = ({selected}) => {
    setPageNumber(selected)
  }
  return (
    <div>
      {error ? (<h1>{error}</h1>) :
      !loading ? (<div className="App">
        {displaySubReddits}
        <ReactPaginate  
        previousLabel={"Previous"} 
        nextLabel={"Next"} 
        pageCount={pageCount} 
        onPageChange={changePage}
        containerClassName={"pagination-btns"}
        previousLinkClassName={"prev-btn"}
        nextLinkClassName={"next-btn"}
        disabledClassName={"pagination-disabled"}
        activeClassName={"pagination-active"}
        />
    </div>) : (<div className="loader"></div>)}
    </div>
    
  );
}

export default App;
