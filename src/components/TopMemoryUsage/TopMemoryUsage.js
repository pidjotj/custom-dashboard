import React from "react";
import PropTypes from 'prop-types';
import { ChartUtils } from "../../utils/ChartUtils";

class TopMemoryUsage extends React.Component {
  render() {
    const { valuesTab } = this.props;
    console.log("values", valuesTab);
    return (
      <div className="column-div">
        <span className="first-average">used average: {<span className="normal-text">{ChartUtils.formatBytes(valuesTab[0])}</span>}</span>
        <span className="second-average">buff average: {<span className="normal-text">{ChartUtils.formatBytes(valuesTab[1])}</span>}</span>
        <span className="third-average">cach average: {<span className="normal-text">{ChartUtils.formatBytes(valuesTab[2])}</span>}</span>
        <span className="fourth-average">free average: {<span className="normal-text">{ChartUtils.formatBytes(valuesTab[3])}</span>}</span>
      </div>
    );
  }
}

TopMemoryUsage.propTypes = {
  valuesTab: PropTypes.array.isRequired,
};

export default TopMemoryUsage;
