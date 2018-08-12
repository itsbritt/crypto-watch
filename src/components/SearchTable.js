import React, { Component } from 'react';
import SearchBar from './SearchBar';
import FilteredList from './FilteredList';

class SearchTable extends Component {
  constructor(props) {
   super(props);
   this.state = {
     filteredText: '',
     enableSelect: false
   };

   this.onTextChange = this.onTextChange.bind(this);
   this.enableSelect = this.enableSelect.bind(this);
   this.disableSelect = this.disableSelect.bind(this);
 }

 enableSelect() {
   const enableSelect = this.state.enableSelect;
   if (enableSelect) {
     return;
   }
   this.setState({enableSelect: true});
 }

 disableSelect() {
   const enableSelect = this.state.enableSelect;
   if (!enableSelect) {
     return;
   }
   this.setState({enableSelect: false});
 }

 onTextChange(filteredText) {
   this.setState({ filteredText });
 }

  render() {
    return (
      <div>
        <SearchBar onTextChange={this.onTextChange} filteredText={this.state.filteredText} enableSelect={this.state.enableSelect}/>
        <FilteredList coins={this.props.coins} filteredText={this.state.filteredText} enableSelect={this.enableSelect} disableSelect={this.disableSelect}/>
      </div>
    );
  }
}

export default SearchTable;
