import React from "react";
import PropTypes from 'prop-types';

class TopMemoryUsage extends React.Component {
  render() {
    const { valuesTab } = this.props;
    console.log("values", valuesTab);
    return (
      <div className="column-div">
        <span className="used-average">used average: {<span className="normal-text">{ valuesTab[0] }</span>}</span>
        <span className="buff-average">buff average: {<span className="normal-text">{valuesTab[1]}</span>}</span>
        <span className="cach-average">cach average: {<span className="normal-text">{valuesTab[2]}</span>}</span>
        <span className="free-average">free average: {<span className="normal-text">{valuesTab[3]}</span>}</span>
      </div>
    );
  }
}

TopMemoryUsage.propTypes = {
  valuesTab: PropTypes.array.isRequired,
};

export default TopMemoryUsage;
