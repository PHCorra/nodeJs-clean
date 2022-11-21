import { MissingParamError } from "../helpers/missing-param-error"
import { LoginRouter } from "./login-router"



const makeSut = () => {
  return new LoginRouter()
}
describe('Login Router', () => {
  test('Should return 400 if no email is provided', () => {
    const sut = makeSut();
    const httpRequest = {
      body: {
        password: 'testPassword'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse!.statusCode).toBe(400)
    expect(httpResponse!.body).toEqual(new MissingParamError('email'))
  })
  test('Should return 400 if no password is provided', () => {
    const sut = makeSut(); // System under test
    const httpRequest = {
      body: {
        email: 'test@email'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse!.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 500 if no httpRequest is provided', () => {
    const sut = makeSut(); // System under test
    const httpResponse = sut.route(undefined)
    expect(httpResponse!.statusCode).toBe(500)
  })

  test('Should return 500 if  httpRequest has no body', () => {
    const sut = makeSut(); // System under test
    const httpResponse = sut.route({})
    expect(httpResponse!.statusCode).toBe(500)
  })

})