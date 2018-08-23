import React, { Component } from 'react';
import * as d3 from 'd3';

class Chart extends Component {

    constructor(props) {
        super(props);
        this.state = { price: '', time: ''};
    }

    connectWS = (ticker) => {
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
                price = data.price,
                time = data.time_exchange;

            if (data.type === 'error') {
                console.log('error establishing web socket connection', data);
            } else {
                this.setState({ price, time });
            }
        };
    }

    // componentWillReceiveProps(nextProps) {
    //     // console.log('nextProps', nextProps);
    //     let coins = nextProps.coins,
    //         ticker = coins[0];
    //
    //     coins.forEach(coin => {
    //
    //     })
    //
    //     if (ticker) {
    //         this.connectWS(ticker);
    //     }
    //
    // }

    render() {
        let propsData = this.props.data;
        let w = 860,
            h = 400,
            data = [];

        propsData.forEach(d => {
            let parsed = Date.parse(d.time_open),
                date = new Date(parsed),
                price = d.price_open;

            data.push({date, price});
        });

        let x = d3.scaleTime()
            .domain(d3.extent(data, function (d) {
                return d.date;
            }))
            .rangeRound([0, w]);

        let y = d3.scaleLinear()
            .domain([d3.min(data, function(d) {
                return d.price;
            }),d3.max(data,function(d){
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
            <path className="line shadow" d={line(data)} strokeLinecap="round"/>
        );

    }
}

export default Chart;
