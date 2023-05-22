export interface Message {
    id: string;
    content: string;
}

export interface CharacterMessage extends Message {}

export interface UserMessage extends Message {}
