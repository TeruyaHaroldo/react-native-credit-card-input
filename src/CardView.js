import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ImageBackground, Image, Text, StyleSheet, Platform } from 'react-native';
import FlipCard from 'react-native-flip-card';

import defaultIcons from './Icons';

const CARD_FRONT = require('../images/card-front.png');
const CARD_BACK = require('../images/card-back.png');

const styles = StyleSheet.create({
  cardFace: {},
  icon: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 60,
    height: 40,
    resizeMode: 'contain',
  },
  baseText: {
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
  },
  placeholder: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  focused: {
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
  },
  number: {
    fontSize: 20,
    position: 'absolute',
    top: 95,
    left: 24,
  },
  name: {
    fontSize: 16,
    position: 'absolute',
    bottom: 20,
    left: 24,
    right: 100,
  },
  expiryLabel: {
    fontSize: 9,
    position: 'absolute',
    bottom: 40,
    left: 218,
  },
  expiry: {
    fontSize: 16,
    position: 'absolute',
    bottom: 20,
    left: 220,
  },
  amexCVC: {
    fontSize: 16,
    position: 'absolute',
    top: 73,
    right: 30,
  },
  cvc: {
    fontSize: 16,
    position: 'absolute',
    top: 80,
    right: 30,
  },
});

class CardView extends Component {
  static propTypes = {
    focused: PropTypes.string,
    brand: PropTypes.string,
    name: PropTypes.string,
    number: PropTypes.string,
    expiry: PropTypes.string,
    cvc: PropTypes.string,
    placeholder: PropTypes.object,
    customIcons: PropTypes.object,
  };

  static defaultProps = {
    name: '',
    placeholder: {
      number: '•••• •••• •••• ••••',
      name: 'NOME COMPLETO',
      expiry: '••/••',
      cvc: '•••',
    },
  };

  render() {
    const { focused, brand, name, number, expiry, cvc, customIcons, placeholder } = this.props;

    const Icons = { ...defaultIcons, ...customIcons };
    const isAmex = brand === 'american-express';
    const shouldFlip = !isAmex && focused === 'cvc';
    const BASE_SIZE = { width: 300, height: 190 };

    return (
      <View style={BASE_SIZE}>
        <FlipCard
          style={{ borderWidth: 0 }}
          flipHorizontal
          flipVertical={false}
          friction={10}
          perspective={2000}
          clickable={false}
          flip={shouldFlip}
        >
          <ImageBackground style={[BASE_SIZE, styles.cardFace]} source={CARD_FRONT}>
            <Image style={styles.icon} source={Icons[brand]} />
            <Text
              style={[
                styles.baseText,
                styles.number,
                !number && styles.placeholder,
                focused === 'number' && styles.focused,
              ]}
            >
              {!number ? placeholder.number : number}
            </Text>
            <Text
              style={[
                styles.baseText,
                styles.name,
                !name && styles.placeholder,
                focused === 'name' && styles.focused,
              ]}
              numberOfLines={1}
            >
              {!name ? placeholder.name : name.toUpperCase()}
            </Text>
            <Text
              style={[
                styles.baseText,
                styles.expiryLabel,
                styles.placeholder,
                focused === 'expiry' && styles.focused,
              ]}
            >
              MÊS/ANO
            </Text>
            <Text
              style={[
                styles.baseText,
                styles.expiry,
                !expiry && styles.placeholder,
                focused === 'expiry' && styles.focused,
              ]}
            >
              {!expiry ? placeholder.expiry : expiry}
            </Text>
            {isAmex && (
              <Text
                style={[
                  styles.baseText,
                  styles.amexCVC,
                  !cvc && styles.placeholder,
                  focused === 'cvc' && styles.focused,
                ]}
              >
                {!cvc ? placeholder.cvc : cvc}
              </Text>
            )}
          </ImageBackground>
          <ImageBackground style={[BASE_SIZE, styles.cardFace]} source={CARD_BACK}>
            <Text
              style={[
                styles.baseText,
                styles.cvc,
                !cvc && styles.placeholder,
                focused === 'cvc' && styles.focused,
              ]}
            >
              {!cvc ? placeholder.cvc : cvc}
            </Text>
          </ImageBackground>
        </FlipCard>
      </View>
    );
  }
}

export default CardView;
