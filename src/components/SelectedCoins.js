import React, { Component } from 'react';
import SelectedCoin from './SelectedCoin';

class SelectedCoins extends Component {

    render() {
        const { coins } = this.props;

        let icon = 'remove',
            selectedCoinComponents;

        selectedCoinComponents = coins.map((coin, index) => {
            return <SelectedCoin symbol={ coin } key={ index } icon={ icon } removeCoin={ this.props.removeCoin } />
        });

        //limit coins within selectedCoins table to 3
        if (coins.length < 3) {
            icon = 'add';
            selectedCoinComponents.push(<SelectedCoin symbol="Add New" icon={ icon } key={ coins.length } openSearch={ this.props.openSearch } />);
        }

        return (
            <div className="selected-coin-container">
                { selectedCoinComponents }
            </div>
        );
    }

}

export default SelectedCoins;
