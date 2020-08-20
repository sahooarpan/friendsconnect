import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

const Guest = ({ isAuthenticated }) => {
  if(isAuthenticated){
    return <Redirect to='/dashboard'/>
  }
    return (
        <div id="home-section">
        <div class="dark-overlay">
            <div class="home-inner container">
                <div class="row">
                    <div class="col d-lg-block">
                        <h1 class="display-4">
                            Build <strong>social profiles</strong> and gain revenue <strong>profits</strong>
                        </h1>
                        <div class="d-flex">
                            <div class="p-4 align-self-start">
                              <i class="fas fa-check fa-2x"></i>
                            </div>
                            <div class="p-4 align-self-end">
                             <h3>Please create accounts create good posts.</h3> 
                            </div>
                          </div>
              
                          <div class="d-flex">
                            <div class="p-4 align-self-start">
                              <i class="fas fa-check fa-2x"></i>
                            </div>
                            <div class="p-4 align-self-end">
                            <h3>Like and comment on posts</h3>  
                            </div>
                          </div>
              
                          <div class="d-flex">
                            <div class="p-4 align-self-start">
                              <i class="fas fa-check fa-2x"></i>
                            </div>
                            <div class="p-4 align-self-end">
                             <h3>Connect with friends :)</h3> 
                            </div>
                          </div>
                          <div className="d-flex button-container mt-5">
                              <Link to="/login" className="btn btn-info pl-3 mr-4">Login</Link>
                              <Link to="/register" className="btn btn-info ">Register</Link>
                                
                          </div>
                        </div>  
                        
            </div>
            </div>
            </div>
            </div>
    )
}

const mapStateToProps = state=>({
  isAuthenticated:state.auth.isAuthenticated
})



export default connect(mapStateToProps)(Guest)
