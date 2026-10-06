// Questions, free-text parsing and build logic for the REP Home Gym Builder.
// Market data (prices, handles, packages) lives in markets.js; copy in i18n.js.

import { MARKETS, PRICES, PACKAGES, PRODUCT_NAMES, RACK_COLORS, RACK_KEYS, formatPrice } from './markets.js'
import { STRINGS } from './i18n.js'

export const t = (market) => STRINGS[MARKETS[market].lang]

// ---------------------------------------------------------------------------
// Questions
// ---------------------------------------------------------------------------

const BUDGET_TIERS = [1000, 2500, 5000]

export function getQuestions(market) {
  const s = t(market)
  const m = MARKETS[market]
  const o = s.options
  const fmt = (n) => formatPrice(n, market)
  const opts = (group) => Object.entries(group).map(([value, label]) => ({ value, label }))
  const [a, b, c] = BUDGET_TIERS

  return [
    {
      id: 'budget',
      prompt: s.questions.budget.prompt,
      hint: s.questions.budget.hint(fmt(1800)),
      options: [
        { label: o.budget.under(fmt(a)), value: a },
        { label: o.budget.range(fmt(a), fmt(b)), value: b },
        { label: o.budget.range(fmt(b), fmt(c)), value: c },
        { label: o.budget.over(fmt(c)), value: 8000 },
      ],
    },
    { id: 'space', prompt: s.questions.space.prompt, options: opts(o.space) },
    {
      id: 'ceiling',
      prompt: s.questions.ceiling.prompt,
      options: Object.entries(o.ceiling[m.units]).map(([value, label]) => ({ value: value === 'unsure' ? 'mid' : value, label })),
    },
    { id: 'floor', prompt: s.questions.floor.prompt, options: opts(o.floor) },
    { id: 'experience', prompt: s.questions.experience.prompt, options: opts(o.experience) },
    { id: 'goal', prompt: s.questions.goal.prompt, options: opts(o.goal) },
    { id: 'mustHaves', prompt: s.questions.mustHaves.prompt, multi: true, options: opts(o.mustHaves) },
    {
      id: 'color',
      prompt: s.questions.color.prompt,
      options: Object.entries(o.color).map(([value, label]) => ({ value: value === 'none' ? null : value, label })),
    },
  ]
}

// ---------------------------------------------------------------------------
// Free-text parsing
// ---------------------------------------------------------------------------

// Handles "$1,800", "1800", "1.5k", "2k", "1000-2500" (top of a range), and
// German formats like "2.000 €" or "2,5k".
export function parseBudget(text, market = 'us') {
  let s = text.toLowerCase()
  if (MARKETS[market].lang === 'de') s = s.replace(/\.(?=\d{3}(\D|$))/g, '').replace(/,/g, '.')
  else s = s.replace(/,/g, '')
  const matches = [...s.matchAll(/(\d+(?:\.\d+)?)\s*(k)?/g)]
  if (!matches.length) return null
  const top = Math.max(...matches.map(m => parseFloat(m[1]) * (m[2] ? 1000 : 1)))
  return top > 0 ? Math.round(top) : null
}

