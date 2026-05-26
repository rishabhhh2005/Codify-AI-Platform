import { createContext, useContext } from 'react';
import { useInterviewSession } from '@/hooks/useInterviewSession';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const session = useInterviewSession();
  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside SessionProvider');
  return ctx;
}
