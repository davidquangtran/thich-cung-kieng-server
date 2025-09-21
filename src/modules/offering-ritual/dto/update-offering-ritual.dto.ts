import { PartialType } from '@nestjs/mapped-types';
import { CreateOfferingRitualDto } from './create-offering-ritual.dto';

export class UpdateOfferingRitualDto extends PartialType(CreateOfferingRitualDto) {}
