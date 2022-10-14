import { Subjects, Publisher, ExpirationCompleteEvent } from '@abodeorg/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