// English and German keywords. Order matters: the first matching value wins.
const KEYWORDS = {
  space: {
    small: ['apartment', 'flat', 'small', 'room', 'condo', 'bedroom', 'office', 'wohnung', 'klein', 'zimmer'],
    garage: ['garage'],
    basement: ['basement', 'cellar', 'keller'],
    large: ['large', 'dedicated', 'barn', 'shed', 'big', 'groß', 'gross', 'halle'],
  },
  ceiling: {
    low: ['under 7', 'under 2', 'unter 2', 'low', 'short', 'niedrig', '6', '1.9', '1,9', '2.0', '2,0'],
    high: ['over 8', 'over 2.4', 'über 2,4', 'high', 'tall', 'hoch', '9', '10', '12', '2.5', '2,5', '2.6', '2,6', '2.7', '2,7', ' 3 m', ' 3m', '3,0', '3.0'],
    mid: ['7', '8', '2.1', '2,1', '2.2', '2,2', '2.3', '2,3', '2.4', '2,4', 'sure', 'normal', 'standard', 'weiß nicht', 'weiss nicht'],
  },
  floor: {
    concrete: ['concrete', 'cement', 'slab', 'beton', 'estrich'],
    finished: ['hardwood', 'wood', 'finished', 'tile', 'laminate', 'vinyl', 'parkett', 'holz', 'fliesen', 'laminat'],
    carpet: ['carpet', 'teppich'],
    covered: ['already', 'mats', 'rubber', 'gym floor', 'schon', 'matten', 'gummi', 'gymboden'],
  },
  experience: {
    beginner: ['beginner', 'new', 'start', 'never', 'just', 'anfänger', 'neu', 'gerade', 'angefangen'],
    advanced: ['advanced', '3', '4', '5', '6', '7', '8', '9', '10', '20', 'decade', 'competitive', 'long time', 'fortgeschritten', 'lange'],
    intermediate: ['intermediate', '1', '2', 'year', 'some', 'jahr', 'etwas'],
  },
  goal: {
    strength: ['strength', 'power', 'strong', 'kraft'],
    muscle: ['muscle', 'bodybuild', 'hypertrophy', 'size', 'muskel'],
    olympic: ['olympic', 'snatch', 'clean', 'weightlifting', 'olymp', 'gewichtheben', 'reißen'],
    functional: ['functional', 'hybrid', 'crossfit', 'conditioning', 'athletic', 'funktion'],
    general: ['general', 'health', 'fitness', 'lose', 'tone', 'gesund', 'abnehmen', 'allgemein'],
  },
  mustHaves: {
    rack: ['rack', 'barbell', 'bar', 'squat', 'bench press', 'langhantel', 'stange'],
    dumbbells: ['dumbbell', 'db', 'kurzhantel'],
    cable: ['cable', 'pulley', 'lat', 'functional trainer', 'kabel', 'zug'],
    cardio: ['cardio', 'row', 'bike', 'treadmill', 'erg', 'rudern', 'ausdauer'],
    storage: ['storage', 'organi', 'tree', 'shelf', 'aufbewahrung', 'ordnung'],
  },
  color: {
    'Metallic Black': ['metallic'],
    'Matte Black': ['matte', 'matt', 'black', 'schwarz'],
    Red: ['red', 'rot'],
    Blue: ['blue', 'blau'],
    White: ['white', 'weiß', 'weiss'],
    none: ['no', 'any', 'none', "don't", 'whatever', 'egal', 'kein'],
  },
}

// Returns an answer value for a question from free text, or undefined if unclear.
export function parseAnswer(question, text, market) {
  const lower = text.toLowerCase().trim()
  const padded = ` ${lower}`
  if (question.id === 'budget') return parseBudget(text, market) ?? undefined

  const exact = question.options.find(o => o.label.toLowerCase() === lower)
  if (exact) return question.multi ? [exact.value] : exact.value

  const map = KEYWORDS[question.id]
  if (!map) return undefined

  if (question.multi) {
    const picked = Object.keys(map).filter(k => map[k].some(w => padded.includes(w)))
    return picked.length ? picked : undefined
  }

  for (const [value, words] of Object.entries(map)) {
    if (words.some(w => padded.includes(w))) return value === 'none' ? null : value
  }
  return undefined
}

// ---------------------------------------------------------------------------
// Budget trimming: cheaper swaps first, then optional extras, in this order.
// ---------------------------------------------------------------------------

