import {PartialType} from "@nestjs/swagger";
import {AbstractBaseCreateDto} from "./abstract.base.create.dto";

export class AbstractBaseUpdateDto extends PartialType(AbstractBaseCreateDto) {
}