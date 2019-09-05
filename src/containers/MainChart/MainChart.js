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
          let newTab = MainChart.parseTable(tempVariableData, key, keyDateResultEnd);
          let newSeries = JSON.parse(JSON.stringify(this.state.series));
          newSeries[0].data = newTab;
          newSeries[0].name = currentVariable;
          this.setState({
            series: newSeries
          }, () => {
            this.getValues(newTab);
          })
        }
        let newFullDate = MainChart.parseTable(fullDate, key, keyDateResultEnd);
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
        let newTab = MainChart.parseTable(tempVariableData, keyDateResult, key);
        let newSeries = JSON.parse(JSON.stringify(this.state.series));
        newSeries[0].data = newTab;
        newSeries[0].name = currentVariable;
        this.setState({
          series: newSeries
        }, () => {
          this.getValues(newTab);
        })
      }
      let newFullDate = MainChart.parseTable(fullDate, keyDateResult, key);
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
        let newTab = MainChart.parseTable(tempVariableData, keyDateResult, keyDateResultEnd);
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
          let newFullDate = MainChart.parseTable(fullDate, keyDateResult, keyDateResultEnd);
          let newCategories = JSON.parse(JSON.stringify(this.state.options));
          newCategories.xaxis.categories = newFullDate;
          if (!fromMain) {
            this.getValues(temp);
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

  getValues(tab) {
    let result = [];

    result.push(Math.max.apply(Math, tab));
    result.push(Math.min.apply(Math, tab));
    const sum = tab.reduce(function(a,b) { return a + b});
    const average = sum / tab.length;
    result.push(average);
    this.setState({ averageTab: result });
  }

  static parseTable(oldTab, keyFrom, keyTo = null) {

    let oldTabTemp = [];

    if (keyFrom !== -1 && keyTo === -1) {
      oldTabTemp = oldTab.slice(keyFrom);
    } else if (keyFrom !== -1 && keyTo !== -1) {
      // Have to add 2 because of the table modification in Dropdown.
      oldTabTemp = oldTab.slice(keyFrom, keyTo + keyFrom + 2);
    } else {
      oldTabTemp = oldTab;
    }
    let newTab = [];

    if (oldTabTemp.length > 20) {
      const maxVal = 20;
      const delta = Math.floor(oldTabTemp.length / maxVal);

      for (let i = 0; i < oldTabTemp.length; i += delta) {
        newTab.push(oldTabTemp[i]);
      }
      return newTab;
    }

    return oldTabTemp;
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
              width='1000'
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
