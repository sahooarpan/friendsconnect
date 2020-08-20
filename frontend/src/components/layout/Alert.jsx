import React from 'react'
import { connect } from 'react-redux'


const Alert = ({alerts}) => alerts!==null && alerts.map(alert=>(
    <div className={`alert  ${alert.alertType} alert-content `} role="alert">
  {alert.msg}
</div>    
))
    
const mapStateToProps = state =>({
    alerts:state.alert
})
     

export default connect(mapStateToProps)(Alert)
