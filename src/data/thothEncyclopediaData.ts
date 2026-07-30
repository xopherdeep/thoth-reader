export interface NumerologyEntry {
  number: string;
  title: string;
  sephira: string;
  elementOrPlanet: string;
  concept: string;
  crowleyInsight: string;
  tarotMapping: string;
  alchemicalAspect: string;
}

export interface AstrologyDecanEntry {
  decan: string;
  zodiacSign: string;
  dates: string;
  rulingPlanet: string;
  cardName: string;
  thothTitle: string;
  element: string;
  esotericMeaning: string;
}

export interface AlchemyFormulaEntry {
  name: string;
  latinName?: string;
  phase: string;
  symbolism: string;
  associatedCards: string[];
  magicalOperation: string;
}

export interface CrowleyEssaySection {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  keyPassages: string[];
  philosophicalDepth: string;
}

export interface SephiraEntry {
  number: number;
  name: string;
  hebrewName: string;
  englishTranslation: string;
  pillar: 'Middle (Equilibrium)' | 'Right (Mercy / Force)' | 'Left (Severity / Form)' | 'Hidden';
  world: string;
  divineName: string;
  archangel: string;
  planetarySphere: string;
  colorScale: string;
  spiritualExperience: string;
  tarotCards: string[];
  description: string;
  crowleyNote: string;
}

export interface PathEntry {
  pathNumber: number;
  hebrewLetter: string;
  hebrewName: string;
  letterMeaning: string;
  numericalValue: number;
  connectedSephirot: string; // e.g., "Kether (1) ↔ Chokmah (2)"
  cardName: string;
  atuNumber: number;
  astrologyOrElement: string;
  crowleyKeyInsight: string;
}

export interface QabalisticWorldEntry {
  name: string;
  hebrewName: string;
  translation: string;
  element: string;
  tetragrammatonLetter: string;
  courtAgency: string;
  tarotSuit: string;
  description: string;
}

export interface EsotericFormulaEntry {
  formula: string;
  meaning: string;
  origin: string;
  symbolism: string;
  tarotAssociations: string[];
  magicalFunction: string;
}

