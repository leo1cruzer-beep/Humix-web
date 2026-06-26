import { createContext, useContext, useState } from 'react';

const CONFIRMED_KEY = 'humix_identity_confirmed';
const USER_ID_KEY   = 'humix_user_id';

const IdentityCtx = createContext(null);

export function IdentityProvider({ children }) {
  const [isVerified, setIsVerified] = useState(
    () => localStorage.getItem(CONFIRMED_KEY) === 'true',
  );
  const [userId, setUserId] = useState(
    () => localStorage.getItem(USER_ID_KEY) ?? null,
  );

  const verify = () => {
    localStorage.setItem(CONFIRMED_KEY, 'true');
    setIsVerified(true);
    const id = localStorage.getItem(USER_ID_KEY);
    if (id) setUserId(id);
  };

  const clearIdentity = () => {
    localStorage.removeItem(CONFIRMED_KEY);
    localStorage.removeItem(USER_ID_KEY);
    setIsVerified(false);
    setUserId(null);
  };

  return (
    <IdentityCtx.Provider value={{ isVerified, userId, verify, clearIdentity }}>
      {children}
    </IdentityCtx.Provider>
  );
}

export function useIdentity() {
  return useContext(IdentityCtx);
}
