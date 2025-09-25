import {HttpStatus, Injectable} from '@nestjs/common';
import {HealthCheckResponseDto} from "../dtos/health.check.dto";

@Injectable()
export class AppService {
    async healthCheck() {
        return new HealthCheckResponseDto(HttpStatus.OK, "OK", "Application is running", null)
    }
}
