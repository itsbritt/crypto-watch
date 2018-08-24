import React, { Component } from 'react';
import * as d3 from 'd3';

class Chart extends Component {

    constructor(props) {
        super(props);
        this.state = { data: props.data };
    }

    connectWS = (ticker, lastHourData) => {
        let handshake = {
            "type": "hello",
            "apikey": "40359CB8-D9FD-463C-8537-008C7D755BAA",
            "heartbeat": false,
            "subscribe_data_type": ["trade"],
            "subscribe_filter_symbol_id": [ `BITSTAMP_SPOT_${ticker}_USD`]
        };

        let ws = new WebSocket('wss://ws.coinapi.io/v1/');
        ws.onopen = () => {
            ws.send(JSON.stringify(handshake));
        };

        ws.onmessage = (evt) => {
            let data = JSON.parse(evt.data),
                price = data.price_open, //check to see what this response data looks like
                time = data.time_open;

            if (data.type === 'error') {
                console.log('error establishing web socket connection', data);
            } else {
                let newStateData = this.state.data.concat({ price, time });
                this.setState({ data: newStateData });
            }
        };
    }

    componentDidMount() {
        console.log('componentDid mount running');
        // console.log('nextProps', nextProps);
        let ticker = this.props.coin,
            // data = nextProps.data,
            live = this.props.live;

        //
        // this.setState({data});
            // ticker = coins[0];

        if (ticker && live) {
            this.connectWS(ticker);
        }

    }

    render() {
        let propsData = this.state.data;
        let w = 860,
            h = 400;

        let x = d3.scaleTime()
            .domain(d3.extent(propsData, function (d) {
                return d.date;
            }))
            .rangeRound([0, w]);

        let y = d3.scaleLinear()
            .domain([d3.min(propsData, function(d) {
                return d.price;
            }),d3.max(propsData,function(d){
                return d.price;
            })])
            .range([h, 0]);

        let line = d3.line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d.price);
            }).curve(d3.curveLinear);

        return (
            <path className="line shadow" d={line(propsData)} strokeLinecap="round" stroke={ this.props.stroke } />
        );

    }
}

export default Chart;
