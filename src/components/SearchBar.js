import React, { Component } from 'react';
import * as RB from 'react-bootstrap';

class SearchBar extends Component {

  constructor(props) {
    super(props);
    this.onUserInput = this.onUserInput.bind(this);
  }

  onUserInput(e) {
    this.props.onTextChange(e.target.value);
  }

  render() {
    return(
      <RB.FormGroup>
        <RB.InputGroup>
          <RB.FormControl
          type="text"
          placeholder="Search..."
          onChange={this.onUserInput}/>
          <RB.InputGroup.Button>
            <RB.Button disabled={!this.props.enableSelect}>Search</RB.Button>
          </RB.InputGroup.Button>
        </RB.InputGroup>
      </RB.FormGroup>
    );
  }
}

export default SearchBar;
