import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActivityLogger } from '../hooks/useActivityLogger';
import { useEmailGate } from '../hooks/useEmailGate';
import { Heart, Scale, Sprout, GraduationCap, Briefcase, Send, ArrowLeft } from 'lucide-react';
import { LoanShield } from '../screens/LoanShield';

const SERVICES = [
  { id: 'health',      label: 'Health',      Icon: Heart,         desc: 'Medical guidance for you and your family' },
  { id: 'legal',       label: 'Legal',       Icon: Scale,         desc: 'Understand your rights and legal options' },
  { id: 'agriculture', label: 'Agriculture', Icon: Sprout,        desc: 'Farming advice and crop guidance' },
  { id: 'education',   label: 'Education',   Icon: GraduationCap, desc: 'Learning support for all ages' },
  { id: 'freelancing', label: 'Freelancing', Icon: Briefcase,     desc: 'Find work and grow your income' },
];

const LANGUAGES = [
  { code: 'en', label: 'English', content: 'English' },
  { code: 'ur', label: 'اردو',    content: 'اردو'   },
  { code: 'ar', label: 'العربية', content: 'Arabic'  },
];

async function apiPost(path, body) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export default function LifeAssistantPage() {
  const navigate = useNavigate();
  const [activeService, setActiveService]   = useState(null);
  const [messages, setMessages]             = useState([]);
  const [inputText, setInputText]           = useState('');
  const [isTyping, setIsTyping]             = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [sessionId, setSessionId]           = useState(null);
  const [selectedLang, setSelectedLang]     = useState('en');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { logActivity } = useActivityLogger();
  const { checkGate, recordUse } = useEmailGate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const selectService = async (svc) => {
    setActiveService(svc);
    setMessages([]);
    setInputText('');
    setIsTyping(false);
    setSessionId(null);
    setSelectedLang('en');
    setIsInitializing(true);

    try {
      const sessionData = await apiPost('/api/proxy/api/chat/session', { service: svc.id });
      const newId = sessionData.sessionId;
      setSessionId(newId);
      // Complete all 4 onboarding steps so real AI kicks in immediately
      await apiPost('/api/proxy/api/chat/message', { sessionId: newId, content: 'English' }); // step 0 → set language
      await apiPost('/api/proxy/api/chat/message', { sessionId: newId, content: 'no' });       // step 1 → farmer
      await apiPost('/api/proxy/api/chat/message', { sessionId: newId, content: 'no' });       // step 2 → children
      await apiPost('/api/proxy/api/chat/message', { sessionId: newId, content: 'male' });     // step 3 → gender → complete
    } catch { /* allow user to still try chatting */ } finally {
      setIsInitializing(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const switchLanguage = async (lang) => {
    if (isInitializing || selectedLang === lang.code) return;
    setSelectedLang(lang.code);
    setMessages([]);
    setInputText('');
    setIsTyping(false);
    setSessionId(null);
    setIsInitializing(true);

    try {
      const sessionData = await apiPost('/api/proxy/api/chat/session', { service: activeService.id });
      const newId = sessionData.sessionId;
      setSessionId(newId);
      await apiPost('/api/proxy/api/chat/message', { sessionId: newId, content: lang.content }); // step 0 → language
      await apiPost('/api/proxy/api/chat/message', { sessionId: newId, content: 'no' });          // step 1
      await apiPost('/api/proxy/api/chat/message', { sessionId: newId, content: 'no' });          // step 2
      await apiPost('/api/proxy/api/chat/message', { sessionId: newId, content: 'male' });        // step 3 → complete
    } catch { /* silent fail */ } finally {
      setIsInitializing(false);
    }
  };

  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text || isTyping || isInitializing || !sessionId) return;
    if (checkGate('life-assistant')) return;
    recordUse('life-assistant');

    setMessages(prev => [...prev, { role: 'user', text, id: Date.now() }]);
    setInputText('');
    setIsTyping(true);

    try {
      const data = await apiPost('/api/proxy/api/chat/message', {
        sessionId,
        content: text,
        service: activeService.id,
      });
      const reply = data.assistantMessage?.content ?? 'I received your message.';
      setMessages(prev => [...prev, { role: 'assistant', text: reply, id: Date.now() }]);
      logActivity(activeService.label, 'Life Assistant', reply);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: 'Sorry, I could not connect right now. Please try again.', id: Date.now() },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const busy = isTyping || isInitializing;

  return (
    <div className="life-assistant-page page-transition">
      {/* ── TOP: Service selector ── */}
      <div className="service-cards-section">
        {/* Topbar */}
        <div style={s.topBar}>
          <button onClick={() => navigate('/')} style={s.backBtn} aria-label="Back">
            <ArrowLeft size={18} strokeWidth={2} />
          </button>
          <span style={s.topBarTitle}>Life Assistant</span>
          <span className="badge badge-blue label-tag" style={{ fontSize: '11px' }}>AI-Powered</span>
        </div>

        {/* Cards */}
        <div style={s.cardsWrap}>
          {SERVICES.map(svc => (
            <ServicePill
              key={svc.id}
              svc={svc}
              active={activeService?.id === svc.id}
              onClick={() => selectService(svc)}
            />
          ))}
        </div>
      </div>

      {/* ── BOTTOM: Chat area ── */}
      <div className="chat-section">
        {!activeService ? (
          <div style={s.emptyState}>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', textAlign: 'center', padding: '0 24px' }}>
              Select a service above to start chatting
            </p>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div style={s.chatHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={s.iconBox}>
                  <activeService.Icon size={16} color="#00C48C" strokeWidth={1.5} />
                </div>
                <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)' }}>
                  {activeService.label}
                </span>
                {isInitializing && (
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Connecting…</span>
                )}
              </div>
              <div style={s.langBar}>
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => switchLanguage(lang)}
                    disabled={busy}
                    style={{
                      ...s.langBtn,
                      background: selectedLang === lang.code ? '#00C48C' : 'transparent',
                      color: selectedLang === lang.code ? '#000' : 'var(--text-secondary)',
                    }}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {messages.length === 0 && !busy && (
                activeService?.id === 'legal' ? (
                  <div style={{ padding: '16px' }}>
                    <LoanShield />
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)', fontSize: '14px' }}>
                    Ask anything about {activeService.label.toLowerCase()} guidance.
                  </div>
                )
              )}
              {messages.map(msg => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    marginBottom: '12px',
                  }}
                >
                  <div style={msg.role === 'user' ? s.userBubble : s.assistantBubble}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && !isInitializing && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
                  <div style={s.assistantBubble}>
                    <TypingIndicator />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div className="chat-input-bar">
              <input
                ref={inputRef}
                className="chat-input-field"
                type="text"
                placeholder={isInitializing ? 'Connecting…' : `Ask about ${activeService.label.toLowerCase()}...`}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={busy}
                autoComplete="off"
              />
              <button
                className="chat-send-btn"
                onClick={sendMessage}
                disabled={!inputText.trim() || busy}
                style={{ opacity: (!inputText.trim() || busy) ? 0.5 : 1 }}
              >
                <Send size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ServicePill({ svc, active, onClick }) {
  const { Icon, label } = svc;
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '7px 14px',
        borderRadius: '8px',
        border: `1px solid ${active ? 'rgba(0,196,140,0.35)' : 'rgba(255,255,255,0.08)'}`,
        background: active ? 'rgba(0,196,140,0.12)' : 'rgba(255,255,255,0.04)',
        color: active ? '#00C48C' : 'var(--text-secondary)',
        fontSize: '14px',
        fontWeight: active ? 600 : 400,
        fontFamily: "'Inter', sans-serif",
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all 0.15s ease',
        flexShrink: 0,
      }}
    >
      <Icon size={15} strokeWidth={1.8} />
      {label}
    </button>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '20px' }}>
      {[0, 1, 2].map(i => (
        <span key={i} className="typing-dot" style={{ animationDelay: `${i * 0.2}s` }} />
      ))}
    </div>
  );
}

