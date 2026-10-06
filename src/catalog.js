// REP Fitness catalog data and build logic for the Home Gym Builder.
// Prices are REP's "starting at" prices from repfitness.com (Oct 2026) and
// should be refreshed from the Shopify storefront before any real launch.

const STORE = 'https://repfitness.com/products/'

const ALL_COLORS = ['Metallic Black', 'Matte Black', 'Red', 'Blue', 'White', 'Clear Coat']

export const PRODUCTS = {
  // Racks
  pr1100: { name: 'PR-1100 Power Rack', price: 379.99, handle: 'pr-1100-power-rack', colors: ['Metallic Black', 'Matte Black', 'Red', 'Blue'] },
  pr4000: { name: 'PR-4000 Rack Builder', price: 799.94, handle: 'pr-4000-rack-builder', colors: ALL_COLORS },
  pr5000: { name: 'PR-5000 Rack Builder', price: 899.99, handle: 'pr-5000-rack-builder', colors: ALL_COLORS },
  pr4100: { name: 'PR-4100 Folding Squat Rack', price: 499.99, handle: 'pr-4100-folding-wall-mount-squat-power-rack', colors: null },
  altitude: { name: 'Altitude™ Power Rack', price: 899.99, handle: 'altitude-power-rack', colors: ['Metallic Black', 'Matte Black', 'Red', 'Blue', 'White'] },
  athenaWall: { name: 'Athena® Wall-Mounted Builder', price: 2474.99, handle: 'wall-mounted-athena', colors: null },
  ares: { name: 'Ares™ 2.0 Builder', price: 2999.99, handle: 'ares-2-0-builder', colors: null },

  // Benches
  fb3000: { name: 'FB-3000 Flat Bench', price: 149.99, handle: 'fb-3000-flat-bench' },
  fb5000: { name: 'FB-5000 Competition Flat Bench', price: 244.99, handle: 'fb-5000-competition-flat-bench' },
  ab3100: { name: 'AB-3100 Adjustable Bench', price: 269.99, handle: 'ab-3100-adjustable-weight-bench' },
  nighthawk: { name: 'Nighthawk™ Adjustable Bench', price: 449.99, handle: 'rep-nighthawk-adjustable-bench' },
  blackwing: { name: 'BlackWing™ Adjustable Bench', price: 599.99, handle: 'blackwing-adjustable-bench' },

  // Bars
  delta: { name: 'Delta™ Basic Bar', price: 199.99, handle: 'delta-basic-bar' },
  blackDiamond: { name: 'Black Diamond™ Power Bar', price: 279.99, handle: 'black-diamond-power-bar' },
  colorado: { name: 'Colorado™ Bar (20kg)', price: 299.99, handle: 'colorado-bar-20kg' },

  // Plates (priced per pair)
  ironPlates: { name: 'Old School Iron Plates', price: 22.5, handle: 'old-school-iron-plate-pairs', perPair: true },
  bumperPlates: { name: 'Black Bumper Plates', price: 69.99, handle: 'black-bumper-plate-pairs', perPair: true },
  compBumpers: { name: 'Competition Bumper Plates', price: 189.99, handle: 'competition-bumper-plate-pairs-lb', perPair: true },

  // Dumbbells and kettlebells
  quickdraw: { name: 'QuickDraw™ Adjustable Dumbbells', price: 335.99, handle: 'quickdraw-adjustable-dumbbell-lb' },
  pepin: { name: 'REP® x PÉPIN™ FAST Series™ Adjustable Dumbbells', price: 899.99, handle: 'rep-x-pepin-fast-series-adjustable-dumbbell' },
  dbStand: { name: 'Adjustable Dumbbell Stand', price: 299.99, handle: 'rep-adjustable-dumbbell-stand' },
  adjKettlebell: { name: 'Adjustable Kettlebell', price: 149.99, handle: 'adjustable-kettlebells' },

  // Cable add-ons
  performancePack: { name: 'Cable Attachment Performance Package', price: 199.99, handle: 'performance-package' },

  // Cardio
  concept2: { name: 'Concept2 Row Erg', price: 1050, handle: 'concept2-row-erg' },

  // Storage
  plateTree: { name: 'Bar & Weight Plate Tree', price: 179.99, handle: 'bar-and-weight-plate-tree' },

  // Flooring
  rubberTiles: { name: 'Rubber Floor Tiles', price: 69.99, handle: 'rubber-floor-tiles', perUnit: 'tile' },
  floorMat: { name: "4'x6' Floor Mat", price: 76.99, handle: '4x6-floor-mats' },
}

