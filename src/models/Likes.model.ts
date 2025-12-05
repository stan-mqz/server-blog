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
} from "sequelize-typescript";
import User from "./Users.model";
import Post from "./Posts.model";

@Table({
  tableName: "likes",
  timestamps: true,
})
export class Like extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id_like: number;

  //Foreign key to bring user_id

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare user_id: number;
  //Foreign key to bring posts_id

  @ForeignKey(() => Post)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare post_id: number;

  //We say that user_id belongs to User
  @BelongsTo(() => User, "user_id")
  declare user: User;

  //We say that post_id belongs to Post
  @BelongsTo(() => Post, "post_id")
  declare post: Post;
}

export default Like;
