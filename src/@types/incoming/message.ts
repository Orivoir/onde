import IncomingRequest from './request.ts'
import IncomingResponse from './response.ts'

export default interface IncomingMessage {
  request: IncomingRequest,
  response: IncomingResponse,
}