export const PACKAGES = {
  trailhead: { name: 'Trailhead Home Gym Package', price: 379.99, handle: 'trailhead-home-gym-package', blurb: 'PR-1100 rack, bench, Delta bar and your choice of plates' },
  essentials: { name: 'Home Gym Essentials Package', price: 1969.91, handle: 'home-gym-essentials-package', blurb: 'PR-5000 rack, adjustable bench, adjustable dumbbells, bar, plates and accessories' },
  compact: { name: 'Compact Home Gym Package', price: 2889.92, handle: 'compact-home-gym-package', blurb: 'Wall-mounted Athena or Ares 2.0 with bench, dumbbells, bar and plates; sits under 3 ft from the wall' },
  ultimate: { name: 'Ares™ 2.0 Ultimate Home Gym Package', price: 4969.9, handle: 'ares-2-0-ultimate-home-gym-package', blurb: 'PR-5000 with Ares 2.0 cables, bench, dumbbells, bar, plates and attachments' },
  minimalist: { name: 'Minimalist Home Gym Package', price: null, handle: 'minimalist-package', blurb: 'Adjustable bench, adjustable dumbbells and an adjustable kettlebell. No rack needed' },
}

export const productUrl = (handle) => STORE + handle

export const formatPrice = (n) => {
  const cents = Math.round(n * 100) % 100 !== 0
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: 2 })
}

// ---------------------------------------------------------------------------
// Questions
// ---------------------------------------------------------------------------

export const QUESTIONS = [
  {
    id: 'budget',
    prompt: "Let's build your home gym. What's your total budget?",
    hint: 'Pick one or type an amount, like $1,800.',
    options: [
      { label: 'Under $1,000', value: 1000 },
      { label: '$1,000 – $2,500', value: 2500 },
      { label: '$2,500 – $5,000', value: 5000 },
      { label: '$5,000+', value: 8000 },
    ],
  },
  {
    id: 'space',
    prompt: 'Where is the gym going?',
    options: [
      { label: 'Apartment / small room', value: 'small' },
      { label: 'Garage bay', value: 'garage' },
      { label: 'Basement', value: 'basement' },
      { label: 'Large dedicated space', value: 'large' },
    ],
  },
  {
    id: 'ceiling',
    prompt: 'How tall is the ceiling? This decides which racks fit and whether overhead pressing and pull-ups work.',
    options: [
      { label: 'Under 7 ft', value: 'low' },
      { label: '7 – 8 ft', value: 'mid' },
      { label: 'Over 8 ft', value: 'high' },
      { label: 'Not sure', value: 'mid' },
    ],
  },
  {
    id: 'floor',
    prompt: 'What floor are you working with?',
    options: [
      { label: 'Concrete', value: 'concrete' },
      { label: 'Hardwood / finished', value: 'finished' },
      { label: 'Carpet', value: 'carpet' },
      { label: 'Already have gym flooring', value: 'covered' },
    ],
  },
  {
    id: 'experience',
    prompt: 'How long have you been lifting?',
    options: [
      { label: 'Just starting', value: 'beginner' },
      { label: '1 – 3 years', value: 'intermediate' },
      { label: '3+ years', value: 'advanced' },
    ],
  },
  {
    id: 'goal',
    prompt: "What's your main training goal?",
    options: [
      { label: 'Strength / Powerlifting', value: 'strength' },
      { label: 'Muscle building', value: 'muscle' },
      { label: 'General fitness', value: 'general' },
      { label: 'Functional / Hybrid', value: 'functional' },
      { label: 'Olympic lifting', value: 'olympic' },
    ],
  },
  {
    id: 'mustHaves',
    prompt: 'What does the gym need? Pick all that apply, then tap Done.',
    multi: true,
    options: [
      { label: 'Rack & barbell', value: 'rack' },
      { label: 'Dumbbells', value: 'dumbbells' },
      { label: 'Cable machine', value: 'cable' },
      { label: 'Cardio', value: 'cardio' },
      { label: 'Storage', value: 'storage' },
    ],
  },
  {
    id: 'color',
    prompt: 'Last one: any color preference for the rack?',
    options: [
      { label: 'Metallic Black', value: 'Metallic Black' },
      { label: 'Matte Black', value: 'Matte Black' },
      { label: 'Red', value: 'Red' },
      { label: 'Blue', value: 'Blue' },
      { label: 'White', value: 'White' },
      { label: 'No preference', value: null },
    ],
  },
]

