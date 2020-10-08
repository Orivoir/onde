import {ServerRequest} from './../../../depts.ts'

/**
 * @types ServerRequest <https://doc.deno.land/https/deno.land/std/http/mod.ts#ServerRequest>
 */
export default interface IncomingRequest extends ServerRequest {

  /**
   * @description parse params url
   */
  params: {
    [keyname: string]: string
  }

  /**
   * @description parse querystring from url
   */
  query: {
    [keyname: string]: string
  }

  pathname: string
}
