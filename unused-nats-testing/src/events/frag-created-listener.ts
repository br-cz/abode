import { Message } from 'node-nats-streaming';
import { Listener } from './abstract-listener';
import { Subjects } from './subjects';
import { FragCreatedEvent } from './frag-created-event';

export class FragCreatedListener extends Listener<FragCreatedEvent> {
  //our event/msg type
  //Annotating with the variable type with code the same as the assignment is weird,
  //but essentially TS wants to know we'll never change the type of subject like final in Java, but in this case its readonly
  readonly subject: Subjects.FragCreated = Subjects.FragCreated;

  queueGroupName = 'payments-service'; //can possibly be refactored

  //the syntax for data annotation basically gives data the data "type" from the frag-created-event interface
  onMessage(data: FragCreatedEvent['data'], msg: Message) {
    console.log('Event Data!', data);

    msg.ack();
  }
}
