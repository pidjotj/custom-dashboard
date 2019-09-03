import React from "react";
import "../../containers/HomePage/styles/index.css";
import { connect } from "react-redux";
import Chart from "react-apexcharts";
import { ButtonGroup, CarouselItem } from "reactstrap";
import DateDropDown from "../DateDropDown";
import VariableDropDown from "../VariableDropDown";
import AverageValues from "../AverageValues";

const items = [
  {
    id: 0,
    type: 'line',
  },
  {
    id: 1,
    type: 'bar'
  }
];

class MainChart extends React.Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);

    this.state = {
      activeIndex: 0,
      keyDateResult: -1,
      keyDateResultEnd: -1,
      toResult: '',
      currentVariable: '',
      tempVariableData: [],
      averageTab: [],

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
            colors: ['#FFFFFF', '#E91E63', '#9C27B0']
          }
        },
        colors: ["#FF1654", "#247BA0"],
        tooltip: {
          theme: 'dark',
        }
      },
      series: [
        {
          name: "series-1",
          data: [30, 40, 45, 50, 49, 60, 170, 391, 530, 340, 45, 50, 49, 60, 70, 91]
        },
      ],
    };
  }

  // CAROUSEL METHODS
  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }

  next() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === items.length - 1 ? 0 : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === 0 ? items.length - 1 : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }

  // END CAROUSEL METHODS

  receiveCallbackFrom(key) {
    console.log("Callback called");
    const { keyDateResult, keyDateResultEnd,  currentVariable, tempVariableData } = this.state;
    const { metricsFile } = this.props;
      this.setState({ keyDateResult: key }, () => {
          console.log("keyDateResult", key);
          console.log("keyDataResultEnd", keyDateResultEnd);
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
              this.getValues(newTab)
            })
          }
          let newFullDate = MainChart.parseTable(fullDate, key, keyDateResultEnd);
          console.log("~~~~~ newFullDate", newFullDate);
          let newCategories = JSON.parse(JSON.stringify(this.state.options));
          newCategories.xaxis.categories = newFullDate;
          this.setState({
              options: newCategories
            }
          )
      });
  };

  receiveCallbackTo(key) {
    const { keyDateResult, keyDateResultEnd,  currentVariable, tempVariableData } = this.state;
    const { metricsFile } = this.props;
    this.setState({ keyDateResultEnd: key }, () =>{
      console.log("keyDateResult", keyDateResult);
      console.log("keyDataResultEnd", key);
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
          this.getValues(newTab)
        })
      }
      let newFullDate = MainChart.parseTable(fullDate, keyDateResult, key);
      console.log("~~~~~ newFullDate", newFullDate);
      let newCategories = JSON.parse(JSON.stringify(this.state.options));
      newCategories.xaxis.categories = newFullDate;
      this.setState({
          options: newCategories
        }
      )
    })
  }

  receiveCallbackVariable(variable) {
    let nameVar = variable;
    const { metricsFile } = this.props;
    this.setState( { currentVariable: variable }, (variable) => {
      let temp = [];
      metricsFile.map( (metrics) => {
        temp.push(metrics[nameVar]);
      });
      this.getValues(temp);
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
          this.setState({
              options: newCategories
            }
          )
        })
      })
    })
  }

  getValues(tab) {
    const { currentVariable } = this.state;
    let result = [];

    console.log(" ~~ currentVariable", currentVariable);
    result.push(Math.max.apply(Math, tab));
    result.push(Math.min.apply(Math, tab));
    const average = (result[0] + result[1]) / 2;
    result.push(average);
    console.log("result", result);
    this.setState({ averageTab: result });
  }

  static parseTable(oldTab, keyFrom, keyTo = null) {

    let oldTabTemp = [];

    if (keyFrom !== -1 && keyTo === -1) {
      console.log("IN KEYFRON & KEYTO === -1");
      oldTabTemp = oldTab.slice(keyFrom);
      console.log("~~ oldTabTemp", oldTabTemp);
    } else if (keyFrom !== -1 && keyTo !== -1) {
      console.log("IN KEYFRON & KEYTO");
      // Have to add 2 because of the table modification in Dropdown.
      oldTabTemp = oldTab.slice(keyFrom, keyTo + keyFrom + 2);
    } else {
      console.log("IN KEYFRON === -1 & KEYTO === -1");
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
    const { metricsFile } = this.props;
    const {
      keyDateResult,
      keyDateResultEnd,
      activeIndex,
      options,
      series,
      averageTab,
    } = this.state;

    const slides = items.map((item) => {
      return (
        <CarouselItem
          onExiting={this.onExiting}
          onExited={this.onExited}
          key={item.id}
        >
          <div className="p-12">
            <Chart
              options={options}
              series={series}
              type={item.type}
              width="900"
            />
          </div>
        </CarouselItem>
      );
    });



    return (
      <div className="main-div">
        <AverageValues tab={averageTab}/>
        <div>
            <div className="row-div">
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
          <div className="chart-div">
            <Chart
              options={options}
              series={series}
              type="line"
              width="900"
            />
          </div>
        </div>
        {/*<Carousel*/}
        {/*  interval={false}*/}
        {/*  activeIndex={activeIndex}*/}
        {/*  next={this.next}*/}
        {/*  previous={this.previous}*/}
        {/*>*/}
        {/*  <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={this.goToIndex} />*/}
        {/*  {slides}*/}
        {/*  <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />*/}
        {/*  <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />*/}
        {/*</Carousel>*/}
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
