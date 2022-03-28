import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { ORDER_STATE, TimelineItem } from './orders';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  state: ORDER_STATE;
  timeline: TimelineItem[];
}
