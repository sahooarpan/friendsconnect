import { CREATE_POST, DELETE_POST, GET_POST,UPDATE_LIKES,POST_ERROR,ADD_COMMENT,EDIT_POST, DELETE_COMMENT,GET_POSTS, GET_POSTS_PAGINATED } from '../actions/types'

const initialState ={
    posts:[],
    postsArr:[],
    post:{
        success:false
    },
    loading:true,
    error:{}
}

export default (state=initialState,action)=>{
    const { type,payload } = action
    switch(type){
        case CREATE_POST:
    
            return{
                ...state,
                posts:[payload,...state.posts],
                loading:false
            }
        case EDIT_POST:
            return{
                ...state,
                post:action.payload,
                loading:false
            }    
        case POST_ERROR:
            return{
                ...state,
                error:payload,
                loading:false
            }
        case GET_POSTS:
            return{
                ...state,
                posts:payload,
                loading:false
            }
            case GET_POSTS_PAGINATED:
                return{
                    ...state,
                    posts:payload,
                    loading:false
                }    
            
        case UPDATE_LIKES:
            return{
                ...state,
                post:{...state.post,likes:payload}
                ,loading:false
            }
        case ADD_COMMENT:
            return{
                ...state,
                post:{...state.post,comments:payload,success:true},
                loading:false
            }       
        case DELETE_COMMENT:
            return{
                ...state,
                post:{...state.post,comments:state.post.comments.filter(comment=>comment._id!==payload)},
                loading:false
            }     
        case DELETE_POST:
            return{
                ...state,
                posts:state.posts.filter(post=>post._id!==payload),
                loading:false

            }    

            case GET_POST:
                return{
                    ...state,
                    post:action.payload,
                    loading:false
                }

        default:
            return state    
    }
}

