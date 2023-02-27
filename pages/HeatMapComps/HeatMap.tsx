// Create a heatmap  react component 

import React, { Component } from 'react';
import Heat from './Heat';

export default class HeatMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            points: []
        }
    }

    render(){
        return(
            <div>
                <Heat></Heat>
            </div>
        )
    }
}