class ApiErrors extends Error {
  constructor(
    statusCode,
    message = "Somthing went wrong",
    errors = [],
    stack = ""
  ) {
    super(message) //Calls the parent Error constructor and sets the message property.
    this.statusCode = statusCode
    this.data = null,
    this.message = message,
    this.success = false,
    this.errors = errors
    
    if(stack){
        this.stack = stack
    }else{
        Error.captureStackTrace(this,this.constructor)
    }
  }
}
export {ApiErrors}
