import axios from 'axios'
import { REGISTER_SUCCESS,REGISTER_FAIL,USER_LOADED,AUTH_ERROR,LOGIN_SUCCESS,LOGIN_FAIL,LOGOUT,GET_PROFILE,EDIT_PROFILE } from './types';
import { setAlert } from './alert'
import { setAuthToken } from '../util/setAuthToken'

import { useDispatch } from 'react-redux'



export const loadUser =()=> async dispatch=>{
    try {
        const res = await axios.get('/api/users',{
            headers:{
                'Content-Type':'application/json'
            }
        })
        console.log(res)
        dispatch({
            type:USER_LOADED,
            payload:res.data
        })
    } catch (error) {
        
    }
}

export const register =({name,email,password,confirmPassword,image})=>async dispatch=>{
    const config={
        headers:{
            'Content-Type':'application/json'
        }
        
        
    }
    const body= JSON.stringify({name,email,password,confirmPassword,image})
    try {
        const res = await axios.post('/api/users/register',body,config);
        console.log("res",res);
        dispatch({
            type:REGISTER_SUCCESS,
            payload:res.data
        })
        if(localStorage.token){
            setAuthToken(localStorage.token);
          }
        dispatch(loadUser())
    } catch (err) {
        console.log(err)
        dispatch({
            type:REGISTER_FAIL
        })
        
    }
}

export const updateProfile = ({id,name,email,image})=>async dispatch=>{
    const config={
        headers:{
            'Content-Type':'application/json'
        }
        
        
    }
    const body= JSON.stringify({id,name,email,image})
    console.log("actbody",body)
    
    try {
        const res = await axios.put(`/api/users/edit/${id}`,body,config);
        console.log("res",res);
        dispatch({
            type:EDIT_PROFILE,
            payload:res.data
        })
        
        //dispatch(setAlert("Updated Profile Successfully","alert-success"))
        dispatch(loadUser())
    } catch (err) {
        console.log(err)
        dispatch({
            type:REGISTER_FAIL
        })
        
    }
}






export const login =({email,password})=>async dispatch=>{
    const config={
        headers:{
            'Content-Type':'application/json'
        }
        
        
    }
    const body= JSON.stringify({email,password})
    console.log(body)
    try {
        const res = await axios.post('/api/users/signin',body,config);
        console.log("res",res);
        dispatch({
            type:LOGIN_SUCCESS,
            payload:res.data
        })
        if(localStorage.token){
            setAuthToken(localStorage.token);
          }
        dispatch(loadUser())
        dispatch(setAlert("Logged successfully","alert-success"))
    } catch (err) {
        // const errors = err.response.data.errors;
        // if(errors){
        //     errors.forEach(error => {
        //         console.log(error.msg)
        //         dispatch(setAlert(error.msg,'danger'))
                
        //     });
        // }
        dispatch({
            type:LOGIN_FAIL
        })
        dispatch(setAlert("Invalid Credentials!","alert-danger"))
    
        
    }
}

export const logOut =()=>async(dispatch)=>{
    
    
    
    dispatch({
        type:LOGOUT
    })
    
    dispatch(setAlert("Logged out Succesfully","alert-success"));
}