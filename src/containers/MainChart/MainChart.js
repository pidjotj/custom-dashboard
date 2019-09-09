import React from 'react';
import '../HomePage/styles/index.css';
import { connect } from 'react-redux';
import Chart from 'react-apexcharts';
import { ButtonGroup } from 'reactstrap';
import DateDropDown from '../../components/DateDropDown';
import VariableDropDown from '../../components/VariableDropDown';
import AverageValues from '../../components/AverageValues';
import ButtonChartType from "../../components/ButtonChartType";
import ChartTitle from "../../components/ChartTitle";
import { chartWidth, maxTabGlobal } from "../../utils/Constants";
import { ChartUtils } from "../../utils/ChartUtils";

class MainChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0,
      keyDateResult: -1,
      keyDateResultEnd: -1,
      toResult: '',
      currentVariable: '',
      tempVariableData: [],
      averageTab: [],

      // Chart
      chartType: 'line',
      options: {
        chart: {
          id: 'global-chart',
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
        colors: ['#FF1654', '#247BA0'],
        tooltip: {
          theme: 'dark',
        }
      },
      series: [
        {
          name: '',
          data: []
        },
      ],
    };
  }

  receiveCallbackFrom(key) {
    const { keyDateResultEnd, currentVariable, tempVariableData } = this.state;
    const { metricsFile } = this.props;
    if (key > keyDateResultEnd && keyDateResultEnd !== -1) {
      this.setState({ keyDateResult: -1 }, () => {
      });

    }
      this.setState({ keyDateResult: key }, () => {
        const fullDate = [];
        metricsFile.map( (metrics) => {
          fullDate.push(metrics.time);
        });
        if (currentVariable !== '') {
          let newTab = ChartUtils.parseTable(tempVariableData, key, keyDateResultEnd, maxTabGlobal);
          let newSeries = JSON.parse(JSON.stringify(this.state.series));
          newSeries[0].data = newTab;
          newSeries[0].name = currentVariable;
          this.setState({
            series: newSeries
          }, () => {
            let tempAverage = ChartUtils.getValues(newTab);
            this.setState({ averageTab: tempAverage })
          })
        }
        let newFullDate = ChartUtils.parseTable(fullDate, key, keyDateResultEnd, maxTabGlobal);
        let newCategories = JSON.parse(JSON.stringify(this.state.options));
        newCategories.xaxis.categories = newFullDate;
        this.setState({
            options: newCategories
          }
        )
    });
  };

  receiveCallbackTo(key) {
    const { keyDateResult, currentVariable, tempVariableData } = this.state;
    const { metricsFile } = this.props;
    this.setState({ keyDateResultEnd: key }, () =>{
      const fullDate = [];
      metricsFile.map( (metrics) => {
        fullDate.push(metrics.time);
      });
      if (currentVariable !== '') {
        let newTab = ChartUtils.parseTable(tempVariableData, keyDateResult, key, maxTabGlobal);
        let newSeries = JSON.parse(JSON.stringify(this.state.series));
        newSeries[0].data = newTab;
        newSeries[0].name = currentVariable;
        this.setState({
          series: newSeries
        }, () => {
          let tempAverage = ChartUtils.getValues(newTab);
          this.setState({ averageTab: tempAverage })
        })
      }
      let newFullDate = ChartUtils.parseTable(fullDate, keyDateResult, key, maxTabGlobal);
      let newCategories = JSON.parse(JSON.stringify(this.state.options));
      newCategories.xaxis.categories = newFullDate;
      this.setState({
          options: newCategories
        }
      )
    })
  }

  receiveCallbackVariable(variable, fromMain) {
    let nameVar = variable;
    const { metricsFile } = this.props;
    this.setState( { currentVariable: variable }, () => {
      let temp = [];
      metricsFile.map( (metrics) => {
        temp.push(metrics[nameVar]);
      });
      this.setState({ tempVariableData: temp }, () => {
        const { tempVariableData, keyDateResult, keyDateResultEnd } = this.state;
        let newTab = ChartUtils.parseTable(tempVariableData, keyDateResult, keyDateResultEnd, maxTabGlobal);
        let newSeries = JSON.parse(JSON.stringify(this.state.series));
        newSeries[0].data = newTab;
        newSeries[0].name = nameVar;
        this.setState({
          series: newSeries
        }, () => {
          const fullDate = [];
          metricsFile.map( (metrics) => {
            fullDate.push(metrics.time);
          });
          let newFullDate = ChartUtils.parseTable(fullDate, keyDateResult, keyDateResultEnd, maxTabGlobal);
          let newCategories = JSON.parse(JSON.stringify(this.state.options));
          newCategories.xaxis.categories = newFullDate;
          if (!fromMain) {
            let tempAverage = ChartUtils.getValues(newTab);
            this.setState({ averageTab: tempAverage })
          }
          this.setState({
              options: newCategories
            }
          )
        })
      })
    })
  }

  receiveType(type) {
    this.setState({ chartType: type }, () => {
      this.receiveCallbackVariable(this.state.currentVariable, true)
    });
  }

  render() {
    const {
      keyDateResult,
      options,
      series,
      averageTab,
      chartType,
    } = this.state;
    return (
      <div className='main-div'>
        <div>
          <ChartTitle title='Global Chart' />
            <div className='row-div'>
              <VariableDropDown
                callback={this.receiveCallbackVariable.bind(this)}
              />
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
          <div className='chart-div'>
            <Chart
              options={options}
              series={series}
              type={chartType}
              width={chartWidth}
            />
          </div>
        </div>
        <div className="column-div">
          <AverageValues tab={averageTab}/>
          <ButtonChartType
            callback={this.receiveType.bind(this)}
          />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    metricsFile: state.metricsReducer.metricsFile
  };
}

export default connect(mapStateToProps, null)(MainChart);
