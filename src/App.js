import React, { Component } from 'react';
import SearchTable from './components/SearchTable';
import SelectedCoins from './components/SelectedCoins';
import Axis from './components/Axis';
import Chart from './components/Chart';
import axios from 'axios';
import moment from 'moment';
import * as d3 from 'd3';

import './App.css';

// import { library } from '@fortawesome/fontawesome-svg-core';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faStroopwafel } from '@fortawesome/free-solid-svg-icons';
// import logo from './logo.svg'; // add new logo

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedCoins: [],
            openSearchTable: false,
            d3Data: []
        };
    }

    getCoin = (coinSymbol) => {
        const ticker = coinSymbol.trim().toUpperCase();
        const timeEnd = moment();
        const timeStart = timeEnd.subtract(1, 'day').toISOString();
        const endpoint = `https://rest.coinapi.io/v1/ohlcv/BITSTAMP_SPOT_${ticker}_USD/history?period_id=15MIN&time_start=${timeStart}`;
        const config = { headers : { "X-CoinAPI-Key": "40359CB8-D9FD-463C-8537-008C7D755BAA" }};
        const selectedCoins = this.state.selectedCoins;

        if (selectedCoins.indexOf(ticker) === 1) {
            console.log('coin aleady added');
            return;
        }

        axios.get(endpoint, config)
        .then(res => {
            let d3Data = res.data;
            let selectedCoins = this.state.selectedCoins.concat(ticker);
            this.setState({ selectedCoins, d3Data });
        })
        .catch(err => {
            console.log('err', err);
            // notification ticker symbol not found
        });
        // clear input field
    };

    openSearch = () => {
        this.setState({openSearchTable: true});
    };

    render() {
        let margin = 50;
        let h = 400; //h - margin * 2
        let w = 860; // w - margin*2
        let data = this.state.d3Data.map(d => {
            let parsed = Date.parse(d.time_open);
            return {
                date: new Date(parsed),
                price: d.price_open
            };
        });

        let xScale = d3.scaleTime()
            .domain(d3.extent(data, function (d) {
                return d.date;
            }))
            .range([0, w]);

        let minPrice = d3.min(data, function(d) {
            return d.price;
        });
        let maxPrice = d3.max(data, function(d) {
            return d.price;
        });

        let yScale = d3.scaleLinear()
        .range([h, 0]).domain([minPrice, maxPrice]);

        console.log('minPrice', minPrice);
        console.log('maxPrice', maxPrice);

        let xAxis = d3.axisBottom(xScale);
        let yAxis = d3.axisLeft(yScale);

        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Crypto Watch</h1>
                </header>
                <div className="app-body">
                    <div className="col-md-9">
                        <svg className="graph-svg">
                            <g transform="translate(50, 50)">
                                <Axis axis={yAxis} axisType="y"/>
                                <Axis h={h} axis={xAxis} axisType="x"/>
                                <Chart coins={ this.state.selectedCoins } data={ this.state.d3Data } />
                            </g>
                        </svg>
                    </div>
                    <div className="col-md-3">
                        <div className="search-table-container">
                            <SelectedCoins coins={ this.state.selectedCoins } openSearch={ this.openSearch }/>
                            { this.state.openSearchTable ? <SearchTable getCoin={ this.getCoin } /> : null }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