// ---------------------------------------------------------------------------
// Free-text parsing
// ---------------------------------------------------------------------------

// Handles "$1,800", "1800", "1.5k", "2k", "1000-2500" (takes the top of a range).
export function parseBudget(text) {
  const matches = [...text.toLowerCase().replace(/,/g, '').matchAll(/(\d+(?:\.\d+)?)\s*(k)?/g)]
  if (!matches.length) return null
  const values = matches.map(m => parseFloat(m[1]) * (m[2] ? 1000 : 1))
  const top = Math.max(...values)
  return top > 0 ? Math.round(top) : null
}

const KEYWORDS = {
  space: { small: ['apartment', 'small', 'room', 'condo', 'bedroom', 'office'], garage: ['garage'], basement: ['basement'], large: ['large', 'dedicated', 'barn', 'shed', 'big'] },
  ceiling: { low: ['under 7', 'low', 'short', '6'], high: ['over 8', 'high', 'tall', '9', '10', '12'], mid: ['7', '8', 'sure', 'normal', 'standard'] },
  floor: { concrete: ['concrete', 'cement', 'slab'], finished: ['hardwood', 'wood', 'finished', 'tile', 'laminate', 'vinyl'], carpet: ['carpet'], covered: ['already', 'mats', 'rubber', 'gym floor'] },
  experience: { beginner: ['beginner', 'new', 'start', 'never', 'just'], advanced: ['advanced', '3', '4', '5', '6', '7', '8', '9', '10', '20', 'decade', 'competitive', 'long time'], intermediate: ['intermediate', '1', '2', 'year', 'some'] },
  goal: { strength: ['strength', 'power', 'strong'], muscle: ['muscle', 'bodybuild', 'hypertrophy', 'size'], general: ['general', 'health', 'fitness', 'lose', 'weight loss', 'tone'], functional: ['functional', 'hybrid', 'crossfit', 'conditioning', 'athletic'], olympic: ['olympic', 'snatch', 'clean', 'weightlifting'] },
  mustHaves: { rack: ['rack', 'barbell', 'bar', 'squat', 'bench press'], dumbbells: ['dumbbell', 'db'], cable: ['cable', 'pulley', 'lat', 'functional trainer'], cardio: ['cardio', 'row', 'bike', 'treadmill', 'erg'], storage: ['storage', 'organize', 'tree', 'shelf'] },
  color: { 'Metallic Black': ['metallic'], 'Matte Black': ['matte', 'black'], Red: ['red'], Blue: ['blue'], White: ['white'], none: ['no', 'any', 'none', "don't", 'whatever'] },
}

// Returns an answer value for a question from free text, or undefined if unclear.
export function parseAnswer(question, text) {
  const t = text.toLowerCase()
  if (question.id === 'budget') return parseBudget(text) ?? undefined

  // Exact chip label match first.
  const exact = question.options.find(o => o.label.toLowerCase() === t)
  if (exact) return question.multi ? [exact.value] : exact.value

  const map = KEYWORDS[question.id]
  if (!map) return undefined

  if (question.multi) {
    const picked = Object.keys(map).filter(k => map[k].some(w => t.includes(w)))
    return picked.length ? picked : undefined
  }

  for (const [value, words] of Object.entries(map)) {
    if (words.some(w => t.includes(w))) return value === 'none' ? null : value
  }
  return undefined
}

// ---------------------------------------------------------------------------
// Budget trimming: cheaper swaps first, then optional extras, in this order.
// ---------------------------------------------------------------------------

