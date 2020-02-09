import React, { Component } from "react";
import SearchTable from "./components/SearchTable";
import SelectedCoins from "./components/SelectedCoins";
import Axis from "./components/Axis";
import Chart from "./components/Chart";
import Tselect from "./components/Tselect";
import Slider from "./components/Slider";
import axios from "axios";
import moment from "moment";
import * as d3 from "d3";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartArea, faCoins } from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import "react-notifications/lib/notifications.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCoins: [],
      yAxisData: [],
      xAxisData: [],
      openSearchTable: false,
      loading: false,
      timeSelection: "24h",
      mouseX: 0,
      toolTipData: []
    };
  }

  notify = errorCode => {
    let message;
    if (errorCode === 429) {
      message = "API Request Limit Exceeded";
    } else if (errorCode === 400) {
      message = "Invalid Ticker Symbol";
    } else {
      message = "Oops, Something Went Wrong";
    }
    NotificationManager.error(message);
  };

  // Purpose is to re-render the already selected coins (if there are any) and draw them with the newly selected time scale/domain
  changeTimeSelection = selection => {
    let currentCoins = this.state.selectedCoins.slice();
    const resetPromise = new Promise((resolve, reject) => {
      resolve(this.reset());
    });
    if (selection === "Live") {
      if (currentCoins[0]) {
        currentCoins = [currentCoins[0]];
      } else {
        this.setState({ selectedCoins: [] });
      }
    }
    resetPromise.then(() => {
      this.setState({ timeSelection: selection });
      if (currentCoins[0]) {
        this.getCoin(currentCoins);
      }
    });
  };

  getTimeConfig = () => {
    const { timeSelection } = this.state;
    const timeEnd = moment();
    let timeConfig;

    switch (timeSelection) {
      case "Live":
        timeConfig = {
          timeStart: timeEnd.subtract(20, "minute").toISOString(),
          interval: "10SEC"
        };
        break;
      case "24h":
        timeConfig = {
          timeStart: timeEnd.subtract(1, "day").toISOString(),
          interval: "15MIN"
        };
        break;
      case "1m":
        timeConfig = {
          timeStart: timeEnd.subtract(1, "month").toISOString(),
          interval: "8HRS"
        };
        break;
      case "1y":
        timeConfig = {
          timeStart: timeEnd.subtract(1, "year").toISOString(),
          interval: "5DAY"
        };
        break;
      case "All":
        timeConfig = {
          timeStart: timeEnd.subtract(8, "year").toISOString(),
          interval: "1MTH"
        };
        break;
      default:
        timeConfig = {
          timeStart: timeEnd.subtract(1, "day").toISOString(),
          interval: "15MIN"
        };
    }
    return timeConfig;
  };

  getYAxisData = apiResponse => {
    return apiResponse.map(d => {
      const parsed = Date.parse(d.time_open);
      return {
        date: new Date(parsed),
        price: d.price_open
      };
    });
  };

  getYAxisWsData = apiResponse => {
    const parsedDate = Date.parse(apiResponse.time_exchange);
    return {
      date: new Date(parsedDate),
      price: apiResponse.price
    };
  };

  getXAxisData = apiResponse => {
    return apiResponse.map(d => {
      let parsed = Date.parse(d.time_open);
      return {
        date: new Date(parsed)
      };
    });
  };

  getXAxisWsData = apiResponse => {
    const parsedTime = apiResponse.time_exchange;
    return {
      date: new Date(parsedTime)
    };
  };

  reset = () => {
    this.setState({
      yAxisData: [],
      xAxisData: [],
      openSearchTable: false,
      selectedCoins: []
    });
  };

  connectWS = ticker => {
    const handshake = {
      type: "hello",
      apikey: process.env.REACT_APP_COIN_API_KEY,
      heartbeat: false,
      subscribe_data_type: ["trade"],
      subscribe_filter_symbol_id: [`BITFINEX_SPOT_${ticker}_USD`]
    };
    const ws = new WebSocket("wss://ws.coinapi.io/v1/");

    ws.onopen = () => {
      ws.send(JSON.stringify(handshake));
    };

    ws.onmessage = evt => {
      if (!this.state.selectedCoins.length) {
        this.setState({ timeSelection: "24h" });
        ws.close();
        return;
      }

      const parsedResponse = JSON.parse(evt.data);
      const currentYData = this.state.yAxisData[0].data.slice(1);
      const newYData = this.getYAxisWsData(parsedResponse);
      const xAxisData = this.state.xAxisData.slice().splice(1);
      const newXData = this.getXAxisWsData(parsedResponse);
      xAxisData.push(newXData);
      currentYData.push(newYData);

      this.setState(prevState => ({
        yAxisData: [
          {
            ...prevState.yAxisData,
            data: currentYData
          }
        ],
        xAxisData
      }));
    };
  };

  getCoin = coinSymbols => {
    const config = {
      headers: { "X-CoinAPI-Key": process.env.REACT_APP_COIN_API_KEY }
    };
    const selectedCoins = this.state.selectedCoins.slice();
    const yAxisData = this.state.yAxisData.slice();
    const newCoins = selectedCoins.concat(coinSymbols);
    const timeConfig = this.getTimeConfig();
    const { timeSelection } = this.state;
    let xAxisData;

    if (coinSymbols.length) {
      this.setState({ loading: true });
    }

    coinSymbols.forEach((coin, index) => {
      const ticker = coin;
      const timeStart = timeConfig.timeStart;
      const interval = timeConfig.interval;
      // let endpoint = `https://rest.coinapi.io/v1/ohlcv/BITFINEX_SPOT_${ticker}_USD/history?period_id=${interval}&time_start=${timeStart}`;
      let endpoint = `https://rest.coinapi.io/v1/ohlcv/${ticker}/USD/history?period_id=${interval}&time_start=${timeStart}`;
      axios
        .get(endpoint, config)
        .then(res => {
          // res.data must be an array in order to be
          const yData = this.getYAxisData(res.data);
          const coinDataObject = { name: ticker, data: yData };
          yAxisData.push(coinDataObject);
          if (index < 1) {
            // only need to get time data once unless connecting to web socket
            xAxisData = this.getXAxisData(res.data);
            this.setState({ xAxisData });
          }
        })
        .then(() => {
          if (index === coinSymbols.length - 1) {
            // set state if this is last coin
            this.setState({
              selectedCoins: newCoins,
              yAxisData: yAxisData,
              openSearchTable: false,
              loading: false
            });
          }

          if (timeSelection === "Live") {
            return this.connectWS(coin);
          }
        })
        .catch(err => {
          this.notify(err.response.status);
          this.setState({ loading: false, openSearchTable: false });
          console.error("err", err.response.status);
          return;
        });
    });
  };

  removeCoin = coin => {
    const selectedCoinsCopy = this.state.selectedCoins.slice();
    const yAxisDataCopy = this.state.yAxisData.slice();
    const coinIndex = selectedCoinsCopy.indexOf(coin);
    let xAxisData = this.state.xAxisData;

    selectedCoinsCopy.splice(coinIndex, 1);
    yAxisDataCopy.splice(coinIndex, 1);

    if (this.state.selectedCoins.length === 1) {
      xAxisData = [];
    }

    this.setState({
      selectedCoins: selectedCoinsCopy,
      yAxisData: yAxisDataCopy,
      xAxisData: xAxisData
    });
  };

  openSearch = () => {
    this.setState({ openSearchTable: true });
  };

  toggleSearch = () => {
    this.setState(prevState => ({
      openSearchTable: !prevState.openSearchTable
    }));
  };

  setColor = index => {
    let color;
    switch (index) {
      case 0:
        color = "#40BF57";
        break;
      case 1:
        color = "#4799B7";
        break;
      case 2:
        color = "#A93FCF";
        break;
      default:
        color = "#40BF57";
    }
    return color;
  };

  getMinPrice = data => {
    return d3.min(data, d => d.price);
  };

  getMaxPrice = data => {
    return d3.max(data, d => d.price);
  };

  showToolTip = evt => {
    const { offsetX } = evt.nativeEvent;
    this.setState({ mouseX: offsetX - 50 }); //subtract 50 because of translateX of chart
  };

  hideToolTip = () => {
    this.setState({ mouseX: 0 });
  };

  getTimeFormat = () => {
    const { timeSelection } = this.state;
    if (timeSelection === "1m") {
      return "%d %b";
    } else if (timeSelection === "1y" || timeSelection === "All") {
      return "%d-%b-%y";
    } else if (timeSelection === "Live") {
      return "%M:%S";
    } else {
      return "%H:%M %p";
    }
  };

  render() {
    const h = 400;
    const w = 860;
    const chartComponents = [];
    const yAxisComponents = [];
    const { xAxisData, yAxisData } = this.state;
    const xScale = d3
      .scaleTime()
      .domain(
        d3.extent(xAxisData, d => {
          return d.date;
        })
      )
      .rangeRound([0, w]);
    const timeFormat = this.getTimeFormat();
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(12)
      .tickFormat(d3.timeFormat(timeFormat));

    let yAxisTranslateLeft = 0;
    let tickWidth = w * -1;

    yAxisData.forEach((coin, index) => {
      const strokeColor = this.setColor(index);
      const coinData = coin.data;
      const minPrice = this.getMinPrice(coinData);
      const maxPrice = this.getMaxPrice(coinData);
      const yScale = d3
        .scaleLinear()
        .rangeRound([h, 0])
        .domain([minPrice, maxPrice]);
      const yAxis = d3.axisLeft(yScale).tickSize(tickWidth);

      yAxisComponents.push(
        <Axis
          axis={yAxis}
          axisType="y"
          key={index}
          left={yAxisTranslateLeft}
          color={strokeColor}
        />
      );
      chartComponents.push(
        <Chart
          data={coinData}
          ref={coin.name}
          mouseX={this.state.mouseX}
          coin={coin.name}
          key={index + 1}
          stroke={strokeColor}
          timeSelection={this.state.timeSelection}
        />
      );

      yAxisTranslateLeft -= 35; // Put some space between y-axes
      tickWidth = 0;
    });

    return (
      <div className="App">
        <header className="App-header">
          <FontAwesomeIcon icon={faChartArea} className="fa fa-3x" />
          <h1 className="App-title">Coin Watch</h1>
          <FontAwesomeIcon icon={faCoins} className="fa fa-3x" />
        </header>
        <div className="col-md-9">
          <Tselect
            timeSelection={this.state.timeSelection}
            changeTimeSelection={this.changeTimeSelection}
          />
          {this.state.loading && (
            <div className="lds-ripple">
              <div></div>
              <div></div>
            </div>
          )}
          <svg className="graph-svg">
            <g transform="translate(50, 50)">
              {chartComponents}
              {yAxisComponents}
              <Axis h={h} axis={xAxis} axisType="x" />
              <rect
                className="draggable-area"
                height={h}
                width={w}
                opacity={0}
                onMouseLeave={this.hideToolTip}
                onMouseMove={evt => this.showToolTip(evt)}
              />
              {this.state.mouseX && this.state.selectedCoins.length && (
                <Slider
                  classname="slider"
                  setColor={this.setColor}
                  mouseX={this.state.mouseX}
                  xAxisData={this.state.xAxisData}
                  coinData={this.state.yAxisData}
                />
              )}
            </g>
          </svg>
          {this.state.yAxisData.length && (
            <h5 className="chart-legend">Price Chart - US Dollar (USD)</h5>
          )}
        </div>
        <div className="col-md-3">
          <div className="search-table-container">
            <SelectedCoins
              coins={this.state.selectedCoins}
              toggleSearch={this.toggleSearch}
              removeCoin={this.removeCoin}
              timeSelection={this.state.timeSelection}
              openSearchTable={this.state.openSearchTable}
            />
            {this.state.openSearchTable && (
              <SearchTable
                coins={this.state.selectedCoins}
                getCoin={this.getCoin}
              />
            )}
          </div>
        </div>
        <NotificationContainer timeOut="2000" />
      </div>
    );
  }
}

export default App;
