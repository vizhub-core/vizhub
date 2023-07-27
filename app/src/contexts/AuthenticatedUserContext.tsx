import { createContext } from 'react';
import { User } from 'entities';
import { useShareDBDocData } from '../useShareDBDocData';

// A context that provides the currently authenticated user.
export const AuthenticatedUserContext = createContext<User | null>(null);

export const AuthenticatedUserProvider = ({
  authenticatedUserSnapshot,
  children,
}) => (
  <AuthenticatedUserContext.Provider
    value={useShareDBDocData<User>(authenticatedUserSnapshot, 'User')}
  >
    {children}
  </AuthenticatedUserContext.Provider>
);
