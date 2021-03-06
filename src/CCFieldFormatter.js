import valid from 'card-validator';
import pick from 'lodash.pick';

import { removeNonNumber, removeLeadingSpaces } from './Utilities';

const limitLength = (string = '', maxLength) => string.substr(0, maxLength);

const addGaps = (string = '', gaps) => {
  const offsets = [0].concat(gaps).concat([string.length]);

  return offsets
    .map((end, index) => {
      if (index === 0) return '';
      const start = offsets[index - 1];
      return string.substr(start, end - start);
    })
    .filter(part => part !== '')
    .join(' ');
};

const FALLBACK_CARD = { gaps: [4, 8, 12], lengths: [16], code: { size: 3 } };
export default class CCFieldFormatter {
  constructor(displayedFields) {
    this._displayedFields = [...displayedFields, 'type'];
  }

  formatValues = values => {
    const card = valid.number(values.number).card || FALLBACK_CARD;

    return pick(
      {
        type: card.type,
        number: this._formatNumber(values.number, card),
        expiry: this._formatExpiry(values.expiry),
        cvc: this._formatCVC(values.cvc, card),
        name: removeLeadingSpaces(values.name),
        postalCode: removeNonNumber(values.postalCode),
        taxDocument: this._formatCpf(values.taxDocument),
      },
      this._displayedFields
    );
  };

  _formatNumber = (number, card) => {
    const numberSanitized = removeNonNumber(number);
    const lengthSanitized = limitLength(numberSanitized, 16);
    const formatted = addGaps(lengthSanitized, card.gaps);
    return formatted;
  };

  _formatExpiry = expiry => {
    const sanitized = limitLength(removeNonNumber(expiry), 4);
    if (sanitized.match(/^[2-9]$/)) {
      return `0${sanitized}`;
    }
    if (sanitized.length > 2) {
      return `${sanitized.substr(0, 2)}/${sanitized.substr(2, sanitized.length)}`;
    }
    return sanitized;
  };

  _formatCVC = (cvc, card) => {
    const maxCVCLength = card.code.size;
    return limitLength(removeNonNumber(cvc), maxCVCLength);
  };

  _formatCpf = value => {
    if (!value) {
      return '';
    }
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };
}
