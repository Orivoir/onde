export default interface IncomingResponse {

  headers: Headers,

  /**
   * @description remove header X-Powered-By should be remove before prod switch
   */
  removePoweredBy: () => void

  /**
   * @description set status code
   * @default 200
   */
  setStatus: (status: number | string) => boolean,

  /**
   * @description set content type can use `aliase` type
   * @see /src/@types/http/AliaseContentType.ts
   * @default text/html
   */
  setContent: ( content: string ) => void,

  /**
   * @description emit response file
   */
  render: ( path: string ) => Promise<void>,

  sendFile: ( absolutePath: string ) => Promise<void>
}
