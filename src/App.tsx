import { useState, useEffect } from 'react'
import { analyzePoem, type AnalysisResult } from './api/analyzePoem'

type Screen = 'splash' | 'home' | 'analyze' | 'result' | 'learn' | 'practice' | 'explanation' | 'profile' | 'teacher'

// ── Icons ──────────────────────────────────────────────────────────────
function CheckIcon({ color = '#22c55e' }: { color?: string }) {
  return <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill={color}/><path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function WarnIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill="#f59e0b"/><path d="M8 5v4M8 10.5v.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></svg>
}
function XIcon({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill="#ef4444"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></svg>
}
function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1 text-[var(--navy)] font-semibold text-sm">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </button>
  )
}

// ── Bottom Nav ─────────────────────────────────────────────────────────
function BottomNav({ active, onNav }: { active: Screen; onNav: (s: Screen) => void }) {
  const tabs: { id: Screen; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'learn', label: 'Learn', icon: '📖' },
    { id: 'practice', label: 'Practice', icon: '✏️' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ]
  return (
    <nav className="bottom-nav">
      {tabs.map(t => (
        <button key={t.id} onClick={() => onNav(t.id)}
          className={`flex-1 flex flex-col items-center gap-0.5 py-3 text-xs font-medium transition-colors ${
            active === t.id || (t.id === 'home' && ['home','analyze','result'].includes(active))
              ? 'text-purple-600' : 'text-gray-400'
          }`}>
          <span className="text-lg">{t.icon}</span>{t.label}
        </button>
      ))}
    </nav>
  )
}

// ── API Key Gate ───────────────────────────────────────────────────────
function ApiKeyGate({ onKey }: { onKey: (key: string) => void }) {
  const [val, setVal] = useState('')
  const envKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined
  useEffect(() => { if (envKey) onKey(envKey) }, [envKey])
  if (envKey) return null
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="card p-6 w-full max-w-sm">
        <div className="text-3xl mb-3 text-center">🔑</div>
        <h2 className="font-bold text-lg text-center text-gray-900 mb-1">Anthropic API Key</h2>
        <p className="text-sm text-gray-500 text-center mb-4">Enter your key to enable real AI-powered Yaappu analysis.</p>
        <input
          type="password"
          value={val}
          onChange={e => setVal(e.target.value)}
          placeholder="sk-ant-..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 mb-3"
        />
        <button
          onClick={() => val.startsWith('sk-') && onKey(val)}
          className="btn-grad w-full py-3"
        >
          Connect →
        </button>
        <p className="text-xs text-gray-400 text-center mt-3">Key is stored in memory only and never sent anywhere except Anthropic.</p>
      </div>
    </div>
  )
}

