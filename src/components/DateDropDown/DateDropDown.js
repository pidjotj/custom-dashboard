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
      keyDate: null,
    }
  }

  toggle() {
    this.setState(prevState => ({
      open: !prevState.open
    }));
  }

  onChange(e, key) {
    const { callback } = this.props;
    this.setState({ selectDate: e.currentTarget.textContent, keyDate: key }, () => {
      callback(this.state.keyDate)
    });
  }


  render() {
    const { metricsFile, select, value } = this.props;
    const { selectDate } = this.state;
    let temp = [];
    const specificId = value === -1 && select === 'to' ? 0 : value;
    if (specificId !== -1 && select === 'to') {
      temp = metricsFile.slice(specificId + 1);
    }
    return (
      <Dropdown isOpen={value === -1 && select === 'to' ? false : this.state.open} toggle={this.toggle} className="ml-10">
        <DropdownToggle color="secondary" caret>
          {selectDate === '' ? select === 'from' ? 'From ...' : 'To ...' : selectDate}
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
          {select === 'from' ? metricsFile.map( (metrics, key) => (
            <DropdownItem onClick={(e) => this.onChange(e, key)}>{metrics.time}</DropdownItem>
          )) : temp.map( (metrics, key) => (
            <DropdownItem onClick={(e) => this.onChange(e, key)}>{metrics.time}</DropdownItem>
          )) }
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
  value: PropTypes.number,
  valueTo: PropTypes.string,
  callback: PropTypes.func,
};

export default connect(mapStateToProps, null)(DateDropDown);
