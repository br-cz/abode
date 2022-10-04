import { Publisher, Subjects, FragCreatedEvent } from '@abodeorg/common';

export class FragCreatedPublisher extends Publisher<FragCreatedEvent> {
  subject: Subjects.FragCreated = Subjects.FragCreated;
}
