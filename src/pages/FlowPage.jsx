import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Plus, Play, Trash2 } from 'lucide-react';

const TRIGGER_EXAMPLES = [
  'Remind me every Friday at 6pm to log my earnings',
  'Alert me when Bitcoin drops below $90,000',
  'Every Monday morning send me a motivational message on Telegram',
  'When someone fills my contact form, email me immediately',
];

const SYSTEM_PROMPT = `You are Flow, an automation builder for Havro. The user describes an automation in plain language. You must respond with ONLY valid JSON, no markdown, no explanation:

{
  "title": "short automation name",
  "trigger": {
    "type": "schedule" | "price_alert" | "form_submission",
    "description": "plain language trigger description",
    "config": {}
  },
  "action": {
    "type": "telegram" | "whatsapp" | "email" | "social",
    "description": "plain language action description",
    "config": {}
  },
  "summary": "One sentence describing what this automation does"
}

For schedule triggers, config includes: { "frequency": "daily|weekly|hourly", "time": "HH:MM", "day": "Monday" }
For price_alert triggers, config includes: { "asset": "BTC", "condition": "below|above", "price": 90000 }
For form_submission triggers, config includes: { "form": "contact" }
For telegram/whatsapp actions, config includes: { "message": "template message" }
For email actions, config includes: { "subject": "...", "body": "..." }
For social actions, config includes: { "platform": "twitter|instagram", "content": "..." }`;

export default function FlowPage() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [flows, setFlows] = useState([]);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const buildFlow = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: input.trim() }]
        })
      });
      const data = await res.json();
      const raw = data.choices?.[0]?.message?.content || '';
      const clean = raw.replace(/```json|```/g, '').trim();
      const jsonMatch = clean.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found');
      const parsed = JSON.parse(jsonMatch[0]);
      setFlows(prev => [{ ...parsed, id: Date.now(), active: false }, ...prev]);
      setInput('');
    } catch {
      setError('Could not build automation. Try describing it differently.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFlow = (id) => setFlows(prev => prev.map(f => f.id === id ? { ...f, active: !f.active } : f));
  const deleteFlow = (id) => setFlows(prev => prev.filter(f => f.id !== id));

  const TRIGGER_ICONS = { schedule: '🕐', price_alert: '📈', form_submission: '📋' };
  const ACTION_ICONS = { telegram: '✈️', whatsapp: '💬', email: '📧', social: '📱' };

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg, #0a0a0a)', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'var(--bg-card, #111)', flexShrink: 0 }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-secondary, #aaa)', padding: '4px', borderRadius: '6px' }}>
          <ArrowLeft size={18} strokeWidth={2} />
        </button>
        <Zap size={18} color="#2563EB" />
        <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary, #fff)', flex: 1 }}>Flow</span>
        <span style={{ fontSize: '11px', background: 'rgba(37,99,235,0.15)', color: '#2563EB', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>AI-Powered</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {/* Input */}
        <div style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: '12px', padding: '14px', marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', color: '#2563EB', fontWeight: 600, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={14} /> Describe your automation
          </div>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="e.g. Alert me on Telegram when ETH drops below $2,000"
            rows={3}
            style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 12px', color: 'var(--text-primary, #fff)', fontSize: '14px', lineHeight: 1.6, fontFamily: "'Inter', sans-serif", resize: 'none', outline: 'none', marginBottom: '10px' }}
          />
          {/* Examples */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
            {TRIGGER_EXAMPLES.map((ex, i) => (
              <button key={i} onClick={() => setInput(ex)}
                style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(37,99,235,0.3)', background: 'rgba(37,99,235,0.08)', color: '#2563EB', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
                {ex.slice(0, 30)}…
              </button>
            ))}
          </div>
          <button onClick={buildFlow} disabled={!input.trim() || loading}
            style={{ width: '100%', padding: '11px', borderRadius: '8px', border: 'none', background: (!input.trim() || loading) ? 'rgba(255,255,255,0.08)' : '#2563EB', color: (!input.trim() || loading) ? '#666' : '#fff', fontWeight: 700, fontSize: '14px', cursor: (!input.trim() || loading) ? 'not-allowed' : 'pointer', fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}>
            {loading ? (<><span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Building...</>) : (<><Zap size={15} />Build Automation</>)}
          </button>
          {error && <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '8px', textAlign: 'center' }}>{error}</div>}
        </div>

        {/* Flows list */}
        {flows.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted, #555)' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>⚡</div>
            <div style={{ fontSize: '14px' }}>No automations yet. Describe one above.</div>
          </div>
        ) : (
          flows.map(flow => (
            <div key={flow.id} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${flow.active ? 'rgba(37,99,235,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '12px', padding: '14px', marginBottom: '12px', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary, #fff)', marginBottom: '4px' }}>{flow.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted, #888)', lineHeight: 1.5 }}>{flow.summary}</div>
                </div>
                <button onClick={() => deleteFlow(flow.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px', marginLeft: '8px', flexShrink: 0 }}>
                  <Trash2 size={15} />
                </button>
              </div>

              {/* Trigger → Action cards */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px', fontSize: '12px' }}>
                  <div style={{ color: '#888', marginBottom: '3px', fontWeight: 600 }}>{TRIGGER_ICONS[flow.trigger?.type]} TRIGGER</div>
                  <div style={{ color: 'var(--text-primary, #fff)' }}>{flow.trigger?.description}</div>
                </div>
                <div style={{ color: '#2563EB', fontWeight: 700, flexShrink: 0 }}>→</div>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px', fontSize: '12px' }}>
                  <div style={{ color: '#888', marginBottom: '3px', fontWeight: 600 }}>{ACTION_ICONS[flow.action?.type]} ACTION</div>
                  <div style={{ color: 'var(--text-primary, #fff)' }}>{flow.action?.description}</div>
                </div>
              </div>

              {/* Activate toggle */}
              <button onClick={() => toggleFlow(flow.id)}
                style={{ width: '100%', padding: '9px', borderRadius: '8px', border: `1px solid ${flow.active ? 'rgba(37,99,235,0.4)' : 'rgba(255,255,255,0.1)'}`, background: flow.active ? 'rgba(37,99,235,0.15)' : 'transparent', color: flow.active ? '#2563EB' : '#888', fontWeight: 600, fontSize: '13px', cursor: 'pointer', fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Play size={13} fill={flow.active ? '#2563EB' : 'none'} />
                {flow.active ? 'Active' : 'Activate'}
              </button>
            </div>
          ))
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
