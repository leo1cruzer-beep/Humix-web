import { useState, useRef } from 'react'

const LANGS = [
  { code: 'en', label: 'EN', speechCode: 'en-US', dir: 'ltr' },
  { code: 'ur', label: 'اردو', speechCode: 'ur-PK', dir: 'rtl' },
  { code: 'ar', label: 'العربية', speechCode: 'ar-SA', dir: 'rtl' },
]

const SYSTEM_PROMPT = `You are Loan Shield, a predatory loan detection expert helping vulnerable people in developing countries understand if a loan offer is dangerous.

Analyze the loan terms provided and respond in the user's language (detect from their input, or use the language hint provided).

Your analysis MUST follow this exact JSON structure — respond with ONLY valid JSON, no markdown, no preamble:

{
  "verdict": "SAFE" | "CAUTION" | "DANGER",
  "apr": "calculated or estimated APR percentage, or 'Unable to calculate'",
  "summary": "2-3 sentence plain language verdict explanation",
  "redFlags": ["flag1", "flag2"],
  "safeFactors": ["factor1"],
  "advice": "1-2 sentences on what the person should do next"
}

Red flags to check:
- APR above 50% annually (predatory), above 200% (extremely predatory)
- Weekly/daily fees that hide true interest rate
- Rollover traps (must take new loan to repay old)
- Collateral seizure clauses (land, livestock, home)
- Penalty compounding (fees on fees)
- No written contract required
- Pressure to sign immediately
- Loan amount increases with each renewal
- Hidden fees not mentioned upfront
- Guarantor requirements that put others at risk

Safe factors:
- APR clearly stated and below 30%
- No collateral required
- Fixed repayment schedule
- Licensed lender
- Grace period offered
- No prepayment penalties

If the input is not about a loan, ask them to describe their loan terms.`

const PLACEHOLDER = {
  en: 'Paste or describe your loan terms here...\n\nExample: "Borrow $500, pay back $650 in 4 weeks. Weekly fee $37.50."',
  ur: 'یہاں اپنی قرض کی شرائط لکھیں یا بیان کریں...\n\nمثال: "500 ڈالر قرض، 4 ہفتوں میں 650 ڈالر واپس کریں۔"',
  ar: 'الصق أو اكتب شروط القرض هنا...\n\nمثال: "اقتراض 500 دولار، السداد 650 دولار في 4 أسابيع."',
}

