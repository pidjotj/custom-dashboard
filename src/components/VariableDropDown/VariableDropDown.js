import React, { Component } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { connect } from "react-redux";
import PropTypes from 'prop-types';

class VariableDropDown extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);

    this.state = {
      open: false,
      selectVariable: '',
    }
  }

  toggle() {
    this.setState(prevState => ({
      open: !prevState.open
    }));
  }

  onChange(e) {
    const { callback } = this.props;
    this.setState({ selectVariable: e.currentTarget.textContent }, () => {
      callback(this.state.selectVariable)
    });
  }

  render() {
    const { metricsFile } = this.props;
    const { selectVariable } = this.state;
    let keys = [];
    if (metricsFile[0]) {
      keys = Object.keys(metricsFile[0]);
      console.log("keys", keys);
    }
    delete keys[14];
    console.log("new keys", keys);

    return (
      <Dropdown isOpen={this.state.open} toggle={this.toggle} >
        <DropdownToggle color="primary" caret>
          {selectVariable === '' ? "Select a variable" : selectVariable}
        </DropdownToggle>
        <DropdownMenu modifiers={{
          setMaxHeight: {
            enabled: true,
            order: 890,
            fn: (data) => {
              return {
                ...data,
                styles: {
                  ...data.styles,
                  overflow: 'auto',
                  maxHeight: 200,
                },
              };
            },
          },
        }}>
          {keys.map( (key, i) => (
            <DropdownItem key={i} onClick={(e) => this.onChange(e)}>{key}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    );
  }
}

function mapStateToProps(state) {
  return {
    metricsFile: state.metricsReducer.metricsFile
  };
}

VariableDropDown.propTypes = {
  callback: PropTypes.func,
};

export default connect(mapStateToProps, null)(VariableDropDown);
