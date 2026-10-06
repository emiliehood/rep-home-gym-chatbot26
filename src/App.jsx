import { useState, useEffect, useRef, useMemo } from 'react'
import './App.css'
import { getQuestions, parseAnswer, buildGym, t } from './catalog.js'
import { MARKETS, productUrl, formatPrice } from './markets.js'

const TYPING_DELAY = 550
const RESTART_WORDS = /^(restart|start over|reset|neustart|neu starten|von vorn)$/i

let nextId = 1
const msg = (sender, text, extra = {}) => ({ id: nextId++, sender, text, ...extra })

// Market comes from ?market=uk|de, so a link can open straight into a store.
function initialMarket() {
  const param = new URLSearchParams(window.location.search).get('market')?.toLowerCase()
  return MARKETS[param] ? param : 'us'
}

const openingMessages = (market) => {
  const q = getQuestions(market)[0]
  return [msg('bot', t(market).intro), msg('bot', q.prompt, { hint: q.hint })]
}

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

function BuildCard({ build, market, onRestart, onEditBudget }) {
  const { items, tips, pkg, total, remaining, hasPlates, budget } = build
  const s = t(market).card
  const fmt = (n) => formatPrice(n, market)

  return (
    <div className="build-card">
      <div className="build-card__head">
        <span className="eyebrow">{s.eyebrow}</span>
        <h2>{s.title}</h2>
      </div>

      <ul className="build-list">
        {items.map(item => (
          <li key={item.key} className="build-item">
            <div className="build-item__info">
              <a href={productUrl(market, item.handle)} target="_blank" rel="noreferrer">{item.name}</a>
              <span className="build-item__note">{item.note}</span>
            </div>
            <div className="build-item__price">
              {item.perPair
                ? <>{s.from} {fmt(item.price)}<small>{s.perPair}</small></>
                : item.qty > 1
                  ? <>{fmt(item.price * item.qty)}<small>{item.qty} × {fmt(item.price)}</small></>
                  : fmt(item.price)}
            </div>
          </li>
        ))}
      </ul>

      <div className="build-total">
        <span>{s.total}{hasPlates ? s.beforePlates : ''}</span>
        <strong>{fmt(total)}</strong>
      </div>

      <div className={`build-budget ${remaining < 0 ? 'is-over' : 'is-under'}`}>
        <RichLine text={remaining < 0 ? s.over(fmt(-remaining), fmt(budget)) : s.under(fmt(remaining), fmt(budget), hasPlates)} />
      </div>

      {pkg && (
        <a className="build-package" href={productUrl(market, pkg.handle)} target="_blank" rel="noreferrer">
          <span className="eyebrow">{s.bundle}</span>
          <strong>{pkg.name}{pkg.price ? ` · ${s.from} ${fmt(pkg.price)}` : ''}</strong>
          <span>{pkg.blurb}</span>
        </a>
      )}

      {tips.length > 0 && (
        <div className="build-tips">
          <span className="eyebrow">{s.tips}</span>
          <ul>{tips.map(tip => <li key={tip}>{tip}</li>)}</ul>
        </div>
      )}

      <div className="build-actions">
        <button className="btn btn--primary" onClick={onEditBudget}>{s.adjust}</button>
        <button className="btn btn--secondary" onClick={onRestart}>{s.restart}</button>
      </div>
    </div>
  )
}

