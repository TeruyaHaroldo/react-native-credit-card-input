import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TextInput, StyleSheet, ViewPropTypes, Dimensions } from 'react-native';

const s = StyleSheet.create({
  baseInputStyle: {
    color: 'black',
  },
});

export default class CCInput extends Component {
  static propTypes = {
    field: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    keyboardType: PropTypes.string,
    status: PropTypes.oneOf(['valid', 'invalid', 'incomplete']),
    containerStyle: ViewPropTypes.style,
    inputStyle: Text.propTypes.style,
    labelStyle: Text.propTypes.style,
    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    onBecomeEmpty: PropTypes.func,
    onBecomeValid: PropTypes.func,
    additionalInputProps: PropTypes.shape(TextInput.propTypes),
    onSubmitEditing: PropTypes.func,
  };

  static defaultProps = {
    label: '',
    value: '',
    status: 'incomplete',
    containerStyle: {},
    inputStyle: {},
    labelStyle: {},
    onFocus: () => {},
    onChange: () => {},
    onBecomeEmpty: () => {},
    onBecomeValid: () => {},
    additionalInputProps: {},
    onSubmitEditing: () => {},
  };

  focus = () => this.refs.input.focus();

  _onFocus = () => this.props.onFocus(this.props.field);
  _onChange = value => this.props.onChange(this.props.field, value);

  render() {
    const {
      label,
      value,
      placeholder,
      status,
      keyboardType,
      containerStyle,
      inputStyle,
      labelStyle,
      validColor,
      invalidColor,
      placeholderColor,
      additionalInputProps,
      onSubmitEditing,
    } = this.props;
    return (
      <View style={{ width: Dimensions.get('window').width }}>
        <View style={[containerStyle]}>
          {!!label && <Text style={[labelStyle]}>{label}</Text>}
          <TextInput
            ref="input"
            {...additionalInputProps}
            keyboardType={keyboardType}
            autoCapitalise="words"
            autoCorrect={false}
            style={[
              s.baseInputStyle,
              inputStyle,
              validColor && status === 'valid'
                ? { color: validColor }
                : invalidColor && status === 'invalid'
                ? { color: invalidColor }
                : {},
            ]}
            clearButtonMode="always"
            underlineColorAndroid={'transparent'}
            placeholderTextColor={placeholderColor}
            placeholder={placeholder}
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
