import React from 'react'
import { connect, useSelector } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import Spinner from './layout/Spinner'
import { getPost,addLike,removeLike,addComment,deletePost } from '../actions/post'
import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import CommentItem from './CommentItem'
const SinglePost = ({post:{post:{_id,user,image,heading,content,likes,comments,success}},auth,getPost,match,addLike,removeLike,
    addComment,deletePost,history

}) => {
    const [loading,setLoading] = useState(false)
   
    const [username,setUsername] = useState('')
    //const post = useSelector(state=>state.post)
    const [text,setText] = useState('')
   
   const [addedComment,setAddedComment] =useState(0)
   
   useEffect(()=>{
    setLoading(true)   
    getPost(match.params.id);
    setLoading(false)
      
    
    

},[])

   
   useEffect(()=>{
       if(success){
        getPost(match.params.id);
                async function fetchData(){
            const {data:{name}} = await axios.get(`/api/users/name/${user}`)
            console.log(name,"name")
            setUsername(name)
        }
        fetchData()
        //success=false
    }
        
    
    },[success])
   
    
   
   
    useEffect(()=>{
        async function fetchData(){
            const {data:{name}} = await axios.get(`/api/users/name/${user}`)
            console.log(name,"name")
            setUsername(name)
        }
        fetchData()
         
    },[user])

    const handleSubmit=e=>{
        e.preventDefault();
        console.log(match.params.id,{text})
        addComment(match.params.id,{text})
        setText('')
        setAddedComment(addedComment+1)
        

    }
    

    const deleteHandler=(id)=>{
        deletePost(id)
        history.push('/dashboard')
    }

    return loading?<div className="text-center text-danger">Loading....</div>:(
        <div className="container  mt-6">
            <div className="row p-4">
                <div className="col-md-4 mb-xs-6">
                <img src={image} className="img-fluid post-img img-thumbnail" />
    
                </div>
                
                <div className="col-md-6">
    
    
    <h4 className=" mr-4">{heading}</h4>
    <div className="d-flex mt-4 mb-4">
    <button onClick={e=>addLike(_id)} className="btn btn-outline-primary mr-4">
    <div className="d-flex">
    <i class="fa fa-thumbs-up mr-2" aria-hidden="true"></i>{likes && likes.length}
    </div>
    </button>
        
    <button onClick={e=>removeLike(_id)} className="btn btn-outline-danger mr-4">
        <i class="fa fa-thumbs-down mr-2" aria-hidden="true"></i></button>    
        <button className="btn btn-outline-success mr-4">
    <div className="d-flex">
    <i class="fa fa-comments mr-2" aria-hidden="true"></i>{comments && comments.length}
    </div>
    </button>
    
    </div>
    <h4 className="text-success post-text">Posted By : <Link to={`/profile/${user}`}>{username}</Link></h4>
    <h4 className="text-secondary post-text mt-6">{content}</h4>
    <div className="d-flex mt-3">
        
    {user && user.toString() === auth.user._id  && <Link to={`/edit/post/${match.params.id}`} className="btn btn-outline-warning">
            Edit Post
         </Link> }
         {user && user.toString() === auth.user._id  && <button onClick={()=>deleteHandler(match.params.id)} className="ml-3 btn btn-outline-danger">
            Delete Post
         </button> }     


    </div>

                </div>
            </div>
            <div className="mt-4 pl-6">


            <form className="form-inline d-flex"  onSubmit={e=>handleSubmit(e)}>
  <div className="row2">
  <textarea value={text} onChange={e=>setText(e.target.value)} cols="50"  className="mr-2" placeholder="Comment here"></textarea>
  <button type="button" className=" btn btn-primary" id="submit" type="submit" >Enter</button>
  </div>
</form>
            </div>
            {comments && comments.length>0 && 
<div className="container mt-4">
<h4 className="text-primary text-center">
    Comments
</h4>
<div className="mt-4 comments">

<div className="comments">
    {comments.map(comment=><CommentItem comment={comment} postId={match.params.id} />)}
</div>
</div>
</div>} 

        
        </div>
    )
}

const mapStateToProps = state=>({
    auth:state.auth,
    post:state.post
})


export default connect(mapStateToProps,{getPost,addLike,removeLike,addComment,deletePost})(withRouter(SinglePost))

