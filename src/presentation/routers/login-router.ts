import { HttpResponse } from "../helpers/http-response"

type httpRequest = {
  body?: any
  headers?: any
  params?: any
  query?: any
} | undefined

export class LoginRouter {

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