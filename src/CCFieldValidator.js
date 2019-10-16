import valid from 'card-validator';
import pick from 'lodash.pick';
import values from 'lodash.values';
import every from 'lodash.every';

const toStatus = validation =>
  validation.isValid ? 'valid' : validation.isPotentiallyValid ? 'incomplete' : 'invalid';

const isCpfValid = value => {
  const cpf = value.replace(/\D/g, '');
  if (!cpf || cpf.length < 11) {
    return 'incomplete';
  }
  if (
    cpf.length !== 11 ||
    cpf === '00000000000' ||
    cpf === '11111111111' ||
    cpf === '22222222222' ||
    cpf === '33333333333' ||
    cpf === '44444444444' ||
    cpf === '55555555555' ||
    cpf === '66666666666' ||
    cpf === '77777777777' ||
    cpf === '88888888888' ||
    cpf === '99999999999'
  ) {
    return 'invalid';
  }

  // Validate 1o check digit
  let add = 0;
  let rev;
  for (let i = 0; i < 9; i++) {
    add += parseInt(cpf.charAt(i), 10) * (10 - i);
  }
  rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) {
    rev = 0;
  }
  if (rev !== parseInt(cpf.charAt(9), 10)) {
    return 'invalid';
  }

  // Validate 2o check digit
  add = 0;
  for (let i = 0; i < 10; i++) {
    add += parseInt(cpf.charAt(i), 10) * (11 - i);
  }
  rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) {
    rev = 0;
  }
  if (rev !== parseInt(cpf.charAt(10), 10)) {
    return 'invalid';
  }

  return 'valid';
};

const FALLBACK_CARD = { gaps: [4, 8, 12], lengths: [16], code: { size: 3 } };

export default class CCFieldValidator {
  constructor(displayedFields, validatePostalCode) {
    this._displayedFields = displayedFields;
    this._validatePostalCode = validatePostalCode;
  }

  validateValues = formValues => {
    const numberValidation = valid.number(formValues.number);
    const expiryValidation = valid.expirationDate(formValues.expiry);
    const maxCVCLength = (numberValidation.card || FALLBACK_CARD).code.size;
    const cvcValidation = valid.cvv(formValues.cvc, maxCVCLength);

    const validationStatuses = pick(
      {
        number: toStatus(numberValidation),
        expiry: toStatus(expiryValidation),
        cvc: toStatus(cvcValidation),
        name: formValues.name ? 'valid' : 'incomplete',
        postalCode: this._validatePostalCode(formValues.postalCode),
        taxDocument: isCpfValid(formValues.taxDocument),
      },
      this._displayedFields
    );

    return {
      valid: every(values(validationStatuses), status => status === 'valid'),
      status: validationStatuses,
    };
  };
}
