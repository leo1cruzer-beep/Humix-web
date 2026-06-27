import { createContext, useContext, useState, useEffect } from 'react';
import { useIdentity } from './useIdentity';

const LIFE_USES_KEY = 'havro_life_assistant_uses';
const TOOL_USES_KEY = 'havro_tool_uses';
const LIFE_LIMIT    = 5;
const TOOL_LIMIT    = 1;

const EmailGateCtx = createContext(null);

export function EmailGateProvider({ children }) {
  const { userHasEmail } = useIdentity();
  const [gateOpen, setGateOpen] = useState(false);
  const [lifeUses, setLifeUses] = useState(() =>
    parseInt(localStorage.getItem(LIFE_USES_KEY) || '0', 10),
  );
  const [toolUses, setToolUses] = useState(() =>
    JSON.parse(localStorage.getItem(TOOL_USES_KEY) || '{}'),
  );

  // When email is verified, close gate and reset all counters
  useEffect(() => {
    if (userHasEmail) {
      setGateOpen(false);
      localStorage.removeItem(LIFE_USES_KEY);
      localStorage.removeItem(TOOL_USES_KEY);
      setLifeUses(0);
      setToolUses({});
    }
  }, [userHasEmail]);

  // Returns true if the user is gated (and opens the gate modal).
  // Call this BEFORE the AI action; if it returns true, abort.
  const checkGate = (category) => {
    if (userHasEmail) return false;
    if (localStorage.getItem('havro_email_verified') === 'true') return false;
    const isLife = category === 'life-assistant';
    const limit  = isLife ? LIFE_LIMIT : TOOL_LIMIT;
    const uses   = isLife ? lifeUses : (toolUses[category] ?? 0);
    if (uses >= limit) {
      setGateOpen(true);
      return true;
    }
    return false;
  };

  // Call this when the user successfully initiates an AI action.
  const recordUse = (category) => {
    if (userHasEmail) return;
    if (category === 'life-assistant') {
      const next = lifeUses + 1;
      localStorage.setItem(LIFE_USES_KEY, next.toString());
      setLifeUses(next);
    } else {
      const next = { ...toolUses, [category]: (toolUses[category] ?? 0) + 1 };
      localStorage.setItem(TOOL_USES_KEY, JSON.stringify(next));
      setToolUses(next);
    }
  };

  return (
    <EmailGateCtx.Provider value={{ checkGate, recordUse, gateOpen, setGateOpen }}>
      {children}
    </EmailGateCtx.Provider>
  );
}

export function useEmailGate() {
  return useContext(EmailGateCtx);
}
