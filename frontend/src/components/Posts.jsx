import React,{useEffect, useState} from 'react'
import axios from 'axios'
import Spinner from './layout/Spinner'
import { useParams, Link } from 'react-router-dom'

const Posts = ({match}) => {
    console.log(match,"mtch")
    const [posts,setPosts] = useState([])
    const [loading,setLoading] = useState(true)
    const params = useParams()
    console.log(params,'props')
    // useEffect(()=>async()=>{
    // const { data: postData } = await axios.get(`/api/posts/${match.params.id}`)
    // setPosts(postData)
    // console.log(postData);
    // setLoading(false)
    
    // },[match.params.id])
    useEffect(() => {
        async function fetchData() {
          const { data: postData } = await axios.get(`/api/posts/${match.params.id}`);
          setPosts(postData);
          console.log(postData);
          setLoading(false);
        }
        fetchData();
    }, []);


     
     
    return loading? <Spinner/>: (
        <>
        {posts.length===0?<p className="mt-3 text-danger">You have 0 posts. Please create posts to get more followers </p>:posts.map(post=>(
        <ul className="list-group">    
        <Link to={`/post/${post._id}`} className="d-flex justify-content-between list-group-item" key={post.id}>
        <div className="d-flex">    
        <img className="avatar-tiny mr-3" src={post.image} />{" "} 
        <strong className="mr-4">{post.heading}</strong>{" "}
        </div>    
        <strong className="ml-4 text-primary">{post.date.substring(0,10)}</strong>
        </Link>
        
        </ul>    
            
        ))}
        </>    
    )
}

export default Posts
 