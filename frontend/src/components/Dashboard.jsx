import React, { useState } from 'react'
import { connect } from 'react-redux'
import { useEffect } from 'react'
import Pagination from './Pagination'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Dashboard = ({ posts }) => {
    const [ loading,setLoading ] = useState(false)
    const [ currentPage,setCurrentPage ] = useState(1)
    const [totalPosts,setTotalPosts] = useState(0)
    const [currentPosts,setCurrentPosts] = useState([])
    
    
    
    useEffect(()=>{
        async function fetchPosts(){
            setLoading(true)
            console.log("loading",loading)
            const {data} = await axios.get('/api/posts/posts',{
                params:{
                    page:currentPage
                
                }
            })
            console.log(data,"postsdsh")
            setTotalPosts(data.count)
            setCurrentPosts(data.results)
            setLoading(false)
            console.log("loading",loading)
               
        }
        
        fetchPosts()
   
    },[])


 
    useEffect(()=>{
        async function fetchPosts(){
            setLoading(true)
            console.log("loading",loading)
            const {data} = await axios.get('/api/posts/posts',{
                params:{
                    page:currentPage
                
                }
            })
            console.log(data,"postsdsh")
            setTotalPosts(data.count)
            setCurrentPosts(data.results)
            setLoading(false)
            console.log("loading",loading)
               
        }
        
        fetchPosts()
   
    },[currentPage])




    // const indexOfLast = currentPage * postsPerPage
    // const indexOfFirstPost = indexOfLast - postsPerPage
    
    // const currentPosts =posts.slice(indexOfFirstPost,indexOfLast)
    // console.log(currentPosts,"currposts")
    
    const paginate = currentPage=>setCurrentPage(currentPage)
   



    return  (
        
        <div className="container  mt-5">
            {/* <h3 className='text-center text-primary mb-3'>Dashboard</h3> */}
            {loading && <div className="text-center">Loading...</div>}
            <div className="mb-4  row">
            {!loading && currentPosts && currentPosts.map(post=>(
                
                    <div className=" mx-xs-4 col-sm-6 dashboard  col-md-4">
                    <Link to={`/post/${post._id}`} className="card align-self-xs-center mt-4 post-dashboard">
  <img className="card-img-top card-image" src={post.image} alt="Card image cap"/>
  <div className="card-body">
    <h4 className="text-primary search-name card-text">
        {post.heading}
    </h4>
    <p className="text-secondary mt-2 search-name card-text">
       Posted By: {post.user.name}
    </p>
     <div className="d-flex">           
    <p className="text-primary mt-2 search-name card-text mr-2">
    <i class="fa fa-thumbs-up mr-1" aria-hidden="true"></i>{post && post.likes && post.likes.length}
    
    </p>
    <p className="text-success mt-2 search-name card-text">             
    <i class="fa fa-comments mr-1" aria-hidden="true"></i>{post && post.comments && post.comments.length}
    </p>
    </div>

  </div>
</Link>
                    </div>
                    
            ))}
            </div>
            <div className="pagination">
            <Pagination className="mt-4"
            totalPosts={totalPosts}
            paginate={paginate}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}    
            />
            </div>
        </div>
    )
}

const mapStateToProps = state =>({
    posts:state.post.posts
})

export default connect(mapStateToProps)(Dashboard)