export const SEPHIROT_DATA: SephiraEntry[] = [
  {
    number: 1,
    name: 'Kether',
    hebrewName: 'כתר',
    englishTranslation: 'The Crown',
    pillar: 'Middle (Equilibrium)',
    world: 'Atziluth (Archetypal)',
    divineName: 'Eheieh (I Am That I Am)',
    archangel: 'Metatron',
    planetarySphere: 'Rashith ha-Gilgalim (Primum Mobile / First Swirlings)',
    colorScale: 'Brilliant White Brilliance',
    spiritualExperience: 'Union with God / Absolute Illumination',
    tarotCards: ['Ace of Wands', 'Ace of Cups', 'Ace of Swords', 'Ace of Disks'],
    description:
      'Kether is the first manifestation from Ain Soph Aur (Limitless Light). It is the unconditioned Monad, the divine point before space-time differentiation.',
    crowleyNote:
      'In the Thoth deck, the Four Aces represent the pure roots of the elemental forces residing in Kether, uncorrupted by material conflict.'
  },
  {
    number: 2,
    name: 'Chokmah',
    hebrewName: 'חכמה',
    englishTranslation: 'Wisdom',
    pillar: 'Right (Mercy / Force)',
    world: 'Atziluth / Briah',
    divineName: 'Yah (Lord)',
    archangel: 'Raziel (Herald of Deity)',
    planetarySphere: 'Mazloth (Sphere of the Zodiac / Fixed Stars)',
    colorScale: 'Pure Soft Blue / Pearl Grey',
    spiritualExperience: 'The Vision of God Face to Face',
    tarotCards: ['2 of Wands (Dominion)', '2 of Cups (Love)', '2 of Swords (Peace)', '2 of Disks (Change)', 'The Four Knights'],
    description:
      'Chokmah is the Great Father (Abba), the dynamic male impulse of creation. It represents kinetic energy, wisdom, and the initial expansion of divine will.',
    crowleyNote:
      'Chokmah gives birth to the Four Knights of the Tarot, who ride dynamic steeds as pure elemental fire initiating action.'
  },
  {
    number: 3,
    name: 'Binah',
    hebrewName: 'בינה',
    englishTranslation: 'Understanding',
    pillar: 'Left (Severity / Form)',
    world: 'Briah (Creative)',
    divineName: 'YHVH Elohim (Lord God of Hosts)',
    archangel: 'Tzaphkiel (Watcher of God)',
    planetarySphere: 'Shabbathai (Saturn)',
    colorScale: 'Crimson / Dark Brown / Black',
    spiritualExperience: 'The Vision of Sorrow / Understanding of Karma',
    tarotCards: ['3 of Wands (Virtue)', '3 of Cups (Abundance)', '3 of Swords (Sorrow)', '3 of Disks (Works)', 'The Four Queens'],
    description:
      'Binah is the Great Mother (Aimah / Marah), the womb of form that receives the kinetic thrust of Chokmah and gives structure to the universe.',
    crowleyNote:
      'Binah sits above the Abyss. The Four Queens sit upon thrones as receptive Water, cradling and nourishing the elemental seeds.'
  },
  {
    number: 0,
    name: "Da'ath",
    hebrewName: 'דעת',
    englishTranslation: 'Knowledge (The Hidden Sephira)',
    pillar: 'Middle (Equilibrium)',
    world: 'The Abyss / Portal between Supernals & Lower Sephirot',
    divineName: 'YHVH Elohim (Reflected)',
    archangel: 'Metatron / Sandalphon Dual Portal',
    planetarySphere: 'Sirius / Pluto / The Void',
    colorScale: 'Deep Lavender / Iridescent Grey',
    spiritualExperience: 'Crossing the Abyss / Dissolution of Ego',
    tarotCards: ['Atu 0 - The Fool', 'Atu II - The Priestess', 'Atu XIV - The Art'],
    description:
      'Da’ath is not a standard Sephira, but the invisible dimension born of the union between Chokmah and Binah. It represents the Abyss where intellect becomes direct intuitive knowledge.',
    crowleyNote:
      'To cross Da’ath, the magician must surrender the false ego to Choronzon (the demon of dispersion). Only the True Will remains untouched.'
  },
  {
    number: 4,
    name: 'Chesed',
    hebrewName: 'חסד',
    englishTranslation: 'Mercy / Majesty',
    pillar: 'Right (Mercy / Force)',
    world: 'Briah / Yetzirah',
    divineName: 'El (The Mighty God)',
    archangel: 'Tzadkiel (Righteousness of God)',
    planetarySphere: 'Tzedek (Jupiter)',
    colorScale: 'Deep Violet / Royal Blue',
    spiritualExperience: 'The Vision of Love & Benevolent Rule',
    tarotCards: ['4 of Wands (Completion)', '4 of Cups (Luxury)', '4 of Swords (Truce)', '4 of Disks (Power)'],
    description:
      'Chesed is the realm of organized order, expansive grace, and constitutional law. It is the solid, benevolent king consolidating the universe.',
    crowleyNote:
      'Chesed establishes stability. In Wands it manifests as architectural completion; in Disks as material security and sovereign power.'
  },
  {
    number: 5,
    name: 'Geburah',
    hebrewName: 'גבורה',
    englishTranslation: 'Severity / Strength',
    pillar: 'Left (Severity / Form)',
    world: 'Yetzirah (Formative)',
    divineName: 'Elohim Gibor (God of Might)',
    archangel: 'Kamael (Burner of God)',
    planetarySphere: 'Madim (Mars)',
    colorScale: 'Bright Scarlet / Fire Red',
    spiritualExperience: 'The Vision of Power & Purifying Fire',
    tarotCards: ['5 of Wands (Strife)', '5 of Cups (Disappointment)', '5 of Swords (Defeat)', '5 of Disks (Worry)'],
    description:
      'Geburah supplies the necessary martial force to break stagnant forms. It burns away illusions, decay, and complacency through severe purification.',
    crowleyNote:
      'Without Geburah, Chesed would decay into decadent laziness. The Fives force evolution through friction and crisis.'
  },
  {
    number: 6,
    name: 'Tiphareth',
    hebrewName: 'תפארת',
    englishTranslation: 'Beauty / Harmony',
    pillar: 'Middle (Equilibrium)',
    world: 'Yetzirah (Formative)',
    divineName: 'YHVH Eloah va-Da’ath',
    archangel: 'Raphael (Healing of God)',
    planetarySphere: 'Shemesh (The Sun)',
    colorScale: 'Clear Amber Gold / Rich Yellow',
    spiritualExperience: 'Knowledge & Conversation of the Holy Guardian Angel',
    tarotCards: ['6 of Wands (Victory)', '6 of Cups (Pleasure)', '6 of Swords (Science)', '6 of Disks (Success)', 'The Four Princes'],
    description:
      'Tiphareth is the solar heart of the Tree of Life. It connects all Sephirot (except Malkuth directly) and represents central balance, christic energy, and harmony.',
    crowleyNote:
      'The Four Princes ride in chariots as intellectual Air, governed by the solar light of Tiphareth to carry execution to fulfillment.'
  },
  {
    number: 7,
    name: 'Netzach',
    hebrewName: 'נצח',
    englishTranslation: 'Victory / Endurance',
    pillar: 'Right (Mercy / Force)',
    world: 'Yetzirah / Assiah',
    divineName: 'YHVH Tzabaoth (Lord of Hosts)',
    archangel: 'Haniel (Grace of God)',
    planetarySphere: 'Nogah (Venus)',
    colorScale: 'Emerald Green',
    spiritualExperience: 'The Vision of Triumph & Eternal Beauty',
    tarotCards: ['7 of Wands (Valour)', '7 of Cups (Debauch)', '7 of Swords (Futility)', '7 of Disks (Failure)'],
    description:
      'Netzach governs instinct, raw emotion, artistic passion, and nature. Located below the Abyss, its unguided fire easily degenerates into illusion.',
    crowleyNote:
      'Sevens in the Thoth deck reflect emotional weakness when uncorrected by reason: Debauch in Cups, Futility in Swords, Failure in Disks.'
  },
  {
    number: 8,
    name: 'Hod',
    hebrewName: 'הוד',
    englishTranslation: 'Splendor / Glory',
    pillar: 'Left (Severity / Form)',
    world: 'Yetzirah / Assiah',
    divineName: 'Elohim Tzabaoth (Gods of Hosts)',
    archangel: 'Michael (Like unto God)',
    planetarySphere: 'Kokab (Mercury)',
    colorScale: 'Bright Orange / Vermilion',
    spiritualExperience: 'The Vision of Sacred Splendor & Hermetic Science',
    tarotCards: ['8 of Wands (Swiftness)', '8 of Cups (Indolence)', '8 of Swords (Interference)', '8 of Disks (Prudence)'],
    description:
      'Hod represents the rational intellect, magic, communication, and structural logic. It translates Netzach’s raw feelings into systemic form.',
    crowleyNote:
      'Eights reflect swift mercurial intelligence: electric velocity in 8 Wands (Swiftness), but over-analysis in 8 Swords (Interference).'
  },
  {
    number: 9,
    name: 'Yesod',
    hebrewName: 'יסוד',
    englishTranslation: 'Foundation',
    pillar: 'Middle (Equilibrium)',
    world: 'Assiah (Material / Astral)',
    divineName: 'Shaddai El Chai (Almighty Living God)',
    archangel: 'Gabriel (Hero of God)',
    planetarySphere: 'Levanah (The Moon)',
    colorScale: 'Deep Violet / Indigo / Silver',
    spiritualExperience: 'The Vision of the Machinery of the Universe',
    tarotCards: ['9 of Wands (Great Strength)', '9 of Cups (Happiness)', '9 of Swords (Cruelty)', '9 of Disks (Gain)'],
    description:
      'Yesod is the subconscious, sexual, and astral foundation holding the etheric mold before physical crystallization into Malkuth.',
    crowleyNote:
      'Nines represent immense subconscious power right before materialization: Great Strength in Wands, Happiness in Cups, Gain in Disks.'
  },
  {
    number: 10,
    name: 'Malkuth',
    hebrewName: 'מלכות',
    englishTranslation: 'Kingdom / Manifestation',
    pillar: 'Middle (Equilibrium)',
    world: 'Assiah (Material Universe)',
    divineName: 'Adonai ha-Aretz (Lord of the Earth)',
    archangel: 'Sandalphon',
    planetarySphere: 'Cholem ha-Yesodoth (Sphere of the Four Elements)',
    colorScale: 'Citrine, Olive, Russet, and Black',
    spiritualExperience: 'The Vision of the Holy Guardian Angel Face to Face in Matter',
    tarotCards: ['10 of Wands (Oppression)', '10 of Cups (Satiety)', '10 of Swords (Ruin)', '10 of Disks (Wealth)', 'The Four Princesses'],
    description:
      'Malkuth is the physical earth, the tangible manifestation of all nine superior Sephirot combined. It is the bride (Kallah) and ultimate vessel.',
    crowleyNote:
      'The Four Princesses stand on physical Earth. Tens represent the final exhaustion or complete perfection of elemental energy.'
  }
];

