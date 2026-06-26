import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const IdentityCtx = createContext(null);

export function IdentityProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const u = session?.user ?? null;
        setUser(u);

        // Auto-create profile on first sign-in
        if (event === 'SIGNED_IN' && u) {
          await supabase.from('profiles').upsert(
            { id: u.id, email: u.email, created_at: new Date().toISOString() },
            { onConflict: 'id', ignoreDuplicates: true },
          );
        }
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  const clearIdentity = () => supabase.auth.signOut();

  return (
    <IdentityCtx.Provider value={{
      isVerified: !!user,
      userId: user?.id ?? null,
      user,
      loading,
      clearIdentity,
    }}>
      {children}
    </IdentityCtx.Provider>
  );
}

export function useIdentity() {
  return useContext(IdentityCtx);
}