const VERDICT_CONFIG = {
  SAFE:    { emoji: '✅', label: 'Safe',    color: '#22c55e', bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.3)' },
  CAUTION: { emoji: '⚠️', label: 'Caution', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  DANGER:  { emoji: '🚨', label: 'Danger',  color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)' },
}

export function LoanShield() {
  const [lang, setLang] = useState(LANGS[0])
  const [text, setText] = useState('')
  const [listening, setListening] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const recognitionRef = useRef(null)

  const toggleMic = () => {
    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      return
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError('Voice input not supported on this browser. Please type your loan terms.')
      return
    }
    const rec = new SpeechRecognition()
    rec.lang = lang.speechCode
    rec.continuous = false
    rec.interimResults = true
    rec.onstart = () => setListening(true)
    rec.onresult = (e) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join('')
      setText(prev => prev ? prev + ' ' + transcript : transcript)
    }
    rec.onerror = () => { setListening(false); setError('Microphone error. Please try again.') }
    rec.onend = () => setListening(false)
    recognitionRef.current = rec
    rec.start()
  }

  const analyze = async () => {
    if (!text.trim()) return
    setLoading(true)
    setResult(null)
    setError('')
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: `Language hint: ${lang.code}\n\nLoan terms to analyze:\n${text.trim()}` }]
        })
      })
      const data = await res.json()
      const raw = data.content?.[0]?.text || ''
      const clean = raw.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      setResult(parsed)
    } catch {
      setError('Analysis failed. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => { setResult(null); setText(''); setError('') }
  const verdict = result ? VERDICT_CONFIG[result.verdict] || VERDICT_CONFIG.CAUTION : null

  return (
    <div style={{ padding: '16px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{ fontSize: '24px' }}>🛡️</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary, #fff)' }}>Loan Shield</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted, #888)' }}>Predatory loan detector</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '8px', padding: '3px', marginBottom: '14px', width: 'fit-content' }}>
        {LANGS.map(l => (
          <button key={l.code} onClick={() => { setLang(l); setResult(null); setError('') }}
            style={{ border: 'none', borderRadius: '6px', padding: '5px 12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', background: lang.code === l.code ? '#00C48C' : 'transparent', color: lang.code === l.code ? '#000' : 'var(--text-secondary, #aaa)', fontFamily: "'Inter', sans-serif" }}>
            {l.label}
          </button>
        ))}
      </div>

      {!result ? (
        <>
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder={PLACEHOLDER[lang.code]} dir={lang.dir} rows={6}
              style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.05)', border: `1px solid ${listening ? '#00C48C' : 'rgba(255,255,255,0.1)'}`, borderRadius: '10px', padding: '12px 48px 12px 14px', color: 'var(--text-primary, #fff)', fontSize: '14px', lineHeight: 1.6, fontFamily: "'Inter', sans-serif", resize: 'vertical', outline: 'none', transition: 'border-color 0.2s', direction: lang.dir }} />
            <button onClick={toggleMic}
              style={{ position: 'absolute', top: '10px', right: '10px', width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: listening ? '#ef4444' : 'rgba(0,196,140,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', transition: 'all 0.2s' }}>
              {listening ? '⏹' : '🎙️'}
            </button>
          </div>

          {listening && (
            <div style={{ fontSize: '12px', color: '#00C48C', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 1s infinite' }} />
              Listening... tap ⏹ to stop
            </div>
          )}

          {error && (
            <div style={{ fontSize: '13px', color: '#ef4444', marginBottom: '10px', padding: '10px', background: 'rgba(239,68,68,0.1)', borderRadius: '8px' }}>{error}</div>
          )}

          <button onClick={analyze} disabled={!text.trim() || loading}
            style={{ width: '100%', padding: '13px', borderRadius: '10px', border: 'none', background: (!text.trim() || loading) ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #00C48C, #00a876)', color: (!text.trim() || loading) ? 'var(--text-muted, #888)' : '#000', fontWeight: 700, fontSize: '15px', cursor: (!text.trim() || loading) ? 'not-allowed' : 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {loading ? (<><span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Analyzing...</>) : '🔍 Analyze Loan'}
          </button>

          <div style={{ fontSize: '11px', color: 'var(--text-muted, #666)', textAlign: 'center', marginTop: '8px' }}>Your data is not stored. Analysis is private.</div>
        </>
      ) : (
        <>
          <div style={{ background: verdict.bg, border: `1px solid ${verdict.border}`, borderRadius: '12px', padding: '16px', marginBottom: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '6px' }}>{verdict.emoji}</div>
            <div style={{ fontWeight: 800, fontSize: '22px', color: verdict.color, fontFamily: "'Inter', sans-serif" }}>{verdict.label}</div>
            {result.apr && result.apr !== 'Unable to calculate' && (
              <div style={{ fontSize: '13px', color: 'var(--text-muted, #888)', marginTop: '4px' }}>Estimated APR: <strong style={{ color: verdict.color }}>{result.apr}</strong></div>
            )}
          </div>

          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '14px', marginBottom: '12px', fontSize: '14px', lineHeight: 1.7, color: 'var(--text-primary, #fff)', direction: lang.dir }}>{result.summary}</div>

          {result.redFlags?.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#ef4444', marginBottom: '8px', letterSpacing: '0.05em' }}>🚩 RED FLAGS</div>
              {result.redFlags.map((flag, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '13px', color: 'var(--text-primary, #fff)', direction: lang.dir }}>
                  <span style={{ color: '#ef4444', flexShrink: 0 }}>•</span>{flag}
                </div>
              ))}
            </div>
          )}

          {result.safeFactors?.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#22c55e', marginBottom: '8px', letterSpacing: '0.05em' }}>✅ SAFE FACTORS</div>
              {result.safeFactors.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '13px', color: 'var(--text-primary, #fff)', direction: lang.dir }}>
                  <span style={{ color: '#22c55e', flexShrink: 0 }}>•</span>{f}
                </div>
              ))}
            </div>
          )}

          {result.advice && (
            <div style={{ background: 'rgba(0,196,140,0.08)', border: '1px solid rgba(0,196,140,0.2)', borderRadius: '10px', padding: '12px', marginBottom: '14px', fontSize: '13px', color: 'var(--text-primary, #fff)', lineHeight: 1.6, direction: lang.dir }}>
              <span style={{ fontWeight: 700, color: '#00C48C' }}>💡 What to do: </span>{result.advice}
            </div>
          )}

          <button onClick={reset}
            style={{ width: '100%', padding: '11px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'var(--text-secondary, #aaa)', fontWeight: 600, fontSize: '14px', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
            ← Check Another Loan
          </button>
        </>
      )}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
