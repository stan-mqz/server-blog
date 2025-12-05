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
} from 'sequelize-typescript';
import  User  from './Users.model';
import  Post  from './Posts.model';

@Table({
  tableName: 'comments',
  timestamps: true,
})
export class Comment extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id_comment: number;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare content_comment: string;

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
  @BelongsTo(() => User, 'user_id')
  declare user: User;

  //We say that post_id belongs to Post
  @BelongsTo(() => Post, 'post_id')
  declare post: Post;
}   

export default Comment