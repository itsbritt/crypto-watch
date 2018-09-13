import React, { Component } from 'react';
import SearchTable from './components/SearchTable';
import SelectedCoins from './components/SelectedCoins';
import Axis from './components/Axis';
import Chart from './components/Chart';
import Tselect from './components/Tselect';
import Slider from './components/Slider';
import axios from 'axios';
import moment from 'moment';
import * as d3 from 'd3';

import './App.css';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedCoins: [],
            yAxisData: [],
            xAxisData: [],
            openSearchTable: false,
            timeSelection: '24h',
            mouseX: 0,
            toolTipData: []
        };
    }

    // Purpose is to re-render the already selected coins (if there are any) and draw them with the newly selected time scale/domain
    changeTimeSelection = (selection) => {
        const currentCoins = this.state.selectedCoins.slice();
        const resetPromise = new Promise((resolve, reject) => {
            resolve(this.reset());
        });
        resetPromise.then(() => {
            this.setState({timeSelection: selection});
            this.getCoin(currentCoins);
        });
    };

    getTimeConfig = () => {
        const { timeSelection } = this.state;
        const timeEnd = moment();
        let timeConfig;

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

    getYAxisData = (apiResponse) => {
        return apiResponse.map(d => {
            const parsed = Date.parse(d.time_open);
            return {
                date: new Date(parsed),
                price: d.price_open
            };
        });
    };

    getXAxisData = (apiResponse) => {
        return apiResponse.map(d => {
            let parsed = Date.parse(d.time_open);
            return {
                date: new Date(parsed),
            };
        });
    };

    reset = () => {
        this.setState({
            yAxisData: [],
            xAxisData: [],
            openSearchTable: false,
            selectedCoins: []
        });
    };

    getCoin = (coinSymbols) => {
        const config = { headers : { "X-CoinAPI-Key": "40359CB8-D9FD-463C-8537-008C7D755BAA" }};
        const selectedCoins = this.state.selectedCoins.slice();
        const yAxisData = this.state.yAxisData.slice();
        const newCoins = selectedCoins.concat(coinSymbols);
        let xAxisData;

        coinSymbols.forEach((coin, index) => {
            const ticker = coin;
            const timeConfig = this.getTimeConfig();
            const timeStart = timeConfig.timeStart;
            const interval = timeConfig.interval;
            const endpoint = `https://rest.coinapi.io/v1/ohlcv/BITFINEX_SPOT_${ticker}_USD/history?period_id=${interval}&time_start=${timeStart}`;

            axios.get(endpoint, config)
            .then(res => {
                const yData = this.getYAxisData(res.data);
                const coinDataObject = { name: ticker, data: yData };
                yAxisData.push(coinDataObject);
                if (index < 1) { // only need to get time data once because we're only drawing one x-axis
                    xAxisData = this.getXAxisData(res.data);
                    this.setState({ xAxisData });
                }
            })
            .then(() => {
                if (index === coinSymbols.length - 1)  {  // set state if this is last coin
                    this.setState({ selectedCoins: newCoins, yAxisData: yAxisData, openSearchTable: false });
                }
            })
            .catch(err => {
                console.log('err', err);
                return;
            });
        });
    };

    removeCoin = (coin) => {
        const selectedCoinsCopy = this.state.selectedCoins.slice();
        const yAxisDataCopy = this.state.yAxisData.slice();
        const coinIndex = selectedCoinsCopy.indexOf(coin);
        let xAxisData = this.state.xAxisData;

        selectedCoinsCopy.splice(coinIndex, 1);
        yAxisDataCopy.splice(coinIndex, 1);

        if (this.state.selectedCoins.length === 1) {
            xAxisData = [];
        }

        this.setState({selectedCoins: selectedCoinsCopy, yAxisData: yAxisDataCopy, xAxisData: xAxisData});
    };

    openSearch = () => {
        this.setState({ openSearchTable: true });
    };

    setColor = (index) => {
        let color;
        switch(index) {
            case 0:
                color = '#40BF57';
                break;
            case 1:
                color = '#4799B7';
                break;
            case 2:
                color = '#A93FCF';
                break;
            default:
                color = '#40BF57';
        }
        return color;
    };

    getMinPrice = (data) => {
        return d3.min(data, (d) => d.price);
    };

    getMaxPrice = (data) => {
        return d3.max(data, (d) => d.price);
    };

    showToolTip = (evt) => {
        const { offsetX } = evt.nativeEvent;
        this.setState({mouseX: offsetX - 50 }); //subtract 50 because of translateX of chart
    };

    hideToolTip = () => {
        this.setState({ mouseX: 0 });
    };

    render() {
        const h = 400;
        const w = 860;
        const chartComponents = [];
        const yAxisComponents = [];
        const { xAxisData, yAxisData } = this.state;
        const xScale = d3.scaleTime()
        .domain(d3.extent(xAxisData, (d) => {
            return d.date;
        }))
        .range([0, w]);
        const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%H"));

        let yAxisTranslateLeft = 0;
        let tickWidth = w * -1;

        yAxisData.forEach((coin,index) => {
            const strokeColor = this.setColor(index);
            const coinData = coin.data;
            const minPrice = this.getMinPrice(coinData);
            const maxPrice = this.getMaxPrice(coinData);
            const yScale = d3.scaleLinear().range([h, 0]).domain([minPrice, maxPrice]);
            const yAxis = d3.axisLeft(yScale).tickSize(tickWidth);

            yAxisComponents.push(<Axis axis={ yAxis } axisType="y" key={ index } left= { yAxisTranslateLeft } color= { strokeColor } />);
            chartComponents.push(<Chart data={ coinData } ref={ coin.name } mouseX={ this.state.mouseX } coin={ coin.name } key={ index + 1 } stroke={ strokeColor }/>);

            yAxisTranslateLeft -= 35; // Put some space between y-axes
            tickWidth = 0;
        });

        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Coin Watch</h1>
                </header>
                <div className="col-md-9">
                    <Tselect timeSelection={ this.state.timeSelection } changeTimeSelection={ this.changeTimeSelection }/>
                    <svg className="graph-svg">
                        <g transform="translate(50, 50)">
                            { chartComponents }
                            { yAxisComponents }
                            <Axis h={ h } axis={ xAxis } axisType="x"/>
                            <rect height={ h } width={ w } opacity={0} onMouseLeave={ this.hideToolTip } onMouseMove={ (evt) => this.showToolTip(evt) }/>
                            { this.state.mouseX && this.state.selectedCoins.length && <Slider setColor={ this.setColor } mouseX={ this.state.mouseX } xAxisData={ this.state.xAxisData} coinData={this.state.yAxisData}/> }
                        </g>
                    </svg>
                </div>
                <div className="col-md-3">
                    <div className="search-table-container">
                        <SelectedCoins coins={ this.state.selectedCoins } openSearch={ this.openSearch } removeCoin={ this.removeCoin } />
                        { this.state.openSearchTable && <SearchTable coins={ this.state.selectedCoins } getCoin={ this.getCoin } /> }
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