export const TREE_OF_LIFE_PATHS: PathEntry[] = [
  {
    pathNumber: 11,
    hebrewLetter: 'א',
    hebrewName: 'Aleph',
    letterMeaning: 'Ox',
    numericalValue: 1,
    connectedSephirot: 'Kether (1) ↔ Chokmah (2)',
    cardName: 'Atu 0 - The Fool',
    atuNumber: 0,
    astrologyOrElement: 'Air (Divine Breath)',
    crowleyKeyInsight: 'The Holy Ghost, Harpocrates, divine zero entering manifestation unconditioned.'
  },
  {
    pathNumber: 12,
    hebrewLetter: 'ב',
    hebrewName: 'Beth',
    letterMeaning: 'House',
    numericalValue: 2,
    connectedSephirot: 'Kether (1) ↔ Binah (3)',
    cardName: 'Atu I - The Magus',
    atuNumber: 1,
    astrologyOrElement: 'Mercury',
    crowleyKeyInsight: 'The communicator of truth and illusion, transmitting divine logos through the caduceus.'
  },
  {
    pathNumber: 13,
    hebrewLetter: 'ג',
    hebrewName: 'Gimel',
    letterMeaning: 'Camel',
    numericalValue: 3,
    connectedSephirot: 'Kether (1) ↔ Tiphareth (6)',
    cardName: 'Atu II - The Priestess',
    atuNumber: 2,
    astrologyOrElement: 'Moon',
    crowleyKeyInsight: 'The virgin veil spanning the Abyss, connecting the divine Crown directly to the Solar heart.'
  },
  {
    pathNumber: 14,
    hebrewLetter: 'ד',
    hebrewName: 'Daleth',
    letterMeaning: 'Door',
    numericalValue: 4,
    connectedSephirot: 'Chokmah (2) ↔ Binah (3)',
    cardName: 'Atu III - The Empress',
    atuNumber: 3,
    astrologyOrElement: 'Venus',
    crowleyKeyInsight: 'The horizontal bridge between Father and Mother; love, abundance, and organic creation.'
  },
  {
    pathNumber: 15,
    hebrewLetter: 'ה',
    hebrewName: 'Heh',
    letterMeaning: 'Window',
    numericalValue: 5,
    connectedSephirot: 'Chokmah (2) ↔ Tiphareth (6)',
    cardName: 'Atu IV - The Emperor',
    atuNumber: 4,
    astrologyOrElement: 'Aries (Fire)',
    crowleyKeyInsight: 'Crowley exchanged Star/Emperor paths: Heh is the Emperor, fiery sovereign order.'
  },
  {
    pathNumber: 16,
    hebrewLetter: 'ו',
    hebrewName: 'Vau',
    letterMeaning: 'Nail / Hook',
    numericalValue: 6,
    connectedSephirot: 'Chokmah (2) ↔ Chesed (4)',
    cardName: 'Atu V - The Hierophant',
    atuNumber: 5,
    astrologyOrElement: 'Taurus (Earth)',
    crowleyKeyInsight: 'Initiator into sacred mysteries, holding the pentagram hexagram wand of Horus.'
  },
  {
    pathNumber: 17,
    hebrewLetter: 'ז',
    hebrewName: 'Zain',
    letterMeaning: 'Sword',
    numericalValue: 7,
    connectedSephirot: 'Binah (3) ↔ Tiphareth (6)',
    cardName: 'Atu VI - The Lovers',
    atuNumber: 6,
    astrologyOrElement: 'Gemini (Air)',
    crowleyKeyInsight: 'The Royal Marriage of opposites under the blessing of the Hermetic Hermaphrodite.'
  },
  {
    pathNumber: 18,
    hebrewLetter: 'ח',
    hebrewName: 'Cheth',
    letterMeaning: 'Fence / Enclosure',
    numericalValue: 8,
    connectedSephirot: 'Binah (3) ↔ Geburah (5)',
    cardName: 'Atu VII - The Chariot',
    atuNumber: 7,
    astrologyOrElement: 'Cancer (Water)',
    crowleyKeyInsight: 'Bearer of the Holy Graal, armored vehicle traversing the watery waters of Binah.'
  },
  {
    pathNumber: 19,
    hebrewLetter: 'ט',
    hebrewName: 'Teth',
    letterMeaning: 'Serpent',
    numericalValue: 9,
    connectedSephirot: 'Chesed (4) ↔ Geburah (5)',
    cardName: 'Atu VIII - Adjustment',
    atuNumber: 8,
    astrologyOrElement: 'Libra (Air)',
    crowleyKeyInsight: 'Equilibrium of Ma’at, standing on tiptoe balancing the scales of karma and cause.'
  },
  {
    pathNumber: 20,
    hebrewLetter: 'י',
    hebrewName: 'Yod',
    letterMeaning: 'Hand',
    numericalValue: 10,
    connectedSephirot: 'Chesed (4) ↔ Tiphareth (6)',
    cardName: 'Atu IX - The Hermit',
    atuNumber: 9,
    astrologyOrElement: 'Virgo (Earth)',
    crowleyKeyInsight: 'The Secret Chief bearing the egg lantern of creative spermatozoa into dark voids.'
  },
  {
    pathNumber: 21,
    hebrewLetter: 'כ',
    hebrewName: 'Kaph',
    letterMeaning: 'Palm of Hand',
    numericalValue: 20,
    connectedSephirot: 'Chesed (4) ↔ Netzach (7)',
    cardName: 'Atu X - Fortune',
    atuNumber: 10,
    astrologyOrElement: 'Jupiter',
    crowleyKeyInsight: 'The 10-spoked wheel of cosmic luck, Sphinx, Hermanubis, and Typhon.'
  },
  {
    pathNumber: 22,
    hebrewLetter: 'ל',
    hebrewName: 'Lamed',
    letterMeaning: 'Ox Goad',
    numericalValue: 30,
    connectedSephirot: 'Geburah (5) ↔ Tiphareth (6)',
    cardName: 'Atu XI - Lust',
    atuNumber: 11,
    astrologyOrElement: 'Leo (Fire)',
    crowleyKeyInsight: 'Babalon riding the Seven-Headed Beast Therion, intoxicating ecstasy of life force.'
  },
  {
    pathNumber: 23,
    hebrewLetter: 'מ',
    hebrewName: 'Mem',
    letterMeaning: 'Water',
    numericalValue: 40,
    connectedSephirot: 'Geburah (5) ↔ Hod (8)',
    cardName: 'Atu XII - The Hanged Man',
    atuNumber: 12,
    astrologyOrElement: 'Water (Elemental)',
    crowleyKeyInsight: 'Sacrifice of ego, baptism in the deep waters, spiritual surrender for rebirth.'
  },
  {
    pathNumber: 24,
    hebrewLetter: 'נ',
    hebrewName: 'Nun',
    letterMeaning: 'Fish',
    numericalValue: 50,
    connectedSephirot: 'Tiphareth (6) ↔ Netzach (7)',
    cardName: 'Atu XIII - Death',
    atuNumber: 13,
    astrologyOrElement: 'Scorpio (Water)',
    crowleyKeyInsight: 'Putrefaction, transformation from caterpillar through chrysalis into eagle-phoenix.'
  },
  {
    pathNumber: 25,
    hebrewLetter: 'ס',
    hebrewName: 'Samekh',
    letterMeaning: 'Prop / Support',
    numericalValue: 60,
    connectedSephirot: 'Tiphareth (6) ↔ Yesod (9)',
    cardName: 'Atu XIV - The Art',
    atuNumber: 14,
    astrologyOrElement: 'Sagittarius (Fire)',
    crowleyKeyInsight: 'The Alchemical Marriage (Solve et Coagula), blending fire and water into spiritual gold.'
  },
  {
    pathNumber: 26,
    hebrewLetter: 'ע',
    hebrewName: 'Ayin',
    letterMeaning: 'Eye',
    numericalValue: 70,
    connectedSephirot: 'Tiphareth (6) ↔ Hod (8)',
    cardName: 'Atu XV - The Devil',
    atuNumber: 15,
    astrologyOrElement: 'Capricorn (Earth)',
    crowleyKeyInsight: 'Pan, creative generative laughter, seeing through material illusion without fear.'
  },
  {
    pathNumber: 27,
    hebrewLetter: 'פ',
    hebrewName: 'Peh',
    letterMeaning: 'Mouth',
    numericalValue: 80,
    connectedSephirot: 'Netzach (7) ↔ Hod (8)',
    cardName: 'Atu XVI - The Tower',
    atuNumber: 16,
    astrologyOrElement: 'Mars',
    crowleyKeyInsight: 'Destruction of false ego structures, flash of divine lightning freeing spirit.'
  },
  {
    pathNumber: 28,
    hebrewLetter: 'צ',
    hebrewName: 'Tzaddi',
    letterMeaning: 'Fish Hook',
    numericalValue: 90,
    connectedSephirot: 'Netzach (7) ↔ Yesod (9)',
    cardName: 'Atu XVII - The Star',
    atuNumber: 17,
    astrologyOrElement: 'Aquarius (Air)',
    crowleyKeyInsight: 'Nuit pouring the waters of space; "Tzaddi is not the Star" (Liber AL I:57 key correction).'
  },
  {
    pathNumber: 29,
    hebrewLetter: 'ק',
    hebrewName: 'Qoph',
    letterMeaning: 'Back of Head',
    numericalValue: 100,
    connectedSephirot: 'Netzach (7) ↔ Malkuth (10)',
    cardName: 'Atu XVIII - The Moon',
    atuNumber: 18,
    astrologyOrElement: 'Pisces (Water)',
    crowleyKeyInsight: 'The dark night of the soul, gateway to subconscious underworld, illusion and rebirth.'
  },
  {
    pathNumber: 30,
    hebrewLetter: 'ר',
    hebrewName: 'Resh',
    letterMeaning: 'Head',
    numericalValue: 200,
    connectedSephirot: 'Hod (8) ↔ Yesod (9)',
    cardName: 'Atu XIX - The Sun',
    atuNumber: 19,
    astrologyOrElement: 'Sun',
    crowleyKeyInsight: 'Solar illumination, twin children dancing under Heru-ra-ha in radiant freedom.'
  },
  {
    pathNumber: 31,
    hebrewLetter: 'ש',
    hebrewName: 'Shin',
    letterMeaning: 'Tooth / Fire',
    numericalValue: 300,
    connectedSephirot: 'Hod (8) ↔ Malkuth (10)',
    cardName: 'Atu XX - The Aeon',
    atuNumber: 20,
    astrologyOrElement: 'Fire / Spirit',
    crowleyKeyInsight: 'Birth of the New Aeon of Horus (1904+), replacing Judgement with cosmic child crown.'
  },
  {
    pathNumber: 32,
    hebrewLetter: 'ת',
    hebrewName: 'Tau',
    letterMeaning: 'Cross / Mark',
    numericalValue: 400,
    connectedSephirot: 'Yesod (9) ↔ Malkuth (10)',
    cardName: 'Atu XXI - The Universe',
    atuNumber: 21,
    astrologyOrElement: 'Saturn / Earth',
    crowleyKeyInsight: 'Final completion of the Great Work, maiden dancing in the serpent wheel of space.'
  }
];

