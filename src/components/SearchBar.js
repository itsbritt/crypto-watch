import React, { Component } from 'react';
// import { FormGroup, InputGroup, Button, FormControl } from 'react-bootstrap';

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
                <div>
                <input
                    type="text"
                    placeholder="Ticker Symbol"
                    onChange={this.onUserInput}
                />
                <button onClick={() => this.props.getCoin(this.state.inputText)}>Search</button>
                </div>
        );
    }
}

export default SearchBar;