const s = {
  topBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg-card)',
    flexShrink: 0,
  },
  backBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    color: 'var(--text-secondary)',
    padding: '4px',
    borderRadius: '6px',
  },
  topBarTitle: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 700,
    fontSize: '16px',
    color: 'var(--text-primary)',
    flex: 1,
  },
  cardsWrap: {
    display: 'flex',
    gap: '8px',
    padding: '12px 16px',
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none',
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg-card)',
    flexShrink: 0,
    flexWrap: 'wrap',
    gap: '8px',
  },
  iconBox: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'rgba(0,196,140,0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  langBar: {
    display: 'flex',
    gap: '3px',
    background: 'var(--icon-bg)',
    borderRadius: '8px',
    padding: '3px',
  },
  langBtn: {
    border: 'none',
    borderRadius: '6px',
    padding: '4px 10px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    lineHeight: 1.4,
    fontFamily: "'Inter', sans-serif",
    color: 'var(--text-secondary)',
  },
  userBubble: {
    background: 'rgba(0,196,140,0.12)',
    border: '1px solid rgba(0,196,140,0.20)',
    color: 'var(--text-primary)',
    padding: '10px 14px',
    borderRadius: '16px 16px 4px 16px',
    fontSize: '15px',
    lineHeight: 1.5,
    maxWidth: '75%',
    wordBreak: 'break-word',
  },
  assistantBubble: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: 'var(--text-primary)',
    padding: '10px 14px',
    borderRadius: '16px 16px 16px 4px',
    fontSize: '15px',
    lineHeight: 1.5,
    maxWidth: '75%',
    wordBreak: 'break-word',
  },
};
