import React, { Component } from 'react';

class Rosconnect extends Component {

    textColour(){
        if(this.props.status === "Connected"){
            return "badge badge-success w-100 p-3";
        }
        else{
            return "badge badge-danger w-100 p-3";
        }
    }

    handleRefresh = () => {
        this.props.ros.connect('ws://localhost:9090');
    }

    render() {
        return (  
            <React.Fragment>
                <span className={this.textColour()}>
                    {this.props.status}
                    <button onClick = {()=>this.handleRefresh()} className="btn btn-primary btn-sm m-2" >Refresh</button>
                </span>
            </React.Fragment>
        );
    }
}
 
export default Rosconnect;