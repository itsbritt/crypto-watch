import React, { Component } from 'react';

class Tselect extends Component {
    render() {
        let currentSelection = this.props.timeSelection;
        let options = ['Live', '24h', '1m', '1y', 'All'];
        let listOptions = options.map(option => {
            let activeClass = currentSelection === option ? 'active' : 'inactive';
            return <li key={ option } className={ activeClass } onClick={ () => this.props.changeTimeSelection(option) }>{ option }</li>
        });
        return (
            <ul className="t-select-list">
                { listOptions }
            </ul>
        )
    }
}

export default Tselect;
