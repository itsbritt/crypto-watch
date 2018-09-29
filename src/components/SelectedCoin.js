import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons'

class SelectedCoin extends Component {

    render() {
        const { symbol, openSearchTable } = this.props;

        return (
            <div className="selected-coin">
                {
                    symbol !== 'Add Coin' ?  <FontAwesomeIcon icon={ faMinusCircle } onClick={ () => this.props.removeCoin(this.props.symbol) } className="fa-2x  remove-coin"/>
                    : !openSearchTable ? <FontAwesomeIcon onClick={ this.props.toggleSearch } icon={ faPlusCircle } className="fa-2x  add-coin" />
                    : <FontAwesomeIcon onClick={ this.props.toggleSearch } icon={ faMinusCircle } className="fa-2x  add-coin" />
                }
                <h2>{ this.props.symbol }</h2>
            </div>

        )

    }
}

export default SelectedCoin;
