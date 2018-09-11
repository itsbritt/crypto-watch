import React, { Component } from 'react';
import * as RB from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

class SearchBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            inputText: ''
        };
    }

    onUserInput = (e) => {
        let typed = e.target.value,
            cleaned = typed.trim().toUpperCase();

        // Check for coin in selected coins
        if (this.props.selectedCoins.indexOf(cleaned) === -1) {
            this.setState({ inputText: [cleaned] });
        } else {
            console.log('coin already added');
            //notification here
        }
    };

    render() {
        // loading is not set up yet
        const { isLoading } = this.props;
        return (
                <div className="search-bar-elements">
                    <RB.FormControl
                        type="text"
                        onChange={ this.onUserInput }
                        placeholder="Symbol (e.g., BTC)"
                        className="custom-search"
                        autoFocus
                    />
                    <RB.Button className="search-btn" onClick={ () => this.props.getCoin(this.state.inputText) }>
                        { isLoading ? (<i className="fa fa-spinner fa-pulse fa-2x"></i>)  :
                        <FontAwesomeIcon icon={faPaperPlane} className="fa-2x" />
                        }
                    </RB.Button>
                </div>
        );
    }
}

export default SearchBar;
