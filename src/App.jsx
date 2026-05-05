import { useState, useEffect, useMemo } from "react";
import { Volume2, BookOpen, Layers, Hash, Loader2, Sparkles, X, Eye, EyeOff, Shuffle } from "lucide-react";

/* ------------------------- DATA ------------------------- */

const LETTERS = [
  { up: "Α", lo: "α", sound: "ah",        hint: "as in father",                          ex: "ΑΓΟΡΑ",    exLow: "αγορά",     tr: "ah-ghoh-RAH",        mean: "market" },
  { up: "Β", lo: "β", sound: "v",         hint: "as in van",                             ex: "ΒΙΒΛΙΟ",   exLow: "βιβλίο",    tr: "vee-VLEE-oh",        mean: "book" },
  { up: "Γ", lo: "γ", sound: "gh / y",    hint: "soft “gh”; like “y” before ε / ι",      ex: "ΓΑΤΑ",     exLow: "γάτα",      tr: "GHAH-tah",           mean: "cat" },
  { up: "Δ", lo: "δ", sound: "th",        hint: "voiced “th”, as in this",               ex: "ΔΕΝ",      exLow: "δεν",       tr: "dhen",               mean: "not" },
  { up: "Ε", lo: "ε", sound: "eh",        hint: "as in bet",                             ex: "ΕΝΑ",      exLow: "ένα",       tr: "EH-nah",             mean: "one" },
  { up: "Ζ", lo: "ζ", sound: "z",         hint: "as in zoo",                             ex: "ΖΕΣΤΟ",    exLow: "ζεστό",     tr: "zes-TOH",            mean: "hot" },
  { up: "Η", lo: "η", sound: "ee",        hint: "as in see",                             ex: "ΗΛΙΟΣ",    exLow: "ήλιος",     tr: "EE-lyos",            mean: "sun" },
  { up: "Θ", lo: "θ", sound: "th",        hint: "unvoiced “th”, as in think",            ex: "ΘΕΑΤΡΟ",   exLow: "θέατρο",    tr: "THEH-ah-troh",       mean: "theatre" },
  { up: "Ι", lo: "ι", sound: "ee",        hint: "as in see",                             ex: "ΙΔΕΑ",     exLow: "ιδέα",      tr: "ee-DHEH-ah",         mean: "idea" },
  { up: "Κ", lo: "κ", sound: "k",         hint: "as in kit",                             ex: "ΚΑΦΕΣ",    exLow: "καφές",     tr: "kah-FES",            mean: "coffee" },
  { up: "Λ", lo: "λ", sound: "l",         hint: "as in let",                             ex: "ΛΕΜΟΝΙ",   exLow: "λεμόνι",    tr: "leh-MOH-nee",        mean: "lemon" },
  { up: "Μ", lo: "μ", sound: "m",         hint: "as in mom",                             ex: "ΜΟΥΣΕΙΟ",  exLow: "μουσείο",   tr: "moo-SEE-oh",         mean: "museum" },
  { up: "Ν", lo: "ν", sound: "n",         hint: "as in no",                              ex: "ΝΕΡΟ",     exLow: "νερό",      tr: "neh-ROH",            mean: "water" },
  { up: "Ξ", lo: "ξ", sound: "ks",        hint: "as in fox",                             ex: "ΞΕΝΟΣ",    exLow: "ξένος",     tr: "KSEH-nos",           mean: "foreigner" },
  { up: "Ο", lo: "ο", sound: "oh",        hint: "as in or",                              ex: "ΟΧΙ",      exLow: "όχι",       tr: "OH-hee",             mean: "no" },
  { up: "Π", lo: "π", sound: "p",         hint: "as in pen",                             ex: "ΠΟΡΤΑ",    exLow: "πόρτα",     tr: "POR-tah",            mean: "door" },
  { up: "Ρ", lo: "ρ", sound: "r",         hint: "rolled, like Spanish r",                ex: "ΡΟΔΙ",     exLow: "ρόδι",      tr: "ROH-dhee",           mean: "pomegranate" },
  { up: "Σ", lo: "σ / ς", sound: "s",     hint: "as in see; ς only at end of a word",    ex: "ΣΠΙΤΙ",    exLow: "σπίτι",     tr: "SPEE-tee",           mean: "house" },
  { up: "Τ", lo: "τ", sound: "t",         hint: "as in top",                             ex: "ΤΡΕΝΟ",    exLow: "τρένο",     tr: "TREH-noh",           mean: "train" },
  { up: "Υ", lo: "υ", sound: "ee",        hint: "as in see",                             ex: "ΥΓΕΙΑ",    exLow: "υγεία",     tr: "ee-YEE-ah",          mean: "health" },
  { up: "Φ", lo: "φ", sound: "f",         hint: "as in fish",                            ex: "ΦΩΣ",      exLow: "φως",       tr: "fohs",               mean: "light" },
  { up: "Χ", lo: "χ", sound: "kh / h",    hint: "like Scottish loch; “h” before ε / ι",  ex: "ΧΑΡΑ",     exLow: "χαρά",      tr: "khah-RAH",           mean: "joy" },
  { up: "Ψ", lo: "ψ", sound: "ps",        hint: "as in lapse",                           ex: "ΨΩΜΙ",     exLow: "ψωμί",      tr: "psoh-MEE",           mean: "bread" },
  { up: "Ω", lo: "ω", sound: "oh",        hint: "as in or — same sound as ο",            ex: "ΩΡΑ",      exLow: "ώρα",       tr: "OH-rah",             mean: "hour" },
];

