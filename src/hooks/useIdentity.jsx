import { createContext, useContext, useState } from 'react';

const CONFIRMED_KEY   = 'humix_identity_confirmed';
const USER_ID_KEY     = 'humix_user_id';
const LAST_ACTIVE_KEY = 'humix_last_active';
const SESSION_TTL     = 24 * 60 * 60 * 1000; // 24 hours in ms

function checkAndRefresh() {
  if (localStorage.getItem(CONFIRMED_KEY) !== 'true') return false;

  const raw = localStorage.getItem(LAST_ACTIVE_KEY);
  if (raw && Date.now() - parseInt(raw, 10) > SESSION_TTL) {
    // Expired — wipe everything
    localStorage.removeItem(CONFIRMED_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(LAST_ACTIVE_KEY);
    return false;
  }

  // Still valid — refresh activity timestamp
  localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
  return true;
}

const IdentityCtx = createContext(null);

export function IdentityProvider({ children }) {
  const [isVerified, setIsVerified] = useState(() => checkAndRefresh());
  const [userId, setUserId]         = useState(
    () => localStorage.getItem(USER_ID_KEY) ?? null,
  );

  const verify = () => {
    localStorage.setItem(CONFIRMED_KEY, 'true');
    localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
    setIsVerified(true);
    const id = localStorage.getItem(USER_ID_KEY);
    if (id) setUserId(id);
  };

  const clearIdentity = () => {
    localStorage.removeItem(CONFIRMED_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(LAST_ACTIVE_KEY);
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