const DOWNGRADES = [
  { from: 'dbStand', to: null, trim: 'dbStand' },
  { from: 'pepin', to: 'quickdraw', trim: 'pepin' },
  { from: 'blackwing', to: 'nighthawk', trim: 'blackwing' },
  { from: 'nighthawk', to: 'ab3100', trim: 'nighthawk' },
  { from: 'fb5000', to: 'fb3000', trim: 'fb5000' },
  { from: 'ab3100', to: 'fb3000', trim: 'ab3100' },
  { from: 'plateTree', to: null, trim: 'plateTree' },
  { from: 'adjKettlebell', to: null, trim: 'adjKettlebell' },
  { from: 'performancePack', to: null, trim: 'performancePack' },
  { from: 'rubberTiles', to: null, trim: 'flooring' },
  { from: 'floorMat', to: null, trim: 'flooring' },
  { from: 'colorado', to: 'delta', trim: 'bar' },
  { from: 'blackDiamond', to: 'delta', trim: 'bar' },
  { from: 'pr5000', to: 'pr1100', trim: 'rack' },
  { from: 'pr4000', to: 'pr1100', trim: 'rack' },
]

const joinList = (list, and) => list.length < 2 ? list.join('') : `${list.slice(0, -1).join(', ')}${and}${list.at(-1)}`

const KG_NAMED = ['bumperPlates', 'compBumpers', 'quickdraw', 'pepin']

const itemsTotal = (items) => items.reduce((sum, i) => sum + (i.perPair ? 0 : i.price * i.qty), 0)

// ---------------------------------------------------------------------------
// Build recommendation
// ---------------------------------------------------------------------------