const COMBOS = [
  { glyph: "αι", sound: "eh",      hint: "same as ε",                               ex: "ΑΙΜΑ",        exLow: "αίμα",         tr: "EH-mah",            mean: "blood" },
  { glyph: "ει", sound: "ee",      hint: "same as ι, η, υ",                         ex: "ΕΙΝΑΙ",       exLow: "είναι",        tr: "EE-neh",            mean: "is / are" },
  { glyph: "οι", sound: "ee",      hint: "same as ι, η, υ",                         ex: "ΠΛΟΙΟ",       exLow: "πλοίο",        tr: "PLEE-oh",           mean: "ship" },
  { glyph: "ου", sound: "oo",      hint: "as in food",                              ex: "ΟΥΖΟ",        exLow: "ούζο",         tr: "OO-zoh",            mean: "ouzo" },
  { glyph: "αυ", sound: "av / af", hint: "“av” before voiced; “af” before unvoiced",ex: "ΑΥΤΟΣ",       exLow: "αυτός",        tr: "af-TOS",            mean: "he / this" },
  { glyph: "ευ", sound: "ev / ef", hint: "“ev” before voiced; “ef” before unvoiced",ex: "ΕΥΧΑΡΙΣΤΩ",   exLow: "ευχαριστώ",    tr: "ef-khah-ree-STOH",  mean: "thank you" },
  { glyph: "μπ", sound: "b / mb",  hint: "“b” at start; “mb” in middle",            ex: "ΜΠΥΡΑ",       exLow: "μπύρα",        tr: "BEE-rah",           mean: "beer" },
  { glyph: "ντ", sound: "d / nd",  hint: "“d” at start; “nd” in middle",            ex: "ΝΤΟΜΑΤΑ",     exLow: "ντομάτα",      tr: "doh-MAH-tah",       mean: "tomato" },
  { glyph: "γκ", sound: "g",       hint: "hard “g”, as in go",                      ex: "ΓΚΑΡΑΖ",      exLow: "γκαράζ",       tr: "gah-RAHZ",          mean: "garage" },
  { glyph: "γγ", sound: "ng",      hint: "as in finger",                            ex: "ΑΓΓΛΙΑ",      exLow: "Αγγλία",       tr: "ahng-GLEE-ah",      mean: "England" },
  { glyph: "τσ", sound: "ts",      hint: "as in cats",                              ex: "ΤΣΑΙ",        exLow: "τσάι",         tr: "tseh",              mean: "tea" },
  { glyph: "τζ", sound: "dz",      hint: "as in adze",                              ex: "ΤΖΑΤΖΙΚΙ",    exLow: "τζατζίκι",     tr: "dzah-DZEE-kee",     mean: "tzatziki" },
];

