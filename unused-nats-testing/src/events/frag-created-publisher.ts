import { Publisher } from './abstract-publisher';
import { FragCreatedEvent } from './frag-created-event';
import { Subjects } from './subjects';

export class FragCreatedPublisher extends Publisher<FragCreatedEvent> {
  subject: Subjects.FragCreated = Subjects.FragCreated;
}
