import React from "react";
import ReactDOM from "react-dom";
import Graph from "react-graph-vis";

import "./styles.css";
import apis from "../api";

function fetchMockGraph() {
    const nodes = [
        { id: 1, label: "bus 1", color: '#d1d1d1', shape: 'dot', borderWidth: 2, size: 30 },
        { id: 2, label: "bus 2", color: '#d1d1d1', shape: 'dot', borderWidth: 2, size: 30 },
        { id: 3, label: "grid 1", color: '#d1d1d1', shape: 'dot', borderWidth: 2, size: 30 },
        { id: 4, label: "feeder 1", color: '#d1d1d1', shape: 'dot', borderWidth: 2, size: 30 },
        { id: 5, label: "ess 1", color: '#d1d1d1', shape: 'dot', borderWidth: 2, size: 30 }
    ];

    const edges = [
        { from: 1, to: 2 },
        { from: 2, to: 1 },
        { from: 3, to: 1 },
        { from: 1, to: 4 },
        { from: 5, to: 2 }
    ];

    const graph = {
        nodes: nodes,
        edges: edges
    };

    return graph
}

function assembleGraph(graphConfig) {
    var nodes = [];
    var edges = [];

    for (const assetConfig in graphConfig) {
        nodes.append({id: assetConfig.uuid, label: assetConfig.name, color: '#d1d1d1', shape: 'dot', borderWidth: 2, size: 30})
    };

    const graph = {
        nodes: nodes,
        edges: edges,
    };

    return graph
}

class HMI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedNode: null,
            graph: [],
            isLoading: false,
        };
    }

    componentDidMount = async() => {
        this.setState({ isLoading: true })

        await api.getAllAssetConfig().then(config => {
            this.setState({
                graph: assembleGraph(config),
                isLoading: false,
            })
        })
    }
    
    onNodeClick(event) {
        this.setState({selectedNode: event});
    }

    render() {
        return (
            <div>
                <div className="GraphView">
                    <GraphView 
                        graph={this.state.graph} 
                        onClick={(event) => this.onNodeClick(event)}
                    />
                </div>
                <div className="DataView">
                    <DataView 
                        selectedNode={this.state.selectedNode}
                    />
                </div>
            </div>
        )
    };
}

class DataView extends React.Component {
    render() {
        return (
            "Node Selected: " + this.props.selectedNode
        )
    };
}

class GraphView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            network: null,
            options: {
                physics: {
                    enabled: false,
                    stabilization: {
                        enabled: true,
                        iterations: 100
                    }
                },
                layout: {
                    hierarchical: false
                },
                interaction: {
                    dragView: false,
                    dragNodes: true,
                },
                edges: {
                    color: "#000000",
                    width: 2
                },
                height: "500px"
            },
            events: {
                select: function(event) {
                    var { nodes } = event
                    props.onClick(nodes[0]);
                }
            },
            timeout: 
                setInterval(() => {
                    console.log('timeout');
                    /*
                    var graph = this.props.graph;
                    this.state.network.setData(graph)
                    */
                }, 10000)
        };
    }

    render() {
        return (
            <Graph
                graph={this.props.graph}
                options={this.state.options}
                events={this.state.events}
                getNetwork={network => this.setState({network})}
            />
        )
    }
}

class App extends React.Component {

    render() {
        return (
            <div className="HMI"> 
                <HMI />
            </div>
        )
    };
}

ReactDOM.render(
    <App />, 
    document.getElementById('root')
);