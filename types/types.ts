import { User } from "next-auth";

export interface IPost {
  id: string;
  image: string;
  tag: string;
  text: string;
  timestamp: string;
  userImg: string;
  username: string;
}

export interface ExtendedUserType extends User {
  tag?: string;
  uid?: string;
}

export interface ILike {}