export function buildGym(a, market) {
  const s = t(market)
  const m = MARKETS[market]
  const prices = PRICES[market]
  const packages = PACKAGES[market]
  const fmt = (n) => formatPrice(n, market)
  const has = (key) => Boolean(prices[key])

  // Budget thresholds below are in US dollars; scale them to local price levels.
  const budget = a.budget
  const usd = budget / m.parity

  const noteFor = (key) => {
    const n = s.notes[key]
    return typeof n === 'object' ? n[m.units] : n
  }
  const line = (key, note = noteFor(key), qty = 1) => ({
    key,
    name: PRODUCT_NAMES[key] + (m.units === 'metric' && KG_NAMED.includes(key) ? ' (KG)' : ''),
    price: prices[key][0],
    handle: prices[key][1],
    perPair: ['ironPlates', 'bumperPlates', 'compBumpers'].includes(key),
    note,
    qty,
  })

  const needs = new Set(a.mustHaves?.length ? a.mustHaves : ['rack'])
  const small = a.space === 'small'
  const lowCeiling = a.ceiling === 'low'
  const items = []
  const tips = []
  let pkgKey = null

  // ---- Rack / cable system -------------------------------------------------
  if (needs.has('rack') || needs.has('cable')) {
    if (needs.has('cable') && usd >= 5000 && !small && !lowCeiling) {
      items.push(line('pr5000', s.notes.pr5000Ares))
      items.push(line('ares'))
      pkgKey = 'ultimate'
    } else if (needs.has('cable') && usd >= 2500 && has('athenaWall')) {
      items.push(line('athenaWall'))
      pkgKey = 'compact'
    } else if (needs.has('cable')) {
      items.push(line('altitude'))
      pkgKey = 'garage'
      tips.push(s.tips.cableLater(fmt(prices.athenaWall?.[0] ?? prices.ares[0])))
    } else if (small || lowCeiling) {
      items.push(line(has('pr4100') ? 'pr4100' : 'wallFixed'))
      tips.push(s.tips.studs)
    } else if (usd < 1500) {
      items.push(line('pr1100'))
      pkgKey = 'trailhead'
    } else if (usd < 3000 && has('pr4000')) {
      items.push(line('pr4000'))
    } else if (usd < 2000) {
      items.push(line('pr1100'))
      pkgKey = 'trailhead'
    } else {
      items.push(line('pr5000'))
      if (usd >= 3000) pkgKey = 'essentials'
    }
    if (needs.has('cable') && has('performancePack') && !items.some(i => i.key === 'altitude')) {
      items.push(line('performancePack'))
    }
  } else if (needs.has('dumbbells')) {
    pkgKey = 'minimalist'
  }

  // ---- Bench ----------------------------------------------------------------
  if (a.goal === 'strength' && usd >= 1500) items.push(line('fb5000'))
  else if (usd < 1500) items.push(line(a.goal === 'strength' ? 'fb3000' : 'ab3100'))
  else if (usd < 4000) items.push(line('nighthawk'))
  else items.push(line('blackwing'))

  // ---- Bar and plates -------------------------------------------------------
  if (needs.has('rack') || needs.has('cable')) {
    if (usd < 1500) items.push(line('delta'))
    else if (a.goal === 'strength') items.push(line('blackDiamond'))
    else items.push(line('colorado'))

    const dropping = a.goal === 'olympic' || a.goal === 'functional' || a.floor === 'finished'
    if (a.goal === 'olympic' && usd >= 5000) items.push(line('compBumpers'))
    else if (dropping || !has('ironPlates')) items.push(line('bumperPlates'))
    else items.push(line('ironPlates'))
  }

  // ---- Dumbbells ------------------------------------------------------------
  if (needs.has('dumbbells') || small) {
    if (usd >= 4000 || (a.experience === 'advanced' && usd >= 2500)) {
      items.push(line('pepin'))
      items.push(line('dbStand'))
    } else {
      items.push(line('quickdraw'))
    }
    if (small && !needs.has('rack')) items.push(line('adjKettlebell'))
  }

  // ---- Cardio, storage, flooring -------------------------------------------
  if (needs.has('cardio')) {
    if (has('concept2')) items.push(line('concept2'))
    else tips.push(s.tips.noCardio)
  }
  if (needs.has('storage') && (needs.has('rack') || needs.has('cable'))) items.push(line('plateTree'))

  if (a.floor === 'concrete' || a.floor === 'finished' || a.floor === 'carpet') {
    if (a.floor === 'concrete' && has('rubberTiles')) items.push(line('rubberTiles', undefined, 6))
    else if (a.floor !== 'concrete' && has('floorMat')) items.push(line('floorMat', undefined, 2))
    else tips.push(s.tips.noFlooring)
  }

  // ---- Stay inside the budget ----------------------------------------------
  const trims = []
  for (const d of DOWNGRADES) {
    if (itemsTotal(items) <= budget) break
    const idx = items.findIndex(i => i.key === d.from)
    if (idx === -1) continue
    if (d.to) items[idx] = line(d.to, undefined, items[idx].qty)
    else items.splice(idx, 1)
    const said = s.trims[d.trim]
    if (!trims.includes(said)) trims.push(said)
  }
  if (trims.length) tips.unshift(s.tips.trimmed(joinList(trims, s.and)))

  // ---- Fit-specific tips ----------------------------------------------------
  const rack = items.find(i => RACK_KEYS.includes(i.key))
  if (lowCeiling) {
    tips.push(s.tips.lowCeiling[m.units])
    if (rack && !['pr4100', 'wallFixed'].includes(rack.key)) tips.push(s.tips.checkHeight)
  }
  if (items.some(i => i.key === 'rubberTiles')) tips.push(s.tips.tiles)
  if (a.ceiling === 'mid' && rack?.key === 'pr5000') tips.push(s.tips.pr5000Height[m.units])
  if (a.experience === 'beginner' && items.some(i => i.perPair)) tips.push(s.tips.beginner)

  // ---- Color ---------------------------------------------------------------
  if (rack && a.color && RACK_COLORS[rack.key]) {
    const colorLabel = s.options.color[a.color]
    if (RACK_COLORS[rack.key].includes(a.color)) rack.note += `. ${s.notes.shownIn(colorLabel)}`
    else tips.push(s.tips.colorUnavailable(rack.name, colorLabel))
  }

  // ---- Package and totals ---------------------------------------------------
  const pkg = pkgKey && packages[pkgKey] ? { ...packages[pkgKey], blurb: s.packages[packages[pkgKey].blurb] } : null
  const total = itemsTotal(items)

  return { items, tips, pkg, total, remaining: budget - total, hasPlates: items.some(i => i.perPair), budget }
}
