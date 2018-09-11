import React, { Component } from 'react';

class Tselect extends Component {

    render() {
        const options = ['Live', '24h', '1m', '1y', 'All'];
        const { timeSelection } = this.props;
        
        let listOptions = options.map(option => {
            let activeClass = timeSelection === option ? 'active' : 'inactive';
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
