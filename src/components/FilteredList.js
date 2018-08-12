import React, { Component } from 'react';
import CoinRow from './CoinRow';

class FilteredList extends Component {

  constructor(props) {
    super(props);

    this.state = { coins: props.coins };
  }

  componentWillReceiveProps(nextProps) {
    const filteredText = nextProps.filteredText,
          coins = [];

    nextProps.coins.forEach(coin => {
      let coinName = coin.name.toLowerCase(),
          coinSymbol = coin.symbol.toLowerCase();

      if (coinName.indexOf(filteredText.toLowerCase()) === -1 && coinSymbol.indexOf(filteredText.toLowerCase()) === -1) {
        return;
      }
      coins.push(coin);
    });

    this.setState({ coins });

    if (coins.length === 1) {
      this.props.enableSelect();
    } else if (coins.length === 0) {
      // send notification: "No Results"
      this.props.disableSelect();
    } else {
      this.props.disableSelect();
    }
  }

  render() {
      const rows = [],
            coins = this.state.coins;

      coins.forEach(coin => {
        let coinName = coin.name;
        rows.push(<CoinRow coin={coin} key={coinName} />);
      });

    return(
      <table>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

export default FilteredList;
