import React from 'react'
import { connect } from 'react-redux'
import { Link,withRouter } from 'react-router-dom'
import { deleteComment } from '../actions/post'
const CommentItem = ({comment,postId,auth,deleteComment}) => {
console.log(comment)


    return comment.user ?(
        <div className="post bg-white p-1 my-3">
            <div className="row">
                <Link className="col-md-6"
                 to={`/profile/${comment && comment.user && comment.user._id}`}>
                     <div className="px-4 py-1 comment-user-details">
                    <img src={comment && comment.user && comment.user.image} alt="" className="comment-image rounded-circle"/>
                    <p className="comment-name">{comment && comment.user && comment.user.name}</p>
                    </div>
                </Link>
            </div>
            <div className="ml-4 py-4 col-md-6 comment-box">
            <div className=" comment-item ">    
            <p className="comment-name mr-2">{comment && comment.text}{" "}
            {auth.user._id === comment.user._id}
            {auth.user._id === comment.user._id &&
            <a className="text-danger delete-button comment-name" onClick={()=>deleteComment(postId,comment._id)}>Delete</a>
            }
            </p>
            
            </div>
    <p className="comment-name">Posted on {comment.date.substring(0,10)}</p>
            </div>
            
        </div>
   
    ):<div></div>
}

const mapStateToProps = state=>({
    auth:state.auth
})

export default connect(mapStateToProps,{deleteComment})(CommentItem)
