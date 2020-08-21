import React, { useEffect } from 'react'
import Header from './components/Header'
import './App.css'
import Footer from './components/Footer'
import Guest from './components/Guest'
import { BrowserRouter as Router,Link,Route,Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { loadUser } from './actions/auth'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import Alert from './components/layout/Alert'
import store from './store'
import { setAuthToken } from './util/setAuthToken'
import PrivateRoute from './components/routing/PrivateRoute'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import CreatePost from './components/CreatePost'
import SinglePost from './components/SinglePost'
import EditPost from './components/EditPost'




const App = () => {
  
  if(localStorage.token){
    setAuthToken(localStorage.token);
  }
  
  useEffect(()=>{
    store.dispatch(loadUser()) 
    window.scrollTo(0,0)
  },[])
  return (


    <div>
      <Router>
      <Header/>
      <Alert/>  
      <div className="content">
          
      <Route exact path='/login' component={Login} />
      
      <Route exact path='/register' component={Register} />
      
      <PrivateRoute  path='/profile/:id' component={Profile} />
      
      <PrivateRoute  path='/dashboard' component={Dashboard} />
      <PrivateRoute  path='/create-post' component={CreatePost} />
      <PrivateRoute exact path='/edit/post/:id' component={EditPost} />
    
      <PrivateRoute  path='/post/:id' component={SinglePost} />
      
      <PrivateRoute exact path='/edit/profile/:id' component={EditProfile} />
      
      
      
      
      </div>
      


      
      <Route exact path='/' component={Guest} />
      
      <Footer/>
      </Router>
      
    </div>
  
  )
}

export default App
