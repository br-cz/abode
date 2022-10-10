import { Publisher, Subjects, OrderCreatedEvent } from '@abodeorg/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