const DOWNGRADES = [
  { from: 'dbStand', to: null, says: 'dropped the dumbbell stand' },
  { from: 'pepin', to: 'quickdraw', says: 'swapped to QuickDraw dumbbells' },
  { from: 'blackwing', to: 'nighthawk', says: 'chose the Nighthawk bench' },
  { from: 'nighthawk', to: 'ab3100', says: 'chose the AB-3100 bench' },
  { from: 'fb5000', to: 'fb3000', says: 'chose the FB-3000 flat bench' },
  { from: 'ab3100', to: 'fb3000', says: 'chose the FB-3000 flat bench' },
  { from: 'plateTree', to: null, says: 'left storage for later' },
  { from: 'adjKettlebell', to: null, says: 'left the kettlebell for later' },
  { from: 'performancePack', to: null, says: 'left cable attachments for later' },
  { from: 'rubberTiles', to: null, says: 'left flooring for later' },
  { from: 'floorMat', to: null, says: 'left flooring for later' },
  { from: 'colorado', to: 'delta', says: 'chose the Delta bar' },
  { from: 'blackDiamond', to: 'delta', says: 'chose the Delta bar' },
]

const itemsTotal = (items) => items.reduce((sum, i) => sum + (i.perPair ? 0 : i.price * i.qty), 0)

function trimToBudget(items, budget) {
  const changes = []
  for (const d of DOWNGRADES) {
    if (itemsTotal(items) <= budget) break
    const idx = items.findIndex(i => i.key === d.from)
    if (idx === -1) continue
    if (d.to) {
      items[idx] = { ...PRODUCTS[d.to], key: d.to, note: defaultNote(d.to), qty: items[idx].qty }
    } else {
      items.splice(idx, 1)
    }
    if (!changes.includes(d.says)) changes.push(d.says)
  }
  return changes
}

function defaultNote(key) {
  return {
    quickdraw: 'Up to 60 lb per hand in one compact pair',
    nighthawk: 'Adjustable bench with 7 back angles',
    ab3100: 'Flat and incline in one affordable bench',
    fb3000: 'Sturdy flat bench that keeps budget for the bar',
    delta: 'Mixed-use bar that handles both powerlifting and general training',
  }[key] ?? ''
}

// ---------------------------------------------------------------------------
// Build recommendation
// ---------------------------------------------------------------------------

const line = (key, note, qty = 1) => ({ ...PRODUCTS[key], key, note, qty })

