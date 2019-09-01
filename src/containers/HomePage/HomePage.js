import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getInfosFromJSON } from "./store/actions/home.action";

import MainChart  from '../../components/MainChart';

class HomePage extends React.Component {

  componentDidMount() {
    this.props.getInfosFromJSON();
  }

  render() {
    const {metricsFile} = this.props;
    console.log("metricsFile: ", metricsFile[0]);
    return (
      <div>
        <MainChart />
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