// ── Splash ─────────────────────────────────────────────────────────────
function SplashScreen({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="splash-screen flex flex-col items-center justify-center relative overflow-hidden" style={{ minHeight: '100vh' }}>
      <div className="ring" style={{ width: 340, height: 340, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
      <div className="ring" style={{ width: 260, height: 260, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
      <div className="absolute bottom-0 left-0 right-0" style={{ height: 140, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }}>
        <svg viewBox="0 0 480 140" preserveAspectRatio="none" className="w-full h-full opacity-70">
          <path d="M0 140 L0 80 L20 80 L20 40 L30 40 L30 20 L40 20 L40 40 L50 40 L50 80 L80 80 L80 60 L90 60 L90 80 L120 80 L120 50 L130 50 L135 30 L140 50 L150 50 L150 80 L200 80 L200 70 L210 70 L210 50 L220 50 L220 70 L230 70 L230 80 L260 80 L260 60 L270 60 L280 40 L290 60 L300 60 L300 80 L340 80 L340 70 L350 70 L350 80 L380 80 L380 50 L395 50 L400 30 L405 50 L420 50 L420 80 L450 80 L450 90 L480 90 L480 140 Z" fill="#1a0533" opacity="0.8"/>
        </svg>
      </div>
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="relative">
          <div style={{ width: 110, height: 110, background: 'radial-gradient(circle, #9333ea 0%, #4f46e5 60%, #1e1b4b 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 60px rgba(147,51,234,0.6)' }}>
            <span style={{ fontSize: 52 }}>📚</span>
          </div>
          <div className="absolute -top-2 -right-2 text-yellow-300 text-2xl">✦</div>
          <div className="absolute -bottom-1 -left-3 text-purple-300 text-xl opacity-70">✦</div>
        </div>
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-white tracking-wide" style={{ textShadow: '0 2px 20px rgba(255,120,0,0.5)' }}>Chandam AI</h1>
          <p className="tamil text-lg text-orange-200 mt-2 font-medium">கொல்லி சந்தம் • செய்யுளில் சிறப்பு</p>
        </div>
        <button onClick={onEnter} className="btn-grad px-10 py-3.5 text-base mt-6" style={{ background: 'linear-gradient(90deg,#7c3aed,#f97316)', boxShadow: '0 4px 24px rgba(249,115,22,0.4)' }}>
          தொடங்குக →
        </button>
      </div>
    </div>
  )
}

// ── Home ───────────────────────────────────────────────────────────────
function HomeScreen({ onNavigate, setPoem }: { onNavigate: (s: Screen) => void; setPoem: (p: string) => void }) {
  const [input, setInput] = useState('')
  return (
    <div className="screen">
      <div className="px-5 pt-10 pb-4" style={{ background: 'linear-gradient(135deg, #1a1f5e 0%, #312e81 100%)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-purple-200 text-sm">வணக்கம் 👋</p>
            <p className="tamil text-white font-bold text-lg">இன்று Yaappu கற்போமா?</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold">A</div>
        </div>
        <div className="card p-4 flex items-center gap-4 cursor-pointer hover:shadow-lg transition-shadow" style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }} onClick={() => onNavigate('analyze')}>
          <div className="flex-1">
            <p className="text-white font-bold text-base">Analyze Your Poem</p>
            <p className="text-purple-200 text-xs mt-0.5">Paste your Tamil poem<br/>and check the Yaappu structure with AI</p>
          </div>
          <span className="text-3xl">🤖</span>
        </div>
      </div>
      <div className="px-5 pt-5 space-y-5">
        <div className="card p-4">
          <p className="text-xs font-semibold text-gray-500 mb-2">Quick Analyze</p>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            className="tamil w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 resize-none focus:outline-none focus:border-purple-400"
            rows={3} maxLength={500} placeholder="உங்கள் கவிதையை இங்கே உள்ளிடுங்கள்..." />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">{input.length}/500</span>
          </div>
          <button onClick={() => { setPoem(input); onNavigate('analyze') }}
            className="btn-grad w-full py-3 mt-3 flex items-center justify-center gap-2">
            ✦ Analyze Poem
          </button>
        </div>
        <div>
          <p className="font-semibold text-gray-800 mb-3">Quick Actions</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="card p-4 cursor-pointer hover:shadow-md" onClick={() => onNavigate('learn')}>
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-xl mb-2">📖</div>
              <p className="font-bold text-gray-800 text-sm">Learn</p>
              <p className="text-xs text-gray-500 mt-0.5">Understand the rules of Yaappu</p>
            </div>
            <div className="card p-4 cursor-pointer hover:shadow-md" onClick={() => onNavigate('practice')}>
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-xl mb-2">🎯</div>
              <p className="font-bold text-gray-800 text-sm">Practice</p>
              <p className="text-xs text-gray-500 mt-0.5">Test your knowledge with fun quizzes</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <p className="font-semibold text-gray-800 mb-3">Your Progress</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">🏆</div>
            <div className="flex-1">
              <div className="flex justify-between text-sm font-medium text-gray-800">
                <span>Yaappu Explorer</span>
                <span className="text-yellow-500">★ 72%</span>
              </div>
              <div className="mt-1.5 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="progress-bar-fill h-full" style={{ width: '72%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Analyze ────────────────────────────────────────────────────────────
const EXAMPLE_POEM = `அறிவுடையார் ஆற்றல்
அறிவார் அறியாரை`

function AnalyzeScreen({
  onNavigate, poem, setPoem, onResult, apiKey,
}: {
  onNavigate: (s: Screen) => void
  poem: string
  setPoem: (p: string) => void
  onResult: (r: AnalysisResult) => void
  apiKey: string
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAnalyze() {
    if (!poem.trim()) return
    setLoading(true)
    setError(null)
    try {
      const result = await analyzePoem(poem, apiKey)
      onResult(result)
      onNavigate('result')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Analysis failed. Check your API key.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="screen">
      <div className="px-5 pt-10 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <BackBtn onClick={() => onNavigate('home')} />
          <h1 className="text-xl font-bold text-gray-900">Analyze Your Poem</h1>
        </div>
        <div className="card p-4">
          <textarea value={poem} onChange={e => setPoem(e.target.value)}
            className="tamil w-full text-sm text-gray-700 resize-none focus:outline-none"
            rows={6} placeholder="உங்கள் செய்யுளை இங்கே உள்ளிடுங்கள்..." />
          <div className="text-right text-xs text-gray-400 mt-1">{poem.length}/500</div>
        </div>
        <div className="card p-4 mt-4 border border-yellow-100 cursor-pointer hover:shadow-sm" style={{ background: '#fffbeb' }}
          onClick={() => setPoem(EXAMPLE_POEM)}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-yellow-600 mb-1.5">⭐ Example Poem (tap to use)</p>
              <p className="tamil text-gray-800 text-sm leading-relaxed">{EXAMPLE_POEM}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center my-6">
          <span className="text-5xl opacity-20">🪷</span>
        </div>
        {error && (
          <div className="mb-3 p-3 bg-red-50 rounded-xl text-sm text-red-700">{error}</div>
        )}
        <button onClick={handleAnalyze} disabled={loading || !poem.trim()}
          className={`btn-grad w-full py-3.5 flex items-center justify-center gap-2 text-base ${loading || !poem.trim() ? 'opacity-60' : ''}`}>
          {loading ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10"/>
              </svg>
              AI Analyzing…
            </>
          ) : '✦ Analyze Poem'}
        </button>
      </div>
    </div>
  )
}

// ── Result ─────────────────────────────────────────────────────────────
function ResultScreen({ onNavigate, result }: { onNavigate: (s: Screen) => void; result: AnalysisResult | null }) {
  if (!result) return (
    <div className="screen flex items-center justify-center">
      <p className="text-gray-400">No result yet. Go analyze a poem first.</p>
    </div>
  )

  const scoreColor = result.verdictColor === 'green' ? '#22c55e' : result.verdictColor === 'yellow' ? '#f59e0b' : '#ef4444'
  const conicStop = `conic-gradient(${scoreColor} 0% ${result.score}%, #e8e0ff ${result.score}% 100%)`

  return (
    <div className="screen">
      <div className="px-5 pt-10 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BackBtn onClick={() => onNavigate('analyze')} />
            <h1 className="text-xl font-bold text-gray-900">Yaappu Analysis</h1>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-6 mb-4">
          <div className="relative flex items-center justify-center" style={{ width: 90, height: 90 }}>
            <div style={{ width: 90, height: 90, borderRadius: '50%', background: conicStop, position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 14, background: '#fff', borderRadius: '50%' }} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-extrabold text-gray-900">{result.score}%</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-lg" style={{ color: scoreColor }}>{result.verdict}</span>
              {result.verdictColor === 'green' && <CheckIcon color={scoreColor} />}
              {result.verdictColor === 'yellow' && <WarnIcon />}
              {result.verdictColor === 'red' && <XIcon />}
            </div>
            <div className="flex gap-2 flex-wrap">
              {result.tags.map((tag, i) => (
                <span key={i} className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  tag.status === 'ok' ? 'bg-green-100 text-green-700' :
                  tag.status === 'warn' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>{tag.label}</span>
              ))}
            </div>
          </div>
        </div>

        {result.summary && (
          <div className="card p-4 mb-4 bg-purple-50">
            <p className="text-sm text-purple-800 leading-relaxed">{result.summary}</p>
          </div>
        )}

        {result.lines.length > 0 && (
          <div className="card p-4 mb-4">
            <p className="font-semibold text-gray-800 mb-3">Line by Line Analysis</p>
            <div className="space-y-3">
              {result.lines.map((l, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                  <span className="text-xs text-gray-400 mt-0.5 font-medium">{i + 1}.</span>
                  <div className="flex-1">
                    <p className="tamil text-sm text-gray-800">{l.text}</p>
                    {l.note && <p className="text-xs text-yellow-600 mt-0.5">⚠ {l.note}</p>}
                    {!l.note && l.status === 'correct' && <p className="text-xs text-green-600 mt-0.5">✓ Correct</p>}
                    {!l.note && l.status === 'error' && <p className="text-xs text-red-500 mt-0.5">✗ Incorrect</p>}
                  </div>
                  <div className="mt-0.5">
                    {l.status === 'correct' && <CheckIcon />}
                    {l.status === 'warn' && <WarnIcon />}
                    {l.status === 'error' && <XIcon />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={() => onNavigate('analyze')} className="w-full py-3 rounded-2xl border-2 border-purple-300 text-purple-700 font-semibold hover:bg-purple-50 transition-colors">
          🔄 Analyze Another Poem
        </button>
      </div>
    </div>
  )
}

// ── Learn ──────────────────────────────────────────────────────────────
function LearnScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <div className="screen">
      <div className="px-5 pt-10 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <BackBtn onClick={() => onNavigate('home')} />
          <h1 className="text-xl font-bold text-gray-900">Learn Ner Asai</h1>
        </div>
        <div className="card overflow-hidden mb-4">
          <div className="flex items-center gap-4 p-4" style={{ background: 'linear-gradient(135deg,#1a1f5e,#4f46e5)' }}>
            <div>
              <p className="tamil text-white font-bold text-2xl">நேர் அசை</p>
              <p className="text-purple-200 text-sm">(Ner Asai)</p>
            </div>
            <div className="ml-auto text-4xl">🪷</div>
          </div>
          <div className="p-4">
            <p className="font-semibold text-gray-800 text-sm mb-2">What is Ner Asai?</p>
            <p className="tamil text-sm text-gray-600 leading-relaxed">நேர் அசை என்பது ஒரு குறில் அல்லது ஒரு நெடில் எழுத்தால் உருவாகும் சிறிய ஓலிக்கு ஆகும். இந் செய்யுளின் அடிப்படை அலகு ஒன்றாகும்.</p>
          </div>
        </div>
        <div className="card p-4 mb-4">
          <p className="font-semibold text-gray-800 mb-3">🔮 Pattern</p>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 bg-orange-50 rounded-xl px-4 py-3 flex-1 justify-center">
              <div className="w-4 h-4 rounded-full bg-orange-300" />
              <span className="text-xs text-gray-600">Kuril (short)</span>
            </div>
            <div className="flex items-center gap-2 bg-pink-50 rounded-xl px-4 py-3 flex-1 justify-center">
              <div className="w-6 h-4 rounded-full bg-pink-400" />
              <span className="text-xs text-gray-600">Nedil (long)</span>
            </div>
          </div>
        </div>
        <div className="card p-4 mb-4">
          <p className="font-semibold text-gray-800 mb-3">📝 Example</p>
          <div className="flex gap-3">
            {['கல்', 'மா', 'நான்'].map((w, i) => (
              <div key={i} className="flex-1 bg-purple-50 rounded-xl py-3 text-center">
                <span className="tamil font-bold text-purple-800 text-xl">{w}</span>
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => onNavigate('practice')} className="btn-grad w-full py-3.5 flex items-center justify-center gap-2 text-base">
          🎯 Try in Practice
        </button>
      </div>
    </div>
  )
}

// ── Practice ───────────────────────────────────────────────────────────
function PracticeScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  const options = ['Ner', 'Nirai']
  return (
    <div className="screen">
      <div className="px-5 pt-10 pb-4">
        <div className="flex items-center justify-between mb-2">
          <BackBtn onClick={() => onNavigate('home')} />
          <span className="text-sm font-semibold text-gray-600">Question 03 / 05</span>
          <div className="flex items-center gap-1 bg-yellow-50 px-2.5 py-1 rounded-full">
            <span className="text-yellow-500">⭐</span>
            <span className="font-bold text-gray-700 text-sm">60</span>
          </div>
        </div>
        <div className="h-2 bg-gray-100 rounded-full mt-3 mb-6">
          <div className="progress-bar-fill h-full rounded-full" style={{ width: '60%' }} />
        </div>
        <p className="tamil text-gray-700 font-semibold text-base mb-4">இந்த அசை எது?</p>
        <div className="card p-8 flex items-center justify-center mb-6" style={{ minHeight: 120 }}>
          <span className="tamil font-extrabold text-5xl text-gray-900">கல்</span>
        </div>
        <div className="space-y-3 mb-6">
          {options.map((opt, i) => (
            <button key={opt} onClick={() => setSelected(opt)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left font-medium transition-all ${
                selected === opt ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white'
              }`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                selected === opt ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'
              }`}>{String.fromCharCode(65 + i)}</span>
              <span className="text-gray-800">{opt}</span>
            </button>
          ))}
        </div>
        <button onClick={() => selected && onNavigate('explanation')}
          className={`btn-grad w-full py-3.5 flex items-center justify-center gap-2 text-base ${!selected ? 'opacity-50' : ''}`}>
          ✦ Check Answer
        </button>
        <div className="flex items-start gap-2 mt-4 p-3 bg-yellow-50 rounded-xl">
          <span className="text-yellow-400 mt-0.5">💡</span>
          <div>
            <p className="text-xs font-semibold text-yellow-700">Think carefully!</p>
            <p className="text-xs text-yellow-600">Look at the sound structure.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Explanation ────────────────────────────────────────────────────────
function ExplanationScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <div className="screen">
      <div className="px-5 pt-10 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <BackBtn onClick={() => onNavigate('practice')} />
          <h1 className="text-xl font-bold text-gray-900">Explanation</h1>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-2xl mb-5" style={{ background: '#fee2e2' }}>
          <XIcon size={20} />
          <div>
            <p className="font-bold text-red-700">Incorrect!</p>
            <p className="text-sm text-red-600">The correct answer is Nirai.</p>
          </div>
        </div>
        <div className="space-y-3 mb-5">
          <div className="card p-4 flex items-center gap-3">
            <span className="text-sm text-gray-500 font-medium w-28">Your Answer</span>
            <div className="flex-1 bg-red-50 rounded-xl p-2.5 text-center"><span className="font-semibold text-red-700">Ner</span></div>
            <XIcon />
          </div>
          <div className="card p-4 flex items-center gap-3">
            <span className="text-sm text-gray-500 font-medium w-28">Correct Answer</span>
            <div className="flex-1 bg-green-50 rounded-xl p-2.5 text-center"><span className="font-semibold text-green-700">Nirai</span></div>
            <CheckIcon />
          </div>
        </div>
        <div className="card p-4 mb-5">
          <p className="font-semibold text-yellow-600 mb-2">⭐ Why?</p>
          <p className="tamil text-sm text-gray-600 leading-relaxed">"கல்" என்பது ஒரு குறில் + ஒரு நெடில் என இரு எழுத்துகளின் சேர்க்கையாக உருவாறிது. இது நிரை அசை ஆகும்.</p>
        </div>
        <div className="card p-4 mb-5">
          <p className="font-semibold text-gray-800 mb-3">See the Pattern</p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 rounded-full border-2 border-purple-500" />
            <div className="w-8 h-0.5 bg-gray-300" />
            <div className="w-5 h-5 rounded-full border-2 border-purple-500" />
          </div>
          <p className="tamil text-center text-sm text-gray-600 mt-2">Nirai Asai</p>
        </div>
        <button onClick={() => onNavigate('learn')} className="btn-grad w-full py-3 flex items-center justify-center gap-2 mb-3">
          📖 Learn This Rule
        </button>
        <button onClick={() => onNavigate('practice')} className="w-full py-3 rounded-2xl border-2 border-gray-200 text-gray-700 font-semibold">
          Try Again
        </button>
      </div>
    </div>
  )
}

// ── Profile ────────────────────────────────────────────────────────────
function ProfileScreen() {
  return (
    <div className="screen">
      <div className="px-5 pt-10 pb-4">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Your Progress</h1>
        <div className="card p-4 flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-orange-400 flex items-center justify-center text-2xl">👩</div>
          <div className="flex-1">
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">⭐ Level 4</span>
            <p className="font-bold text-gray-900 mt-0.5">Yaappu Explorer</p>
            <p className="text-xs text-gray-500">Keep going! You are doing great!</p>
            <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="progress-bar-fill h-full" style={{ width: '80%' }} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[{ n: '12', l: 'Asai', icon: '🔤' }, { n: '9', l: 'Seer', icon: '📏' }, { n: '7', l: 'Venba', icon: '📜' }].map(s => (
            <div key={s.l} className="card p-4 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <p className="font-bold text-2xl text-gray-900">{s.n}</p>
              <p className="text-xs text-gray-500">{s.l}</p>
            </div>
          ))}
        </div>
        <div className="card p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <p className="font-semibold text-gray-800">⭐ Achievements</p>
            <button className="text-xs text-purple-600 font-medium">View All</button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[{ icon: '🔥', label: '5 Day Streak' }, { icon: '🎯', label: '20 Questions' }, { icon: '📚', label: 'Rule Master' }].map(a => (
              <div key={a.label} className="bg-purple-50 rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">{a.icon}</div>
                <p className="text-xs text-gray-600 leading-tight">{a.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-4 overflow-hidden" style={{ background: 'linear-gradient(135deg,#1a1f5e,#4f46e5)' }}>
          <p className="text-white font-semibold mb-2">Learning Journey</p>
          <p className="tamil text-purple-200 text-sm">"செய்யுள் கற்றால் உலகம் கற்றாம்"</p>
          <div className="mt-3 text-3xl opacity-40 text-right">🏛️</div>
        </div>
      </div>
    </div>
  )
}

// ── Root ───────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>('splash')
  const [poem, setPoem] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_ANTHROPIC_API_KEY as string ?? '')

  const navigate = (s: Screen) => setScreen(s)

  if (screen === 'splash') return <SplashScreen onEnter={() => setScreen('home')} />

  return (
    <div style={{ background: '#f0eeff', minHeight: '100vh' }}>
      {!apiKey && <ApiKeyGate onKey={setApiKey} />}
      {screen === 'home' && <HomeScreen onNavigate={navigate} setPoem={setPoem} />}
      {screen === 'analyze' && (
        <AnalyzeScreen onNavigate={navigate} poem={poem} setPoem={setPoem} onResult={setResult} apiKey={apiKey} />
      )}
      {screen === 'result' && <ResultScreen onNavigate={navigate} result={result} />}
      {screen === 'learn' && <LearnScreen onNavigate={navigate} />}
      {screen === 'practice' && <PracticeScreen onNavigate={navigate} />}
      {screen === 'explanation' && <ExplanationScreen onNavigate={navigate} />}
      {screen === 'profile' && <ProfileScreen />}
      <BottomNav active={screen} onNav={navigate} />
    </div>
  )
}
