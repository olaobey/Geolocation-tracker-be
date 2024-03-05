/* eslint-disable @typescript-eslint/no-explicit-any */
class APIError extends Error {
    status: number;
  
    data?: any;
  
    constructor(message = 'Internal server error', status = 500, data = undefined) {
      super(message);
      this.status = status;
      this.data = data;
    }
  
    static notFound(msg = 'Resources Not Found', status = 404) {
      return new APIError(msg, status);
    }
  
    static serverError(msg = 'Server error', status = 500) {
      return new APIError(msg, status);
    }
  
    static emptyOutput(msg = 'No content', status = 204) {
      return new APIError(msg, status);
    }
  
    static unauthorized(msg = "Sorry, you don't have the right permission to view the resources", status = 403) {
      return new this(msg, status);
    }
  
    static unauthenticated(msg = 'Sorry, you need to login first', status = 401) {
      return new this(msg, status);
    }
  
    static badRequest(msg = 'Bad request', status = 400, data: any = undefined) {
      return new this(msg, status, data);
    }
  
    static conflict(msg = 'User email already exist', status = 409, data: any = undefined) {
      return new this(msg, status, data);
    }
  }
  
  export default APIError;