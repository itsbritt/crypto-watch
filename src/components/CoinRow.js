import React, { Component } from 'react';

class CoinRow extends Component {
  render() {
    const coin = this.props.coin;
    return (
      <tr>
        <td>{coin.name}</td>
        <td>{coin.symbol}</td>
      </tr>
    );
  }
}

export default CoinRow;
