import React from "react";
import '../../styles/index.css'
import { connect } from 'react-redux';
import Chart from "react-apexcharts";
import {
  ButtonGroup,
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption
} from 'reactstrap';
import DateDropDown from "../DateDropDown";
import VariableDropDown from "../VariableDropDown";

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
        // {
        //   name: "series-2",
        //   data: [30, 40, 45, 50, 49, 60, 170, 391, 530, 340, 45, 50, 49, 60, 70, 91]
        // }
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
          newSeries[0].name = test;
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
    const { keyDateResult, activeIndex, options, series } = this.state;

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
      <div className="mt-20">
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
        <Carousel
          interval={false}
          activeIndex={activeIndex}
          next={this.next}
          previous={this.previous}
        >
          <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
          {slides}
          <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
          <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
        </Carousel>
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
