import React from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class DateDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);

    this.state = {
      open: false,
      selectDate: '',
    }
  }

  toggle() {
    this.setState(prevState => ({
      open: !prevState.open
    }));
  }

  onChange(e) {
    const { callback } = this.props;
    this.setState({ selectDate: e.currentTarget.textContent }, () => {
      callback(this.state.selectDate)
    });
  }


  render() {
    const { metricsFile, select} = this.props;
    const { selectDate } = this.state;
    console.log("mectricsFile Drop", metricsFile);
    console.log("select", select);
    return (
      <Dropdown isOpen={this.state.open} toggle={this.toggle} className="ml-10">
        <DropdownToggle caret>
          {selectDate === '' ? "select date " + select + " ..." : selectDate}
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
          {metricsFile.map( (metrics) => (
            <DropdownItem onClick={(e) => this.onChange(e)}>{metrics.time}</DropdownItem>
          ))}
          <DropdownItem header>Header</DropdownItem>
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

DateDropDown.propTypes = {
  select: PropTypes.string,
  callback: PropTypes.func
};

export default connect(mapStateToProps, null)(DateDropDown);
