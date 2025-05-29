export default class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        Object.setPrototypeOf(this, ApiError.prototype);
    }

    static badRequest(message: string) { 
        return new ApiError(400, message);
    } 

    static internal(message: string) { 
        return new ApiError(500, message);
    } 

    static forbidden(errors = []) { 
        return new ApiError(403, 'Access denied');
    } 

    static unauthorizedError(errors = []) {
        return new ApiError(401, 'Unauthorized access');
    } 
}