export const QABALISTIC_WORLDS_DATA: QabalisticWorldEntry[] = [
  {
    name: 'Atziluth',
    hebrewName: 'אצילות',
    translation: 'World of Emanation / Archetypes',
    element: 'Fire (Yod)',
    tetragrammatonLetter: 'Yod (י)',
    courtAgency: 'The Four Knights',
    tarotSuit: 'Wands (Primal Spark)',
    description:
      'The highest spiritual plane closest to Kether. Here reside the divine names and pure archetypal light before form exists.'
  },
  {
    name: 'Briah',
    hebrewName: 'בריאה',
    translation: 'World of Creation / Archangels',
    element: 'Water (Heh)',
    tetragrammatonLetter: 'Heh (ה)',
    courtAgency: 'The Four Queens',
    tarotSuit: 'Cups (Creative Waters)',
    description:
      'The creative realm of archangels and spiritual conception where the archetypes receive divine womb structures.'
  },
  {
    name: 'Yetzirah',
    hebrewName: 'יצירה',
    translation: 'World of Formation / Angels',
    element: 'Air (Vau)',
    tetragrammatonLetter: 'Vau (ו)',
    courtAgency: 'The Four Princes',
    tarotSuit: 'Swords (Formative Intellect)',
    description:
      'The formative realm of intellectual patterns, geometry, mind, and the angel choirs shaping reality.'
  },
  {
    name: 'Assiah',
    hebrewName: 'עשייה',
    translation: 'World of Action / Material Universe',
    element: 'Earth (Heh final)',
    tetragrammatonLetter: 'Heh final (ה)',
    courtAgency: 'The Four Princesses',
    tarotSuit: 'Disks (Physical Realm)',
    description:
      'The physical universe, chemical elements, body, and material manifestation where the Great Work bears fruit.'
  }
];

