import { Subjects } from './subjects';

export interface FragCreatedEvent {
  subject: Subjects.FragCreated;

  //the data we'll have in the current event
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}
