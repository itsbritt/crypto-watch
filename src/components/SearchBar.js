import React, { Component } from 'react';
import * as RB from 'react-bootstrap';

class SearchBar extends Component {
  constructor(props) {
   super(props);
   this.state = { filteredText: '' };

   this.onUserInput = this.onUserInput.bind(this);
 }

  onUserInput = () => {
    console.log(this.refs);
    const filteredText = this.refs.filteredTextInput.value;
    this.setState({ filteredText });
  }

  render() {
    return(

      <RB.FormGroup>
        <RB.InputGroup>
          <RB.FormControl
          type="text"
          placeholder="Search..."
          value={this.state.filteredText}
          ref="filteredTextInput"
          onChange={this.onUserInput}/>
          <RB.InputGroup.Button>
            <RB.Button>Search</RB.Button>
          </RB.InputGroup.Button>
        </RB.InputGroup>
      </RB.FormGroup>
    )
  }
}

export default SearchBar;

// <form>
//   <input
//     type="text"
//     placeholder="Search..."
//     value={this.state.filteredText}
//     ref="filteredTextInput"
//     onChange={this.onUserInput}
//   />
// </form>
// <button type="button" />
