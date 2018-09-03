import React, { Component } from 'react';
import SelectedCoin from './SelectedCoin';

class SelectedCoins extends Component {

    render() {
        let selectedCoins = this.props.coins,
            selectedCoinComponents,
            icon = 'remove',
            id = 0;

        selectedCoinComponents = selectedCoins.map(coin => {
            return <SelectedCoin symbol={ coin } key={ id++ } icon={ icon } removeCoin={ this.props.removeCoin } />
        });

        // this limits coins within selectedCOins table to 3 max, and user will only see add new coin  only if 2 or less are already added
        if (selectedCoins.length < 3) {
            selectedCoinComponents.push(<SelectedCoin symbol="Add New" icon='add' key={ id++ } openSearch={ this.props.openSearch } />);
        }

        return (
            <div className="selected-coin-container">
                { selectedCoinComponents }
            </div>
        );
    }

}

export default SelectedCoins;
