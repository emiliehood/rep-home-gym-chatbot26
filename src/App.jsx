import { useState, useEffect, useRef } from 'react'
import './App.css'
import { QUESTIONS, parseAnswer, buildGym, productUrl, formatPrice } from './catalog.js'

const INTRO = "Hey, I'm the **REP Home Gym Builder**. Answer a few quick questions about your space, budget and goals, and I'll put together a build from REP's lineup."
const TYPING_DELAY = 550

let nextId = 1
const msg = (sender, text, extra = {}) => ({ id: nextId++, sender, text, ...extra })

// Renders **bold** segments inside a line of text.
function RichLine({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <p>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i}>{part.slice(2, -2)}</strong>
          : <span key={i}>{part}</span>
      )}
    </p>
  )
}

function BuildCard({ build, onRestart, onEditBudget }) {
  const { items, tips, pkg, total, remaining, plateLine, budget } = build
  const overBudget = remaining < 0

  return (
    <div className="build-card">
      <div className="build-card__head">
        <span className="eyebrow">Your build</span>
        <h2>REP Home Gym</h2>
      </div>

      <ul className="build-list">
        {items.map(item => (
          <li key={item.key} className="build-item">
            <div className="build-item__info">
              <a href={productUrl(item.handle)} target="_blank" rel="noreferrer">{item.name}</a>
              <span className="build-item__note">{item.note}</span>
            </div>
            <div className="build-item__price">
              {item.perPair
                ? <>from {formatPrice(item.price)}<small>per pair</small></>
                : item.qty > 1
                  ? <>{formatPrice(item.price * item.qty)}<small>{item.qty} × {formatPrice(item.price)}</small></>
                  : formatPrice(item.price)}
            </div>
          </li>
        ))}
      </ul>

      <div className="build-total">
        <span>Starting total{plateLine ? ' (before plates)' : ''}</span>
        <strong>{formatPrice(total)}</strong>
      </div>

      <div className={`build-budget ${overBudget ? 'is-over' : 'is-under'}`}>
        {overBudget
          ? <>About <strong>{formatPrice(-remaining)}</strong> over your {formatPrice(budget)} budget. Try a lower budget tier to see a leaner build.</>
          : <><strong>{formatPrice(remaining)}</strong> left in your {formatPrice(budget)} budget{plateLine ? ' to put toward plates' : ''}.</>}
      </div>

      {pkg && (
        <a className="build-package" href={productUrl(pkg.handle)} target="_blank" rel="noreferrer">
          <span className="eyebrow">Save with a bundle</span>
          <strong>{pkg.name}{pkg.price ? ` · from ${formatPrice(pkg.price)}` : ''}</strong>
          <span>{pkg.blurb}</span>
        </a>
      )}

      {tips.length > 0 && (
        <div className="build-tips">
          <span className="eyebrow">Good to know</span>
          <ul>{tips.map(t => <li key={t}>{t}</li>)}</ul>
        </div>
      )}

      <div className="build-actions">
        <button className="btn btn--primary" onClick={onEditBudget}>Adjust budget</button>
        <button className="btn btn--secondary" onClick={onRestart}>Start over</button>
      </div>
    </div>
  )
}

