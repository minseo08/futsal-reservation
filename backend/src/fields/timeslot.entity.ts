import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Field } from './field.entity';

@Entity('time_slots')
export class TimeSlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({ default: 'AVAILABLE' }) // AVAILABLE, PENDING, BOOKED
  status: string;

  @ManyToOne(() => Field, (field) => field.timeSlots, {
    onDelete: 'CASCADE',
  })

  @JoinColumn({ name: 'field_id' })
  field: Field;
}