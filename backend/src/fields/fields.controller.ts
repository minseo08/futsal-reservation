import { Controller, Get, Post, Body, Param, Query, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { FieldsService } from './fields.service';
import { Field, LocationRegion } from './field.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';

@Controller('fields')
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  create(
    @Body('name') name: string,
    @Body('address') address: string,
    @Body('pricePerHour') pricePerHour: number,
    @Body('startHour') startHour: number,
    @Body('endHour') endHour: number,
    @Body('region') region: LocationRegion,
    @Body('thumbnailUrl') thumbnailUrl: string,
    @Body('imageUrls') imageUrls: string[]
  ) {
    return this.fieldsService.createField(name, address, pricePerHour, startHour, endHour, region, thumbnailUrl, imageUrls);
  }

  @Get()
  findAll(@Query('region') region?: LocationRegion) {
    return this.fieldsService.findAll(region);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('reserve')
  reserve(
    @Body('timeSlotId') timeSlotId: string,
    @Request() req: any
  ) {
        return this.fieldsService.bookSlot(timeSlotId, req.user.name, req.user.email);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fieldsService.findOne(id);
  }


  @UseGuards(AuthGuard('jwt'))
  @Get('reservations/mine')
  findMyReservations(@Request() req: any) {
    return this.fieldsService.findMyReservations(req.user.name);
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Delete('reservations/:id')
  cancelReservation(@Param('id') id: string) {
    return this.fieldsService.cancelReservation(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<Field>) {
    return await this.fieldsService.updateField(id, updateData);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.fieldsService.deleteField(id);
  }
}