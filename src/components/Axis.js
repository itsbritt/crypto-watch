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
        const node = ReactDOM.findDOMNode(this);
        d3.select(node).call(this.props.axis);
    };

    render() {
        const translateX = 'translate(0, 400)';
        const translateY = `translate(${this.props.left}, 0)`;

        return (
            <g className="axis" transform={ this.props.axisType === 'x' ? translateX : translateY }></g>
        );
    }

}

export default Axis;
