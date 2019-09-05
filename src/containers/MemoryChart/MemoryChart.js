import React from "react";
import { connect } from 'react-redux';
import ChartTitle from "../../components/ChartTitle";
import Chart from "react-apexcharts";
import { ButtonGroup  } from "reactstrap";
import DateDropDown from "../../components/DateDropDown/DateDropDown";
import AverageValues from "../../components/AverageValues";
import ButtonChartType from "../../components/ButtonChartType/ButtonChartType";
import MainChart from "../MainChart";


class MemoryChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keyDateResult: -1,
      keyDateResultEnd: -1,
      averageTab: [],

      // Chart
      chartType: 'line',
      options: {
        chart: {
          id: 'basic-bar',
        },
        xaxis: {
          categories: [],
          labels: {
            style: {
              color: '#FFFFFF',
            }
          }
        },
        yaxis: {
          labels: {
            style: {
              color: '#FFFFFF'
            }
          }
        },
        dataLabels: {
          style: {
            colors: ['#FFFFFF', '#E91E63', '#9C27B0']
          }
        },
        colors: ['#FF1654', '#247BA0', '#9C27B0', '#673245'],
        tooltip: {
          theme: 'dark',
        }
      },
      series: [
        {
          name: '',
          data: []
        },
        {
          name: '',
          data: []
        },
        {
          name: '',
          data: []
        },
        {
          name: '',
          data: []
        }
      ],
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.metricsFile !== undefined && this.props.metricsFile !== prevProps.metricsFile) {
      this.getMemoryInfosFromMetrics();
    }
  }

  getMemoryInfosFromMetrics() {
    const { metricsFile } = this.props;
    const { series, keyDateResult, keyDateResultEnd } = this.state;
    const varName = ['used', 'buff', 'cach', 'free'];
    let usedTab = [];
    let buffTab = [];
    let cachTab = [];
    let freeTab = [];
    metricsFile.map( (metrics) => {
      usedTab.push(metrics[varName[0]]);
      buffTab.push(metrics[varName[1]]);
      cachTab.push(metrics[varName[2]]);
      freeTab.push(metrics[varName[3]]);
    });
    let newSeries = JSON.parse(JSON.stringify(series));
    newSeries[0].data = MainChart.parseTable(usedTab, keyDateResult, keyDateResultEnd);
    newSeries[0].name = (varName[0]);
    newSeries[1].data = MainChart.parseTable(buffTab, keyDateResult, keyDateResultEnd);
    newSeries[1].name = varName[1];
    newSeries[2].data = MainChart.parseTable(cachTab, keyDateResult, keyDateResultEnd);
    newSeries[2].name = varName[2];
    newSeries[3].data = MainChart.parseTable(freeTab, keyDateResult, keyDateResultEnd);
    newSeries[3].name = varName[3];
    this.setState({ series: newSeries })
  };

  receiveCallbackFrom(key) {
    console.log("callBack from");
    const { keyDateResultEnd, series, options } = this.state;
    const { metricsFile } = this.props;
    this.setState({ keyDateResult: key }, () => {
      const fullDate = [];
      metricsFile.map( (metrics) => {
        fullDate.push(metrics.time);
      });
      let usedTab = MainChart.parseTable(series[0].data, key, keyDateResultEnd);
      let buffTab = MainChart.parseTable(series[1].data, key, keyDateResultEnd);
      let cachTab = MainChart.parseTable(series[2].data, key, keyDateResultEnd);
      let freeTab = MainChart.parseTable(series[3].data, key, keyDateResultEnd);
      let newSeries = JSON.parse(JSON.stringify(series));
      newSeries[0].data = usedTab;
      newSeries[1].data = buffTab;
      newSeries[2].data = cachTab;
      newSeries[3].data = freeTab;
      this.setState({
        series: newSeries
      });
      let newFullDate = MainChart.parseTable(fullDate, key, keyDateResultEnd);
      let newCategories = JSON.parse(JSON.stringify(options));
      newCategories.xaxis.categories = newFullDate;
      this.setState({
          options: newCategories
        }
      )
    });
  }

  receiveCallbackTo(key) {
    console.log("callBack to");
    const { keyDateResult, series, options } = this.state;
    const { metricsFile } = this.props;
    this.setState({ keyDateResultEnd: key }, () =>{
      const fullDate = [];
      metricsFile.map( (metrics) => {
        fullDate.push(metrics.time);
      });
      let usedTab = MainChart.parseTable(series[0].data, keyDateResult, key);
      let buffTab = MainChart.parseTable(series[1].data, keyDateResult, key);
      let cachTab = MainChart.parseTable(series[2].data, keyDateResult, key);
      let freeTab = MainChart.parseTable(series[3].data, keyDateResult, key);
      let newSeries = JSON.parse(JSON.stringify(series));
      newSeries[0].data = usedTab;
      newSeries[1].data = buffTab;
      newSeries[2].data = cachTab;
      newSeries[3].data = freeTab;
      console.log("usedTab", usedTab);
      this.setState({
        series: newSeries
      });
      let newFullDate = MainChart.parseTable(fullDate, keyDateResult, key);
      let newCategories = JSON.parse(JSON.stringify(options));
      newCategories.xaxis.categories = newFullDate;

      console.log("newCategories", newFullDate);
      this.setState({
          options: newCategories
        }, () => {
        console.log("options", options.xaxis)
      })
    })
  }

  render() {
    const {
      options,
      series,
      averageTab,
      keyDateResult,
      chartType,
    } = this.state;
    return (
      <div className="main-div">
        <div>
          <ChartTitle title='Memory Chart (used - buff - cach - free)' />
          <div className='chart-div'>
            <div className="dropdown-outside-global">
              <ButtonGroup>
                <DateDropDown
                  select={'from'}
                  value={keyDateResult}
                  callback={this.receiveCallbackFrom.bind(this)}
                />
                <DateDropDown
                  select={'to'}
                  value={keyDateResult}
                  callback={this.receiveCallbackTo.bind(this)}
                />
              </ButtonGroup>
            </div>
            <Chart
              options={options}
              series={series}
              type={chartType}
              width='1000'
            />
          </div>
        </div>
        {/*<div className="column-div">*/}
        {/*  <AverageValues tab={averageTab}/>*/}
        {/*</div>*/}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    metricsFile: state.metricsReducer.metricsFile
  };
}

export default connect(mapStateToProps, null)(MemoryChart);
