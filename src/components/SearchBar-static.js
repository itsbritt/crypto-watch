import React, { Component } from 'react';

class CoinRow extends Component {
  render() {
    const coin = this.props.coin;
    return (
      <tr>
        <td>{coin.name}
        <td>{coin.symbol}
      </tr>
    );
  }
}

class SearchBar extends Component {
  constructor(props){
    super(props);
    this.handleSearchInput = this.handleSearchInput.bind(this);
  }

  handleSearchInput(e) {
    this.props.onUserInput(e.target.value);
  }

  render() {
    return (
      <RB.FormGroup>
        <RB.InputGroup>
          <RB.FormControl
          type="text"
          placeholder="Search"
          value={filteredText}
          />
          <RB.InputGroup.Button>
            <RB.Button>Select</RB.Button>
          </RB.InputGroup.Button>
        </RB.InputGroup>
      </RB.FormGroup>
    )
  }
}

class FilteredList extends Component {
  render() {
    const rows = this.props.coins.map(coin => {
      <CoinRow coin={coin} key={coin.name} />;
    });
    return(
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Symbol</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

class SearchTable extends Component {
  constructor(props) {
   super(props);
   this.state = { filteredText: '' };
   this.onUserInput = this.onUserInput.bind(this);
 }

 onUserInput = () => {
   const filteredText = this.refs.filteredTextInput.value;
   this.setState({ filteredText });
 }

  render() {
    return (
      <div>
      <SearchBar
        filteredText={this.state.filteredText}
        onUserInput={this.onUserInput}
      />
        <FilteredList /> /* Only show if there are coins in this list */
      </div>
    )
  }
}

const COINS = [
  {name: 'Bitcoin', symbol: 'BTC'},
  {name: 'Ethereum', symbol: 'ETC'},
  {name: 'Ripple', symbol: 'XRP'},
  {name: 'Litecoin', symbol: 'LTC'},
  {name: 'Bitcoin Cash', symbol: 'BCH'}
];

// ReactDOM.render(
//   <SearchTable coins={COINS} />,
//    document.getElementById('container')
// );

// Considering the pieces of data: Determining what is state vs props...
  // 1. The original list of searchable COINS
    // Passed thru parent via props
    // Remains unchanged overtime
    // We can conclude this probably isnt state
  // 2. The filtered List of coins - NOT state because it can be computed by combining search text with original list
  // 3. The text entered into the search bar by the user - state data because it can be changed over time and can't be computed from anything else

  // * Conclusion: Our only state data is the search text

  // Next Step: Determining where the state should live
    // Find the COMMON OWNER COMPONENT
