import React, { Component } from 'react';
import * as RB from 'react-bootstrap';

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
        return(
            <RB.FormGroup className="search-form">
                <RB.InputGroup>
                    <RB.FormControl
                        type="text"
                        placeholder="Ticker Symbol"
                        onChange={this.onUserInput}
                    />
                    <RB.InputGroup.Button>
                        <RB.Button onClick={() => this.props.getCoin(this.state.inputText)}>Search</RB.Button>
                    </RB.InputGroup.Button>
                </RB.InputGroup>
            </RB.FormGroup>
        );
    }
}

export default SearchBar;
