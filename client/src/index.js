import React from "react";
import ReactDOM from "react-dom";
import Graph from "react-graph-vis";

import "./styles.css";
import apis from "./api";

function assembleGraph(graphConfig) {

    const getNodes = x => ({
        id: x.uuid, 
        label: x.name, 
        color: '#d1d1d1', 
        shape: 'dot', 
        borderWidth: 2, 
        size: 30,
    })

    const getEdges = function(x) {
        var edges = [];
        for (var i = 0; i < x.edges.length; i++) {
            edges.push({from: x.uuid, to: x.edges[i]})
        }
        
       return edges
    }

    const nodes = graphConfig.map(getNodes)
    const edges = graphConfig.flatMap(getEdges)

    const graph = {
        nodes: nodes,
        edges: edges,
    };
    console.log(graph)
    return graph
}

class HMI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedNode: null,
            graph: {nodes: [], edges: []},
            isLoading: false,
        };
    }

    componentDidMount = async() => {
        this.setState({ isLoading: true })

        await apis.getAllAssetConfig().then(config => {
            this.setState({
                graph: assembleGraph(config.data),
                isLoading: false,
            })
        })
    }
    
    onNodeClick(event) {
        this.setState({selectedNode: event});
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div>
                    <LoadingView />
                </div>
            )
        } else { 
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
        }
    };
}

class LoadingView extends React.Component {
    render() {
        return (
            <h1>Loading</h1>
        )
    }
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
                    width: 2,
                    length: 200,
                },
                height: '500px',
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