// interface IHttpRequest {
//   body?: any
//   headers?: any
//   params?: any
//   query?: any
// }

type httpRequest = {
  body?: any
  headers?: any
  params?: any
  query?: any
} | undefined

class LoginRouter {

  route(httpRequest: httpRequest) {
    if (!httpRequest) {
      return HttpResponse.serverError('no httpRequest provided');
    }
    if (!httpRequest.body) {
      return HttpResponse.serverError('no body provided');
    }
    const { email, password } = httpRequest.body
    if (!email) {
      return HttpResponse.badRequest('email');
    }
    if (!password) {
      return HttpResponse.badRequest('password');
    }
  }
}

class HttpResponse {
  static badRequest(paramName: string) {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName)
    }
  }

  static serverError(serverArgumentError: string) {
    return {
      statusCode: 500,
      body: new MissingServerError(serverArgumentError)
    }
  }
}

class MissingParamError extends Error {
  constructor(paramName: string) {
    super(`Missing param: ${paramName}`)
    this.name = 'MissingParamError'
  }
}

class MissingServerError extends Error {
  constructor(serverArgumentError: string) {
    super(`Missing server argument: ${serverArgumentError}`)
    this.name = 'ServerError'
  }
}

describe('Login Router', () => {
  test('Should return 400 if no email is provided', () => {
    const sut = new LoginRouter() // System under test
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
    const sut = new LoginRouter() // System under test
    const httpRequest = {
      body: {
        email: 'test@email'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse!.body).toEqual(new MissingParamError('password'))
  })
  test('Should return 500 if no httpRequest is provided', () => {
    const sut = new LoginRouter() // System under test
    const httpResponse = sut.route(undefined)
    expect(httpResponse!.statusCode).toBe(500)
  })
  test('Should return 500 if  httpRequest has no body', () => {
    const sut = new LoginRouter() // System under test
    const httpResponse = sut.route({})
    expect(httpResponse!.statusCode).toBe(500)
  })
})