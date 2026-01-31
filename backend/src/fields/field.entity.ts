import { Entity, PrimaryGeneratedColumn, Column, VersionColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { TimeSlot } from './timeslot.entity';

export enum LocationRegion {
  SEOUL = '서울',
  GYEONGGI_INCHEON = '경기/인천',
  CHUNGCHEONG = '충청',
  JEOLLA = '전라',
  GYEONGSANG = '경상',
  GANGWON = '강원',
}

@Entity('fields')
export class Field {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ type: 'int' })
  pricePerHour: number;

  @Column({ nullable: true })
  description: string;

  @VersionColumn()
  version: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column("simple-array", { nullable: true })
  imageUrls: string[];

  @Column({
    type: 'enum',
    enum: LocationRegion,
    default: LocationRegion.SEOUL,
  })
  region: LocationRegion;

  @OneToMany(() => TimeSlot, (timeSlot) => timeSlot.field, {
    cascade: true,
  })
  timeSlots: TimeSlot[];
}