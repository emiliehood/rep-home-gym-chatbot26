// Market configuration for the REP Home Gym Builder.
// Prices and handles were pulled from each REP storefront's Shopify product
// JSON (repfitness.com, uk.repfitness.com, de.repfitness.com) in October 2026.
// A product that is missing or sold out in a market is simply left out, so the
// builder only ever recommends what that store can sell.

export const MARKETS = {
  us: {
    code: 'us',
    label: 'US',
    name: 'United States',
    lang: 'en',
    locale: 'en-US',
    currency: 'USD',
    store: 'https://repfitness.com',
    units: 'imperial',
    parity: 1, // local price level vs. US, used to scale budget thresholds
  },
  uk: {
    code: 'uk',
    label: 'UK',
    name: 'United Kingdom',
    lang: 'en-GB',
    locale: 'en-GB',
    currency: 'GBP',
    store: 'https://uk.repfitness.com',
    units: 'metric',
    parity: 0.93,
  },
  de: {
    code: 'de',
    label: 'DE',
    name: 'Deutschland',
    lang: 'de',
    locale: 'de-DE',
    currency: 'EUR',
    store: 'https://de.repfitness.com',
    units: 'metric',
    parity: 1.15,
  },
}

// Product names are REP's own and stay untranslated across markets.
export const PRODUCT_NAMES = {
  pr1100: 'PR-1100 Power Rack',
  pr4000: 'PR-4000 Rack Builder',
  pr5000: 'PR-5000 Rack Builder',
  pr4100: 'PR-4100 Folding Squat Rack',
  wallFixed: 'Wall-Mount Fixed Rack Builder',
  altitude: 'Altitude™ Power Rack',
  athenaWall: 'Athena® Wall-Mounted Builder',
  ares: 'Ares™ 2.0 Builder',
  altitudeCable: 'Altitude™ Cable Attachment',
  summitAthena: 'Summit™ All-In-One Trainer with Athena™',
  fb3000: 'FB-3000 Flat Bench',
  fb5000: 'FB-5000 Competition Flat Bench',
  ab3100: 'AB-3100 Adjustable Bench',
  nighthawk: 'Nighthawk™ Adjustable Bench',
  blackwing: 'BlackWing™ Adjustable Bench',
  delta: 'Delta™ Basic Bar',
  blackDiamond: 'Black Diamond™ Power Bar',
  colorado: 'Colorado™ Bar (20kg)',
  ironPlates: 'Old School Iron Plates',
  bumperPlates: 'Black Bumper Plates',
  compBumpers: 'Competition Bumper Plates',
  quickdraw: 'QuickDraw™ Adjustable Dumbbells',
  pepin: 'REP® x PÉPIN™ FAST Series™ Adjustable Dumbbells',
  dbStand: 'Adjustable Dumbbell Stand',
  adjKettlebell: 'Adjustable Kettlebell',
  performancePack: 'Cable Attachment Performance Package',
  concept2: 'Concept2 Row Erg',
  plateTree: 'Bar & Weight Plate Tree',
  rubberTiles: 'Rubber Floor Tiles',
  floorMat: "4'x6' Floor Mat",
}