function App() {
  const [messages, setMessages] = useState(() => [
    msg('bot', INTRO),
    msg('bot', QUESTIONS[0].prompt, { hint: QUESTIONS[0].hint }),
  ])
  const [step, setStep] = useState(0) // index into QUESTIONS; QUESTIONS.length = results shown
  const [answers, setAnswers] = useState({})
  const [multiPick, setMultiPick] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [editingBudget, setEditingBudget] = useState(false)
  const endRef = useRef(null)

  const done = step >= QUESTIONS.length
  const question = QUESTIONS[step]

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const botSay = (newMessages) => {
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages(prev => [...prev, ...newMessages])
    }, TYPING_DELAY)
  }

  const showResults = (finalAnswers) => {
    const build = buildGym(finalAnswers)
    setStep(QUESTIONS.length)
    botSay([
      msg('bot', "Here's the build I'd put together for you. Tap any item to see it on repfitness.com."),
      msg('bot', '', { build }),
    ])
  }

  const submitAnswer = (value, label) => {
    setMessages(prev => [...prev, msg('user', label)])
    const updated = { ...answers, [question.id]: value }
    setAnswers(updated)
    setMultiPick([])

    if (editingBudget || step === QUESTIONS.length - 1) {
      setEditingBudget(false)
      showResults(updated)
      return
    }

    const next = QUESTIONS[step + 1]
    setStep(step + 1)
    botSay([msg('bot', acknowledge(question.id, value) + next.prompt, { hint: next.hint })])
  }

  const restart = () => {
    setAnswers({})
    setMultiPick([])
    setEditingBudget(false)
    setStep(0)
    setMessages([msg('bot', INTRO), msg('bot', QUESTIONS[0].prompt, { hint: QUESTIONS[0].hint })])
  }

  const editBudget = () => {
    setEditingBudget(true)
    setStep(0)
    botSay([msg('bot', "Sure. What budget should I work with? I'll keep the rest of your answers.", { hint: QUESTIONS[0].hint })])
  }

  const handleSend = () => {
    const text = input.trim()
    if (!text || typing) return
    setInput('')

    if (/^(restart|start over|reset)$/i.test(text)) {
      restart()
      return
    }

    if (done) {
      setMessages(prev => [...prev, msg('user', text)])
      if (/budget/i.test(text)) editBudget()
      else botSay([msg('bot', "Want to tweak something? Tap **Adjust budget** to try a different number, or **Start over** to change your space and goals.")])
      return
    }

    const value = parseAnswer(question, text)
    if (value === undefined) {
      setMessages(prev => [...prev, msg('user', text)])
      botSay([msg('bot', question.id === 'budget'
        ? "I didn't catch a number there. Try something like **$2,000** or pick a range below."
        : "I didn't quite catch that. Tap one of the options below or try rephrasing.")])
      return
    }

    if (question.id === 'budget' && value < 150) {
      setMessages(prev => [...prev, msg('user', text)])
      botSay([msg('bot', 'That budget is a bit tight for equipment from this lineup. Most builds start around **$500**. What number should I work with?')])
      return
    }

    submitAnswer(value, text)
  }

  const toggleMulti = (value) => {
    setMultiPick(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value])
  }

  const submitMulti = () => {
    if (!multiPick.length) return
    const labels = question.options.filter(o => multiPick.includes(o.value)).map(o => o.label)
    submitAnswer(multiPick, labels.join(', '))
  }

  const lastBotId = [...messages].reverse().find(m => m.sender === 'bot')?.id
  const showChips = !done && !typing

  return (
    <div className="app">
      <header className="site-header">
        <div className="site-header__bar">Home Gym Builder · Prototype for interview</div>
        <div className="site-header__main">
          <span className="wordmark">REP</span>
          <span className="site-header__title">Build your home gym</span>
        </div>
        <div className="progress" aria-label={`Step ${Math.min(step + 1, QUESTIONS.length)} of ${QUESTIONS.length}`}>
          <div className="progress__fill" style={{ width: `${(Math.min(step, QUESTIONS.length) / QUESTIONS.length) * 100}%` }} />
        </div>
      </header>

      <main className="messages">
        {messages.map(m => (
          <div key={m.id} className={`message message--${m.sender} ${m.build ? 'message--wide' : ''}`}>
            {m.build ? (
              <BuildCard build={m.build} onRestart={restart} onEditBudget={editBudget} />
            ) : (
              <div className="bubble">
                {m.text.split('\n').map((l, i) => <RichLine key={i} text={l} />)}
                {m.hint && m.id === lastBotId && <span className="bubble__hint">{m.hint}</span>}
              </div>
            )}
          </div>
        ))}

        {typing && (
          <div className="message message--bot">
            <div className="bubble bubble--typing" aria-label="Typing"><span /><span /><span /></div>
          </div>
        )}

        {showChips && (
          <div className="chips">
            {question.options.map(o => {
              const active = question.multi && multiPick.includes(o.value)
              return (
                <button
                  key={o.label}
                  className={`chip ${active ? 'chip--active' : ''}`}
                  aria-pressed={question.multi ? active : undefined}
                  onClick={() => question.multi ? toggleMulti(o.value) : submitAnswer(o.value, o.label)}
                >
                  {o.label}
                </button>
              )
            })}
            {question.multi && (
              <button className="chip chip--done" disabled={!multiPick.length} onClick={submitMulti}>Done</button>
            )}
          </div>
        )}

        <div ref={endRef} />
      </main>

      <footer className="composer">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSend() }}
          placeholder={done ? "Type 'restart' to start over" : 'Type your answer...'}
          aria-label="Your answer"
        />
        <button className="btn btn--primary" onClick={handleSend} disabled={!input.trim() || typing}>Send</button>
      </footer>
    </div>
  )
}

// Short confirmation before the next question so the chat feels responsive.
function acknowledge(id, value) {
  switch (id) {
    case 'budget': return `Got it, working with about ${formatPrice(value)}.\n\n`
    case 'space': return value === 'small' ? "Small spaces can still pack a serious gym.\n\n" : 'Nice, plenty to work with.\n\n'
    case 'ceiling': return value === 'low' ? "Good to know. I'll stick to equipment that fits.\n\n" : ''
    case 'goal': return 'Love it.\n\n'
    default: return ''
  }
}

export default App
