import { z } from "zod";
import { Book } from "./books";

export const USER_BOOK_STATUSES = ["read", "reading", "want-to-read"] as const;
export type UserBookStatus = (typeof USER_BOOK_STATUSES)[number];

export const userBookSchema = z.object({
  bookId: z.string(),
  comment: z.string().optional(),
  rating: z.number().optional(),
  status: z.enum(USER_BOOK_STATUSES),
});

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number(),
  email: z.string().email(),
  books: z.array(userBookSchema),
  friends: z.array(z.string()),
});

export type User = z.infer<typeof userSchema>;
export type UserBook = z.infer<typeof userBookSchema>;

export async function fetchCurrentUser(): Promise<User> {
  const response = await fetch("/api/me");
  return await response.json();
}

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch("/api/users");
  return await response.json();
}

export async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);

  return await response.json();
}

export async function fetchFriends(id: string): Promise<User[]> {
  const response = await fetch(`/api/users/${id}/friends`);

  return await response.json();
}

export async function fetchUserBooks(id: string): Promise<(UserBook & Book)[]> {
  const response = await fetch(`/api/users/${id}/books`);
  return await response.json();
}

export async function updateUserBookStatus({
  userId,
  bookId,
  status,
}: {
  userId: string;
  bookId: string;
  status: UserBookStatus;
}): Promise<UserBook> {
  const response = await fetch(`/api/users/${userId}/books/${bookId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  return await response.json();
}
