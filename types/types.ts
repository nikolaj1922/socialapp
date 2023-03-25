import { User } from "next-auth";

export interface IPost {
  commentId?: string;
  id: string;
  image: string;
  userTag: string;
  text: string;
  timestamp: string;
  userImg: string;
  username: string;
}

export interface ExtendedUserType extends User {
  tag?: string;
  uid?: string;
}
