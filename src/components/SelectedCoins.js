import React, { Component } from 'react';
import SelectedCoin from './SelectedCoin';

class SelectedCoins extends Component {

    render() {
        let selectedCoins = this.props.coins,
            selectedCoinComponents,
            icon = 'remove',
            id = 0;

        selectedCoinComponents = selectedCoins.map(coin => {
            return <SelectedCoin symbol={ coin } key={ id++ } icon={ icon } />
        });

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
