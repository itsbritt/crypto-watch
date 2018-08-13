import React, { Component } from 'react';
import SelectedCoin from './SelectedCoin';

class SelectedCoins extends Component {

    render() {
        let selectedCoins = this.props.coins,
            selectedCoinComponents,
            icon = 'remove',
            key="key";

        selectedCoinComponents = selectedCoins.map(coin => {
            return <SelectedCoin symbol={coin.symbol} key={coin.name} icon={icon} />
        });

        if (selectedCoins.length < 3) {
            selectedCoinComponents.push(<SelectedCoin symbol="Add New" icon='add' key={key} openSearch={this.props.openSearch} />);
        }

        return (
            <div className="selected-coin-container">
                {selectedCoinComponents}
            </div>
        );
    }

}

export default SelectedCoins;
