import React, { Component } from 'react';
import * as RB from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
// import { FormGroup, FormControl } from 'react-bootstrap';

class SearchBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            inputText: ''
        };
        this.onUserInput = this.onUserInput.bind(this);
    }

    onUserInput(e) {
        this.setState({
            inputText: e.target.value
        });
    }

    render() {
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
                        <FontAwesomeIcon icon={faPaperPlane} className="fa-2x" />
                    </RB.Button>
                </div>
        );
    }
}

export default SearchBar;
