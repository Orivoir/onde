import {HttpLocation} from './HttpLocation.ts'
import {OnRequest} from './onRequest.ts'

/**
 * @description HttpRoute interface
 * @see /src/HttpRoute.ts
 */
export default interface Route {

  /**
   * @var path user define path match with route
   */
  path: HttpLocation,

  /**
   * @var methods list methods convert upper case match with route
   */
  methods: string[],

  /**
   * @var callback respond function during request match
   */
  callback: OnRequest

  /** @uris separator uri and params */
  /** @private uris: string[], */

  /** @params list params from path */
  /** @private params?: string[], */
}
