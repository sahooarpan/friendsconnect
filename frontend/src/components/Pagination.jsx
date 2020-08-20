import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'

const Pagination = ({totalPosts,paginate,currentPage,setCurrentPage}) => {

    


    const pageNumbers =[]

    for (let i=1;i<=Math.ceil(totalPosts/5);i++){
        pageNumbers.push(i)
    }

    const handleClick=(number)=>{
        paginate(number)
        setCurrentPage(number)
    }

    useEffect(()=>{
        console.log(currentPage,"cpn")
    
    },[currentPage])
    
    return (
        <ul className="pagination">
            {pageNumbers.map(number=>(
                <li key={number} className={`page-item ${currentPage===number?"active":""} `}>
                    <Link  onClick={()=>handleClick(number)} 
                      className={`page-link` }  >
                        {number}
                    </Link>

                </li>
            ))}
            
        </ul>
    )
}

export default Pagination
