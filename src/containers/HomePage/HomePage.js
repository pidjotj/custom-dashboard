import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getInfosFromJSON } from "./store/actions/home.action";

import MainChart  from './containers/MainChart';
import Header from "../../components/Header";
import MemoryChart from "./containers/MemoryChart";
import CpuChart from "./containers/CPUChart";

class HomePage extends React.Component {

  componentDidMount() {
    this.props.getInfosFromJSON();
  }

  render() {
    const {metricsFile} = this.props;
    console.log("metricsFile: ", metricsFile[0]);
    return (
      <div>
        <Header />
        <MainChart />
        <MemoryChart />
        <CpuChart />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
      metricsFile: state.metricsReducer.metricsFile
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
      getInfosFromJSON
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
