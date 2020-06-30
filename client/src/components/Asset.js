import React from "react";

class Asset extends React.Component {

    render() {
        const config = JSON.stringify(this.props.asset.config)
        const status = JSON.stringify(this.props.asset.status)
        const name = this.props.asset.config.static.name
        const pid = this.props.asset.pid
        
        return (
            <div>
                <h1>{name}</h1> 
                <p>PID: {pid}</p>
                <h2>Status</h2>
                <p>{status}</p>
                <h2>Config</h2>
                <p>{config}</p>
            </div>
        );
    }
}

export default Asset