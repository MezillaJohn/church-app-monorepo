export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string; // MongoDB ObjectId as string
        email: string;
        name: string;
        isAdmin: boolean;
        emailVerifiedAt?: Date | null;
      };
    }
  }
}
