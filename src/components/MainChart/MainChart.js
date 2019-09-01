import React from "react";
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { connect } from 'react-redux';
import Chart from "react-apexcharts";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, ButtonGroup, Button } from 'reactstrap';
import DateDropDown from "../DateDropDown";
import VariableDropDown from "../VariableDropDown";

class MainChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keyDateResult: null,
      fromResult: '',
      toResult: '',
      currentVariable: '',
      options: {
        chart: {
          id: "basic-bar"
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999,1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
        }
      },
      series: [
        {
          name: "series-1",
          data: [30, 40, 45, 50, 49, 60, 70, 91,30, 40, 45, 50, 49, 60, 70, 91]
        }
      ]
    };
  }

  receiveCallbackFrom(key) {
      this.setState({ keyDateResult: key });
  };

  receiveCallbackTo(date) {
    this.setState({ toResult: date })
  }

  receiveCallbackVariable(variable) {
    this.setState( {  currentVariable: variable} )
  }

  render() {
    const { metricsFile } = this.props;
    const { keyDateResult } = this.state;
    return (
      <div>
        <div className="flex-row">
          <VariableDropDown
            callback={this.receiveCallbackVariable.bind(this)}
          />
          <ButtonGroup>
            <DateDropDown
              select={"from"}
              value={keyDateResult}
              callback={this.receiveCallbackFrom.bind(this)}
            />
            <DateDropDown
              select={"to"}
              value={keyDateResult}
              callback={this.receiveCallbackTo.bind(this)}
            />
          </ButtonGroup>
        </div>
        <Chart
          options={this.state.options}
          series={this.state.series}
          type="line"
          width="900"
        />
      </div>
    )
  }
};

function mapStateToProps(state) {
  return {
    metricsFile: state.metricsReducer.metricsFile
  };
}

export default connect(mapStateToProps, null)(MainChart);
