import { createContext, useContext, useState } from 'react';

const IdentityCtx = createContext(null);

export function IdentityProvider({ children }) {
  const [isVerified, setIsVerified] = useState(
    () => localStorage.getItem('humix_identity_confirmed') === 'true'
  );

  const verify = () => {
    localStorage.setItem('humix_identity_confirmed', 'true');
    setIsVerified(true);
  };

  return (
    <IdentityCtx.Provider value={{ isVerified, verify }}>
      {children}
    </IdentityCtx.Provider>
  );
}

export function useIdentity() {
  return useContext(IdentityCtx);
}
