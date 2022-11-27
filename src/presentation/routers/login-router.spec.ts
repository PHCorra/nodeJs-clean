import { MissingParamError } from "../helpers/missing-param-error"
import { UnauthorizedError } from "../helpers/unauthorizedError"
import { LoginRouter } from "./login-router"



const makeSut = () => {
  class AuthUseCaseSpy {
    email!: string
    password!: string
    acessToken!: string | undefined | null
    auth(email: string, password: string) {
      this.email = email
      this.password = password
      return this.acessToken
    }
  }
  const authUseCaseSpy = new AuthUseCaseSpy()
  authUseCaseSpy.acessToken = 'valid_token'
  const sut = new LoginRouter(authUseCaseSpy)
  return {
    sut,
    authUseCaseSpy
  }
}
describe('Login Router', () => {
  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut();
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
    const { sut } = makeSut(); // System under test
    const httpRequest = {
      body: {
        email: 'test@email'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse!.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 500 if no httpRequest is provided', () => {
    const { sut } = makeSut(); // System under test
    const httpResponse = sut.route(undefined)
    expect(httpResponse!.statusCode).toBe(500)
  })

  test('Should return 500 if  httpRequest has no body', () => {
    const { sut } = makeSut(); // System under test
    const httpResponse = sut.route({})
    expect(httpResponse!.statusCode).toBe(500)
  })

  test('Should call AuthUseCase with correct params', () => {
    const { sut, authUseCaseSpy } = makeSut(); // System under test
    const httpRequest = {
      body: {
        email: 'email@test.com',
        password: 'passwordTest'
      }
    }
    sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
  })

  test('Should return 401 when invalid credentials are provided', () => {
    const { sut, authUseCaseSpy } = makeSut(); // System under test
    authUseCaseSpy.acessToken = null
    const httpRequest = {
      body: {
        email: 'invalid_email@test.com',
        password: 'invalid_passwordTest'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse!.statusCode).toBe(401);
    expect(httpResponse!.body).toEqual(new UnauthorizedError())

  })

  test('Should return 200 when valid credentials are provided', () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'valid_email@test.com',
        password: 'valid_password'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse!.statusCode).toBe(200)
    expect(httpResponse.body.acessToken).toEqual(authUseCaseSpy.acessToken)
  })



  test('Should return 500 if no AuthUseCase is provided', () => {
    const sut = new LoginRouter(null);
    const httpRequest = {
      body: {
        email: 'any_email@test.com',
        password: 'any_passwordTest'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse!.statusCode).toBe(500);
  })

  test('Should return 500 if no AuthUseCase has no auth method', () => {
    // class AuthUseCaseSpy { }
    // const authUseCaseSpy = new AuthUseCaseSpy();
    const sut = new LoginRouter({});
    const httpRequest = {
      body: {
        email: 'any_email@test.com',
        password: 'any_passwordTest'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse!.statusCode).toBe(500);
  })
})