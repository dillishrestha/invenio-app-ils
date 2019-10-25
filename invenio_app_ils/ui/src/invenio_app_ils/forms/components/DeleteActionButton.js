import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';

export class DeleteActionButton extends React.Component {
  render() {
    return (
      <Button icon basic onClick={this.props.onClick}>
        <Icon
          color={this.props.color}
          name={this.props.icon}
          size={this.props.size}
        />
      </Button>
    );
  }
}

DeleteActionButton.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  size: PropTypes.string,
};

DeleteActionButton.defaultProps = {
  color: 'red',
  icon: 'delete',
  size: 'large',
};
