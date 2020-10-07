export default interface RequestAborted {

  reason: string,

  /**
   * @description native Deno error during response operation
   */
  error?: any

}