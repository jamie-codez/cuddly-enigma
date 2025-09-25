export class HealthCheckResponseDto {
    statusCode: number;
    statusMessage: string;
    message: string;
    data: any;

    constructor(statusCode: number, statusMessage: string, message: string, data: any) {
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
        this.message = message;
        this.data = data;
    }
}