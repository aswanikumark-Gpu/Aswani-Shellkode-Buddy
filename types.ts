
export enum MessageAuthor {
  USER = 'user',
  BOT = 'bot',
}

export interface Message {
  author: MessageAuthor;
  text: string;
}
