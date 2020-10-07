import {Server} from './../../../depts.ts'

export default interface OndeDone {

  /**
   * @method listen
   * @memberof Onde
   * @description listen http req from server and call all route.s find
   * @types Server <https://doc.deno.land/https/deno.land/std/http/mod.ts#Server>
   */
  listen: (server: Server) => void,
}
