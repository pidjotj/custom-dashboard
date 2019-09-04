import React from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ButtonGroup } from 'reactstrap';
import './style/index.css'

class ButtonChartType extends React.Component {
  constructor(props) {
    super(props);

    console.log("props", props);
  }

   getChartType(e) {
    const { callback } = this.props;
    console.log(e.target.value);
    callback(e.target.value);
  }

  render() {
    return (
      <div className="button-div">
        <span className="chart-type-title">Select a chart type:</span>
        <ButtonGroup size="md" vertical>
          <button onClick={(value) => this.getChartType(value)} className="button-group" value={"line"}>line</button>
          <button onClick={(value) => this.getChartType(value)} className="button-group" value={"area"}>area</button>
          <button onClick={(value) => this.getChartType(value)} className="button-group" value={"bar"}>bar</button>
        </ButtonGroup>
      </div>
    );
  }
}

ButtonChartType.propTypes = {
  callback: PropTypes.func,
};

export default connect(null, null)(ButtonChartType);
