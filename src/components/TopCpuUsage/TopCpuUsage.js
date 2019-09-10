import React from "react";
import PropTypes from 'prop-types';
import { ChartUtils } from "../../utils/ChartUtils";

class TopCpuUsage extends React.Component {
  render() {
    const { valuesTab } = this.props;
    return (
      <div className="column-div">
        <span className="first-average">usr average: {<span className="normal-text">{valuesTab[0]}%</span>}</span>
        <span className="second-average">sys average: {<span className="normal-text">{valuesTab[1]}%</span>}</span>
        <span className="third-average">idl average: {<span className="normal-text">{valuesTab[2]}%</span>}</span>
        <span className="fourth-average">wai average: {<span className="normal-text">{valuesTab[3]}%</span>}</span>
        <span className="fifth-average">hiq average: {<span className="normal-text">{valuesTab[4]}%</span>}</span>
        <span className="sixth-average">siq average: {<span className="normal-text">{valuesTab[5]}%</span>}</span>
      </div>
    );
  }
}

TopCpuUsage.propTypes = {
  valuesTab: PropTypes.array.isRequired,
};
export default TopCpuUsage;
