import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactNative, { NativeModules, View, StyleSheet, ScrollView } from 'react-native';

import CardView from './CardView';
import CCInput from './CCInput';
import { InjectedProps } from './connectToState';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  form: {
    marginTop: 20,
  },
});

export default class CreditCardInput extends Component {
  static propTypes = {
    ...InjectedProps,
    labels: PropTypes.object,
    cardImageBack: PropTypes.number,
    cardBrandIcons: PropTypes.object,
    allowScroll: PropTypes.bool,
    onSubmitEditing: PropTypes.func,
  };

  static defaultProps = {
    labels: {
      name: 'Nome no Cartão',
      number: 'Número do Cartão',
      expiry: 'Validade',
      cvc: 'CVC',
      taxDocument: 'CPF do Titular',
      postalCode: 'CEP',
    },
    allowScroll: false,
    onSubmitEditing: () => {},
  };

  componentDidMount = () => this._focus(this.props.focused);

  componentDidUpdate(prevProps) {
    const { focused } = this.props;

    if (prevProps.focused !== focused) {
      this._focus(focused);
    }
  }

  _focus = field => {
    if (!field) return;

    const scrollResponder = this.refs.Form.getScrollResponder();
    const nodeHandle = ReactNative.findNodeHandle(this.refs[field]);

    NativeModules.UIManager.measureLayoutRelativeToParent(
      nodeHandle,
      e => {
        throw e;
      },
      x => {
        scrollResponder.scrollTo({ x: Math.max(x, 0), animated: true });
        this.refs[field].focus();
      }
    );
  };

  _inputProps = field => {
    const { labels, values, status, onFocus, onChange } = this.props;

    const placeholder = {
      name: '',
      number:
        '\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022',
      expiry: 'Mês/Ano',
      cvc: '\u2022\u2022\u2022',
      taxDocument: '\u2022\u2022\u2022.\u2022\u2022\u2022.\u2022\u2022\u2022-\u2022\u2022\u2022',
    };

    return {
      ref: field,
      field,
      label: labels[field],
      value: values[field],
      status: status[field],
      placeholder: placeholder[field],
      onFocus,
      onChange,
    };
  };

  render() {
    const {
      cardImageBack,
      values: { number, expiry, cvc, name, type, taxDocument },
      focused,
      allowScroll,
      requiresName,
      requiresCVC,
      requiresPostalCode,
      requiresTaxDocument,
      cardBrandIcons,
      onSubmitEditing,
    } = this.props;

    return (
      <View style={styles.container}>
        <CardView
          focused={focused}
          brand={type}
          imageBack={cardImageBack}
          customIcons={cardBrandIcons}
          name={requiresName ? name : ' '}
          number={number}
          expiry={expiry}
          cvc={cvc}
          taxDocument={taxDocument}
        />
        <ScrollView
          ref="Form"
          horizontal
          keyboardShouldPersistTaps="always"
          scrollEnabled={allowScroll}
          showsHorizontalScrollIndicator={false}
          style={styles.form}
        >
          <CCInput
            {...this._inputProps('number')}
            keyboardType="numeric"
            onSubmitEditing={onSubmitEditing}
          />

          <CCInput
            {...this._inputProps('expiry')}
            keyboardType="numeric"
            onSubmitEditing={onSubmitEditing}
          />

          {requiresCVC && (
            <CCInput
              {...this._inputProps('cvc')}
              keyboardType="numeric"
              onSubmitEditing={onSubmitEditing}
            />
          )}
          {requiresName && (
            <CCInput {...this._inputProps('name')} onSubmitEditing={onSubmitEditing} />
          )}
          {requiresTaxDocument && (
            <CCInput
              {...this._inputProps('taxDocument')}
              keyboardType="numeric"
              onSubmitEditing={onSubmitEditing}
            />
          )}
          {requiresPostalCode && (
            <CCInput
              {...this._inputProps('postalCode')}
              keyboardType="numeric"
              onSubmitEditing={onSubmitEditing}
            />
          )}
        </ScrollView>
      </View>
    );
  }
}
