import React,{useEffect, useState} from 'react'
import axios from 'axios'
import Spinner from './layout/Spinner'
import { useParams,Link } from 'react-router-dom'
const Followers = ({match}) => {
    console.log(match,"mtch")
    const [followers,setFollowers] = useState([])
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
          const { data: postData } = await axios.get(`/api/users/followers/${match.params.id}`);
        //   setPosts(postData);
          console.log(postData,"pd");
          setFollowers(postData);
          setLoading(false);
          console.log(followers);  
        }
        fetchData();
    }, [match.params.id]);


    useEffect(() => {
        async function fetchData() {
          const { data: postData } = await axios.get(`/api/users/followers/${match.params.id}`);
        //   setPosts(postData);
          console.log(postData,"pd");
          setFollowers(postData);
          setLoading(false);
          console.log(followers);  
        }
        fetchData();
    }, [followers]);

 
     
    return loading? <Spinner/>: (
        <>
        {followers.length===0?<p className="mt-3 pl-4 text-danger">You have 0 followers</p>:followers.map(follower=>(
        <ul className="list-group">    
        <Link to={`/profile/${follower._id}`} className="d-flex list-group-item" key={follower._id}>
            
        <img className="avatar-tiny mr-2" src={follower.image} />{" "} 
        <strong>{follower.name}</strong>{" "}
        
        </Link>
        
        </ul>    
            
        ))}
        </>    
    )
}

export default Followers
 