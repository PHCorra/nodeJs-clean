import { validator } from '../../__mocks__/validator';

class EmailValidator {
  isValid(email: string) {
    return validator.isEmail(email);
  }
}

describe('Email Validator', () => {
  test('Should return true if validator returns true', () => {
    const sut = new EmailValidator()
    const isEmailValid = sut.isValid('valid_email@email.com')
    expect(isEmailValid).toBe(true)
  })

  test('Should return falkse if validator returns false', () => {
    validator.isEmailValid = false;
    const sut = new EmailValidator()
    const isEmailValid = sut.isValid('invalid_email')
    expect(isEmailValid).toBe(false)
  })
})