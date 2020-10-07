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
   * @description emit response file with `views` config as root
   */
  render: ( path: string ) => Promise<void>,

  /**
   * @description emit response file from absolute path
   */
  sendFile: ( absolutePath: string ) => Promise<void>

  /**
     * @description shortcut JSON response
   */
  json: ( content: JSON ) => void

}
