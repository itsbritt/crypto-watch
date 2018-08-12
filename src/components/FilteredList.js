import React, { Component } from 'react';
import CoinRow from './CoinRow';

class FilteredList extends Component {


  render() {
    const filteredText = this.props.filteredText,
          rows = [];

    let enableSelect;

    this.props.coins.forEach(coin => {
      let coinName = coin.name.toLowerCase(),
          coinSymbol = coin.symbol.toLowerCase();

      if (coinName.indexOf(filteredText.toLowerCase()) === -1 && coinSymbol.indexOf(filteredText.toLowerCase()) === -1) {
        return;
      }
      rows.push(<CoinRow coin={coin} key={coinName} />);
    });

    if (rows.length === 1) {
      enableSelect = true;
      // this.props.enableSelect();
    } else {
      enableSelect = false;
      // this.props.disableSelect();
    }

    return(
      <table enableselect={enableSelect}>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}


export default FilteredList;
