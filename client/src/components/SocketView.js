import React from "react";

class SocketView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            ws: null
        };
    }


    componentDidMount() {
        this.connect();
    }

    retry = 1;

    connect = () => {
        var ws = new WebSocket('ws://localhost:1323/ws');
        let that = this;
        var connectInterval;

        ws.onopen = () => {
            console.log('connected');

            this.setState({ws: ws});

            that.retry = 1;
            clearTimeout(connectInterval);
        };

        ws.onclose = e => {
            console.log('disconnected', e.reason);

            that.retry = that.retry + 1;
            var exp_backoff = Math.min(10000, (Math.pow(2, that.retry) - 1) * 100);
            connectInterval = setTimeout(this.check, Math.min(10000, exp_backoff));
        };

        ws.onerror = err => {
            console.error("Socket error ", err.message);
            ws.close();
        };

        ws.onmessage = evt => {
            const msg = JSON.parse(evt.data);
            this.setState({dataFromServer: msg});
            console.log(msg);
        };
    };


    check = () => {
        const {ws} = this.state;
        if (!ws || ws.readyState == WebSocket.CLOSED) this.connect();
    };

    render() {
        if (this.state.isLoading) {
            return (
                <LoadingView />
            )
        } else { 
            return (
                <ChildComponent websocket={this.state.ws} />
            )
        }
    }
}


export default SocketView