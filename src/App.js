import React, { Component } from 'react';
import SearchBar from './components/SearchBar';
// import logo from './logo.svg'; // add new logo
import './App.css';

class App extends Component {
  //use this with updated logo
  // <img src={logo} className="App-logo" alt="logo" />
  render() {
    return (
      <div className="App">
        <header className="App-header">

          <h1 className="App-title">Crypto Tracker</h1>
            <SearchBar/>
        </header>

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
