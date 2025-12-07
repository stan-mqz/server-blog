export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const, //as const converts it into a literal type
  maxAge: 30 * 24 * 60 * 60 * 1000,
};