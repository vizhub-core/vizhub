import { createContext } from 'react';
import { User } from 'entities';
import { useShareDBDocData } from '../useShareDBDocData';

// A context that provides the currently authenticated user.
// `null` means that the user is not authenticated.
export const AuthenticatedUserContext =
  createContext<User | null>(null);

export const AuthenticatedUserProvider = ({
  authenticatedUserSnapshot,
  children,
}) => {
  const authenticatedUser: User | null =
    useShareDBDocData<User | null>(
      authenticatedUserSnapshot,
      'User',
    );

  return (
    <AuthenticatedUserContext.Provider
      value={authenticatedUser}
    >
      {children}
    </AuthenticatedUserContext.Provider>
  );
};
