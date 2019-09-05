import React from "react";
import PropTypes from 'prop-types';

class ChartTitle extends React.Component {
  render() {
    const { title } = this.props;
    return (
      <div className="header-div">
        <span className="header-title">{title}</span>
      </div>
    );
  }
}

ChartTitle.propTypes = {
  title: PropTypes.string.isRequired
};

export default ChartTitle;
