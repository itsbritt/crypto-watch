import React, { Component } from 'react';
import * as d3 from 'd3';
import ReactDOM from 'react-dom';

class Axis extends Component {

    componentDidMount() {
        this.renderAxis();
    }

    componentDidUpdate() {
        this.renderAxis();
    }

    renderAxis = () => {
        let node = ReactDOM.findDOMNode(this);
        d3.select(node).call(this.props.axis);
    }

    render() {
        // let translateX = `translate(0, ${this.props.h})`;
        let translateX = `translate(0, 400)`;
        // let translateY = `translate(0, ${margin})`;
        return (
            <g className="axis" transform={ this.props.axisType === 'x' ? translateX : '' }></g>
        );
    }

}

export default Axis;
