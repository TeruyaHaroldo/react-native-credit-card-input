import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TextInput, StyleSheet, ViewPropTypes, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginLeft: 16,
    marginRight: 16,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#cbcbcb',
    fontSize: 16,
    height: 40,
    lineHeight: 25,
    paddingBottom: 0,
    color: 'black',
  },
  label: {
    color: '#333333',
    fontSize: 12,
    marginBottom: -4,
  },
});

export default class CCInput extends Component {
  static propTypes = {
    field: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.string,
    keyboardType: PropTypes.string,
    status: PropTypes.oneOf(['valid', 'invalid', 'incomplete']),
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    onSubmitEditing: PropTypes.func,
  };

  static defaultProps = {
    label: '',
    value: '',
    status: 'incomplete',
    onFocus: () => {},
    onChange: () => {},
    onSubmitEditing: () => {},
  };

  focus = () => this.refs.input && this.refs.input.focus();

  _onFocus = () => this.props.onFocus(this.props.field);
  _onChange = value => this.props.onChange(this.props.field, value);

  render() {
    const { label, value, status, keyboardType, onSubmitEditing } = this.props;
    return (
      <View style={{ width: Dimensions.get('window').width }}>
        <View style={styles.container}>
          {!!label && <Text style={styles.label}>{label}</Text>}
          <TextInput
            ref="input"
            keyboardType={keyboardType}
            autoCapitalise="words"
            autoCorrect={false}
            style={[
              styles.input,
              status === 'valid'
                ? { color: 'black' }
                : status === 'invalid'
                ? { color: '#dc2826' }
                : {},
            ]}
            clearButtonMode="always"
            underlineColorAndroid="transparent"
            value={value}
            onFocus={this._onFocus}
            onChangeText={this._onChange}
            onSubmitEditing={onSubmitEditing}
          />
        </View>
      </View>
    );
  }
}
