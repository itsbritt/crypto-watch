import React, { Component } from 'react';
import * as d3 from 'd3';

class Slider extends Component {

    render() {
        const { xAxisData, mouseX, coinData } = this.props;
        const toolTipData = [];
        const textElements = [];
        const circleElements = [];
        const toolTipHeight = 450; // 50 greater than height of chart
        const xScale = d3.scaleTime()
            .domain(d3.extent(xAxisData, (d) => d.date))
            .range([0, 860]);

        coinData.forEach((coin, index) => {
            const domainPosition = xScale.invert(mouseX); //
            const bisectDate = d3.bisector((xAxisData) => xAxisData.date).right;
            const datePriceObject = coin.data[bisectDate(coin.data, domainPosition)] || {};

            datePriceObject.name = coin.name;
            toolTipData.push(datePriceObject);
        });

        toolTipData.forEach((coin, index) => {
            const x = this.props.mouseX + 15;
            const y = (index * 18) + toolTipHeight;
            const fillColor = this.props.setColor(index);

            textElements.push(<text stroke={ fillColor } key={ index } x={ x } y={ y }>{ coin.name }: { coin.price } </text>);
            circleElements.push(<circle key={ index } cx={ mouseX + 4 } r={ 4 } cy={ toolTipHeight } />);
        });

        return (
            <g>
                { textElements }
                { circleElements }
                {/* +3 gives some extra padding between pointer and this rect element to avoid triggering mouseLeave on App.js */}
                <rect width={ 1 } height={ toolTipHeight } x={ mouseX + 3 } fill="white" />
            </g>
        );
    }
}

Slider.defaultProps = {
    coinData: []
};

export default Slider;
