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

export interface ITrending {
  description: string;
  heading: string;
  img: string;
  tags: string[];
}

export interface IFollow {
  username: string;
  userImg: string;
  tag: string;
}
