import React,{ useState, useEffect } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { setAlert } from '../actions/alert'
import { connect } from 'react-redux'
import { updateProfile } from '../actions/auth'
import Alert from './layout/Alert'

import axios from 'axios'
const EditProfile = ({setAlert,updateProfile,auth,history}) => {

    //const dispatch = useDispatch();
    const [image,setImage] = useState('')
    const [formData,setformData]=useState({
        name:'',
        email:''
        
        
    

    })
    useEffect( ()=>{
        const fetchData = async ()=>{
    
            console.log(auth.user._id)
            const { data: userData } = await axios.get(`/api/users/${auth.user._id}`)
            console.log(userData,"ud")
            setformData({
                name: userData.name,
                email:userData.email,
                
                                           
            })
            setImage(userData.image)
        }
        fetchData()
        
    },[])




    

    const [uploading,setUploading] = useState(false)

    const { name,email,password,confirmPassword } = formData

    const handleChange=e=>{
        console.log([e.target.name],e.target.value)
        setformData({
        ...formData,
        [e.target.name]:e.target.value
        
    })
    }
   
    const uploadFileHandler = (e)=>{
        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('image',file);
        setUploading(true)
        axios.post('/api/uploadRoute',bodyFormData,{
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




    useEffect(()=>{
        if(name){
          const delay = setTimeout(()=>{
            if(name.length<=3){
                console.log("Name must be atleast 4 charecters")
                setAlert("Name must be atleast 4 charecters","alert-danger")
            }else{
                console.log(name)
            }
          },2000) 
          return()=>{
              clearTimeout(delay)
          } 
        }

    },[name])
    const onSubmit =e=>{
        e.preventDefault();
        
        const id = auth.user._id
        updateProfile({ id,name,email,image})
        history.push(`/profile/${auth.user._id}`)
       
    }
    

    return (

            <div className="d-flex justify-content-center ">
        
        <form className="form-container bg-light" onSubmit={onSubmit}>
        
        <h3 className="display-4 text-primary">Edit Profile</h3>
        <div class="form-group">
            <label for="name">Name</label>
            <input type="name" class="form-control" id="name" placeholder="Enter name" required name="name" value={name}   onChange={e=>handleChange(e)} />
        </div>

            <div class="form-group">
            <label for="email">Email address</label>
            <input type="email" class="form-control" id="email" name="email" placeholder="Enter email" required value={email} onChange={e=>handleChange(e)} />
            </div>
            
            <div class="form-group">
            <label for="image">Image</label>
            <input type="text" class="form-control" id="image" name="image" placeholder="Image" required value={image} onChange={e=>handleChange(e)} />
            </div>
            <div class="form-group">
            <input type="file" class="form-control-file" onChange={uploadFileHandler}  />
            </div>
            {uploading && <div className="text-primary">uploading....</div>}
            <button type="submit" class="btn btn-primary px-3">Submit</button>
            <p className="form-text">Have an account ? <Link className="form-link" to="/login">Please login </Link>here.</p>
        </form>
        </div>    
    
    )
}

const mapStateToProps =state=>({
    auth:state.auth
})

export default connect(mapStateToProps,{setAlert,updateProfile})(withRouter(EditProfile))
