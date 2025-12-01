import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import User from "./Users.model";
import { Comment } from "./Comments.model";
import { Like } from "./Likes.model";

@Table({
  tableName: "posts",
  timestamps: true,
})
class Post extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id_post!: number;

  @Column(DataType.TEXT)
  content?: string;

  @Column(DataType.STRING(255))
  image?: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  title?: string;

  //Create foreign key from model User
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  user_id!: number;

  // Relationships
  //We specify that the content of user_id belongs to FK from user
  @BelongsTo(() => User, "user_id")
  user!: User;

  //the post_id is being used as foreign key in comments, we specificy that a post can have many comments and a comment can have one post
  @HasMany(() => Comment, "post_id")
  comments!: Comment[];

  //the post_id is being used as foreign key in likes, we specificy that a post can have many likes and a like can have one post
  @HasMany(() => Like, "post_id")
  likes!: Like[];
}

export default Post;
