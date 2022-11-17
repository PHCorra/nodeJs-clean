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
    if (!httpRequest || !httpRequest.body) {
      return {
        statusCode: 500
      }
    }
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