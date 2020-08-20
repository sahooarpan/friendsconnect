import { createStore,applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducers'
import logger from 'redux-logger'

const initialState = {}

const middleWare = [thunk];
middleWare.push(logger);

const store = createStore(rootReducer,initialState,composeWithDevTools(applyMiddleware(...middleWare)));


export default store;    