export const ESOTERIC_FORMULAS_DATA: EsotericFormulaEntry[] = [
  {
    formula: 'YHVH (Tetragrammaton)',
    meaning: 'Yod (Fire/Father) + Heh (Water/Mother) + Vau (Air/Son) + Heh (Earth/Daughter)',
    origin: 'Hebrew Hermetic Qabalah',
    symbolism: 'The 4-stage engine of all creation and action in space-time.',
    tarotAssociations: ['The 16 Court Cards', 'The 4 Suits', 'Opening of the Key 4 Piles'],
    magicalFunction: 'Diagnoses where an endeavor is blocked: ignition, gestation, strategy, or execution.'
  },
  {
    formula: '0 = 2',
    meaning: 'Zero = Positive Pole (+1) + Negative Pole (-1)',
    origin: 'Book of Thoth Theoretical Essay',
    symbolism: 'The vacuum of Naught containing all cosmic possibilities in perfect equilibrium.',
    tarotAssociations: ['Atu 0 - The Fool', 'Aces'],
    magicalFunction: 'Allows the magician to clear all karmic debt and re-enter pure potential.'
  },
  {
    formula: 'ABRAHADABRA',
    meaning: '11-Letter Word of the Neophyte / Word of the Double Cube',
    origin: 'Liber AL vel Legis & Crowleyan Magick',
    symbolism: 'Uniting 5 (Microcosm/Pentagram) with 6 (Macrocosm/Hexagram) = 11.',
    tarotAssociations: ['Atu I - The Magus', 'Atu V - The Hierophant', 'Atu XI - Lust'],
    magicalFunction: 'The magical formula for accomplishing the Great Work in the Aeon of Horus.'
  },
  {
    formula: 'IAO / VIAOV',
    meaning: 'Isis (Nature) + Apophis (Destruction) + Osiris (Resurrection)',
    origin: 'Gnostic & Hermetic Golden Dawn Mysteries',
    symbolism: 'The lifecycle of growth, death, and higher spiritual resurrection.',
    tarotAssociations: ['Atu VI - The Lovers', 'Atu XIII - Death', 'Atu XIV - The Art'],
    magicalFunction: 'Guides spiritual initiation through the dark night of the soul into solar rebirth.'
  },
  {
    formula: 'Solve et Coagula',
    meaning: 'Dissolve and Coagulate',
    origin: 'Classical Hermetic Alchemy',
    symbolism: 'Breaking down ego structures to elemental essence before recombining into divine gold.',
    tarotAssociations: ['Atu XIV - The Art', 'Atu VI - The Lovers', 'Atu XV - The Devil'],
    magicalFunction: 'The core operation of psychic and chemical alchemy.'
  },
  {
    formula: 'VITRIOL',
    meaning: 'Visita Interiora Terrae Rectificando Invenies Occultum Lapidem',
    origin: 'Alchemical Acronym',
    symbolism: 'Visit the interior of the earth; by rectification you shall find the hidden stone.',
    tarotAssociations: ['Atu XVIII - The Moon', 'Atu XIII - Death', 'Atu XX - The Aeon'],
    magicalFunction: 'Facing the subconscious shadow to extract the inner Philosopher’s Stone.'
  }
];