const WORDS = [
  { rank: 1,   w: "και",        tr: "keh",              m: "and",                    pos: "conj" },
  { rank: 2,   w: "ο",          tr: "oh",               m: "the (m.)",               pos: "art" },
  { rank: 3,   w: "η",          tr: "ee",               m: "the (f.)",               pos: "art" },
  { rank: 4,   w: "το",         tr: "toh",              m: "the (n.) / it",          pos: "art" },
  { rank: 5,   w: "να",         tr: "nah",              m: "to / that",              pos: "part" },
  { rank: 6,   w: "δεν",        tr: "dhen",             m: "not",                    pos: "part" },
  { rank: 7,   w: "που",        tr: "poo",              m: "that / who / where",     pos: "conj" },
  { rank: 8,   w: "σε",         tr: "seh",              m: "in / to",                pos: "prep" },
  { rank: 9,   w: "είναι",      tr: "EE-neh",           m: "is / are",               pos: "v" },
  { rank: 10,  w: "έχω",        tr: "EH-khoh",          m: "I have",                 pos: "v" },
  { rank: 11,  w: "ένας",       tr: "EH-nas",           m: "a / one (m.)",           pos: "art" },
  { rank: 12,  w: "μία",        tr: "MEE-ah",           m: "a / one (f.)",           pos: "art" },
  { rank: 13,  w: "ένα",        tr: "EH-nah",           m: "a / one (n.)",           pos: "art" },
  { rank: 14,  w: "αυτός",      tr: "af-TOS",           m: "he / this",              pos: "pron" },
  { rank: 15,  w: "αυτή",       tr: "af-TEE",           m: "she / this",             pos: "pron" },
  { rank: 16,  w: "αυτό",       tr: "af-TOH",           m: "it / this",              pos: "pron" },
  { rank: 17,  w: "για",        tr: "yah",              m: "for",                    pos: "prep" },
  { rank: 18,  w: "με",         tr: "meh",              m: "with / me",              pos: "prep" },
  { rank: 19,  w: "από",        tr: "ah-POH",           m: "from / by",              pos: "prep" },
  { rank: 20,  w: "αλλά",       tr: "ah-LAH",           m: "but",                    pos: "conj" },
  { rank: 21,  w: "ή",          tr: "ee",               m: "or",                     pos: "conj" },
  { rank: 22,  w: "αν",         tr: "an",               m: "if",                     pos: "conj" },
  { rank: 23,  w: "ότι",        tr: "OH-tee",           m: "that (after verbs)",     pos: "conj" },
  { rank: 24,  w: "όταν",       tr: "OH-tan",           m: "when",                   pos: "conj" },
  { rank: 25,  w: "γιατί",      tr: "yah-TEE",          m: "why / because",          pos: "conj" },
  { rank: 26,  w: "τι",         tr: "tee",              m: "what?",                  pos: "q" },
  { rank: 27,  w: "ποιος",      tr: "PYOS",             m: "who? / which?",          pos: "q" },
  { rank: 28,  w: "πώς",        tr: "pos",              m: "how?",                   pos: "q" },
  { rank: 29,  w: "πού",        tr: "POO",              m: "where?",                 pos: "q" },
  { rank: 30,  w: "πότε",       tr: "POH-teh",          m: "when?",                  pos: "q" },
  { rank: 31,  w: "εγώ",        tr: "eh-GOH",           m: "I",                      pos: "pron" },
  { rank: 32,  w: "εσύ",        tr: "eh-SEE",           m: "you (sing.)",            pos: "pron" },
  { rank: 33,  w: "εμείς",      tr: "eh-MEES",          m: "we",                     pos: "pron" },
  { rank: 34,  w: "εσείς",      tr: "eh-SEES",          m: "you (pl.)",              pos: "pron" },
  { rank: 35,  w: "αυτοί",      tr: "af-TEE",           m: "they",                   pos: "pron" },
  { rank: 36,  w: "μου",        tr: "moo",              m: "my / me",                pos: "pron" },
  { rank: 37,  w: "σου",        tr: "soo",              m: "your / you",             pos: "pron" },
  { rank: 38,  w: "του",        tr: "too",              m: "his / him",              pos: "pron" },
  { rank: 39,  w: "της",        tr: "tees",             m: "her",                    pos: "pron" },
  { rank: 40,  w: "μας",        tr: "mas",              m: "our / us",               pos: "pron" },
  { rank: 41,  w: "σας",        tr: "sas",              m: "your / you (pl.)",       pos: "pron" },
  { rank: 42,  w: "τους",       tr: "toos",             m: "their / them",           pos: "pron" },
  { rank: 43,  w: "όλα",        tr: "OH-lah",           m: "all / everything",       pos: "pron" },
  { rank: 44,  w: "κάτι",       tr: "KAH-tee",          m: "something",              pos: "pron" },
  { rank: 45,  w: "τίποτα",     tr: "TEE-poh-tah",      m: "nothing",                pos: "pron" },
  { rank: 46,  w: "κανείς",     tr: "kah-NEES",         m: "nobody / anyone",        pos: "pron" },
  { rank: 47,  w: "ναι",        tr: "neh",              m: "yes",                    pos: "adv" },
  { rank: 48,  w: "όχι",        tr: "OH-hee",           m: "no",                     pos: "adv" },
  { rank: 49,  w: "πολύ",       tr: "poh-LEE",          m: "very / much",            pos: "adv" },
  { rank: 50,  w: "λίγο",       tr: "LEE-ghoh",         m: "a little",               pos: "adv" },
  { rank: 51,  w: "καλά",       tr: "kah-LAH",          m: "well / okay",            pos: "adv" },
  { rank: 52,  w: "μόνο",       tr: "MOH-noh",          m: "only",                   pos: "adv" },
  { rank: 53,  w: "εδώ",        tr: "eh-DHOH",          m: "here",                   pos: "adv" },
  { rank: 54,  w: "εκεί",       tr: "eh-KEE",           m: "there",                  pos: "adv" },
  { rank: 55,  w: "τώρα",       tr: "TOH-rah",          m: "now",                    pos: "adv" },
  { rank: 56,  w: "μετά",       tr: "meh-TAH",          m: "after / afterwards",     pos: "adv" },
  { rank: 57,  w: "πριν",       tr: "preen",            m: "before",                 pos: "adv" },
  { rank: 58,  w: "πάντα",      tr: "PAHN-dah",         m: "always",                 pos: "adv" },
  { rank: 59,  w: "ποτέ",       tr: "poh-TEH",          m: "never",                  pos: "adv" },
  { rank: 60,  w: "σήμερα",     tr: "SEE-meh-rah",      m: "today",                  pos: "adv" },
  { rank: 61,  w: "αύριο",      tr: "AHV-ree-oh",       m: "tomorrow",               pos: "adv" },
  { rank: 62,  w: "χθες",       tr: "khthes",           m: "yesterday",              pos: "adv" },
  { rank: 63,  w: "θέλω",       tr: "THEH-loh",         m: "I want",                 pos: "v" },
  { rank: 64,  w: "κάνω",       tr: "KAH-noh",          m: "I do / make",            pos: "v" },
  { rank: 65,  w: "λέω",        tr: "LEH-oh",           m: "I say",                  pos: "v" },
  { rank: 66,  w: "ξέρω",       tr: "KSEH-roh",         m: "I know",                 pos: "v" },
  { rank: 67,  w: "πάω",        tr: "PAH-oh",           m: "I go",                   pos: "v" },
  { rank: 68,  w: "έρχομαι",    tr: "ER-khoh-meh",      m: "I come",                 pos: "v" },
  { rank: 69,  w: "βλέπω",      tr: "VLEH-poh",         m: "I see",                  pos: "v" },
  { rank: 70,  w: "ακούω",      tr: "ah-KOO-oh",        m: "I hear",                 pos: "v" },
  { rank: 71,  w: "μπορώ",      tr: "boh-ROH",          m: "I can",                  pos: "v" },
  { rank: 72,  w: "πρέπει",     tr: "PREH-pee",         m: "must / should",          pos: "v" },
  { rank: 73,  w: "δίνω",       tr: "DHEE-noh",         m: "I give",                 pos: "v" },
  { rank: 74,  w: "παίρνω",     tr: "PER-noh",          m: "I take",                 pos: "v" },
  { rank: 75,  w: "βρίσκω",     tr: "VREES-koh",        m: "I find",                 pos: "v" },
  { rank: 76,  w: "μένω",       tr: "MEH-noh",          m: "I stay / live",          pos: "v" },
  { rank: 77,  w: "γίνομαι",    tr: "YEE-noh-meh",      m: "I become",               pos: "v" },
  { rank: 78,  w: "αγαπώ",      tr: "ah-ghah-POH",      m: "I love",                 pos: "v" },
  { rank: 79,  w: "μιλάω",      tr: "mee-LAH-oh",       m: "I speak",                pos: "v" },
  { rank: 80,  w: "δουλεύω",    tr: "dhoo-LEH-voh",     m: "I work",                 pos: "v" },
  { rank: 81,  w: "τρώω",       tr: "TROH-oh",          m: "I eat",                  pos: "v" },
  { rank: 82,  w: "πίνω",       tr: "PEE-noh",          m: "I drink",                pos: "v" },
  { rank: 83,  w: "ζω",         tr: "zoh",              m: "I live",                 pos: "v" },
  { rank: 84,  w: "άνθρωπος",   tr: "AHN-throh-pos",    m: "person / human",         pos: "n" },
  { rank: 85,  w: "άντρας",     tr: "AHN-dras",         m: "man",                    pos: "n" },
  { rank: 86,  w: "γυναίκα",    tr: "yee-NEH-kah",      m: "woman",                  pos: "n" },
  { rank: 87,  w: "παιδί",      tr: "peh-DHEE",         m: "child",                  pos: "n" },
  { rank: 88,  w: "φίλος",      tr: "FEE-los",          m: "friend",                 pos: "n" },
  { rank: 89,  w: "σπίτι",      tr: "SPEE-tee",         m: "house / home",           pos: "n" },
  { rank: 90,  w: "δουλειά",    tr: "dhoo-LYAH",        m: "work / job",             pos: "n" },
  { rank: 91,  w: "χρόνος",     tr: "KHROH-nos",        m: "year / time",            pos: "n" },
  { rank: 92,  w: "ώρα",        tr: "OH-rah",           m: "hour / time",            pos: "n" },
  { rank: 93,  w: "μέρα",       tr: "MEH-rah",          m: "day",                    pos: "n" },
  { rank: 94,  w: "νερό",       tr: "neh-ROH",          m: "water",                  pos: "n" },
  { rank: 95,  w: "καλός",      tr: "kah-LOS",          m: "good",                   pos: "adj" },
  { rank: 96,  w: "μεγάλος",    tr: "meh-GHAH-los",     m: "big / great",            pos: "adj" },
  { rank: 97,  w: "μικρός",     tr: "mee-KROS",         m: "small",                  pos: "adj" },
  { rank: 98,  w: "νέος",       tr: "NEH-os",           m: "new / young",            pos: "adj" },
  { rank: 99,  w: "ευχαριστώ",  tr: "ef-khah-ree-STOH", m: "thank you",              pos: "expr" },
  { rank: 100, w: "παρακαλώ",   tr: "pah-rah-kah-LOH",  m: "please / welcome",       pos: "expr" },
];

