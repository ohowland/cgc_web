import React from "react";
import ReactDOM from "react-dom";

import MainView from "./components/MainView"
import "./styles.css";

class App extends React.Component {

    render() {
        return (
            <div className="DefaultView"> 
                <MainView />
            </div>
        )
    };
}

ReactDOM.render(
    <App />, 
    document.getElementById('root')
);