export const CROWLEY_ESSAY_SECTIONS: CrowleyEssaySection[] = [
  {
    id: 'essay-map-of-mind',
    title: 'The Tarot as a Map of Mind & Consciousness',
    subtitle: 'Chapter I: The Theoretical Blueprint of Existence',
    summary:
      'In Crowley\'s foundational essay on the Book of Thoth, he establishes that the Tarot is not a fortune-telling gimmick, but an absolute, self-contained mathematical map of universal human consciousness. Just as a psychological questionnaire evaluates input processing and personality traits across a population, the 78 cards map every possible permutation of human perception and divine law.',
    keyPassages: [
      '"The Tarot is a pictorial representation of the Forces of Nature as conceived by the Ancients in accordance with a conventional symbolism."',
      '"You must regard the 78 cards as an integrated living organism, where no single card exists in isolation, but only in dynamic relation to the entire universe."',
      '"The deck is a 78-piece puzzle engineered to humanize and codify the subtle mechanisms of consciousness."'
    ],
    philosophicalDepth:
      'Crowley demonstrates that the Tarot translates the abstract geometry of Kabbalah and the motions of astrology into a visual alphabet. By interacting with this alphabet, the reader opens a direct portal (doorway) between their individual subconscious mind and the objective macrocosm.'
  },
  {
    id: 'essay-naplesh-zero',
    title: 'The Philosophy of Zero (0 = 2) & The Fool',
    subtitle: 'Chapter II: The Mathematical Mystery of Creation',
    summary:
      'At the heart of the Thoth system lies the mathematical paradox "0 = +1 + (-1) = 2". Zero is not empty nothingness; it is the infinite, unmanifest, unextended Void containing all possibilities in equilibrium. The Fool (Atu 0) is Air, the divine silence, the Holy Ghost, and the innocence of pure potential before duality occurs.',
    keyPassages: [
      '"Zero in mathematical Qabalah is the Naught which contains All. It is the vacuum from which the universe explodes into manifestation."',
      '"The Fool is both Nothing and Everything. He carries the sun in his hand, fearlessly stepping off the cliff into the abyss of manifestation."',
      '"Until duality (+1 and -1) arises, there is no time or space; there is only the eternal Zero of Kether and Hadit."'
    ],
    philosophicalDepth:
      'This zero-formula explains the transition from unmanifest spirit (Ain Soph Aur) to physical reality (Malkuth). In readings, Atu 0 represents raw creative impulse unburdened by past conditioning.'
  },
  {
    id: 'essay-veil-occult',
    title: 'The Veil of Court & Occult Secrecy',
    subtitle: 'Chapter III: Why Secret Societies Preserved the Arcana',
    summary:
      'Crowley details how the true esoteric keys of the Tarot were deliberately concealed behind the "Veil of Court" (the 16 Court cards as medieval royalty) and simple card games during centuries of religious tyranny. The word "occult" simply means hidden: a necessary protective wrapper for timeless universal truths.',
    keyPassages: [
      '"The Court Cards were framed as Kings, Queens, Knights, and Princesses to mask the elemental tetragrammaton YHVH from profane eyes."',
      '"Though kept secret in occult fraternities, these exact same 78 archetypal truths are embedded within the allegories of all world scriptures."',
      '"The Tarot is a proof of concept for discovering the Divine in human experience, free from dogmatic corruption."'
    ],
    philosophicalDepth:
      'By removing the medieval mask and restoring Egyptian and Hermetic symbolism, the Thoth deck restores the original magical potency of these 16 elemental agencies.'
  },
  {
    id: 'essay-four-worlds',
    title: 'The Four Elemental Worlds & The Tetragrammaton',
    subtitle: 'Chapter IV: The YHVH Engine of Creation',
    summary:
      'Every operation in the universe follows the 4-fold formula of Yod-Heh-Vau-Heh. Yod (Fire/Father/Knight) initiates; Heh (Water/Mother/Queen) receives and conceives; Vau (Air/Son/Prince) formulates intellect; Heh final (Earth/Daughter/Princess) materializes the result, becoming the mother of the next cycle.',
    keyPassages: [
      '"Creation is an ongoing 4-stage engine. Fire ignites, Water cradles, Air structures, and Earth fixes."',
      '"In the Thoth deck, the Knights ride on horses as active Fire; Queens sit on thrones as receptive Water; Princes ride chariots as intellectual Air; Princesses stand on ground as physical Earth."',
      '"This 4-fold key governs the Opening of the Key spread, where the deck is divided into the 4 piles of YHVH."'
    ],
    philosophicalDepth:
      'Understanding YHVH unlocks the ability to diagnose where an idea or relationship is stuck: whether in the Fire of intention, the Water of feeling, the Air of planning, or the Earth of execution.'
  }
];

