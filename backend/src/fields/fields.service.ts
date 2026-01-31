import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Field, LocationRegion } from './field.entity';
import { TimeSlot } from './timeslot.entity';
import { Reservation } from './reservation.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class FieldsService {
  constructor(
    @InjectRepository(Field)
    private fieldsRepository: Repository<Field>,
    @InjectRepository(TimeSlot)
    private timeSlotRepository: Repository<TimeSlot>,
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    private mailService: MailService,
  ) {}

  async createField(
    name: string, 
    address: string, 
    pricePerHour: number,
    startHour: number,
    endHour: number,
    region: LocationRegion,
    thumbnailUrl?: string,
    imageUrls?: string[]
  ): Promise<Field> {
    const newField = this.fieldsRepository.create({ name, address, pricePerHour, region, thumbnailUrl, imageUrls });
    const savedField = await this.fieldsRepository.save(newField);

    const slots: TimeSlot[] = [];
    for (let hour = startHour; hour < endHour; hour += 2) {
      const startTime = new Date();
      startTime.setHours(hour, 0, 0, 0);

      const endTime = new Date();
      endTime.setHours(hour + 2, 0, 0, 0);

      const slot = this.timeSlotRepository.create({
        startTime,
        endTime,
        field: savedField,
      });
      slots.push(slot);
    }

    await this.timeSlotRepository.save(slots);

    return savedField;
  }

  async findAll(region?: LocationRegion): Promise<Field[]> {
    return await this.fieldsRepository.find({
      where: region ? { region } : {},
      relations: ['timeSlots']
    });
  }

  async bookSlot(timeSlotId: string, userName: string, userEmail: string): Promise<Reservation> {
    const slot = await this.timeSlotRepository.findOne({ 
      where: { id: timeSlotId },
      relations: ['field'] 
    });
    
    if (!slot || slot.status !== 'AVAILABLE') {
      throw new Error('이미 예약되었거나 존재하지 않는 시간대입니다.');
    }

    const timeInfo = `${slot.startTime.getHours()}:00 - ${slot.endTime.getHours()}:00`;

    slot.status = 'BOOKED';
    await this.timeSlotRepository.save(slot);

    const newReservation = this.reservationRepository.create({
      userName,
      timeSlot: slot,
    });
    
    const savedReservation = await this.reservationRepository.save(newReservation);

    await this.mailService.sendReservationConfirm(
      userEmail, 
      userName, 
      slot.field.name, 
      timeInfo
    );

    return savedReservation;
  }
  async findOne(id: string): Promise<Field> {
    const field = await this.fieldsRepository.findOne({
      where: { id },
      relations: ['timeSlots'],
      order: {
        timeSlots: {
          startTime: 'ASC',
        },
      },
    });
    
    if (!field) throw new Error('구장을 찾을 수 없습니다.');
    return field;
  }
  async findMyReservations(userName: string): Promise<Reservation[]> {
    return await this.reservationRepository.find({
      where: { userName },
      relations: ['timeSlot', 'timeSlot.field'],
      order: { reservedAt: 'DESC' },
    });
  }
  async cancelReservation(reservationId: string): Promise<void> {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
      relations: ['timeSlot'],
    });

    if (!reservation) {
      throw new Error('예약 내역을 찾을 수 없습니다.');
    }

    const slot = reservation.timeSlot;
    slot.status = 'AVAILABLE';
    await this.timeSlotRepository.save(slot);

    await this.reservationRepository.remove(reservation);
  }

  async updateField(id: string, updateData: Partial<Field>): Promise<Field> {
    const field = await this.fieldsRepository.findOne({ where: { id } });
    
    if (!field) {
      throw new Error('수정할 구장을 찾을 수 없습니다.');
    }

    Object.assign(field, updateData);

    return await this.fieldsRepository.save(field);
  }

  async deleteField(id: string): Promise<void> {
    const field = await this.fieldsRepository.findOne({ where: { id } });
    
    if (!field) {
      throw new Error('삭제할 구장을 찾을 수 없습니다.');
    }

    await this.fieldsRepository.remove(field);
  }


}