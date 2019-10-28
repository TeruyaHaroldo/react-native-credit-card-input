import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compact from 'lodash.compact';

import CCFieldFormatter from './CCFieldFormatter';
import CCFieldValidator from './CCFieldValidator';

export const InjectedProps = {
  focused: PropTypes.string,
  values: PropTypes.object.isRequired,
  status: PropTypes.object.isRequired,
  onFocus: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  requiresName: PropTypes.bool,
  requiresCVC: PropTypes.bool,
  requiresTaxDocument: PropTypes.bool,
  requiresPostalCode: PropTypes.bool,
};

export default function connectToState(CreditCardInput) {
  class StateConnection extends Component {
    static propTypes = {
      autoFocus: PropTypes.bool,
      onChange: PropTypes.func.isRequired,
      onFocus: PropTypes.func,
      requiresName: PropTypes.bool,
      requiresCVC: PropTypes.bool,
      requiresPostalCode: PropTypes.bool,
      requiresTaxDocument: PropTypes.bool,
      validatePostalCode: PropTypes.func,
    };

    static defaultProps = {
      autoFocus: false,
      onChange: () => {},
      onFocus: () => {},
      requiresName: true,
      requiresCVC: true,
      requiresPostalCode: false,
      requiresTaxDocument: true,
      validatePostalCode: (postalCode = '') => {
        return postalCode.match(/^\d{6}$/)
          ? 'valid'
          : postalCode.length > 6
          ? 'invalid'
          : 'incomplete';
      },
    };

    constructor() {
      super();
      this.state = {
        focused: '',
        values: {},
        status: {},
      };
    }

    componentDidMount = () =>
      setTimeout(() => {
        if (this.props.autoFocus) {
          this.focus('number');
        }
      });

    setValues = values => {
      const newValues = { ...this.state.values, ...values };
      const displayedFields = this._displayedFields();
      const formattedValues = new CCFieldFormatter(displayedFields).formatValues(newValues);
      const validation = new CCFieldValidator(
        displayedFields,
        this.props.validatePostalCode
      ).validateValues(formattedValues);
      const newState = { values: formattedValues, ...validation };

      this.setState(newState);
      this.props.onChange(newState);
    };

    focus = (field = 'number') => {
      this.setState({ focused: field });
    };

    _displayedFields = () => {
      const { requiresName, requiresCVC, requiresPostalCode, requiresTaxDocument } = this.props;

      return compact([
        'number',
        'expiry',
        requiresCVC ? 'cvc' : null,
        requiresName ? 'name' : null,
        requiresTaxDocument ? 'taxDocument' : null,
        requiresPostalCode ? 'postalCode' : null,
      ]);
    };

    _change = (field, value) => {
      this.setValues({ [field]: value });
    };

    _onFocus = field => {
      this.focus(field);
      this.props.onFocus(field);
    };

    render() {
      return (
        <CreditCardInput
          {...this.props}
          {...this.state}
          onFocus={this._onFocus}
          onChange={this._change}
        />
      );
    }
  }

  return StateConnection;
}
