import { watchPlugins } from "../../../jest.config"
import { MissingParamError, MissingServerError } from "../helpers/missing-param-error"
import { InvalidParamError } from "../helpers/invalid-param-error"
import { UnauthorizedError } from "../helpers/unauthorizedError"
import { LoginRouter } from "./login-router"



const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCase()
  const emailValidatorSpy = makeEmailValidator()
  authUseCaseSpy.acessToken = 'valid_token'
  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)
  return {
    sut,
    authUseCaseSpy,
    emailValidatorSpy
  }
}

const makeEmailValidator = () => {
  class EmailValidatorSpy {
    isEmailValid!: boolean
    isValid(email: string) {
      return this.isEmailValid
    }
  }
  const emailValidatorSpy = new EmailValidatorSpy()
  emailValidatorSpy.isEmailValid = true
  return emailValidatorSpy
}

const makeAuthUseCase = () => {
  class AuthUseCaseSpy {
    email!: string
    password!: string
    acessToken!: string | undefined | null
    async auth(email: string, password: string) {
      this.email = email
      this.password = password
      return this.acessToken
    }
  }
  return new AuthUseCaseSpy()
}

const makeAuthUseCaseWithError = () => {
  class AuthUseCaseSpy {
    acessToken!: string | undefined | null

    async auth() {
      throw new Error()
    }
  }
  return new AuthUseCaseSpy()
}

describe('Login Router', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: 'testPassword'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse!.statusCode).toBe(400)
    expect(httpResponse!.body).toEqual(new MissingParamError('email'))
  })
  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut(); // System under test
    const httpRequest = {
      body: {
        email: 'test@email'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse!.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 500 if no httpRequest is provided', async () => {
    const { sut } = makeSut(); // System under test
    const httpResponse = await sut.route(undefined)
    expect(httpResponse!.statusCode).toBe(500)
  })

  test('Should return 500 if  httpRequest has no body', async () => {
    const { sut } = makeSut(); // System under test
    const httpResponse = await sut.route({})
    expect(httpResponse!.statusCode).toBe(500)
  })

  test('Should call AuthUseCase with correct params', async () => {
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

  test('Should return 401 when invalid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut(); // System under test
    authUseCaseSpy.acessToken = null
    const httpRequest = {
      body: {
        email: 'invalid_email@test.com',
        password: 'invalid_passwordTest'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse!.statusCode).toBe(401);
    expect(httpResponse!.body).toEqual(new UnauthorizedError())

  })

  test('Should return 200 when valid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'valid_email@test.com',
        password: 'valid_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse!.statusCode).toBe(200)
    expect(httpResponse.body.acessToken).toEqual(authUseCaseSpy.acessToken)
  })



  test('Should return 500 if no AuthUseCase is provided', async () => {
    const emailValidatorSpy = makeEmailValidator()
    const sut = new LoginRouter(null, emailValidatorSpy);
    const httpRequest = {
      body: {
        email: 'any_email@test.com',
        password: 'any_passwordTest'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse!.statusCode).toBe(500);
  })

  test('Should return 500 if no AuthUseCase has no auth method', async () => {
    // class AuthUseCaseSpy { }
    // const authUseCaseSpy = new AuthUseCaseSpy();
    const sut = new LoginRouter({}, {});
    const httpRequest = {
      body: {
        email: 'any_email@test.com',
        password: 'any_passwordTest'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse!.statusCode).toBe(500);
  })

  test('Should return 500 if AuthUseCase throw', async () => {
    const authUseCaseSpy = makeAuthUseCaseWithError()
    const emailValidatorSpy = makeEmailValidator()
    const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)
    const httpRequest = {
      body: {
        email: 'any_email@test.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isEmailValid = false
    const httpRequest = {
      body: {
        email: 'invalid_email@test.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should return 500 if no EmailValidator is provided', async () => {
    const authUseCaseSpy = makeAuthUseCase()
    const sut = new LoginRouter(authUseCaseSpy, {})
    const httpRequest = {
      body: {
        email: 'any_email@test.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new MissingServerError('ServerError'))
  })

  test('Should return 500 if EmailValidator has no isValid method', async () => {
    const authUseCaseSpy = makeAuthUseCase()
    const sut = new LoginRouter(authUseCaseSpy, {})
    const httpRequest = {
      body: {
        email: 'any_email@test.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new MissingServerError('ServerError'))
  })
})