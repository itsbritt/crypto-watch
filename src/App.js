import React, { Component } from 'react';
import SearchTable from './components/SearchTable';
import SelectedCoins from './components/SelectedCoins';
import socketIOClient from 'socket.io-client'

// import axios from 'axios';

// import { library } from '@fortawesome/fontawesome-svg-core';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faStroopwafel } from '@fortawesome/free-solid-svg-icons';
// import logo from './logo.svg'; // add new logo
import './App.css';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedCoins: [], // should this be array of objects with price and time data in each?
            openSearchTable: false,
            endpoint: `http://2605:6000:e8c0:8000:2595:b1b:4acd:604e:5000`,
            color: 'white'
        };
    }

    send = () => {
        const socket = socketIOClient(this.state.endpoint);

        socket.emit('change color', this.state.color);
    }

    setColor = (color) => {
        this.setState({ color });
    }

    getCoin = (coinSymbol) => {
        const ticker = coinSymbol.trim().toUpperCase();
        const handshake = {
                            "type": "hello",
                            "apikey": "40359CB8-D9FD-463C-8537-008C7D755BAA",
                            "heartbeat": false,
                            "subscribe_data_type": ["trade"],
                            "subscribe_filter_symbol_id": [ `BITSTAMP_SPOT_${ticker}_USD`]
                        };
        const ws = new WebSocket('wss://ws.coinapi.io/v1/');

        ws.onopen = () => {
            ws.send(JSON.stringify(handshake));
        };

        ws.onmessage = (evt) => {
            let data = JSON.parse(evt.data);
            console.log('response type', evt);

            if (data.type === 'error') {
                console.log('error !');
                //handle error
            } else {
                this.setState({
                    // push coin into selectedCoins,

                })
            }
        };


        // this.setState({
        //
        // })
    };

    openSearch = () => {
        this.setState({openSearchTable: true});
    };

    render() {

        return (
            <div className="App">
                <header className="App-header">

                <h1 className="App-title">Crypto Watch</h1>
                <button onClick={() => this.send()}>Change Color</button>
                <button id="blue" onClick={() => this.setColor('blue')}>Blue</button>
                <button id="red" onClick={() => this.setColor('red')}>Red</button>
                </header>
                <div className="app-body">
                    <div className="col-md-8">
                        <div className="graph-placeholder"></div>
                    </div>
                    <div className="col-md-4">
                        <div className="search-table-container">
                            <SelectedCoins coins={this.state.selectedCoins} openSearch={this.openSearch}/>
                            { this.state.openSearchTable ? <SearchTable getCoin={this.getCoin} /> : null }
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default App;

// Enter Text
// Show filtered list in dropdown  // probably unnecessary
// on select / enter  check if that symbol is valid
// if valid - make request, add symbol to activeList
// if invalid - notify user of invalid code
