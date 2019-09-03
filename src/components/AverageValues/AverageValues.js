import React from "react";
import PropTypes from 'prop-types';

class AverageValues extends React.Component {
  render() {

    const { tab } = this.props;
    console.log("avrageTab", this.props.tab);

    return (
      <div className="column-div">
        <span>Highest value {tab[0]}</span>
        <span>Medium value {tab[2]}</span>
        <span>Lowest value {tab[1]}</span>
      </div>
    );
  }
}

AverageValues.propTypes = {
  tab: PropTypes.array
};

export default AverageValues;
