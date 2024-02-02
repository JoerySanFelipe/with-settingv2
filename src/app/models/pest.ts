import { Timestamp } from '@angular/fire/firestore';

export interface PestMap {
  id: string;
  title: string;
  image: string;
  topic: Topic[];
  createdAt: Timestamp;
}

export interface Topic {
  title: string;
  desc: string;
  image: string;
  category: string;
  contents: Contents[];
  comments: Comments[];
  recomendations: string[];
}

export interface Contents {
  title: string;
  description: string;
  image: string;
}

export interface Comments {
  userID: string;
  isAgritechEmployee: boolean;
  comment: string;
}
