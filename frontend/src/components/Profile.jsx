import React,{useEffect, useState} from 'react'

import { connect } from 'react-redux'
import Spinner from './layout/Spinner'
import axios from 'axios'
import { NavLink,Switch, Route, Link } from 'react-router-dom'
import Followers from './Followers'
import Following from './Following'
import Posts from './Posts'
import { setAlert } from '../actions/alert'

import PrivateRoute from './routing/PrivateRoute'
import auth from '../reducers/auth'

const Profile = ({match,auth:{loading,user},setAlert}) => {
    window.scrollTo(0,0)

    const [profile,setProfile] = useState({});
    const [posts,setPosts] = useState([]);
    const [isFollowing,setisFollowing] = useState(false);
    const [followLoading,setfollowLoading] = useState(false);
        
   
    useEffect(()=>{
    const fetchData = async ()=>{
    
        const id = match.params.id===user._id?user._id:match.params.id
        const { data: userData } = await axios.get(`/api/users/${id}`)
        const { data: postData } = await axios.get(`/api/posts/${match.params.id}`)
        
        
        //console.log(userData,postData)
        setProfile(userData)
        setPosts(postData)  
    }
    fetchData()   
    if(user && user.following &&  user.following.includes(match.params.id)){
        setisFollowing(true)
    }  else{
        setisFollowing(false)
    }
          },[match.params.id])

    useEffect(()=>{
        const fetchData = async ()=>{
    
    
            const { data: userData } = await axios.get(`/api/users/${match.params.id}`)
            const { data: postData } = await axios.get(`/api/posts/${match.params.id}`)
            
            
            //console.log(userData,postData)
            setProfile(userData)
            setPosts(postData)  
        }
        fetchData()
    },[isFollowing])      

         const handlefollowRequest=async()=>{
           console.log("clicked")
           setfollowLoading(true)
            const res = await axios.put(`/api/users/follow/${match.params.id}`);
            console.log("follow",res)
            setfollowLoading(false)
            setisFollowing(true)
            const { data: userData } = await axios.get(`/api/users/${match.params.id}`)
            console.log(userData)
            setAlert("You Followed successfully","alert-success")
            
            
         }

            
           
        
       
       const handleUnfollowRequest=async()=>{
        console.log('unfollow button clicked')
        setfollowLoading(true)
         const res = await axios.put(`/api/users/unfollow/${match.params.id}`);
         console.log("unfollow",res)
         setfollowLoading(false)
         setisFollowing(false)
         const { data: userData } = await axios.get(`/api/users/${match.params.id}`)
        console.log(userData)
        setAlert("You unfollowed successfully","alert-danger")
                
    }



    return loading? <Spinner/>: (
    <div className="container">   
    <div className= "d-flex">
        <img className=" avatar-small mr-4" src={profile.image} />
        <div className="col-xs-4 mt-4">
        <h4>{profile.name}</h4>
        <div className="d-flex">
         {profile._id !== user._id && !isFollowing && 
         (<button   onClick={handlefollowRequest} className="btn btn-primary" 
         type="button" disabled={followLoading}>
            Follow
         </button> )}
         
         {profile._id !== user._id && isFollowing && <button disabled={followLoading} onClick={handleUnfollowRequest} className="btn btn-light">
            Following
         </button> }

         {profile._id === user._id  && <Link to={`/edit/profile/${match.params.id}`} className="btn btn-outline-warning">
            Edit Profile
         </Link> }    
         {profile._id === user._id  && <Link to={`/create-post`} className="ml-2 btn btn-outline-info">
            Create Post
         </Link> }   

        </div>
        </div>
    
    </div>
    <div className="container">
    <ul class="nav nav-tabs pl-4 switch pt-4 mb-4">
    <NavLink exact  to={`/profile/${match.params.id}`} className="nav-item nav-link">
          Posts: {posts.length}
        </NavLink>  
        <NavLink exact to={`/profile/${match.params.id}/followers`} className="nav-item nav-link">
          Followers: { profile && profile.followers && profile.followers.length}
        </NavLink>
        <NavLink exact to={`/profile/${match.params.id}/following`} className="nav-item nav-link">
          Following: { profile && profile.following && profile.following.length}
          </NavLink>
          

</ul>
</div>
        
    <Switch>
    <Route exact path={`/profile/:id`} component={Posts}/>
    
    

    <Route exact path={`/profile/:id/followers`} component={Followers} />
    
    
    <Route exact  path={`/profile/:id/following`} component={Following} />
    
    </Switch>
    </div>
    )

    
}

const mapStateToProps = state=>({
    auth:state.auth
})


export default connect(mapStateToProps,{setAlert})(Profile)
