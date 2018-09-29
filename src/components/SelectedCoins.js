import React, { Component } from 'react';
import SelectedCoin from './SelectedCoin';

class SelectedCoins extends Component {

    render() {
        const { coins, timeSelection } = this.props;

        let icon = 'remove',
            selectedCoinComponents;

        selectedCoinComponents = coins.map((coin, index) => {
            return <SelectedCoin symbol={ coin } key={ index } icon={ icon } removeCoin={ this.props.removeCoin } openSearchTable={ this.props.openSearchTable }  />
        });

        //limit coins within selectedCoins table to 3
        if (coins.length < 3 && timeSelection !== 'Live') {
            icon = 'add';
            selectedCoinComponents.push(<SelectedCoin symbol="Add Coin" icon={ icon } key={ coins.length } toggleSearch={ this.props.toggleSearch } openSearchTable={ this.props.openSearchTable } />);
        } else if (!coins.length && timeSelection === 'Live') {
            selectedCoinComponents.push(<SelectedCoin symbol="Add Coin" icon={ 'add' } key={ coins.length } toggleSearch={ this.props.toggleSearch } openSearchTable={ this.props.openSearchTable } />);
        }

        return (
            <div className="selected-coin-container">
                { selectedCoinComponents }
            </div>
        );
    }

}

export default SelectedCoins;
