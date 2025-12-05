import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Unique,
  AllowNull,
  HasMany,
} from "sequelize-typescript";
import Post from "./Posts.model";
import { Comment } from "./Comments.model";
import { Like } from "./Likes.model";

@Table({
  tableName: "users",
  timestamps: true,
})
class User extends Model {
  //Colum for id : primary key, serial, integer
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id_user: number; //Promise ts it will not be null

  //Column for name : unique, not null, string
  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare username: string;

  //Colum for e-mail: unique, not null, string
  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare email: string;

  //Column for password, not null, string
  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare password: string;

  //Column for avatar: string
  @Column(DataType.STRING(255))
  declare avatar?: string; //? Tells ts it might be empty

  // Relationships

  //One to many relationship: one user can have many posts

  //the user_id is being used as foreign key in posts, we specificy that a user can have many posts and a post can have one user
  @HasMany(() => Post, "user_id")
  declare posts: Post[];

  //One to many relationship: one user can have many comments

  //the user_id is being used as foreign key in comments, we specificy that a user can have many comments and a comment can have one user
  @HasMany(() => Comment, "user_id")
  declare comments: Comment[];

  //One to many relationship: one user can have many likes

  //the user_id is being used as foreign key in Like, we specificy that a user can have many likes and a like can have one user
  @HasMany(() => Like, "user_id")
  likes!: Like[];
}

//Export default the classs for it to work properly
export default User;