const POS_LABELS = {
  art:  "art.",
  conj: "conj.",
  prep: "prep.",
  pron: "pron.",
  q:    "?",
  v:    "verb",
  n:    "noun",
  adj:  "adj.",
  adv:  "adv.",
  expr: "expr.",
  part: "part.",
};

const FILTERS = [
  { id: "all",        label: "all",        match: () => true },
  { id: "verbs",      label: "verbs",      match: (w) => w.pos === "v" },
  { id: "nouns",      label: "nouns",      match: (w) => w.pos === "n" || w.pos === "adj" },
  { id: "pronouns",   label: "pronouns",   match: (w) => w.pos === "pron" || w.pos === "q" },
  { id: "modifiers",  label: "modifiers",  match: (w) => w.pos === "adv" },
  { id: "connectors", label: "connectors", match: (w) => ["art","conj","prep","part","expr"].includes(w.pos) },
];

/* ------------------- TRANSLITERATOR --------------------- */

function transliterate(input) {
  let w = (input || "").toLowerCase();
  w = w.normalize("NFD").replace(/[̀-ͯ]/g, "");
  const digraphs = [
    ["μπ", "b"], ["ντ", "d"], ["γκ", "g"], ["γγ", "ng"],
    ["τσ", "ts"], ["τζ", "dz"],
    ["αι", "e"], ["ει", "i"], ["οι", "i"], ["ου", "u"],
    ["αυ", "av"], ["ευ", "ev"],
  ];
  for (const [from, to] of digraphs) w = w.split(from).join(to);
  const single = {
    α: "a", β: "v", γ: "gh", δ: "dh", ε: "e",
    ζ: "z", η: "i", θ: "th", ι: "i", κ: "k",
    λ: "l", μ: "m", ν: "n", ξ: "ks", ο: "o",
    π: "p", ρ: "r", σ: "s", ς: "s", τ: "t",
    υ: "i", φ: "f", χ: "h", ψ: "ps", ω: "o",
  };
  return [...w].map(c => single[c] !== undefined ? single[c] : c).join("");
}

