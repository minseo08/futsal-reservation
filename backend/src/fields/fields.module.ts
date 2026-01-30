// backend/src/fields/fields.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Field } from './field.entity';
import { TimeSlot } from './timeslot.entity';
import { Reservation } from './reservation.entity';
import { FieldsService } from './fields.service';
import { FieldsController } from './fields.controller';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Field, TimeSlot, Reservation]),
  MailModule,
],
  providers: [FieldsService],
  controllers: [FieldsController],
})
export class FieldsModule {}