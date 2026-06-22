import { useState, useRef, useEffect } from 'react';
import { Heart, Scale, Sprout, GraduationCap, Briefcase, Send } from 'lucide-react';

const SERVICES = [
  { id: 'health',      label: 'Health',      Icon: Heart,         desc: 'Medical guidance for you and your family' },
  { id: 'legal',       label: 'Legal',       Icon: Scale,         desc: 'Understand your rights and legal options' },
  { id: 'agriculture', label: 'Agriculture', Icon: Sprout,        desc: 'Farming advice and crop guidance' },
  { id: 'education',   label: 'Education',   Icon: GraduationCap, desc: 'Learning support for all ages' },
  { id: 'freelancing', label: 'Freelancing', Icon: Briefcase,     desc: 'Find work and grow your income' },
];

const LANGUAGES = [
  { code: 'en', label: 'English', content: 'English' },
  { code: 'ur', label: 'اردو',   content: 'اردو'   },
  { code: 'pa', label: 'پنجابی', content: 'پنجابی' },
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
  const [activeService, setActiveService]   = useState(null);
  const [messages, setMessages]             = useState([]);
  const [inputText, setInputText]           = useState('');
  const [isTyping, setIsTyping]             = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [sessionId, setSessionId]           = useState(null);
  const [selectedLang, setSelectedLang]     = useState('en');
  const messagesEndRef = useRef(null);

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

    setTimeout(() => {
      document.getElementById('chat-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    try {
      // 1. Create session
      const sessionData = await apiPost('/api/proxy/api/chat/session', { service: svc.id });
      const newId = sessionData.sessionId;
      setSessionId(newId);

      // 2. Set language to English
      await apiPost('/api/proxy/api/chat/message', { sessionId: newId, content: 'English' });

      // 3. Skip onboarding
      await apiPost('/api/proxy/api/chat/message', { sessionId: newId, content: 'skip' });
    } catch {
      // If init fails, allow user to still try chatting
    } finally {
      setIsInitializing(false);
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

      await apiPost('/api/proxy/api/chat/message', { sessionId: newId, content: lang.content });
      await apiPost('/api/proxy/api/chat/message', { sessionId: newId, content: 'skip' });
    } catch { /* silent fail */ } finally {
      setIsInitializing(false);
    }
  };

  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text || isTyping || isInitializing || !sessionId) return;

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

  return (
    <main className="page-enter" style={{ paddingBottom: '80px' }}>
      {/* Hero */}
      <section style={s.heroWrap}>
        <div className="dot-grid-bg" style={s.dotGrid} />
        <div style={s.heroInner}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <span className="badge badge-blue label-tag">AI-Powered · 5 Services</span>
          </div>
          <h1 className="page-title" style={{ textAlign: 'center', marginBottom: '16px' }}>
            Your Life Assistant
          </h1>
          <p style={{ fontSize: '18px', color: '#737373', lineHeight: 1.6, textAlign: 'center', maxWidth: '520px', margin: '0 auto' }}>
            Health, legal, agriculture, education, and freelancing guidance — in your language.
          </p>
        </div>
      </section>

      {/* Service Cards */}
      <section style={s.section}>
        <div style={s.container}>
          <div className="life-svc-grid" style={s.grid}>
            {SERVICES.map(svc => (
              <ServiceCard
                key={svc.id}
                svc={svc}
                active={activeService?.id === svc.id}
                onClick={() => selectService(svc)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Chat Panel */}
      {activeService && (
        <section id="chat-panel" style={s.section}>
          <div style={s.container}>
            <ChatPanel
              service={activeService}
              messages={messages}
              isTyping={isTyping}
              isInitializing={isInitializing}
              inputText={inputText}
              onInput={setInputText}
              onSend={sendMessage}
              onKeyDown={handleKeyDown}
              messagesEndRef={messagesEndRef}
              selectedLang={selectedLang}
              onLangChange={switchLanguage}
            />
          </div>
        </section>
      )}
    </main>
  );
}

function ServiceCard({ svc, active, onClick }) {
  const [hov, setHov] = useState(false);
  const { Icon, label, desc } = svc;

  return (
    <div
      style={{
        ...s.card,
        borderColor: active ? '#1B4FD8' : (hov ? '#1B4FD8' : '#E8E8E4'),
        boxShadow: (active || hov) ? '0 4px 16px rgba(27,79,216,0.10)' : 'none',
        transform: hov && !active ? 'translateY(-2px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{ ...s.iconBox, background: active ? '#EEF2FF' : '#F0F0ED' }}>
        <Icon size={22} color={active ? '#1B4FD8' : '#374151'} strokeWidth={1.5} />
      </div>
      <h3 className="card-title" style={{ marginTop: '16px', marginBottom: '6px' }}>{label}</h3>
      <p style={{ fontSize: '14px', color: '#737373', lineHeight: 1.5, marginBottom: '20px', flex: 1 }}>{desc}</p>
      <button
        className="btn btn-blue"
        style={{ padding: '8px 16px', fontSize: '13px', width: '100%', justifyContent: 'center' }}
        onClick={onClick}
      >
        Start Chat →
      </button>
    </div>
  );
}

function ChatPanel({ service, messages, isTyping, isInitializing, inputText, onInput, onSend, onKeyDown, messagesEndRef, selectedLang, onLangChange }) {
  const { Icon, label } = service;
  const busy = isTyping || isInitializing;

  return (
    <div style={s.chatWrap}>
      {/* Header */}
      <div style={s.chatHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ ...s.iconBox, width: '40px', height: '40px' }}>
            <Icon size={18} color="#374151" strokeWidth={1.5} />
          </div>
          <span style={{ fontWeight: 600, fontSize: '16px', color: '#1A1A1A' }}>{label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Language selector */}
          <div style={s.langBar}>
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => onLangChange(lang)}
                disabled={busy}
                style={{
                  ...s.langBtn,
                  background: selectedLang === lang.code ? '#1B4FD8' : 'transparent',
                  color: selectedLang === lang.code ? '#FFFFFF' : '#374151',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {lang.label}
              </button>
            ))}
          </div>
          <span className="badge badge-blue" style={{ fontSize: '11px' }}>Powered by Humix AI</span>
        </div>
      </div>

      {/* Messages */}
      <div style={s.messagesArea}>
        {messages.length === 0 && !busy && (
          <div style={{ textAlign: 'center', padding: '64px 24px', color: '#A3A3A3', fontSize: '14px' }}>
            Start a conversation about {label.toLowerCase()} guidance.
          </div>
        )}
        {isInitializing && messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 24px', color: '#A3A3A3', fontSize: '14px' }}>
            Connecting…
          </div>
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

      {/* Input */}
      <div style={s.inputRow}>
        <input
          type="text"
          placeholder={isInitializing ? 'Connecting…' : `Ask about ${label.toLowerCase()}...`}
          value={inputText}
          onChange={e => onInput(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={busy}
          style={{ ...s.textInput, opacity: busy ? 0.6 : 1 }}
        />
        <button
          className="btn btn-blue"
          style={{ padding: '10px 20px', flexShrink: 0 }}
          onClick={onSend}
          disabled={!inputText.trim() || busy}
        >
          <Send size={15} />
          Send
        </button>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '20px' }}>
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="typing-dot"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
}

const s = {
  heroWrap: {
    position: 'relative',
    paddingTop: '80px',
    paddingBottom: '80px',
    overflow: 'hidden',
    background: '#F7F7F5',
  },
  dotGrid: {
    position: 'absolute',
    inset: 0,
    opacity: 0.4,
    zIndex: 0,
  },
  heroInner: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '680px',
    margin: '0 auto',
    padding: '0 24px',
  },
  section: {
    paddingBottom: '64px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 48px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
  },
  card: {
    background: '#FFFFFF',
    border: '1px solid #E8E8E4',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.18s ease',
  },
  iconBox: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: '#F0F0ED',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  langBar: {
    display: 'flex',
    gap: '4px',
    background: '#F0F0ED',
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
  },
  chatWrap: {
    background: '#FFFFFF',
    border: '1px solid #E8E8E4',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  chatHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: '1px solid #E8E8E4',
    flexWrap: 'wrap',
    gap: '12px',
  },
  messagesArea: {
    minHeight: '400px',
    maxHeight: '520px',
    overflowY: 'auto',
    padding: '24px',
    background: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
  },
  userBubble: {
    background: '#1B4FD8',
    color: '#FFFFFF',
    padding: '10px 16px',
    borderRadius: '12px',
    fontSize: '15px',
    lineHeight: 1.5,
    maxWidth: '70%',
  },
  assistantBubble: {
    background: '#F7F7F5',
    border: '1px solid #E8E8E4',
    color: '#1A1A1A',
    padding: '10px 16px',
    borderRadius: '12px',
    fontSize: '15px',
    lineHeight: 1.5,
    maxWidth: '70%',
  },
  inputRow: {
    display: 'flex',
    gap: '12px',
    padding: '16px 24px',
    borderTop: '1px solid #E8E8E4',
    background: '#FFFFFF',
  },
  textInput: {
    flex: 1,
    height: '44px',
    padding: '0 16px',
    border: '1px solid #E8E8E4',
    borderRadius: '8px',
    fontSize: '15px',
    color: '#1A1A1A',
    background: '#FFFFFF',
    fontFamily: "'Inter', sans-serif",
    transition: 'border-color 0.18s ease',
  },
};