/* ----------------------- COMPONENT ---------------------- */

export default function GreekReader() {
  const [tab, setTab] = useState("letters");
  const [voice, setVoice] = useState(null);
  const [hasGreekVoice, setHasGreekVoice] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [decodeInput, setDecodeInput] = useState("ΦΑΡΜΑΚΕΙΟ");
  const [showHelp, setShowHelp] = useState(false);
  const [spoilersOn, setSpoilersOn] = useState(true);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    if (!supported) return;
    const load = () => {
      const all = window.speechSynthesis.getVoices();
      const greek = all.find(v => v.lang && v.lang.toLowerCase().startsWith("el"));
      if (greek) {
        setVoice(greek);
        setHasGreekVoice(true);
      }
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
  }, [supported]);

  const speak = (text, id, rate = 0.9) => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "el-GR";
    if (voice) u.voice = voice;
    u.rate = rate;
    setActiveId(id);
    u.onend = () => setActiveId(null);
    u.onerror = () => setActiveId(null);
    window.speechSynthesis.speak(u);
  };

  const tabs = [
    { id: "letters", label: "Letters", icon: BookOpen },
    { id: "combos",  label: "Combos",  icon: Layers },
    { id: "words",   label: "Top 100", icon: Hash },
    { id: "decode",  label: "Decode",  icon: Sparkles },
  ];

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: "radial-gradient(ellipse at top, #f5ecd6 0%, #ecdfc1 60%, #e0cfa6 100%)",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        color: "#1c160e",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
        .ui { font-family: 'DM Sans', system-ui, sans-serif; }
        .grain {
          background-image:
            radial-gradient(rgba(120,80,40,0.05) 1px, transparent 1px),
            radial-gradient(rgba(120,80,40,0.04) 1px, transparent 1px);
          background-size: 3px 3px, 7px 7px;
          background-position: 0 0, 1px 1px;
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(139,46,31,0.4); }
          70% { box-shadow: 0 0 0 14px rgba(139,46,31,0); }
          100% { box-shadow: 0 0 0 0 rgba(139,46,31,0); }
        }
        .speaking { animation: pulse-ring 1.2s infinite; }
      `}</style>

      <div className="grain absolute inset-0 pointer-events-none opacity-60" />

      <div className="relative max-w-2xl mx-auto px-5 pt-8 pb-32">
        <header className="mb-7">
          <div className="flex items-baseline gap-3 mb-3">
              <span
                className="text-5xl leading-none"
                style={{ color: "#8b2e1f", fontWeight: 600, letterSpacing: "-0.02em" }}
              >
                Ελληνικά
              </span>
              <span className="text-base ui tracking-widest uppercase" style={{ color: "#6b5a3e" }}>
                read·able
              </span>
          </div>
          <div className="flex items-center gap-2">
              <button
                onClick={() => setSpoilersOn(s => !s)}
                className="ui flex items-center gap-1.5 text-xs uppercase tracking-widest px-2.5 py-1 rounded"
                style={{
                  color: spoilersOn ? "#f5ecd6" : "#6b5a3e",
                  background: spoilersOn ? "#1c160e" : "transparent",
                  border: "1px solid " + (spoilersOn ? "#1c160e" : "#c4ad7a"),
                }}
                aria-label={spoilersOn ? "Show answers" : "Hide answers"}
              >
                {spoilersOn ? <EyeOff size={12} /> : <Eye size={12} />}
                {spoilersOn ? "hide answers" : "show answers"}
              </button>
              <button
                onClick={() => setShowHelp(true)}
                className="ui text-xs uppercase tracking-widest px-2.5 py-1 rounded"
                style={{ color: "#6b5a3e", border: "1px solid #c4ad7a" }}
              >
                ?
              </button>
          </div>
          <p className="mt-2 text-lg italic" style={{ color: "#5c4a32" }}>
            from symbols to sounds — for reading what's actually on the street.
          </p>
        </header>

        <nav className="ui flex gap-1.5 mb-6 overflow-x-auto -mx-1 px-1 pb-1">
          {tabs.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm whitespace-nowrap transition-all"
                style={{
                  background: active ? "#1c160e" : "transparent",
                  color: active ? "#f5ecd6" : "#1c160e",
                  border: active ? "1px solid #1c160e" : "1px solid #c4ad7a",
                  fontWeight: 500,
                }}
              >
                <Icon size={14} strokeWidth={2} />
                {t.label}
              </button>
            );
          })}
        </nav>

        {supported && !hasGreekVoice && (
          <div
            className="ui text-xs px-3 py-2 mb-4 rounded"
            style={{ background: "#f9efd6", border: "1px solid #c4ad7a", color: "#5c4a32" }}
          >
            No Greek voice detected on this device — playback will fall back to your default voice. Add a Greek voice in your OS settings for accurate pronunciation.
          </div>
        )}

        {tab === "decode" && (
          <DecodeView
            input={decodeInput}
            setInput={setDecodeInput}
            speak={speak}
            activeId={activeId}
            spoilersOn={spoilersOn}
          />
        )}

        {tab === "letters" && (
          <div className="grid grid-cols-2 gap-3">
            {LETTERS.map((l, i) => (
              <LetterCard
                key={l.up}
                data={l}
                speaking={activeId === `L-${i}`}
                speakingEx={activeId === `LE-${i}`}
                onTapLetter={() => speak(l.exLow || l.ex, `L-${i}`, 0.7)}
                onTapEx={() => speak(l.exLow || l.ex, `LE-${i}`, 0.85)}
                spoilersOn={spoilersOn}
              />
            ))}
          </div>
        )}

        {tab === "combos" && (
          <div className="grid grid-cols-2 gap-3">
            {COMBOS.map((c, i) => (
              <ComboCard
                key={c.glyph}
                data={c}
                speaking={activeId === `C-${i}`}
                onTap={() => speak(c.exLow || c.ex, `C-${i}`, 0.85)}
                spoilersOn={spoilersOn}
              />
            ))}
          </div>
        )}

        {tab === "words" && (
          <WordsView
            speak={speak}
            activeId={activeId}
            spoilersOn={spoilersOn}
          />
        )}

        <footer className="ui mt-12 pt-6 text-center text-xs" style={{ color: "#8a7654", borderTop: "1px solid #d4bf94" }}>
          built for decoding street signs · tap to hear · {hasGreekVoice ? "Greek voice ready" : "default voice"}
        </footer>
      </div>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}

/* ---------------------- DECODE VIEW --------------------- */

function DecodeView({ input, setInput, speak, activeId, spoilersOn }) {
  const trans = useMemo(() => transliterate(input), [input]);
  const breakdown = useMemo(() => breakdownWord(input), [input]);

  const examples = ["ΦΑΡΜΑΚΕΙΟ", "ΤΖΑΤΖΙΚΙ", "ΕΥΧΑΡΙΣΤΩ", "ΑΕΡΟΔΡΟΜΙΟ", "ΞΕΝΟΔΟΧΕΙΟ"];

  return (
    <div>
      <label className="ui block text-xs uppercase tracking-widest mb-2" style={{ color: "#6b5a3e" }}>
        type or paste any Greek word
      </label>
      <div className="relative">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="ΦΑΡΜΑΚΕΙΟ"
          className="w-full text-2xl px-4 py-3 rounded-lg outline-none"
          style={{
            background: "#faf3e3",
            border: "1.5px solid #c4ad7a",
            fontFamily: "'Cormorant Garamond', serif",
            color: "#1c160e",
          }}
        />
        {input && (
          <button
            onClick={() => setInput("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full"
            style={{ background: "#e0cfa6" }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="ui flex flex-wrap gap-1.5 mt-3">
        {examples.map(ex => (
          <button
            key={ex}
            onClick={() => setInput(ex)}
            className="text-xs px-2.5 py-1 rounded-full"
            style={{ background: "#e9dab2", color: "#5c4a32", border: "1px solid #d4bf94" }}
          >
            {ex.toLowerCase()}
          </button>
        ))}
      </div>

      {input && (
        <div
          className="mt-6 p-6 rounded-xl"
          style={{ background: "#faf3e3", border: "1px solid #c4ad7a" }}
        >
          <button
            onClick={() => speak(input, "DECODE", 0.85)}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg mb-4 ui ${activeId === "DECODE" ? "speaking" : ""}`}
            style={{ background: "#8b2e1f", color: "#f5ecd6", fontWeight: 500 }}
          >
            <Volume2 size={16} />
            <span className="text-sm tracking-wide uppercase">Hear it</span>
          </button>

          <div className="text-center mb-4">
            <div className="text-4xl leading-tight" style={{ color: "#1c160e", fontWeight: 500 }}>
              {input}
            </div>
            <div className="ui mt-2 text-base tracking-wide">
              <Spoiler on={spoilersOn} style={{ color: "#8b2e1f" }}>
                {trans}
              </Spoiler>
            </div>
          </div>

          <div className="border-t pt-4" style={{ borderColor: "#d4bf94" }}>
            <div className="ui text-xs uppercase tracking-widest mb-3" style={{ color: "#8a7654" }}>
              piece by piece
            </div>
            <div className="flex flex-wrap gap-2">
              {breakdown.map((p, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center px-3 py-2 rounded"
                  style={{ background: p.kind === "space" ? "transparent" : "#f0e3bf", minWidth: p.kind === "space" ? 8 : 48 }}
                >
                  <span className="text-2xl leading-none" style={{ color: "#1c160e", fontWeight: 500 }}>
                    {p.glyph}
                  </span>
                  {p.sound && (
                    <span className="ui text-xs mt-1">
                      <Spoiler on={spoilersOn} style={{ color: "#8b2e1f" }}>
                        {p.sound}
                      </Spoiler>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function breakdownWord(word) {
  if (!word) return [];
  const lower = word.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const original = [...word];
  const lowerArr = [...lower];
  const digraphs = {
    "μπ": "b", "ντ": "d", "γκ": "g", "γγ": "ng",
    "τσ": "ts", "τζ": "dz",
    "αι": "eh", "ει": "ee", "οι": "ee", "ου": "oo",
    "αυ": "av/af", "ευ": "ev/ef",
  };
  const single = {
    α: "ah", β: "v", γ: "gh", δ: "th", ε: "eh",
    ζ: "z", η: "ee", θ: "th", ι: "ee", κ: "k",
    λ: "l", μ: "m", ν: "n", ξ: "ks", ο: "oh",
    π: "p", ρ: "r", σ: "s", ς: "s", τ: "t",
    υ: "ee", φ: "f", χ: "kh", ψ: "ps", ω: "oh",
  };
  const out = [];
  let i = 0;
  while (i < lowerArr.length) {
    const two = lowerArr[i] + (lowerArr[i + 1] || "");
    if (digraphs[two]) {
      out.push({ glyph: original[i] + (original[i + 1] || ""), sound: digraphs[two], kind: "letter" });
      i += 2;
    } else if (lowerArr[i] === " ") {
      out.push({ glyph: " ", kind: "space" });
      i += 1;
    } else if (single[lowerArr[i]] !== undefined) {
      out.push({ glyph: original[i], sound: single[lowerArr[i]], kind: "letter" });
      i += 1;
    } else {
      out.push({ glyph: original[i], sound: "", kind: "other" });
      i += 1;
    }
  }
  return out;
}

/* ---------------------- SPOILER ------------------------- */

function Spoiler({ on, children, style = {}, className = "" }) {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (on) setRevealed(false);
  }, [on]);

  const hidden = on && !revealed;

  return (
    <span
      role={hidden ? "button" : undefined}
      tabIndex={hidden ? 0 : undefined}
      onClick={hidden ? (e) => { e.stopPropagation(); e.preventDefault(); setRevealed(true); } : undefined}
      onKeyDown={hidden ? (e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); e.preventDefault(); setRevealed(true); } } : undefined}
      className={className}
      style={{
        ...style,
        filter: hidden ? "blur(6px)" : "none",
        background: hidden ? "rgba(139, 46, 31, 0.1)" : "transparent",
        borderRadius: "3px",
        padding: "0 4px",
        cursor: hidden ? "pointer" : "inherit",
        userSelect: hidden ? "none" : "auto",
        transition: "filter 0.25s ease, background 0.25s ease",
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}

/* ---------------------- CARDS --------------------------- */

function LetterCard({ data, speaking, speakingEx, onTapLetter, onTapEx, spoilersOn }) {
  return (
    <div
      className="rounded-lg p-4 flex flex-col"
      style={{ background: "#faf3e3", border: "1px solid #c4ad7a" }}
    >
      <button
        onClick={onTapLetter}
        className={`flex items-baseline justify-center gap-2 py-2 rounded ${speaking ? "speaking" : ""}`}
        style={{ background: "#f0e3bf" }}
      >
        <span className="text-4xl leading-none" style={{ fontWeight: 500 }}>{data.up}</span>
        <span className="text-3xl leading-none" style={{ color: "#5c4a32" }}>{data.lo}</span>
        <Volume2 size={12} style={{ color: "#8b2e1f" }} />
      </button>
      <div className="ui mt-2.5 text-center">
        <div className="text-base" style={{ color: "#8b2e1f", fontWeight: 600 }}>{data.sound}</div>
        <div className="text-xs mt-0.5 italic" style={{ color: "#8a7654" }}>{data.hint}</div>
      </div>
      <button
        onClick={onTapEx}
        className={`mt-3 pt-2.5 w-full text-center ${speakingEx ? "speaking" : ""}`}
        style={{ borderTop: "1px dashed #d4bf94" }}
      >
        <div className="text-lg leading-tight" style={{ fontWeight: 500 }}>{data.ex}</div>
        <div className="text-base leading-tight" style={{ fontWeight: 500, color: "#5c4a32" }}>{data.exLow}</div>
        <div className="ui text-xs mt-1.5">
          <Spoiler on={spoilersOn} style={{ color: "#5c4a32" }}>{data.tr}</Spoiler>
        </div>
        <div className="ui text-sm mt-1.5">
          <Spoiler on={spoilersOn} style={{ color: "#3d3220", fontWeight: 500 }}>“{data.mean}”</Spoiler>
        </div>
      </button>
    </div>
  );
}

function ComboCard({ data, speaking, onTap, spoilersOn }) {
  return (
    <button
      onClick={onTap}
      className={`text-left rounded-lg p-4 ${speaking ? "speaking" : ""}`}
      style={{ background: "#faf3e3", border: "1px solid #c4ad7a" }}
    >
      <div className="flex items-baseline gap-2 justify-center py-1 rounded" style={{ background: "#f0e3bf" }}>
        <span className="text-4xl" style={{ fontWeight: 500 }}>{data.glyph}</span>
        <Volume2 size={12} style={{ color: "#8b2e1f" }} />
      </div>
      <div className="ui mt-2.5 text-center">
        <div className="text-base" style={{ color: "#8b2e1f", fontWeight: 600 }}>{data.sound}</div>
        <div className="text-xs mt-0.5 italic" style={{ color: "#8a7654" }}>{data.hint}</div>
      </div>
      <div className="mt-3 pt-2.5 text-center" style={{ borderTop: "1px dashed #d4bf94" }}>
        <div className="text-lg leading-tight" style={{ fontWeight: 500 }}>{data.ex}</div>
        <div className="text-base leading-tight" style={{ fontWeight: 500, color: "#5c4a32" }}>{data.exLow}</div>
        <div className="ui text-xs mt-1.5">
          <Spoiler on={spoilersOn} style={{ color: "#5c4a32" }}>{data.tr}</Spoiler>
        </div>
        <div className="ui text-sm mt-1.5">
          <Spoiler on={spoilersOn} style={{ color: "#3d3220", fontWeight: 500 }}>“{data.mean}”</Spoiler>
        </div>
      </div>
    </button>
  );
}

function WordsView({ speak, activeId, spoilersOn }) {
  const [filter, setFilter] = useState("all");
  const [shuffled, setShuffled] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  const filtered = useMemo(() => {
    const f = FILTERS.find(x => x.id === filter) || FILTERS[0];
    let list = WORDS.filter(f.match);
    if (shuffled) {
      list = [...list];
      for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
      }
    }
    return list;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, shuffled, shuffleSeed]);

  const reshuffle = () => {
    setShuffled(true);
    setShuffleSeed(s => s + 1);
  };

  return (
    <div>
      <div className="ui flex gap-1.5 mb-3 overflow-x-auto -mx-1 px-1 pb-1">
        {FILTERS.map(f => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors"
              style={{
                background: active ? "#8b2e1f" : "transparent",
                color: active ? "#f5ecd6" : "#5c4a32",
                border: "1px solid " + (active ? "#8b2e1f" : "#c4ad7a"),
                fontWeight: active ? 500 : 400,
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="ui flex items-center justify-between mb-3">
        <span className="text-xs" style={{ color: "#8a7654" }}>
          {filtered.length} word{filtered.length === 1 ? "" : "s"}{shuffled ? " · shuffled" : " · by frequency"}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={reshuffle}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded"
            style={{
              background: shuffled ? "#1c160e" : "transparent",
              color: shuffled ? "#f5ecd6" : "#5c4a32",
              border: "1px solid " + (shuffled ? "#1c160e" : "#c4ad7a"),
            }}
          >
            <Shuffle size={12} />
            shuffle
          </button>
          {shuffled && (
            <button
              onClick={() => setShuffled(false)}
              className="text-xs px-2 py-1 rounded"
              style={{ color: "#5c4a32", border: "1px solid #c4ad7a" }}
            >
              reset
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map((wd) => (
          <WordCard
            key={wd.rank}
            data={wd}
            speaking={activeId === `W-${wd.rank}`}
            onTap={() => speak(wd.w, `W-${wd.rank}`, 0.85)}
            spoilersOn={spoilersOn}
          />
        ))}
      </div>
    </div>
  );
}

function WordCard({ data, speaking, onTap, spoilersOn }) {
  return (
    <button
      onClick={onTap}
      className={`w-full text-left rounded-lg px-3 py-3 flex items-stretch gap-3 ${speaking ? "speaking" : ""}`}
      style={{ background: "#faf3e3", border: "1px solid #c4ad7a" }}
    >
      <div
        className="ui flex flex-col items-center justify-center text-xs"
        style={{ color: "#a08850", minWidth: 28, fontVariantNumeric: "tabular-nums" }}
      >
        <span style={{ fontSize: 10, opacity: 0.6 }}>#</span>
        <span style={{ fontWeight: 500 }}>{data.rank}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-2xl truncate" style={{ fontWeight: 500 }}>{data.w}</span>
          <span
            className="ui uppercase tracking-wider flex-shrink-0"
            style={{ fontSize: 10, color: "#a08850" }}
          >
            {POS_LABELS[data.pos] || data.pos}
          </span>
        </div>
        <div className="ui text-xs mt-1.5 flex items-baseline gap-1.5 flex-wrap">
          <Spoiler on={spoilersOn} style={{ color: "#8b2e1f" }}>{data.tr}</Spoiler>
          <span style={{ color: "#c4ad7a" }}>·</span>
          <Spoiler on={spoilersOn} style={{ color: "#3d3220", fontWeight: 500 }}>“{data.m}”</Spoiler>
        </div>
      </div>
      <div className="flex items-center">
        <div
          className="rounded-full w-9 h-9 flex items-center justify-center flex-shrink-0"
          style={{ background: "#8b2e1f", color: "#f5ecd6" }}
        >
          {speaking ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />}
        </div>
      </div>
    </button>
  );
}

/* ----------------------- HELP --------------------------- */

function HelpModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
      style={{ background: "rgba(28,22,14,0.6)" }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl w-full max-w-md p-6 ui"
        style={{ background: "#f5ecd6", border: "1px solid #c4ad7a", color: "#1c160e" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
            How to use this
          </h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <ul className="space-y-3 text-sm" style={{ color: "#3d3220" }}>
          <li><b>Letters</b> — the 24-letter alphabet with the actual sound, not the letter name.</li>
          <li><b>Combos</b> — the digraphs that surprise people (αι, ου, μπ, ντ…). Knowing these is half the battle on signs.</li>
          <li><b>Top 100</b> — the 100 most common Greek words by frequency. Filter by category, shuffle for review, tap to hear.</li>
          <li><b>Decode</b> — paste anything you see written in Greek. Get its sounds, piece by piece, and tap to hear it spoken.</li>
          <li><b>hide / show answers</b> — the toggle in the header blurs sound-outs and meanings so you can attempt them first. Tap any blurred bit to peek at just that one.</li>
          <li className="pt-2 italic" style={{ color: "#8a7654" }}>
            Pronunciation uses your device's built-in Greek voice. iOS/Android usually have one. On desktop, Edge and Safari are most reliable.
          </li>
        </ul>
        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 rounded-lg text-sm tracking-wide"
          style={{ background: "#1c160e", color: "#f5ecd6", fontWeight: 500 }}
        >
          got it
        </button>
      </div>
    </div>
  );
}
