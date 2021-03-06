import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { editPost } from '../actions/post'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'


const EditPost = ({auth:{user},editPost,history,match}) => {
    
    const [formData,setformData] = useState({
        heading:'',
        content:''
    })

    const { heading,content } = formData
    
    const [image,setImage] = useState('');

    const [uploading,setUploading] = useState(false)


    useEffect( ()=>{
        const fetchData = async ()=>{
    
            console.log(user._id)
            const { data: postData } = await axios.get(`/api/posts/post/${match.params.id}`)
            console.log(postData,"pdata")
            setformData({
                heading: postData.heading,
                content:postData.content,
                
                                           
            })
            setImage(postData.image)
        }
        fetchData()
        
    },[])





    const uploadFileHandler = (e)=>{
        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('image',file);
        setUploading(true)
        axios.post('/api/uploadRoute/s3',bodyFormData,{
            headers:{
                'Content-Type':'multipart/form-data',
            }
        }).then(res=>{
            setImage(res.data)
            setUploading(false)
        }).catch(err=>{
            console.log(err)
            setUploading(false)
        })

    }
        
    const handleChange=e=>{
        console.log([e.target.name],e.target.value)
        setformData({
        ...formData,
        [e.target.name]:e.target.value
        
    })
   
}

const handleSubmit=(e)=> {
    e.preventDefault();
    console.log(image)
    console.log(formData)
    const id = match.params.id
    editPost({heading,content,image,id})
    history.push(`/post/${match.params.id}`)
}    

    return (
        <div className="d-flex justify-content-center post-form">
        <form onSubmit={e=>handleSubmit(e)}>
        <div class="form-group">
            <label for="image">Image</label>
            <input type="text" class="form-control" id="image" name="image" placeholder="Image" required value={image} onChange={e=>handleChange(e)} />
            </div>
            <div class="form-group">
            <input type="file" class="form-control-file" onChange={uploadFileHandler}  />
            </div>
            {uploading && <div className="text-primary">uploading....</div>}
        <div className="form-group">
          <label htmlFor="post-heading" className="text-muted mb-1">
            <small>heading</small>
          </label>
          <input onChange={e=>handleChange(e)} autoFocus name="heading" id="post-heading" value={heading} className="form-control form-control-lg form-control-heading" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Content</small>
          </label>
          <textarea onChange={e=>handleChange(e)} value={content}  name="content" id="post-content" className="form-control" type="text"></textarea>
        </div>

        <button className="btn btn-primary" type="submit">Save New Post</button>
      </form>
      </div>
    )
}

const mapStateToProps=state=>({
    auth:state.auth
})


export default connect(mapStateToProps,{editPost})(withRouter(EditPost))
