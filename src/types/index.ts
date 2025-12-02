export type UserType = {
    id_user: number,
    username: string,
    email: string,
    password: string,
    avatar: string
    posts: PostType[]
}

export type PostType = {
    id_post: number,
    content: string,
    image?: string,
    title: string,
    user_id: UserType['id_user']
}