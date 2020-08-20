import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { logOut } from '../actions/auth'
import Axios from 'axios'

const Header = ({auth,logOut}) => {

    const [loading,setLoading] = useState(false)
    const [results,setResults]= useState([])
    //const [query,setQuery] = useState('')
    const [display,setDisplay] = useState(false)
    const wrapperRef = useRef(null)    
    useEffect(() => {
        window.addEventListener("mousedown", handleClickOutside);
        return () => {
          window.removeEventListener("mousedown", handleClickOutside);
        };
      });
    
    const handleClickOutside = e =>{
        const { current:wrap  } = wrapperRef
        if(wrap && !wrap.contains(e.target)){
            setDisplay(false)
        }
    }


     const fetchResults=async (e)=>{
        e.preventDefault();
        const query = e.target.value;
       if(query.trim()){
        setDisplay(true)
        setLoading(true)
        const {data}=await Axios.post(`/api/users/getUsers`,{query})
        console.log(data)
        
        setResults(data)
        setLoading(false)
        
       }else{
           setDisplay(false)
       }


    }


    const authLinks =(
        <>
        
        <ul className="navbar-nav ml-auto">
        <li className="nav-item">
            <Link to="/dashboard" className="nav-link text-white">Dashboard</Link>
          </li>
          
          { auth && !auth.loading && auth.isAuthenticated && auth.user && <li className="nav-item">
           <Link to={`/profile/${auth.user._id}`} className="nav-link text-white">
            <>

            <i className='fas fa-user mr-1' /><>{auth.user && auth.user.name}</>
             </>               
            </Link>
          </li>}
          <li className="nav-item">
          <a className="nav-link text-white" onClick={logOut} href='#!'>
          <i className='fas fa-sign-out-alt' />
          <span className='hide-sm'>Logout</span>
        </a>

          </li>
          </ul>
          </>

    )
    
    const guestLinks=(
        <ul className="navbar-nav ml-auto">
        <li className="nav-item">
            <Link to="/login" className="nav-link text-white">Login</Link>
          </li>
          <li className="nav-item">
            <Link to="/register" className="nav-link text-white">Register</Link>
          </li>
          </ul>
    )
    
return (
        <nav role="navigation" className="navbar mb-3 navbar-expand-md bg-dark navbar-dark fixed-top">
            <div className="container-fluid">
            <Link to='/' className=" mb-3 navbar-brand">
                <span className="pr-2">
                    <i className="fas fa-user-friends"></i>
                </span>
                FriendsConnect
            </Link>
           {auth && !auth.loading && auth.isAuthenticated && auth.user &&   <div class="search-box flex-grow-1 d-flex" ref={wrapperRef}>
                
                <form class="form-inline flex-nowrap bg-light mx-0 mx-lg-auto rounded p-1">
                    <div className="autocomplete">
                    <input className="form-control mr-sm-2 nav-search-input" type="search" onChange={e=>fetchResults(e)} placeholder="Search username" aria-label="Search" />
                    {loading && (
                        <div className="autoContainer nav-search-suggestions">
                            
                                    <ul class="list-group list-users">
                                    <li class="list-group-item text-center d-flex">
                                        <p className=" search-name text-primary">Loading...</p>
                                        </li>
                                  </ul>
                                )
                            
                        </div>
                    )}
               

{display && results.length===0 && (
                        <div className="autoContainer nav-search-suggestions">
                            
                                    <ul class="list-group list-users">
                                    <li class="list-group-item text-center d-flex">
                                        <p className=" search-name text-primary">No results found...</p>
                                        </li>
                                  </ul>
                                )
                            
                        </div>

                    )}
                    
                    
                    
                    {display && (
                        <div className="autoContainer nav-search-suggestions">
                            {results.map(result=>{
                                return(
                                    <ul class="list-group list-users">
                                    <Link to={`/profile/${result._id}`} class="list-group-item text-center d-flex">
                                        <img src={result.image} className=" mr-4 search-image" />
                                        <p className=" search-name">{result.name}</p>
                                        </Link>
                                  </ul>
                                )
                            })}
                        </div>
                    )}
                    </div>
                </form>
            </div>
}
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navLinks">
            <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navLinks">
        {!auth.loading && auth.isAuthenticated ?authLinks:guestLinks}
         </div>   
            </div>

        </nav>
    )
}

const mapStateToProps = state=>({
    auth:state.auth
})


export default connect(mapStateToProps,{logOut})(Header)