function App() {
  const [market, setMarket] = useState(initialMarket)
  const [messages, setMessages] = useState(() => openingMessages(market))
  const [step, setStep] = useState(0) // index into questions; questions.length = results shown
  const [answers, setAnswers] = useState({})
  const [multiPick, setMultiPick] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [editingBudget, setEditingBudget] = useState(false)
  const endRef = useRef(null)
  const timer = useRef(null)

  const s = t(market)
  const questions = useMemo(() => getQuestions(market), [market])
  const done = step >= questions.length
  const question = questions[step]

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    document.documentElement.lang = MARKETS[market].lang
  }, [market])

  const botSay = (newMessages) => {
    setTyping(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setTyping(false)
      setMessages(prev => [...prev, ...newMessages])
    }, TYPING_DELAY)
  }

  const reset = (toMarket = market) => {
    clearTimeout(timer.current)
    setTyping(false)
    setAnswers({})
    setMultiPick([])
    setEditingBudget(false)
    setStep(0)
    setMessages(openingMessages(toMarket))
  }

  const switchMarket = (code) => {
    if (code === market) return
    setMarket(code)
    const url = new URL(window.location.href)
    if (code === 'us') url.searchParams.delete('market')
    else url.searchParams.set('market', code)
    window.history.replaceState(null, '', url)
    reset(code)
  }

  const showResults = (finalAnswers) => {
    const build = buildGym(finalAnswers, market)
    setStep(questions.length)
    botSay([msg('bot', s.chat.results), msg('bot', '', { build })])
  }

  const acknowledge = (id, value) => {
    switch (id) {
      case 'budget': return s.ack.budget(formatPrice(value, market)) + '\n\n'
      case 'space': return (value === 'small' ? s.ack.spaceSmall : s.ack.spaceOther) + '\n\n'
      case 'ceiling': return value === 'low' ? s.ack.ceilingLow + '\n\n' : ''
      case 'goal': return s.ack.goal + '\n\n'
      default: return ''
    }
  }

  const submitAnswer = (value, label) => {
    setMessages(prev => [...prev, msg('user', label)])
    const updated = { ...answers, [question.id]: value }
    setAnswers(updated)
    setMultiPick([])

    if (editingBudget || step === questions.length - 1) {
      setEditingBudget(false)
      showResults(updated)
      return
    }

    const next = questions[step + 1]
    setStep(step + 1)
    botSay([msg('bot', acknowledge(question.id, value) + next.prompt, { hint: next.hint })])
  }

  const editBudget = () => {
    setEditingBudget(true)
    setStep(0)
    botSay([msg('bot', s.chat.editBudget, { hint: questions[0].hint })])
  }

  const handleSend = () => {
    const text = input.trim()
    if (!text || typing) return
    setInput('')

    if (RESTART_WORDS.test(text)) {
      reset()
      return
    }

    const echo = () => setMessages(prev => [...prev, msg('user', text)])

    if (done) {
      echo()
      if (/budget/i.test(text)) editBudget()
      else botSay([msg('bot', s.chat.afterDone)])
      return
    }

    const value = parseAnswer(question, text, market)
    if (value === undefined) {
      echo()
      botSay([msg('bot', question.id === 'budget' ? s.chat.noNumber(formatPrice(2000, market)) : s.chat.unclear)])
      return
    }

    if (question.id === 'budget' && value < 150) {
      echo()
      botSay([msg('bot', s.chat.tooLow(formatPrice(500, market)))])
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
  const progress = Math.min(step, questions.length)

  return (
    <div className="app">
      <header className="site-header">
        <div className="site-header__bar">{s.bar}</div>
        <div className="site-header__main">
          <span className="wordmark">REP</span>
          <span className="site-header__title">{s.title}</span>
          <div className="market-switch" role="group" aria-label={s.marketLabel}>
            {Object.values(MARKETS).map(m => (
              <button
                key={m.code}
                className={`market-switch__btn ${m.code === market ? 'is-active' : ''}`}
                aria-pressed={m.code === market}
                title={m.name}
                onClick={() => switchMarket(m.code)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
        <div className="progress" aria-label={s.stepOf(Math.min(step + 1, questions.length), questions.length)}>
          <div className="progress__fill" style={{ width: `${(progress / questions.length) * 100}%` }} />
        </div>
      </header>

      <main className="messages">
        {messages.map(m => (
          <div key={m.id} className={`message message--${m.sender} ${m.build ? 'message--wide' : ''}`}>
            {m.build ? (
              <BuildCard build={m.build} market={market} onRestart={() => reset()} onEditBudget={editBudget} />
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
            <div className="bubble bubble--typing" aria-label={s.typing}><span /><span /><span /></div>
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
              <button className="chip chip--done" disabled={!multiPick.length} onClick={submitMulti}>{s.done}</button>
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
          placeholder={done ? s.placeholderDone : s.placeholder}
          aria-label={s.inputLabel}
        />
        <button className="btn btn--primary" onClick={handleSend} disabled={!input.trim() || typing}>{s.send}</button>
      </footer>
    </div>
  )
}

export default App
