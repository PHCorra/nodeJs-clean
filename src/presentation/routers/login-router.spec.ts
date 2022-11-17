interface IHttpRequest {
  body?: any
  headers?: any
  params?: any
  query?: any
}

class LoginRouter {
  route(httpRequest: IHttpRequest) {
    const { email, password } = httpRequest.body
    if (!email || !password) {
      return {
        statusCode: 400
      }
    }
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
  })
  test('Should return 400 if no password is provided', () => {
    const sut = new LoginRouter() // System under test
    const httpRequest = {
      body: {
        email: 'test@email'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse!.statusCode).toBe(400)
  })
})