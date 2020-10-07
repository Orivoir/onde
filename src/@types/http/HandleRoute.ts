export default interface HandleRoute {

  hasParam: ( param: string ) => boolean,
  hasUri: ( uri: string ) => boolean,

}
