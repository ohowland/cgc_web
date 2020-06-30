import React from "react";
import GraphView from "./GraphView";
import DataView from "./DataView";
import LoadingView from "./LoadingView";
import apis from "../api";

class MainView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            assetRoster: [],
            selectedNode: null,
            graph: {nodes: [], edges: []},
            isLoading: true,
        };
    }

    componentDidMount = async() => {
        await this.updateConfig()
    }

    updateConfig = async() => {
        await apis.getAllAssetConfig().then(incomingConfig => {
            const assetRoster = assembleRoster(incomingConfig.data)
            this.setState({
                assetRoster: assetRoster,
                graph: assembleGraph(assetRoster),
                isLoading: false,
            })
        })
    }
    
    updateStatus = async() => {
        await apis.getAllAssetStatus().then(incomingStatus => {
            var roster = this.state.assetRoster
            for (var i = 0; i < incomingStatus.data.length; i++) {
                const j = roster.findIndex(obj => { return obj.pid === incomingStatus.data[i].pid})
                if (j > -1) {
                    roster[j] = {...roster[j], status: incomingStatus.data[i].data}
                }
            }
            const graph = updateGraph(roster, this.state.graph)

            this.setState({
                assetRoster: roster,
                graph: graph,
            })
        })
    }
    
    onNodeClick(event) {
        this.setState({selectedNode: event})
    }

    render() {
        if (this.state.isLoading) {
            return (
                <LoadingView />
            )
        } else { 
            return (
                <div>
                    <GraphView 
                        graph={this.state.graph}
                        onClick={(event) => this.onNodeClick(event)}
                        updateHandler={this.updateStatus}
                    />
                    <DataView 
                        selectedNode={this.state.selectedNode}
                        assetRoster={this.state.assetRoster}
                    />
                </div>
            )
        }
    }
}

function assembleRoster(assetConfig) {
    const parseRawRoster = x => ({
        pid: x.pid, 
        config: {
            static: x.data.static,
            dynamic: x.data.dynamic,
        },
    })

    const roster = assetConfig.map(parseRawRoster)

    return roster
}

function assembleGraph(roster) {
    
    const getNodes = x => ({
        id: x.pid,
        label: x.config.static.name,
        shape: 'dot', 
        color: '#cfcfcf',
        borderWidth: 2, 
        size: 30,  
    })

    const getEdges = function(x) {
        var edges = [];
        if (x.config.dynamic.members) {
            var keys = Object.keys(x.config.dynamic.members)
            for (var i = 0; i < keys.length; i++) {
                edges.push({from: keys[i], to: x.pid})
            }
        }
        return edges
    }

    const nodes = roster.map(getNodes)
    const edges = roster.flatMap(getEdges)
    
    const graph = {
        nodes: nodes,
        edges: edges
    };

    return graph
}

function updateGraph(roster, graph) {
    var {nodes, edges} = graph

    var updateNodes = []
    for (const node of nodes) {
        const i = roster.findIndex(obj => {return obj.pid === node.id})
        if (i > -1 && roster[i].status) {
            updateNodes.push({
                ...node, 
                size: setNodeSize(roster, i), 
                color: setNodeColor(roster, i)
            })
        } else {
            updateNodes.push(node)
        }
    }
    
    const updateGraph = {
        nodes: updateNodes,
        edges: edges
    };
    
    return updateGraph
}

function setNodeColor(roster, i) {
    if (roster[i].status.machine.online) {
        return "#32cd32"
    } else {
        return '#cfcfcf'
    }
}

function setNodeSize(roster, i) {

    var totalCapacity = roster
        .filter(obj => obj.status !== undefined)
        .map(obj => obj.status.machine.kw)
        .reduce((acc, cur) => acc + cur)
    
    const percent = roster[i].status.machine.kw/totalCapacity || 0

    const minSize = 20
    const maxSize = 60

    const scaled = Math.min(minSize + percent*(maxSize-minSize), maxSize)
    return scaled
}

export default MainView