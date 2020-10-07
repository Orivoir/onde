import IncomingRequest from './../incoming/request.ts'
import IncomingResponse from './../incoming/response.ts'

export type OnRequest = (
  request: IncomingRequest,
  response: IncomingResponse
) => void
