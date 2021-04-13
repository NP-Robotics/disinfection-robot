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

    render() {
        return (  
            <React.Fragment>
                <span className={this.textColour()}>{this.props.status}</span>
            </React.Fragment>
        );
    }
}
 
export default Rosconnect;