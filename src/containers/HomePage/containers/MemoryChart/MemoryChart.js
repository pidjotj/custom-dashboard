import React from "react";
import { connect } from 'react-redux';
import ChartTitle from "../../../../components/ChartTitle";
import Chart from "react-apexcharts";
import { ButtonGroup  } from "reactstrap";
import DateDropDown from "../../../../components/DateDropDown/DateDropDown";
import { maxTabMemory } from "../../../../utils/Constants";
import { ChartUtils } from "../../../../utils/ChartUtils";
import TopMemoryUsage from "../../../../components/TopMemoryUsage";

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
        colors: ['#FF1654', '#247BA0', '#9C27B0', '#ff7b5c'],
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
      this.initChart();
    }
  }

  // TODO refactor every callback method...

  getAverageValues(used, buff, cach, free) {
    let averageValues = [];
    averageValues.push(ChartUtils.getValues(used, false));
    averageValues.push(ChartUtils.getValues(buff, false));
    averageValues.push(ChartUtils.getValues(cach, false));
    averageValues.push(ChartUtils.getValues(free, false));
    this.setState({ averageTab: averageValues });
  }

  getInfosFromMetrics() {
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
    newSeries[0].data = ChartUtils.parseTable(usedTab, keyDateResult, keyDateResultEnd, maxTabMemory);
    newSeries[0].name = (varName[0]);
    newSeries[1].data = ChartUtils.parseTable(buffTab, keyDateResult, keyDateResultEnd, maxTabMemory);
    newSeries[1].name = varName[1];
    newSeries[2].data = ChartUtils.parseTable(cachTab, keyDateResult, keyDateResultEnd, maxTabMemory);
    newSeries[2].name = varName[2];
    newSeries[3].data = ChartUtils.parseTable(freeTab, keyDateResult, keyDateResultEnd, maxTabMemory);
    newSeries[3].name = varName[3];
    this.getAverageValues(newSeries[0].data, newSeries[1].data, newSeries[2].data, newSeries[3].data);
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

  initChart() {
    this.getInfosFromMetrics();
    this.getTimeFromMetrics();
  };

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
        <div className="column-div">
          {/*<AverageValues tab={averageTab}/>*/}
          <TopMemoryUsage valuesTab={averageTab} />
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

export default connect(mapStateToProps, null)(MemoryChart);