// [price, handle] per market. Absent key = not sold or sold out in that store.
export const PRICES = {
  us: {
    pr1100: [379.99, 'pr-1100-power-rack'],
    pr4000: [799.94, 'pr-4000-rack-builder'],
    pr5000: [899.99, 'pr-5000-rack-builder'],
    pr4100: [499.99, 'pr-4100-folding-wall-mount-squat-power-rack'],
    wallFixed: [514.99, 'wall-mount-fixed-rack'],
    altitude: [899.99, 'altitude-power-rack'],
    athenaWall: [2474.99, 'wall-mounted-athena'],
    ares: [2999.99, 'ares-2-0-builder'],
    altitudeCable: [2209.99, 'altitude-rack-cable-attachment'],
    summitAthena: [4444.88, 'summit-all-in-one-athena'],
    fb3000: [149.99, 'fb-3000-flat-bench'],
    fb5000: [244.99, 'fb-5000-competition-flat-bench'],
    ab3100: [269.99, 'ab-3100-adjustable-weight-bench'],
    nighthawk: [449.99, 'rep-nighthawk-adjustable-bench'],
    blackwing: [599.99, 'blackwing-adjustable-bench'],
    delta: [199.99, 'delta-basic-bar'],
    blackDiamond: [279.99, 'black-diamond-power-bar'],
    colorado: [299.99, 'colorado-bar-20kg'],
    ironPlates: [22.5, 'old-school-iron-plate-pairs'],
    bumperPlates: [69.99, 'black-bumper-plate-pairs'],
    compBumpers: [189.99, 'competition-bumper-plate-pairs-lb'],
    quickdraw: [335.99, 'quickdraw-adjustable-dumbbell-lb'],
    pepin: [899.99, 'rep-x-pepin-fast-series-adjustable-dumbbell'],
    dbStand: [299.99, 'rep-adjustable-dumbbell-stand'],
    adjKettlebell: [149.99, 'adjustable-kettlebells'],
    performancePack: [199.99, 'performance-package'],
    concept2: [1050, 'concept2-row-erg'],
    plateTree: [179.99, 'bar-and-weight-plate-tree'],
    rubberTiles: [69.99, 'rubber-floor-tiles'],
    floorMat: [76.99, '4x6-floor-mats'],
  },
  uk: {
    pr1100: [349.99, 'pr-1100-power-rack'],
    pr5000: [900, 'pr-5000-rack-builder'],
    wallFixed: [454.97, 'wall-mount-fixed-rack'],
    altitude: [799.99, 'altitude-power-rack'],
    ares: [2749.99, 'ares-2-0-builder'],
    altitudeCable: [1999.99, 'altitude-rack-cable-attachment'],
    summitAthena: [4499.64, 'summit-all-in-one-athena'],
    fb3000: [139.99, 'fb-3000-flat-bench'],
    fb5000: [224.98, 'fb-5000-competition-flat-bench'],
    ab3100: [249.99, 'ab-3100-adjustable-weight-bench'],
    nighthawk: [414.99, 'rep-nighthawk-adjustable-bench'],
    blackwing: [554.98, 'blackwing™-adjustable-bench'],
    delta: [184.99, 'delta™-basic-bar'],
    blackDiamond: [269.99, 'black-diamond™-power-bar'],
    colorado: [233.74, 'colorado-bar-20kg'],
    ironPlates: [19.99, 'old-school-iron-plate-pairs'],
    bumperPlates: [49.99, 'black-bumper-plates-kg'],
    compBumpers: [179.98, 'competition-bumper-plates-kg'],
    quickdraw: [309.98, 'quickdraw-adjustable-dumbbell-kg'],
    pepin: [899, 'rep-x-pepin-fast-series-adjustable-dumbbell'],
    dbStand: [274.99, 'rep-adjustable-dumbbell-stand'],
    adjKettlebell: [139.99, 'adjustable-kettlebells'],
    plateTree: [154.99, 'bar-and-weight-plate-tree'],
  },
  de: {
    pr1100: [414.99, 'pr-1100-power-rack'],
    pr5000: [1069.91, 'pr-5000-rack-builder'],
    wallFixed: [537.26, 'wall-mount-fixed-rack'],
    altitude: [921.06, 'altitude-power-rack'],
    athenaWall: [2723.71, 'wall-mounted-athena'],
    ares: [3354, 'ares-2-0-builder'],
    altitudeCable: [2404.97, 'altitude-rack-cable-attachment'],
    summitAthena: [4907.56, 'summit-all-in-one-athena'],
    fb3000: [164.99, 'fb-3000-flat-bench'],
    fb5000: [284.98, 'fb-5000-competition-flat-bench'],
    ab3100: [299.99, 'ab-3100-adjustable-weight-bench'],
    nighthawk: [499.99, 'rep-nighthawk-adjustable-bench'],
    blackwing: [654.98, 'blackwing-adjustable-bench'],
    delta: [219.98, 'delta-basic-bar'],
    blackDiamond: [314.99, 'black-diamond-power-bar'],
    colorado: [324.99, 'colorado-bar-20kg'],
    bumperPlates: [79.99, 'black-bumper-plates-kg'],
    compBumpers: [209.99, 'competition-bumper-plate-pairs-kg'],
    quickdraw: [349.98, 'quickdraw-adjustable-dumbbell-kg'],
    pepin: [1089.97, 'pepin-adjustable-dumbbell'],
    dbStand: [324.99, 'rep-r-adjustable-dumbbell-stand'],
    adjKettlebell: [164.99, 'adjustable-kettlebells'],
    performancePack: [204.95, 'performance-package'],
    plateTree: [184.99, 'bar-and-weight-plate-tree'],
  },
}

// Bundles each store actually sells, keyed by the role they play in a build.
export const PACKAGES = {
  us: {
    trailhead: { name: 'Trailhead Home Gym Package', price: 379.99, handle: 'trailhead-home-gym-package', blurb: 'trailhead' },
    essentials: { name: 'Home Gym Essentials Package', price: 1969.91, handle: 'home-gym-essentials-package', blurb: 'essentials' },
    compact: { name: 'Compact Home Gym Package', price: 2889.92, handle: 'compact-home-gym-package', blurb: 'compact' },
    ultimate: { name: 'Ares™ 2.0 Ultimate Home Gym Package', price: 4969.9, handle: 'ares-2-0-ultimate-home-gym-package', blurb: 'ultimate' },
    minimalist: { name: 'Minimalist Home Gym Package', price: null, handle: 'minimalist-package', blurb: 'minimalist' },
  },
  uk: {
    minimalist: { name: 'Small Gym Home Package', price: 1049.95, handle: 'small-gym-home-package', blurb: 'small' },
    garage: { name: 'Home Gym Garage Package', price: 2294.87, handle: 'home-gym-garage-package', blurb: 'garage' },
  },
  de: {
    minimalist: { name: 'Small Gym Home Package', price: 712.81, handle: 'small-gym-home-package', blurb: 'small' },
    garage: { name: 'Home Gym Garage Package', price: 2049.93, handle: 'home-gym-garage-package', blurb: 'garage' },
  },
}

// Rack finishes as listed on repfitness.com. Racks not listed here have no
// finish choice.
export const RACK_COLORS = {
  pr1100: ['Metallic Black', 'Matte Black', 'Red', 'Blue'],
  pr4000: ['Metallic Black', 'Matte Black', 'Red', 'Blue', 'White', 'Clear Coat'],
  pr5000: ['Metallic Black', 'Matte Black', 'Red', 'Blue', 'White', 'Clear Coat'],
  wallFixed: ['Metallic Black', 'Matte Black', 'Red', 'Blue', 'White', 'Clear Coat'],
  altitude: ['Metallic Black', 'Matte Black', 'Red', 'Blue', 'White'],
}

export const RACK_KEYS = ['pr1100', 'pr4000', 'pr5000', 'pr4100', 'wallFixed', 'altitude', 'athenaWall', 'summitAthena']

export const productUrl = (market, handle) => `${MARKETS[market].store}/products/${encodeURIComponent(handle)}`

export function formatPrice(n, market) {
  const m = MARKETS[market]
  const cents = Math.round(n * 100) % 100 !== 0
  return new Intl.NumberFormat(m.locale, {
    style: 'currency',
    currency: m.currency,
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(n)
}
