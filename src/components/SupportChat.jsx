import { useState, useRef, useEffect } from 'react';
import { Headphones, X, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';

// SQL to create the support_inquiries table in Supabase:
// CREATE TABLE support_inquiries (
//   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   email TEXT,
//   message TEXT,
//   created_at TIMESTAMP DEFAULT NOW()
// );

const SYSTEM_PROMPT = `You are Humix Support AI. Humix is an AI platform for underserved global populations offering Life Assistant (health, legal, agriculture, education, freelancing), Finance tools, Career tools, Business income tools, and Creative tools. You help users understand features, troubleshoot issues, and answer questions about Humix. You also handle sales inquiries — explain pricing (free to use), agent program (earn commissions), and platform benefits. Be warm, helpful, concise. If asked about something you don't know say 'Let me connect you with our team' and ask for their email.`;

const GREETING = "Hi! 👋 I'm Humix AI Support. How can I help you today? You can ask me about features, the agent program, or anything else.";

const ESCALATION_KEYWORDS = ['human', 'agent', 'real person'];
const ESCALATION_REPLY = "I'll connect you with our team. Please share your email and we'll get back to you within 24 hours.";

export default function SupportChat() {
  const [isOpen, setIsOpen]             = useState(false);
  const [messages, setMessages]         = useState([]);
  const [input, setInput]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [waitingForEmail, setWaitingForEmail] = useState(false);
  const [escalationMsg, setEscalationMsg]     = useState('');
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) {
      if (messages.length === 0) {
        setMessages([{ role: 'assistant', content: GREETING }]);
      }
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const send = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: trimmed };
    const history = [...messages, userMsg];
    setMessages(history);

    // Email capture after escalation
    if (waitingForEmail) {
      if (trimmed.includes('@')) {
        await supabase.from('support_inquiries').insert({ email: trimmed, message: escalationMsg });
        setMessages([...history, {
          role: 'assistant',
          content: "Thanks! Our team will reach out to you shortly. Is there anything else I can help with?",
        }]);
        setWaitingForEmail(false);
        setEscalationMsg('');
      } else {
        setMessages([...history, {
          role: 'assistant',
          content: "Please share your email address so our team can reach you.",
        }]);
      }
      return;
    }

    // Escalation trigger
    const lower = trimmed.toLowerCase();
    if (ESCALATION_KEYWORDS.some(k => lower.includes(k))) {
      setEscalationMsg(trimmed);
      setWaitingForEmail(true);
      setMessages([...history, { role: 'assistant', content: ESCALATION_REPLY }]);
      return;
    }

    // OpenRouter DeepSeek
    setLoading(true);
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + import.meta.env.VITE_OPENROUTER_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat-v3-0324',
          max_tokens: 200,
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
        }),
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content?.trim()
        ?? "I'm sorry, something went wrong. Please try again.";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Connection issue. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  return (
    <>
      {/* Slide-up chat panel */}
      <div
        style={{
          ...s.panel,
          transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.96)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        role="dialog"
        aria-label="Humix Support Chat"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div style={s.header}>
          <div style={s.headerLeft}>
            <span style={s.onlineDot} />
            <div>
              <p style={s.headerTitle}>Humix Support</p>
              <p style={s.headerSub}>AI Assistant — replies instantly</p>
            </div>
          </div>
          <button style={s.closePanelBtn} onClick={() => setIsOpen(false)} aria-label="Close chat">
            <X size={15} color="#64748B" strokeWidth={2} />
          </button>
        </div>

        {/* Messages */}
        <div style={s.messages}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={msg.role === 'user' ? s.userBubble : s.aiBubble}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ ...s.aiBubble, display: 'flex', alignItems: 'center', gap: '4px', padding: '12px 16px' }}>
                {[0, 1, 2].map(i => (
                  <span key={i} className="typing-dot"
                    style={{ animationDelay: `${i * 0.2}s`, background: '#6366F1' }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div style={s.inputBar}>
          <input
            ref={inputRef}
            type="text"
            placeholder={waitingForEmail ? "Enter your email…" : "Ask a question…"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={loading}
            style={s.inputField}
            aria-label="Chat input"
          />
          <button
            style={{ ...s.sendBtn, opacity: loading || !input.trim() ? 0.45 : 1 }}
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            aria-label="Send message"
          >
            <Send size={14} color="#fff" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Floating trigger button */}
      <button
        style={s.floatBtn}
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={isOpen ? "Close support chat" : "Open support chat"}
      >
        <div style={{ transition: 'transform 0.2s ease', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
          {isOpen
            ? <X size={18} color="#fff" strokeWidth={2} />
            : <Headphones size={18} color="#fff" strokeWidth={1.8} />
          }
        </div>
      </button>
    </>
  );
}

const s = {
  floatBtn: {
    position: 'fixed', bottom: '24px', right: '24px',
    width: '48px', height: '48px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
    zIndex: 350,
    transition: 'background 0.15s ease, border-color 0.15s ease',
  },
  panel: {
    position: 'fixed', bottom: '92px', right: '24px',
    width: 'min(360px, calc(100vw - 32px))',
    height: '520px', maxHeight: 'calc(100dvh - 120px)',
    zIndex: 349,
    background: '#111111',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    boxShadow: '0 32px 80px rgba(0,0,0,0.65)',
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
    transition: 'transform 0.24s cubic-bezier(0.34,1.56,0.64,1), opacity 0.18s ease',
    transformOrigin: 'bottom right',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    flexShrink: 0, background: '#141414',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  onlineDot: {
    width: '8px', height: '8px', borderRadius: '50%',
    background: '#00C48C',
    display: 'inline-block', flexShrink: 0,
  },
  headerTitle: {
    fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '14px',
    color: '#F8FAFC', lineHeight: 1.2,
  },
  headerSub: {
    fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#64748B', lineHeight: 1.4,
  },
  closePanelBtn: {
    width: '28px', height: '28px', borderRadius: '8px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.07)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
  },
  messages: {
    flex: 1, overflowY: 'auto', padding: '14px 16px',
    display: 'flex', flexDirection: 'column', gap: '10px',
  },
  userBubble: {
    maxWidth: '80%', padding: '10px 14px',
    background: 'rgba(99,102,241,0.16)',
    border: '1px solid rgba(99,102,241,0.24)',
    borderRadius: '16px 16px 4px 16px',
    fontFamily: "'Inter', sans-serif", fontSize: '13px',
    color: '#F5F5F5', lineHeight: 1.5,
  },
  aiBubble: {
    maxWidth: '84%', padding: '10px 14px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '16px 16px 16px 4px',
    fontFamily: "'Inter', sans-serif", fontSize: '13px',
    color: '#F8FAFC', lineHeight: 1.5,
  },
  inputBar: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '12px 14px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    background: '#141414', flexShrink: 0,
  },
  inputField: {
    flex: 1, height: '40px', padding: '0 14px',
    border: '1.5px solid rgba(255,255,255,0.1)',
    borderRadius: '50px', fontSize: '13px',
    fontFamily: "'Inter', sans-serif",
    color: '#F8FAFC', background: 'rgba(255,255,255,0.05)',
    outline: 'none', minWidth: 0,
    transition: 'border-color 0.15s ease',
  },
  sendBtn: {
    flexShrink: 0, width: '36px', height: '36px', borderRadius: '50%',
    background: '#6366F1', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: 'none',
    transition: 'opacity 0.15s ease',
  },
};
