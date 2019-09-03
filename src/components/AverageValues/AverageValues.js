import React from "react";
import PropTypes from 'prop-types';

class AverageValues extends React.Component {
  render() {

    const { tab } = this.props;
    console.log("avrageTab", this.props.tab);

    return (
      <div className="column-div">
        <span className="high-value">Highest: {tab[0]}</span>
        <span className="average-value">Average: {tab[2]}</span>
        <span className="low-value">Lowest: {tab[1]}</span>
      </div>
    );
  }
}

AverageValues.propTypes = {
  tab: PropTypes.array
};

export default AverageValues;
