import React, { Component } from 'react';
import SearchBar from './SearchBar';

class SearchTable extends Component {

    render() {

        return (
          <div>
            <SearchBar getCoin={ this.props.getCoin }/>
          </div>
        );
    }
}

export default SearchTable;
