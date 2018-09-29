import React, { Component } from 'react';
import * as d3 from 'd3';

class Chart extends Component {

    render() {
        const { data, timeSelection } = this.props;
        const w = 860;
        const h = 400;

        const x = d3.scaleTime()
            .domain(d3.extent(data, function (d) {
                return d.date;
            }))
            .rangeRound([0, w]);

        const y = d3.scaleLinear()
            .domain([d3.min(data, function(d) {
                return d.price;
            }),d3.max(data,function(d){
                return d.price;
            })])
            .range([h, 0]);

        const line = d3.line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d.price);
            }).curve(d3.curveCardinal);

        // let area = null;
        //
        // if (timeSelection === 'Live') {
        //     console.log('y(0)', y(0));
        //     area = d3.area()
        //         .x(function(d) { return x(d.date); })
        //         .y1(function(d) { return y(d.price); })
        //         .y0(0);

        // d attr on path should be line(area)
        // }

        return (
            <path
                className="line shadow"
                d={ line(data) }
                strokeLinecap="round" stroke={ this.props.stroke }
            />

        );

    }
}

export default Chart;
