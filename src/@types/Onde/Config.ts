export default interface OndeConfig {

  /**
   * @description relative or absolute path to views files
   * @default "./views"
   */
  views: string,

  /**
   * @description relative or absolute path to static directory ( assets files )
   * @default null
   */
  static: string | null,

  /**
   * @description rewriting url for access to static directory
   * @default null
   */
  staticRewrite: string | null
}
