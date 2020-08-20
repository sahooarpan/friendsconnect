import { GET_POSTS, EDIT_POST,GET_POSTS_PAGINATED,  DELETE_POST, CREATE_POST, GET_POST,UPDATE_LIKES,POST_ERROR,ADD_COMMENT,DELETE_COMMENT } from './types'
import { setAlert } from './alert'
import Axios from 'axios'


export const getPosts = ()=>async dispatch=>{
    try {
        
        const { data } = await Axios.get('/api/posts/');
        console.log(data,"posts")
        dispatch({
            type:GET_POSTS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:POST_ERROR,
            payload:error.message
        })

    }
}


export const getPostsDashboard = ()=>async dispatch=>{
    try {
        
        const { data } = await Axios.get('/api/posts/posts');
        console.log(data,"posts")
        dispatch({
            type:GET_POSTS_PAGINATED,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:POST_ERROR,
            payload:error.message
        })

    }
}




export const getPost =(id)=>async dispatch=>{
    try {
        
        const config={
            headers:{
                'Content-Type':'application/json'
            }
        }
        
        const {data} = await Axios.get(`/api/posts/post/${id}`,config)
        console.log(data)
        dispatch({
          type:GET_POST,
          payload:data 
        })
    
        
    } catch (error) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:error.message}  
        })        
    }    

}



export const createPost =({heading,content,image})=>async dispatch=>{
    const config={
        headers:{
            'Content-Type':'application/json'
        }
    }

    const body = JSON.stringify({heading,content,image})

    try {
        const { data } = await Axios.post('/api/posts',body,config);
        console.log(data,"rspnse");
        dispatch({
            type:CREATE_POST,
            payload:data
        })

    } catch (error) {
        console.log(error.message)
    }


}


export const editPost =({heading,content,image,id})=>async dispatch=>{
    const config={
        headers:{
            'Content-Type':'application/json'
        }
    }

    const body = JSON.stringify({heading,content,image})

    try {
        console.log(heading,content,image,id)
        const { data } = await Axios.put(`/api/posts/edit/${id}`,body,config);
        console.log(data,"rspnse");
        dispatch({
            type:EDIT_POST,
            payload:data
        })
        dispatch(setAlert("Post Edited successfully","alert-success"))


    } catch (error) {
        console.log(error.message)
    }


}


export const deletePost =(id)=>async dispatch=>{
    
    
    try {
        console.log(id)
        const res = await Axios.delete(`/api/posts/${id}`);
        console.log(res,"rspnse");  
        dispatch({
            type:DELETE_POST,
            payload:id
        })
        dispatch(setAlert("Post Deleted successfully","alert-danger"))
        

    } catch (error) {
        console.log(error.message)
    }


}





export const addLike =(id)=> async dispatch=>{
    
   
    try {
    
        const res = await Axios.put(`/api/posts/like/${id}`)
        console.log(id)
        dispatch({
            type:UPDATE_LIKES,
            payload:res.data
        })
        

        dispatch(setAlert('You liked the post','alert-success'))

    } catch (error) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:error.response.statusText,status:error.response.status}  
        }) 
        dispatch(setAlert('You already liked the post','alert-danger'))
        
    }

    


}




export const removeLike =(id)=> async dispatch=>{
    
   
    try {
    
        const res = await Axios.put(`/api/posts/unlike/${id}`)
        dispatch({
            type:UPDATE_LIKES,
            payload:res.data
        })

        dispatch(setAlert('You unliked the post','alert-success'))

    } catch (error) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:error.response.statusText,status:error.response.status}  
        }) 
        dispatch(setAlert('You not yet liked post','alert-danger'))
        
    }

    


}

export const addComment =(id,formData)=>async dispatch=>{
    try {
        console.log(formData,"fd")
        const { data } = await Axios.put(`/api/posts/comment/${id}`,formData);
        console.log(data,"res array");
        const commentarr= data.reverse()
        console.log(commentarr,"rev array")
        dispatch({
            type:ADD_COMMENT,
            payload:commentarr
        })
        dispatch(setAlert('Comment Added','alert-success'))

    } catch (err) {
        
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
          
        })
    
    }
}


export const deleteComment =(id,commentId)=>async dispatch=>{
    try {
        const res = await Axios.delete(`/api/posts/comment/${id}/${commentId}`);
        console.log(res);
        dispatch({
            type:DELETE_COMMENT,
            payload:commentId
        })
        dispatch(setAlert('Comment Deleted','alert-danger'))

    } catch (err) {
        
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.message }
          
        })
    
    }
}