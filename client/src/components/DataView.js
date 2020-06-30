import React from "react";

import Asset from "./Asset"
import Dispatch from "./Dispatch"

class DataView extends React.Component {
    render() {
        var display = {config: "", status: "", name: "", pid: ""}
        
        const selectedAsset = this.props.assetRoster.find(asset => {
            return asset.pid === this.props.selectedNode
        })

        if (selectedAsset) {
            return <Asset asset={selectedAsset} />
        } else {
            return <Dispatch roster={this.props.dispatch} />
        }
    }
}

export default DataView