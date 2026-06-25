import { createContext, useContext, useState } from 'react';

const CONFIRMED_KEY = 'humix_identity_confirmed';
const DESCRIPTOR_KEY = 'humix_face_descriptor';

const IdentityCtx = createContext(null);

export function IdentityProvider({ children }) {
  const [isVerified, setIsVerified] = useState(
    () => localStorage.getItem(CONFIRMED_KEY) === 'true',
  );

  const verify = () => {
    localStorage.setItem(CONFIRMED_KEY, 'true');
    setIsVerified(true);
  };

  const clearIdentity = () => {
    localStorage.removeItem(CONFIRMED_KEY);
    localStorage.removeItem(DESCRIPTOR_KEY);
    setIsVerified(false);
  };

  return (
    <IdentityCtx.Provider value={{ isVerified, verify, clearIdentity }}>
      {children}
    </IdentityCtx.Provider>
  );
}

export function useIdentity() {
  return useContext(IdentityCtx);
}
