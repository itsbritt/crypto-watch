import React, { Component } from 'react';
import SearchTable from './components/SearchTable';
import SelectedCoins from './components/SelectedCoins';
import Axis from './components/Axis';
import Chart from './components/Chart';
import Tselect from './components/Tselect';
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
            d3Data: [],
            axisData: [],
            timeSelection: '24h'
        };
    }

    changeTimeSelection = (selection) => {
        this.setState({ timeSelection: selection, d3Data: [], axisData: [] });

    };

    getTimeConfig = () => {
        let timeSelection = this.state.timeSelection;
        let timeConfig;
        const timeEnd = moment();

        switch(timeSelection) {
            case 'Live':
                timeConfig = {
                    timeStart: timeEnd.subtract(1, 'hour').toISOString(),
                    interval: '1MIN'
                };
                break;
            case '24h':
                timeConfig = {
                    timeStart: timeEnd.subtract(1, 'day').toISOString(),
                    interval: '15MIN'
                };
                break;
            case '1m':
                timeConfig = {
                    timeStart: timeEnd.subtract(1, 'month').toISOString(),
                    interval: '8HRS'
                };
                break;
            case '1y':
                timeConfig = {
                    timeStart: timeEnd.subtract(1, 'year').toISOString(),
                    interval: '5DAY'
                };
                break;
            case 'All':
                timeConfig = {
                    timeStart: timeEnd.subtract(8, 'year').toISOString(),
                    interval: '1MTH'
                };
                break;
            default:
                timeConfig = {
                    timeStart: timeEnd.subtract(1, 'day').toISOString(),
                    interval: '15MIN'
                };
        }
        return timeConfig;
    };

    // addCoin = (coin) => {
    //     const ticker = coin.trim().toUpperCase();
    //     let selectedCoins = this.state.selectedCoins.concat(ticker);
    //     this.setState({selectedCoins});
    //     this.getCoinData()
    // };

    getCoin = (coinSymbol) => {
        const ticker = coinSymbol.trim().toUpperCase();
        const timeConfig = this.getTimeConfig();
        const timeStart = timeConfig.timeStart;
        const interval = timeConfig.interval;
        const endpoint = `https://rest.coinapi.io/v1/ohlcv/BITSTAMP_SPOT_${ticker}_USD/history?period_id=${interval}&time_start=${timeStart}`;
        const config = { headers : { "X-CoinAPI-Key": "40359CB8-D9FD-463C-8537-008C7D755BAA" }};
        const selectedCoins = this.state.selectedCoins;

        if (selectedCoins.indexOf(ticker) !== -1) {
            console.log('coin aleady added!');
            return;
        }

        axios.get(endpoint, config)
        .then(res => {
            let axisData = this.state.axisData.concat(res.data);
            let data = { [ticker]: res.data };
            let selectedCoins = this.state.selectedCoins.concat(ticker);
            let d3Data = this.state.d3Data.concat(data);
            let openSearchTable = selectedCoins.length > 2 ? false : true;
            this.setState({ selectedCoins, d3Data, axisData, openSearchTable });
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

    setColor = (index) => {
        let color;
        switch(index) {
            case 0:
                color = 'black';
                break;
            case 1:
                color = 'blue';
                break;
            case 2:
                color = 'red';
                break;
            default:
                color = 'black';
        }
        return color;
    };

    getMinPrice = (data) => {
        return d3.min(data, (d) => {
            return d.price;
        });
    };

    getMaxPrice = (data) => {
        return d3.max(data, (d) => {
            return d.price;
        });
    };

    render() {
        let h = 400; //h - margin * 2
        let w = 860; // w - margin * 2
        let d3Data = this.state.d3Data;
        let coins = this.state.selectedCoins;
        let chartComponents = [];
        let yAxisComponents = [];
        let yAxisTranslateLeft = 0;
        let tickWidth = -860;

        coins.forEach((coin, index) => {

            let data = d3Data[index][coin];
            let chartData = data.map(d => {
                let parsed = Date.parse(d.time_open);
                return {
                    date: new Date(parsed),
                    price: d.price_open
                };
            });

            let strokeColor = this.setColor(index);
            chartComponents.push(<Chart data={ chartData } coin={ coin } key={ coin } stroke={ strokeColor }/>);

            let minPrice = this.getMinPrice(chartData);
            let maxPrice = this.getMaxPrice(chartData);
            let yScale = d3.scaleLinear().range([h, 0]).domain([minPrice, maxPrice]);
            let yAxis = d3.axisLeft(yScale).tickSize(tickWidth);

            yAxisComponents.push(<Axis axis={ yAxis } axisType="y" key={ coin } left= { yAxisTranslateLeft } />);
            yAxisTranslateLeft -= 35;
            tickWidth = 0;

        });

        // all data to draw upper and lower limits of axes for all paths
        let axisData = this.state.axisData.map(d => {
            let parsed = Date.parse(d.time_open);
            return {
                date: new Date(parsed),
                price: d.price_open
            };
        });

        let xScale = d3.scaleTime()
            .domain(d3.extent(axisData, (d) => {
                return d.date;
            }))
            .range([0, w]);

        let xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%H"));

        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Crypto Watch</h1>
                </header>
                <div className="col-md-9">
                    <Tselect timeSelection={ this.state.timeSelection } changeTimeSelection={ this.changeTimeSelection }/>
                    <svg className="graph-svg">
                        <g transform="translate(50, 50)">

                            { d3Data.length ? (<Axis h={ h } axis={ xAxis } axisType="x"/>) : null }

                            { d3Data.length ? {chartComponents} : (<i className="fa fa-spinner fa-pulse fa-2x"></i>) }
                            
                            /* { yAxisComponents } */

                        </g>
                    </svg>
                </div>
                <div className="col-md-3">
                    <div className="search-table-container">
                        <SelectedCoins coins={ coins } openSearch={ this.openSearch }/>
                        { this.state.openSearchTable ? <SearchTable getCoin={ this.getCoin } /> : null }
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
