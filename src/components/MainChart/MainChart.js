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

      tempVariableData: [],

      // Chart
      options: {
        chart: {
          id: "basic-bar"
        },
        xaxis: {
          categories: [261951488, 261136384, 267026432, 264118272, 261627904, 265289728, 256368640, 261992448, 258969600, 264736768, 261332992, 259375104, 257339392, 264241152, 261734400, 258854912, 265363456, 262742016, 261017600, 272863232, 267821056, 275456000]
        },
        dataLabels: {
          style: {
            colors: ['#F44336', '#E91E63', '#9C27B0']
          }
        }
      },
      series: [
        {
          name: "series-1",
          data: [30, 40, 45, 50, 49, 60, 170, 391, 530, 340, 45, 50, 49, 60, 70, 91]
        },
        // {
        //   name: "series-2",
        //   data: [30, 40, 45, 50, 49, 60, 170, 391, 530, 340, 45, 50, 49, 60, 70, 91]
        // }
      ]
    };
  }

  receiveCallbackFrom(key) {
      this.setState({ keyDateResult: key });
  };

  receiveCallbackTo(date) {
    this.setState({ toResult: date })
  }

  static parseTable(oldTab) {

    let newTab = [];
    const maxVal = 20;
    const delta = Math.floor(oldTab.length / maxVal);

    for (let i = 0; i < oldTab.length; i += delta) {
      newTab.push(oldTab[i]);
    }

    return newTab;
  }

  receiveCallbackVariable(variable) {
    let test = variable;
    this.setState( { currentVariable: variable }, (variable) => {
      let temp = [];
      this.props.metricsFile.map( (metrics, key) => {
        temp.push(metrics[test]);
      });
      this.setState({ tempVariableData: temp }, () => {
        const { tempVariableData } = this.state;
        if (tempVariableData.length > 20) {
          let newTab = MainChart.parseTable(tempVariableData);
          let newSeries = JSON.parse(JSON.stringify(this.state.series));
          newSeries[0].data = newTab;
          this.setState({
            series: newSeries
          }, () => {
            console.log("data", this.state.series);
          })
        }
      })
    })
  }

  render() {
    const { metricsFile } = this.props;
    const { keyDateResult } = this.state;
    return (
      <div>
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