export const NUMEROLOGY_ESSAY_DATA: NumerologyEntry[] = [
  {
    number: '0',
    title: 'Zero - The Unmanifest / The Fool',
    sephira: 'Ain Soph Aur (Limitless Light)',
    elementOrPlanet: 'Air / The Void / Silence',
    concept: '0 = 2 (The Formula of Cosmic Creation)',
    crowleyInsight:
      'Zero is not an absence, but the infinite potential before division. +1 (Lingam) and -1 (Yoni) equal 0 when combined. Zero is the pure, unconditioned spirit, free from karma.',
    tarotMapping: 'Atu 0 - The Fool (The Holy Ghost, Harpocrates, Green Man)',
    alchemicalAspect: 'The Prima Materia (Unformed Matter before Creation)'
  },
  {
    number: '1',
    title: 'One - Kether (The Crown) / The Ace',
    sephira: '1st Sephira: Kether',
    elementOrPlanet: 'The Monad / Root of Elements',
    concept: 'The First Manifest Impulse / The Point',
    crowleyInsight:
      'The Aces represent the purest, uncorrupted essence of their respective element before any friction or manifestation in space-time occurs.',
    tarotMapping: 'Aces of Wands, Cups, Swords, and Disks; Atu I - The Magus',
    alchemicalAspect: 'The Alchemical Seed / The First Spark'
  },
  {
    number: '2',
    title: 'Two - Chokmah (Wisdom) / The Two',
    sephira: '2nd Sephira: Chokmah',
    elementOrPlanet: 'Sphere of the Zodiac / Dynamic Energy',
    concept: 'Polarity, Force, Directional Energy',
    crowleyInsight:
      'Two is the dynamic force breaking the unity of One. In its highest expression it is Dominion, Harmonious Change, and Peace; in lower expressions it is duality.',
    tarotMapping: '2 of Wands (Dominion), 2 of Cups (Love), 2 of Swords (Peace), 2 of Disks (Change)',
    alchemicalAspect: 'The Separation of Light and Darkness'
  },
  {
    number: '3',
    title: 'Three - Binah (Understanding) / The Three',
    sephira: '3rd Sephira: Binah',
    elementOrPlanet: 'Saturn / Form / Great Mother',
    concept: 'Crystallization into Form, Triad, Birth',
    crowleyInsight:
      'Three establishes stability and form. Binah gives birth to matter and structure. In Wands it is Virtue, in Cups Abundance, in Swords Sorrow (the piercing of form), in Disks Works.',
    tarotMapping: '3 of Wands (Virtue), 3 of Cups (Abundance), 3 of Swords (Sorrow), 3 of Disks (Works)',
    alchemicalAspect: 'The Three Alchemical Principles: Salt, Sulphur, Mercury'
  },
  {
    number: '4',
    title: 'Four - Chesed (Mercy) / The Four',
    sephira: '4th Sephira: Chesed',
    elementOrPlanet: 'Jupiter / Order / Authority',
    concept: 'Consolidation, Law, System, Solidity',
    crowleyInsight:
      'Four represents solid structure and established authority. It is the cube and solid ground, but risks stagnation if unrefreshed by change.',
    tarotMapping: '4 of Wands (Completion), 4 of Cups (Luxury), 4 of Swords (Truce), 4 of Disks (Power)',
    alchemicalAspect: 'The Four Elements Fixed in Material Form'
  },
  {
    number: '5',
    title: 'Five - Geburah (Severity) / The Five',
    sephira: '5th Sephira: Geburah',
    elementOrPlanet: 'Mars / Friction / Motion',
    concept: 'Disruption, Motion, Necessary Purification',
    crowleyInsight:
      'Five introduces motion and friction to break stagnant form. Geburah burns away decay. It appears as Strife, Loss, Defeat, and Worry, forcing higher evolution.',
    tarotMapping: '5 of Wands (Strife), 5 of Cups (Disappointment), 5 of Swords (Defeat), 5 of Disks (Worry)',
    alchemicalAspect: 'Calcination & Purification by Fire'
  },
  {
    number: '6',
    title: 'Six - Tiphareth (Beauty) / The Six',
    sephira: '6th Sephira: Tiphareth',
    elementOrPlanet: 'Sun / Harmony / Solar Center',
    concept: 'Equilibrium, Solar Harmony, Redemption',
    crowleyInsight:
      'Six is the heart of the Tree of Life. It balances severity and mercy. In every suit, the Sixes bring perfection: Victory, Pleasure, Science, and Success.',
    tarotMapping: '6 of Wands (Victory), 6 of Cups (Pleasure), 6 of Swords (Science), 6 of Disks (Success)',
    alchemicalAspect: 'Conjunction / The Solar Gold'
  },
  {
    number: '7',
    title: 'Seven - Netzach (Victory) / The Seven',
    sephira: '7th Sephira: Netzach',
    elementOrPlanet: 'Venus / Emotion / Instinct',
    concept: 'Degeneration, Passion Without Control, Illusion',
    crowleyInsight:
      'Seven sits below the Abyss on the emotional pillar. Unbalanced by reason, it leads to illusion and decay: Valour, Debauch, Futility, and Failure.',
    tarotMapping: '7 of Wands (Valour), 7 of Cups (Debauch), 7 of Swords (Futility), 7 of Disks (Failure)',
    alchemicalAspect: 'Putrefaction / Fermentation'
  },
  {
    number: '8',
    title: 'Eight - Hod (Splendor) / The Eight',
    sephira: '8th Sephira: Hod',
    elementOrPlanet: 'Mercury / Reason / Structure',
    concept: 'Intellectual Order, Rapid Energy, Over-Calculation',
    crowleyInsight:
      'Eight is the realm of Mercury. It brings swift mental activity, but can become overly rigid or neurotic: Swiftness, Indolence, Interference, and Prudence.',
    tarotMapping: '8 of Wands (Swiftness), 8 of Cups (Indolence), 8 of Swords (Interference), 8 of Disks (Prudence)',
    alchemicalAspect: 'Sublimation & Volatilization'
  },
  {
    number: '9',
    title: 'Nine - Yesod (Foundation) / The Nine',
    sephira: '9th Sephira: Yesod',
    elementOrPlanet: 'Moon / Subconscious / Astral',
    concept: 'Culmination of Astral Form, Immediate Reality',
    crowleyInsight:
      'Nine is the engine of the astral plane right before physical birth. It represents great force: Great Strength, Happiness, Cruelty, and Gain.',
    tarotMapping: '9 of Wands (Great Strength), 9 of Cups (Happiness), 9 of Swords (Cruelty), 9 of Disks (Gain)',
    alchemicalAspect: 'The Astral Mirror / Distillation'
  },
  {
    number: '10',
    title: 'Ten - Malkuth (Kingdom) / The Ten',
    sephira: '10th Sephira: Malkuth',
    elementOrPlanet: 'Earth / Physical Manifestation',
    concept: 'Final Materialization, Exhaustion or Wealth',
    crowleyInsight:
      'Ten completes the cycle. Energy is fully materialized into matter. It represents maximum density: Oppression, Satiety, Ruin, and Wealth.',
    tarotMapping: '10 of Wands (Oppression), 10 of Cups (Satiety), 10 of Swords (Ruin), 10 of Disks (Wealth)',
    alchemicalAspect: 'Fixation / The Earthly Salt'
  }
];

