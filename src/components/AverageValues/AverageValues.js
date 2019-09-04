import React from "react";
import PropTypes from 'prop-types';

class AverageValues extends React.Component {
  render() {

    const { tab } = this.props;
    console.log("avrageTab", this.props.tab);

    return (
      <div className="column-div">
        <span className="high-value">Highest: {<span className="normal-text">{!tab[0] && tab[0] !== 0  ? '_____' : tab[0] }</span>}</span>
        <span className="average-value">Average: {<span className="normal-text">{!tab[2] && tab[2] !== 0  ? '_____' : tab[2]}</span>}</span>
        <span className="low-value">Lowest: {<span className="normal-text">{!tab[1] && tab[1] !== 0 ? '_____' : tab[1]}</span>}</span>
      </div>
    );
  }
}

AverageValues.propTypes = {
  tab: PropTypes.array
};

export default AverageValues;
