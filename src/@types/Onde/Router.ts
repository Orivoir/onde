import Onde, {
  HttpLocation,
  OnRequest
} from './../../../mod.ts'

export default interface OndeRouter {

  get(
    location: HttpLocation,
    onRequest: OnRequest
  ): Onde

  post(
    location: HttpLocation,
    onRequest: OnRequest
  ): Onde

  put(
    location: HttpLocation,
    onRequest: OnRequest
  ): Onde

  patch(
    location: HttpLocation,
    onRequest: OnRequest
  ): Onde

  delete(
    location: HttpLocation,
    onRequest: OnRequest
  ): Onde

  route(
    methods: string | string[],
    location: HttpLocation,
    onRequest: OnRequest
  ): Onde

}