export const ASTROLOGY_DECANS_DATA: AstrologyDecanEntry[] = [
  {
    decan: 'Aries 1st Decan (0°-10°)',
    zodiacSign: 'Aries (Fire)',
    dates: 'March 21 - March 30',
    rulingPlanet: 'Mars in Aries',
    cardName: '2 of Wands',
    thothTitle: 'Dominion',
    element: 'Fire',
    esotericMeaning: 'Pure unrestrained force and pioneer ambition. The spark of divine will taking dominion.'
  },
  {
    decan: 'Aries 2nd Decan (10°-20°)',
    zodiacSign: 'Aries (Fire)',
    dates: 'March 31 - April 9',
    rulingPlanet: 'Sun in Aries',
    cardName: '3 of Wands',
    thothTitle: 'Virtue',
    element: 'Fire',
    esotericMeaning: 'Established power and noble integrity. Light illuminating the initial fire.'
  },
  {
    decan: 'Aries 3rd Decan (20°-30°)',
    zodiacSign: 'Aries (Fire)',
    dates: 'April 10 - April 19',
    rulingPlanet: 'Venus in Aries',
    cardName: '4 of Wands',
    thothTitle: 'Completion',
    element: 'Fire',
    esotericMeaning: 'Settled harmony and architectural perfection after initial fiery expansion.'
  },
  {
    decan: 'Taurus 1st Decan (0°-10°)',
    zodiacSign: 'Taurus (Earth)',
    dates: 'April 20 - April 30',
    rulingPlanet: 'Mercury in Taurus',
    cardName: '5 of Disks',
    thothTitle: 'Worry',
    element: 'Earth',
    esotericMeaning: 'Material instability and anxiety. The mind attempting to over-control physical matter.'
  },
  {
    decan: 'Taurus 2nd Decan (10°-20°)',
    zodiacSign: 'Taurus (Earth)',
    dates: 'May 1 - May 10',
    rulingPlanet: 'Moon in Taurus',
    cardName: '6 of Disks',
    thothTitle: 'Success',
    element: 'Earth',
    esotericMeaning: 'Exalted material harmony, prosperity, and balanced distribution of wealth.'
  },
  {
    decan: 'Taurus 3rd Decan (20°-30°)',
    zodiacSign: 'Taurus (Earth)',
    dates: 'May 11 - May 20',
    rulingPlanet: 'Saturn in Taurus',
    cardName: '7 of Disks',
    thothTitle: 'Failure',
    element: 'Earth',
    esotericMeaning: 'Stagnation and heavy inertia. Effort expended with little tangible yield.'
  },
  {
    decan: 'Gemini 1st Decan (0°-10°)',
    zodiacSign: 'Gemini (Air)',
    dates: 'May 21 - May 31',
    rulingPlanet: 'Jupiter in Gemini',
    cardName: '8 of Swords',
    thothTitle: 'Interference',
    element: 'Air',
    esotericMeaning: 'Over-thinking and mental dispersion. Excessive intellectual chatter impeding action.'
  },
  {
    decan: 'Gemini 2nd Decan (10°-20°)',
    zodiacSign: 'Gemini (Air)',
    dates: 'June 1 - June 10',
    rulingPlanet: 'Mars in Gemini',
    cardName: '9 of Swords',
    thothTitle: 'Cruelty',
    element: 'Air',
    esotericMeaning: 'Aggressive intellectual self-torment, nightmarish worry, and acute mental anguish.'
  },
  {
    decan: 'Gemini 3rd Decan (20°-30°)',
    zodiacSign: 'Gemini (Air)',
    dates: 'June 11 - June 20',
    rulingPlanet: 'Sun in Gemini',
    cardName: '10 of Swords',
    thothTitle: 'Ruin',
    element: 'Air',
    esotericMeaning: 'Total mental collapse and logical destruction. The end of a belief system.'
  },
  {
    decan: 'Cancer 1st Decan (0°-10°)',
    zodiacSign: 'Cancer (Water)',
    dates: 'June 21 - July 1',
    rulingPlanet: 'Venus in Cancer',
    cardName: '2 of Cups',
    thothTitle: 'Love',
    element: 'Water',
    esotericMeaning: 'Harmonious emotional union, sacred attraction, and divine empathy.'
  },
  {
    decan: 'Cancer 2nd Decan (10°-20°)',
    zodiacSign: 'Cancer (Water)',
    dates: 'July 2 - July 12',
    rulingPlanet: 'Mercury in Cancer',
    cardName: '3 of Cups',
    thothTitle: 'Abundance',
    element: 'Water',
    esotericMeaning: 'Joyful emotional overflow, fertility, celebration, and spiritual bounty.'
  },
  {
    decan: 'Cancer 3rd Decan (20°-30°)',
    zodiacSign: 'Cancer (Water)',
    dates: 'July 13 - July 22',
    rulingPlanet: 'Moon in Cancer',
    cardName: '4 of Cups',
    thothTitle: 'Luxury',
    element: 'Water',
    esotericMeaning: 'Emotional saturation leading to complacency, weakness, or stagnant ease.'
  }
];

export const ALCHEMY_FORMULAS_DATA: AlchemyFormulaEntry[] = [
  {
    name: 'Solve et Coagula',
    latinName: 'Dissolve and Coagulate',
    phase: 'The Core Alchemical Maxim',
    symbolism:
      'Dissolving rigid, fixated ego structures into elemental essence (Solve), then recombining them into a purified, divine synthesis (Coagula).',
    associatedCards: ['Atu XIV - The Art (Temperance)', 'Atu VI - The Lovers', 'Atu XV - The Devil'],
    magicalOperation: 'The transmutation of base lead (unconscious ego) into spiritual gold (illuminated True Will).'
  },
  {
    name: 'The Chemical Marriage (Chymical Wedding)',
    latinName: 'Coniunctio Oppositorum',
    phase: 'Union of Dualities',
    symbolism:
      'The sacred wedding of the Red Lion (Sulphur/Fire) and White Eagle (Mercury/Water), producing the Rebis (Divine Hermaphrodite).',
    associatedCards: ['Atu VI - The Lovers', 'Atu XIV - The Art', 'Atu II - The Priestess'],
    magicalOperation: 'Harmonizing masculine solar intellect with feminine lunar intuition into an unbreakable spiritual vessel.'
  },
  {
    name: 'VITRIOL Formula',
    latinName: 'Visita Interiora Terrae Rectificando Invenies Occultum Lapidem',
    phase: 'The Descent into the Shadow',
    symbolism:
      '"Visit the interior of the earth, and by rectification you will find the hidden stone." The journey through the subconscious shadow.',
    associatedCards: ['Atu XVIII - The Moon', 'Atu XIII - Death', 'Atu XX - The Aeon'],
    magicalOperation: 'Facing primal subconscious fears to uncover the Philosopher\'s Stone within the depths of the psyche.'
  },
  {
    name: 'The Three Alchemical Principles',
    latinName: 'Tria Prima',
    phase: 'Sulphur, Salt, Mercury',
    symbolism:
      'Sulphur (Fire/Soul/Desire), Salt (Earth/Body/Form), and Mercury (Air-Water/Spirit/Mind). The triune force animating all matter.',
    associatedCards: ['Atu I - The Magus (Mercury)', 'Atu IV - The Emperor (Sulphur)', 'Atu XXI - The Universe (Salt)'],
    magicalOperation: 'Balancing passion (Sulphur), intellect (Mercury), and physical embodiment (Salt).'
  }
];