export function buildGym(a) {
  const budget = a.budget
  const needs = new Set(a.mustHaves?.length ? a.mustHaves : ['rack'])
  const small = a.space === 'small'
  const lowCeiling = a.ceiling === 'low'
  const items = []
  const tips = []
  let pkg = null

  // ---- Rack / cable system -------------------------------------------------
  if (needs.has('rack') || needs.has('cable')) {
    if (needs.has('cable') && budget >= 5000 && !small && !lowCeiling) {
      items.push(line('pr5000', 'Full power rack, the base for the Ares system'))
      items.push(line('ares', 'Adds lat pulldown, low row and dual cables to the rack'))
      pkg = PACKAGES.ultimate
    } else if (needs.has('cable') && budget >= 2500) {
      items.push(line('athenaWall', 'Wall-mounted rack with dual cables that sits close to the wall'))
      pkg = PACKAGES.compact
    } else if (needs.has('cable')) {
      items.push(line('altitude', 'Power rack built to take cable attachments as you grow'))
      tips.push('A full cable system starts around $2,475, so the Altitude lets you start with the rack and add cables later.')
    } else if (small || lowCeiling) {
      items.push(line('pr4100', 'Folds flat against the wall when you are done'))
      tips.push('The PR-4100 mounts to wall studs, so confirm you can anchor into framing before ordering.')
    } else if (budget < 1500) {
      items.push(line('pr1100', 'Entry-level power rack with plenty of capacity to grow into'))
      pkg = PACKAGES.trailhead
    } else if (budget < 3000) {
      items.push(line('pr4000', 'Great-value rack with a deep attachment ecosystem'))
    } else {
      items.push(line('pr5000', 'Flagship 3x3 rack you will never outgrow'))
      pkg = PACKAGES.essentials
    }
    if (needs.has('cable') && !items.some(i => i.key === 'altitude')) {
      items.push(line('performancePack', 'Handles and bars to get the most out of your cables'))
    }
  } else if (needs.has('dumbbells')) {
    pkg = PACKAGES.minimalist
  }

  // ---- Bench ----------------------------------------------------------------
  let bench
  if (a.goal === 'strength' && budget >= 1500) bench = line('fb5000', 'Competition-spec flat bench for heavy pressing')
  else if (budget < 1500) bench = a.goal === 'strength' ? line('fb3000', 'Sturdy flat bench that keeps budget for the bar') : line('ab3100', 'Flat and incline in one affordable bench')
  else if (budget < 4000) bench = line('nighthawk', 'Adjustable bench with 7 back angles')
  else bench = line('blackwing', 'Premium adjustable bench with 12 back angles')
  items.push(bench)

  // ---- Bar and plates -------------------------------------------------------
  if (needs.has('rack') || needs.has('cable')) {
    if (budget < 1500) items.push(line('delta', 'Mixed-use bar that handles both powerlifting and general training'))
    else if (a.goal === 'strength') items.push(line('blackDiamond', 'Stiff, aggressive-knurl power bar for heavy squats, bench and deadlifts'))
    else items.push(line('colorado', 'Mixed-use bar with spin for cleans and grip for heavy pulls'))

    const dropping = a.goal === 'olympic' || a.goal === 'functional' || a.floor === 'finished'
    if (a.goal === 'olympic' && budget >= 5000) items.push(line('compBumpers', 'Competition plates for Olympic lifting'))
    else if (dropping) items.push(line('bumperPlates', 'Bumpers protect the bar and floor when you drop lifts'))
    else items.push(line('ironPlates', 'Thin iron plates fit more weight on the bar for less money'))
  }

  // ---- Dumbbells ------------------------------------------------------------
  if (needs.has('dumbbells') || small) {
    if (budget >= 4000 || (a.experience === 'advanced' && budget >= 2500)) {
      items.push(line('pepin', 'Up to 125 lb per hand and fast to change'))
      items.push(line('dbStand', 'Keeps the dumbbells at grab height'))
    } else {
      items.push(line('quickdraw', 'Up to 60 lb per hand in one compact pair'))
    }
    if (small && !needs.has('rack')) items.push(line('adjKettlebell', 'Swings, carries and conditioning in one bell'))
  }

  // ---- Cardio, storage, flooring -------------------------------------------
  if (needs.has('cardio')) items.push(line('concept2', 'The gold-standard rower for full-body conditioning'))
  if (needs.has('storage') && (needs.has('rack') || needs.has('cable'))) items.push(line('plateTree', 'Keeps plates and bars off the floor'))

  if (a.floor === 'concrete') {
    items.push(line('rubberTiles', 'Protects plates and concrete, and deadens noise', 6))
  } else if (a.floor === 'finished' || a.floor === 'carpet') {
    items.push(line('floorMat', 'A stable, protective base under the rack and bench', 2))
  }

  // ---- Stay inside the budget ----------------------------------------------
  const trimmed = trimToBudget(items, budget)
  if (trimmed.length) tips.unshift(`To stay close to your budget I ${trimmed.join(', ')}.`)

  // ---- Fit-specific tips ----------------------------------------------------
  const hasRack = items.some(i => i.colors !== undefined)
  if (lowCeiling) {
    tips.push('With a ceiling under 7 ft, plan for seated overhead pressing and skip a tall pull-up bar.')
    if (hasRack && !items.some(i => i.key === 'pr4100')) tips.push('Check the rack height on the product page against your ceiling before ordering.')
  }
  if (items.some(i => i.key === 'rubberTiles')) tips.push('Six tiles covers a typical lifting area. Add more to cover the full footprint.')
  if (a.ceiling === 'mid' && items.some(i => i.key === 'pr5000')) tips.push('Choose the shorter 81" PR-5000 height for a 7 to 8 ft ceiling.')
  if (a.experience === 'beginner' && items.some(i => i.perPair)) tips.push('Start with a few plate pairs and add more as you progress. Strap safeties make solo training safer.')

  // ---- Color ---------------------------------------------------------------
  const rack = items.find(i => i.colors !== undefined)
  if (rack && a.color) {
    if (rack.colors?.includes(a.color)) rack.note += `. Shown in ${a.color}`
    else tips.push(`The ${rack.name} doesn't come in ${a.color}, so it will ship in its standard finish.`)
  }

  // ---- Totals ---------------------------------------------------------------
  const total = itemsTotal(items)
  const plateLine = items.find(i => i.perPair)
  const remaining = budget - total

  return { items, tips, pkg, total, remaining, plateLine, budget }
}
