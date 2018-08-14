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
            selectedCoins: [],
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
        const ticker = coinSymbol.trim().toUpperCase(),
            dummyData = {
                symbol: ticker
            };

        this.setState({
            selectedCoins: this.state.selectedCoins.concat(dummyData),
            openSearchTable: false
        });

        // this.setState({selectedCoins: this.state.selectedCoins.push(ticker)});


        // set loading animation
        //generate web socket connection
        // should already have checked if we can add another coin
        // axios.get(`https://rest.coinapi.io/v1/exchangerate/${ticker}/USD`, {
        // headers: {'X-CoinAPI-Key': '40359CB8-D9FD-463C-8537-008C7D755BAA'} // TODO put this in .env file
        // })
        // .then(res => {
        //     // remove loading animation, close search table
        //     let selectedCoins = this.state.selectedCoins;
        //     selectedCoins.push()
        //     this.setState({
        //         fetchedCoin: res.data,
        //         selectedCoins: selectedCoins.push(),
        //         openSearchTable: false;
        //     });
        //     console.log('success');
        // },
        // (error) => {
        //     console.log('That is not a valid ticker symbol, you idiot.');
        //     this.setState({
        //         error
        //     });
        // });
    };

    openSearch = () => {
        this.setState({openSearchTable: true});
    };

  //use this with updated logo
  // <img src={logo} className="App-logo" alt="logo" />

    render() {

        const socket = socketIOClient(this.state.endpoint);

        socket.on('change color', (color) => {
            document.body.style.backgroundColor = color;
        });

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
