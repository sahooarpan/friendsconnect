import React,{ useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { setAlert } from '../actions/alert'
import { connect } from 'react-redux'
import { login } from '../actions/auth'
import Alert from './layout/Alert'
import { Redirect } from 'react-router-dom'
const Login = ({setAlert,login,isAuthenticated}) => {

    //const dispatch = useDispatch();

    const [formData,setformData]=useState({
        
        email:'',
        password:'',
       

    })

    const { email,password } = formData

    const handleChange=e=>{
        
        setformData({
        ...formData,
        [e.target.name]:e.target.value
        
    })
    }
   
    
    
    const onSubmit =e=>{
        e.preventDefault();
        
        login({email,password})
    }
    if(isAuthenticated){
        return <Redirect to='/dashboard' />
     }

    return (
        <div className="d-flex justify-content-center">
            
        
        <form className="form-container bg-light" onSubmit={onSubmit}>
        
        <h3 className="display-4 text-primary">Login</h3>
        <div class="form-group">
            <label for="email">email</label>
            <input type="email" class="form-control" id="email" placeholder="Enter email" required name="email"   onChange={e=>handleChange(e)} />
        </div>

            
            <div class="form-group">
            <label for="password">Password</label>
            <input type="password" class="form-control" id="password" name="password" placeholder="Password" required value={password} onChange={e=>handleChange(e)} />
            </div>
            <button type="submit" class="btn btn-primary px-3">Submit</button>
            <p className="form-text">Do not have an account ? <Link className="form-link" to="/register">Register</Link></p>
        </form>
            
        </div>
    )
}

const mapStateToProps =state=>({
    isAuthenticated:state.auth.isAuthenticated
})

export default connect(mapStateToProps,{setAlert,login})(Login)
