import { Publisher, Subjects, FragUpdatedEvent } from '@abodeorg/common';

export class FragUpdatedPublisher extends Publisher<FragUpdatedEvent> {
  subject: Subjects.FragUpdated = Subjects.FragUpdated;
}
