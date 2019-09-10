import React from "react";
import { connect } from 'react-redux';
import { ChartUtils } from "../../../../utils/ChartUtils";
import { maxTabMemory } from "../../../../utils/Constants";
import ChartTitle from "../../../../components/ChartTitle";
import { ButtonGroup } from "reactstrap";
import DateDropDown from "../../../../components/DateDropDown/DateDropDown";
import Chart from "react-apexcharts";
import TopMemoryUsage from "../../../../components/TopMemoryUsage";
import TopCpuUsage from "../../../../components/TopCpuUsage";

class CpuChart extends React.Component {
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
        colors: ['#FF1654', '#247BA0', '#9C27B0', '#ff7b5C', '#66CC33', '#FFD700'],
        tooltip: {
          theme: 'dark',
        }
      },
      series: [
        {
          name: '',
          data: [],
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

  // Used componentDidUpdate to initialize values.
  componentDidUpdate(prevProps) {
    if (this.props.metricsFile !== undefined && this.props.metricsFile !== prevProps.metricsFile) {
      this.initChart();
    }
  }

  initChart() {
    this.getInfosFromMetrics();
    this.getTimeFromMetrics();
  };

  getInfosFromMetrics() {
    const { metricsFile } = this.props;
    const { series, keyDateResult, keyDateResultEnd } = this.state;

    const varName = ['usr', 'sys', 'idl', 'wai', 'hiq', 'siq'];
    let usrTab = [];
    let sysTab = [];
    let idlTab = [];
    let waiTab = [];
    let hiqTab = [];
    let siqTab = [];

    metricsFile.map( (metrics) => {
      usrTab.push(metrics[varName[0]]);
      sysTab.push(metrics[varName[1]]);
      idlTab.push(metrics[varName[2]]);
      waiTab.push(metrics[varName[3]]);
      hiqTab.push(metrics[varName[4]]);
      siqTab.push(metrics[varName[5]]);
    });
    let newSeries = JSON.parse(JSON.stringify(series));
    newSeries[0].data = ChartUtils.parseTable(usrTab, keyDateResult, keyDateResultEnd, maxTabMemory);
    newSeries[0].name = (varName[0]);
    newSeries[1].data = ChartUtils.parseTable(sysTab, keyDateResult, keyDateResultEnd, maxTabMemory);
    newSeries[1].name = varName[1];
    newSeries[2].data = ChartUtils.parseTable(idlTab, keyDateResult, keyDateResultEnd, maxTabMemory);
    newSeries[2].name = varName[2];
    newSeries[3].data = ChartUtils.parseTable(waiTab, keyDateResult, keyDateResultEnd, maxTabMemory);
    newSeries[3].name = varName[3];
    newSeries[4].data = ChartUtils.parseTable(hiqTab, keyDateResult, keyDateResultEnd, maxTabMemory);
    newSeries[4].name = varName[4];
    newSeries[5].data = ChartUtils.parseTable(siqTab, keyDateResult, keyDateResultEnd, maxTabMemory);
    newSeries[5].name = varName[5];
    //this.getAverageValues(newSeries[0].data, newSeries[1].data, newSeries[2].data, newSeries[3].data);
    let tempAverageTab = ChartUtils.getAverageValues(newSeries);
    this.setState({ averageTab: tempAverageTab });
    this.setState({ series: newSeries });
  };

  getTimeFromMetrics() {
    const { metricsFile } = this.props;
    const { keyDateResult, keyDateResultEnd, options } = this.state;
    let timeTab = [];
    metricsFile.map( (metrics) => {
      timeTab.push(metrics.time);
    });
    let newFullDate = ChartUtils.parseTable(timeTab, keyDateResult, keyDateResultEnd, maxTabMemory);
    console.log("newFullDate in Init", newFullDate);
    let newCategories = JSON.parse(JSON.stringify(options));
    newCategories.xaxis.categories = newFullDate;
    this.setState({ options: newCategories })
  }

  receiveCallbackFrom(key) {
    console.log("callBack from");
    this.setState({ keyDateResult: key }, () => {
      this.initChart();
    });
  }

  receiveCallbackTo(key) {
    console.log("callBack to");
    this.setState({ keyDateResultEnd: key }, () =>{
      this.initChart();
    });
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
          <ChartTitle title='CPU Usage Chart (usr - sys - idl - wai - hiq - siq)' />
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
        <div className="column-div">
          <TopCpuUsage valuesTab={averageTab} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    metricsFile: state.metricsReducer.metricsFile
  };
}

export default connect(mapStateToProps, null)(CpuChart);
