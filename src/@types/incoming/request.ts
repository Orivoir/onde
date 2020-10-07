import {ServerRequest} from './../../../depts.ts'

/**
 * @types ServerRequest <https://doc.deno.land/https/deno.land/std/http/mod.ts#ServerRequest>
 */
export default interface IncomingRequest extends ServerRequest {

  params: {
    [keyname: string]: string
  }

  isStaticFile: boolean
}
