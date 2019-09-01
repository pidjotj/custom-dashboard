import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getInfosFromJSON } from "./store/actions/home.action";

class HomePage extends React.Component {

  componentDidMount() {
    this.props.getInfosFromJSON();
  }

  render() {
    const {metricsFile} = this.props;
    console.log("metricsFile: ", metricsFile);
    return (
      <div>
        <p>oko</p>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
      metricsFile: state.metricsReducer
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
      getInfosFromJSON
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
