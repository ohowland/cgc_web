import React from "react";
import Graph from "react-graph-vis";

class GraphView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            network: null,
            options: {
                physics: {
                    enabled: true,
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
                    this.props.updateHandler()
                    //this.state.network.setData(graph)
                }, 1000)
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

export default GraphView