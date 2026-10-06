import { useState, useEffect, useRef, useMemo } from 'react'
import './App.css'
import { getQuestions, parseAnswer, parseBudget, buildGym, t, parseEdit, applyEdit, buildHasGroup, groupOf, joinList } from './catalog.js'
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

function BuildCard({ build, market, onRestart, onEditBudget, onRemove }) {
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
              {onRemove && (
                <button className="build-item__remove" onClick={() => onRemove(item)} aria-label={`${s.remove}: ${item.name}`} title={s.remove}>×</button>
              )}
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
  const [resumeStep, setResumeStep] = useState(null) // where to go after a budget change
  const [pendingWarn, setPendingWarn] = useState(false) // budget warning chips showing
  const [lastBuild, setLastBuild] = useState(null)
  const endRef = useRef(null)
  const timer = useRef(null)

  const s = t(market)
  const questions = useMemo(() => getQuestions(market), [market])
  const done = step >= questions.length
  const question = questions[step]
  const mustIdx = questions.findIndex(q => q.id === 'mustHaves')
  const colorIdx = mustIdx + 1

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
    setResumeStep(null)
    setPendingWarn(false)
    setLastBuild(null)
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
    setLastBuild(build)
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

  const echo = (text) => setMessages(prev => [...prev, msg('user', text)])

  const askStep = (idx, prefix = '') => {
    setStep(idx)
    botSay([msg('bot', prefix + questions[idx].prompt, { hint: questions[idx].hint })])
  }

  // After must-haves, warn if even the leanest version of those picks can't fit
  // the budget, so the shopper isn't surprised at the end.
  const afterMustHaves = (ans, prefix = '') => {
    const trial = buildGym({ ...ans, color: null }, market)
    if (trial.remaining >= 0) {
      askStep(colorIdx, prefix)
      return
    }
    const labels = questions[mustIdx].options.filter(o => ans.mustHaves.includes(o.value)).map(o => s.lowerPicks ? o.label.toLowerCase() : o.label)
    setStep(colorIdx)
    setPendingWarn(true)
    botSay([msg('bot', s.chat.warning(joinList(labels, s.and), formatPrice(Math.ceil(trial.total / 10) * 10, market), formatPrice(ans.budget, market)))])
  }

  const submitAnswer = (value, label) => {
    echo(label)
    const updated = { ...answers, [question.id]: value }
    setAnswers(updated)
    setMultiPick([])
    const ack = acknowledge(question.id, value)

    if (question.id === 'budget' && resumeStep !== null) {
      const target = resumeStep
      setResumeStep(null)
      if (target >= questions.length) showResults(updated)
      else if (target === colorIdx) afterMustHaves(updated, ack)
      else askStep(target, ack)
      return
    }
    if (step === questions.length - 1) {
      showResults(updated)
      return
    }
    if (question.id === 'mustHaves') {
      afterMustHaves(updated)
      return
    }
    askStep(step + 1, ack)
  }

  const editBudget = () => {
    setResumeStep(questions.length)
    setStep(0)
    botSay([msg('bot', s.chat.editBudget, { hint: questions[0].hint })])
  }

  const warnChoice = (choice) => {
    echo(s.chat.warnChips[choice])
    setPendingWarn(false)
    if (choice === 'keep') askStep(colorIdx)
    else if (choice === 'picks') askStep(mustIdx)
    else {
      setResumeStep(colorIdx)
      setStep(0)
      botSay([msg('bot', s.chat.newBudget, { hint: questions[0].hint })])
    }
  }

  // "remove the bench", "add dumbbells", or the × on a build item.
  const editBuild = (edit) => {
    const label = s.edit.groups[edit.group]
    if (!edit.action) {
      botSay([msg('bot', s.edit.which(label))])
      return
    }
    if (edit.action === 'remove' && !buildHasGroup(lastBuild, edit.group)) {
      botSay([msg('bot', s.edit.notPresent(label))])
      return
    }
    const updated = applyEdit(answers, edit)
    const build = buildGym(updated, market)
    const sameItems = build.items.map(i => i.key).join() === lastBuild.items.map(i => i.key).join()
    if (sameItems) {
      const missing = edit.action === 'add' && !buildHasGroup(build, edit.group)
      botSay([msg('bot', missing ? s.edit.unavailable(label) : s.edit.noChange)])
      return
    }
    setAnswers(updated)
    setLastBuild(build)
    setResumeStep(null)
    setStep(questions.length)
    botSay([msg('bot', edit.action === 'remove' ? s.edit.removed(label) : s.edit.added(label)), msg('bot', '', { build })])
  }

  const removeItem = (item) => {
    echo(`${s.card.remove}: ${item.name}`)
    editBuild({ action: 'remove', group: groupOf(item.key) })
  }

  const handleSend = () => {
    const text = input.trim()
    if (!text || typing) return
    setInput('')

    if (RESTART_WORDS.test(text)) {
      reset()
      return
    }

    // Once there's a build, item edits work at any point, even mid budget change.
    const edit = lastBuild && parseEdit(text)
    if (edit) {
      echo(text)
      editBuild(edit)
      return
    }

    if (pendingWarn) {
      const n = parseBudget(text, market)
      if (n) {
        echo(text)
        setPendingWarn(false)
        const updated = { ...answers, budget: n }
        setAnswers(updated)
        afterMustHaves(updated, s.ack.budget(formatPrice(n, market)) + '\n\n')
      } else if (/budget/i.test(text)) warnChoice('budget')
      else if (/pick|change|auswahl|ändern/i.test(text)) warnChoice('picks')
      else warnChoice('keep')
      return
    }

    if (done) {
      echo(text)
      if (/budget/i.test(text)) editBudget()
      else botSay([msg('bot', s.chat.afterDone)])
      return
    }

    const value = parseAnswer(question, text, market)
    if (value === undefined) {
      echo(text)
      botSay([msg('bot', question.id === 'budget' ? s.chat.noNumber(formatPrice(2000, market)) : s.chat.unclear)])
      return
    }

    if (question.id === 'budget' && value < 150) {
      echo(text)
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
  const showChips = !done && !typing && !pendingWarn
  const latestBuildId = [...messages].reverse().find(m => m.build)?.id
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
              <BuildCard build={m.build} market={market} onRestart={() => reset()} onEditBudget={editBudget} onRemove={m.id === latestBuildId && !typing ? removeItem : null} />
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

        {pendingWarn && !typing && (
          <div className="chips">
            {Object.entries(s.chat.warnChips).map(([key, label]) => (
              <button key={key} className={`chip ${key === 'keep' ? 'chip--done' : ''}`} onClick={() => warnChoice(key)}>{label}</button>
            ))}
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
