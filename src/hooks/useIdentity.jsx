import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const CONFIRMED_KEY   = 'humix_identity_confirmed';
const USER_ID_KEY     = 'humix_user_id';
const LAST_ACTIVE_KEY = 'humix_last_active';
const GUEST_USES_KEY  = 'humix_guest_uses';
const SESSION_TTL     = 24 * 60 * 60 * 1000;

function checkAndRefresh() {
  if (localStorage.getItem(CONFIRMED_KEY) !== 'true') return false;

  const raw = localStorage.getItem(LAST_ACTIVE_KEY);
  if (raw && Date.now() - parseInt(raw, 10) > SESSION_TTL) {
    localStorage.removeItem(CONFIRMED_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(LAST_ACTIVE_KEY);
    return false;
  }

  localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
  return true;
}

const IdentityCtx = createContext(null);

export function IdentityProvider({ children }) {
  const [isVerified, setIsVerified] = useState(() => checkAndRefresh());
  const [userId, setUserId]         = useState(() => localStorage.getItem(USER_ID_KEY) ?? null);
  const [guestUses, setGuestUses]   = useState(() =>
    parseInt(localStorage.getItem(GUEST_USES_KEY) || '0', 10),
  );

  // Listen for Supabase auth events (magic link returns, session refresh)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') &&
        session?.user
      ) {
        localStorage.setItem(USER_ID_KEY, session.user.id);
        localStorage.setItem(CONFIRMED_KEY, 'true');
        localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
        setIsVerified(true);
        setUserId(session.user.id);
      }
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem(CONFIRMED_KEY);
        localStorage.removeItem(USER_ID_KEY);
        localStorage.removeItem(LAST_ACTIVE_KEY);
        setIsVerified(false);
        setUserId(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

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

  const incrementGuestUse = () => {
    const next = guestUses + 1;
    localStorage.setItem(GUEST_USES_KEY, next.toString());
    setGuestUses(next);
  };

  return (
    <IdentityCtx.Provider value={{ isVerified, userId, guestUses, verify, clearIdentity, incrementGuestUse }}>
      {children}
    </IdentityCtx.Provider>
  );
}

export function useIdentity() {
  return useContext(IdentityCtx);
}
