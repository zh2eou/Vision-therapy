export interface CategoryDef {
  name: string;
  tier: number;
  examples?: string[]; // curated; if absent => manual review
}

const norm = (s: string) => s.trim().toLowerCase();

export const CATEGORIES: CategoryDef[] = [
  // === Tier 1 — common ===
  {
    name: "Colors",
    tier: 1,
    examples: [
      "red","orange","yellow","green","blue","purple","pink","brown","black","white",
      "gray","grey","cyan","magenta","violet","indigo","turquoise","teal","maroon",
      "navy","olive","beige","tan","gold","silver","crimson","scarlet","lime","lavender",
    ],
  },
  {
    name: "Animals",
    tier: 1,
    examples: [
      "dog","cat","horse","cow","pig","sheep","goat","chicken","duck","goose",
      "lion","tiger","bear","wolf","fox","deer","rabbit","mouse","rat","squirrel",
      "elephant","giraffe","zebra","monkey","gorilla","kangaroo","koala","panda",
      "whale","shark","dolphin","fish","eagle","owl","hawk","snake","lizard","frog",
      "turtle","crocodile","alligator","aardvark","elk","moose","bison","buffalo",
    ],
  },
  {
    name: "Fruits",
    tier: 1,
    examples: [
      "apple","banana","orange","pear","grape","grapes","strawberry","blueberry",
      "raspberry","blackberry","peach","plum","cherry","watermelon","melon",
      "cantaloupe","pineapple","mango","kiwi","lemon","lime","papaya","coconut",
      "avocado","apricot","pomegranate","fig","date","guava","passionfruit","lychee",
    ],
  },
  {
    name: "Vegetables",
    tier: 1,
    examples: [
      "carrot","potato","tomato","onion","garlic","celery","lettuce","spinach","kale",
      "broccoli","cauliflower","cabbage","cucumber","zucchini","pepper","corn","peas",
      "beans","pumpkin","squash","eggplant","radish","beet","turnip","asparagus",
      "artichoke","leek","mushroom","parsnip","okra","chard",
    ],
  },
  {
    name: "Body parts",
    tier: 1,
    examples: [
      "head","hair","face","eye","ear","nose","mouth","lip","tooth","tongue","chin",
      "neck","shoulder","arm","elbow","wrist","hand","finger","thumb","chest","back",
      "stomach","hip","leg","knee","ankle","foot","toe","heart","lung","brain",
    ],
  },
  // === Tier 2 — broader ===
  {
    name: "Sports",
    tier: 2,
    examples: [
      "soccer","football","basketball","baseball","hockey","tennis","golf","rugby",
      "cricket","volleyball","badminton","table tennis","ping pong","boxing","wrestling",
      "swimming","diving","cycling","running","skiing","snowboarding","skating",
      "surfing","sailing","rowing","archery","fencing","judo","karate","gymnastics",
      "lacrosse","softball","handball","polo","curling",
    ],
  },
  {
    name: "Countries",
    tier: 2,
    examples: [
      "usa","united states","canada","mexico","brazil","argentina","chile","peru",
      "uk","united kingdom","england","france","germany","spain","italy","portugal",
      "netherlands","belgium","sweden","norway","finland","denmark","poland","russia",
      "china","japan","korea","india","pakistan","thailand","vietnam","indonesia",
      "australia","new zealand","egypt","morocco","kenya","nigeria","south africa",
      "ghana","turkey","greece","ireland","iceland","switzerland","austria",
    ],
  },
  {
    name: "Musical instruments",
    tier: 2,
    examples: [
      "piano","guitar","violin","viola","cello","bass","drums","flute","clarinet",
      "oboe","bassoon","saxophone","trumpet","trombone","tuba","french horn","harp",
      "accordion","harmonica","banjo","mandolin","ukulele","xylophone","marimba",
      "organ","synthesizer","keyboard","timpani","tambourine","triangle",
    ],
  },
  {
    name: "Tools",
    tier: 2,
    examples: [
      "hammer","screwdriver","wrench","pliers","saw","drill","chisel","level",
      "tape measure","ruler","knife","scissors","axe","shovel","rake","hoe",
      "broom","clamp","file","sander","router","nailgun","stapler","allen key",
      "socket wrench","crowbar","mallet","pickaxe","spanner",
    ],
  },
  {
    name: "Kitchen items",
    tier: 2,
    examples: [
      "fork","spoon","knife","plate","bowl","cup","mug","glass","pan","pot","skillet",
      "wok","kettle","blender","mixer","toaster","oven","stove","microwave","fridge",
      "refrigerator","spatula","whisk","ladle","strainer","colander","grater","peeler",
      "cutting board","rolling pin","measuring cup","thermometer",
    ],
  },
  // === Tier 3 — specific knowledge ===
  {
    name: "European capitals",
    tier: 3,
    examples: [
      "london","paris","berlin","madrid","rome","lisbon","amsterdam","brussels",
      "vienna","bern","prague","warsaw","stockholm","oslo","helsinki","copenhagen",
      "dublin","reykjavik","athens","bucharest","budapest","sofia","belgrade","zagreb",
      "ljubljana","bratislava","vilnius","riga","tallinn","luxembourg","valletta",
      "nicosia","chisinau","minsk","kyiv","kiev","skopje","sarajevo","podgorica",
      "tirana","andorra la vella","monaco","vaduz","san marino","vatican city",
    ],
  },
  {
    name: "US states",
    tier: 3,
    examples: [
      "alabama","alaska","arizona","arkansas","california","colorado","connecticut",
      "delaware","florida","georgia","hawaii","idaho","illinois","indiana","iowa",
      "kansas","kentucky","louisiana","maine","maryland","massachusetts","michigan",
      "minnesota","mississippi","missouri","montana","nebraska","nevada",
      "new hampshire","new jersey","new mexico","new york","north carolina",
      "north dakota","ohio","oklahoma","oregon","pennsylvania","rhode island",
      "south carolina","south dakota","tennessee","texas","utah","vermont","virginia",
      "washington","west virginia","wisconsin","wyoming",
    ],
  },
  {
    name: "Elements",
    tier: 3,
    examples: [
      "hydrogen","helium","lithium","beryllium","boron","carbon","nitrogen","oxygen",
      "fluorine","neon","sodium","magnesium","aluminum","aluminium","silicon","phosphorus",
      "sulfur","chlorine","argon","potassium","calcium","iron","copper","zinc","silver",
      "gold","mercury","lead","tin","nickel","platinum","uranium","titanium","chromium",
      "manganese","cobalt","bromine","iodine","krypton","xenon","radon","cesium",
    ],
  },
  {
    name: "Shakespeare plays",
    tier: 3,
    examples: [
      "hamlet","macbeth","othello","king lear","romeo and juliet","julius caesar",
      "the tempest","a midsummer night's dream","much ado about nothing","as you like it",
      "twelfth night","the merchant of venice","the taming of the shrew",
      "henry v","henry iv","henry vi","henry viii","richard ii","richard iii",
      "antony and cleopatra","coriolanus","timon of athens","titus andronicus",
      "the winter's tale","cymbeline","pericles","the comedy of errors",
      "love's labour's lost","all's well that ends well","measure for measure",
      "the two gentlemen of verona","troilus and cressida","the merry wives of windsor",
      "king john",
    ],
  },
  {
    name: "Jazz musicians",
    tier: 3,
    examples: [
      "miles davis","john coltrane","louis armstrong","duke ellington","charlie parker",
      "dizzy gillespie","thelonious monk","ella fitzgerald","billie holiday",
      "sarah vaughan","nina simone","chet baker","dave brubeck","herbie hancock",
      "chick corea","bill evans","ornette coleman","sonny rollins","art blakey",
      "count basie","benny goodman","stan getz","wes montgomery","pat metheny",
      "keith jarrett","oscar peterson","ella",
    ],
  },
  // === Tier 4 — obscure ===
  {
    name: "Cognitive biases",
    tier: 4,
    examples: [
      "confirmation bias","anchoring","availability heuristic","hindsight bias",
      "dunning-kruger","sunk cost","survivorship bias","framing effect","halo effect",
      "recency bias","negativity bias","optimism bias","pessimism bias","status quo bias",
      "bandwagon effect","gambler's fallacy","attribution error","fundamental attribution error",
      "self-serving bias","overconfidence","illusion of control","barnum effect",
      "ikea effect","endowment effect","loss aversion","spotlight effect","in-group bias",
      "base rate fallacy","planning fallacy","just world","actor-observer bias",
    ],
  },
  {
    name: "Logical fallacies",
    tier: 4,
    examples: [
      "ad hominem","straw man","slippery slope","false dichotomy","false dilemma",
      "appeal to authority","appeal to emotion","appeal to ignorance","appeal to nature",
      "appeal to tradition","appeal to popularity","circular reasoning","begging the question",
      "red herring","tu quoque","no true scotsman","post hoc","non sequitur",
      "hasty generalization","equivocation","composition","division","loaded question",
      "genetic fallacy","bandwagon","special pleading","middle ground","texas sharpshooter",
      "gambler's fallacy","black or white","ambiguity","burden of proof",
    ],
  },
  {
    name: "Philosophers",
    tier: 4,
    examples: [
      "socrates","plato","aristotle","descartes","kant","hegel","nietzsche","heidegger",
      "sartre","camus","hume","locke","hobbes","rousseau","voltaire","spinoza","leibniz",
      "schopenhauer","kierkegaard","wittgenstein","russell","frege","marx","engels",
      "foucault","derrida","deleuze","rawls","mill","bentham","aquinas","augustine",
      "confucius","lao tzu","epicurus","zeno","seneca","marcus aurelius","pythagoras",
      "parmenides","heraclitus","diogenes","machiavelli","popper","quine","dewey",
    ],
  },
  {
    name: "Classical composers",
    tier: 4,
    examples: [
      "bach","mozart","beethoven","haydn","handel","vivaldi","chopin","liszt",
      "schubert","schumann","brahms","mendelssohn","tchaikovsky","rachmaninoff",
      "prokofiev","shostakovich","stravinsky","debussy","ravel","mahler","bruckner",
      "wagner","verdi","puccini","rossini","bizet","dvorak","smetana","grieg","sibelius",
      "strauss","gershwin","copland","bernstein","britten","elgar","holst","purcell",
      "palestrina","monteverdi","scarlatti","telemann","berlioz","faure","satie",
    ],
  },
  {
    name: "Dog breeds",
    tier: 4,
    examples: [
      "labrador","golden retriever","poodle","bulldog","beagle","dachshund","chihuahua",
      "pug","boxer","rottweiler","doberman","husky","malamute","shiba inu","akita",
      "pomeranian","corgi","shih tzu","maltese","yorkshire terrier","jack russell",
      "border collie","australian shepherd","german shepherd","mastiff","great dane",
      "saint bernard","bernese mountain dog","newfoundland","greyhound","whippet",
      "basset hound","bloodhound","dalmatian","pitbull","staffordshire","papillon",
      "bichon frise","cocker spaniel","springer spaniel","cavalier king charles",
      "samoyed","chow chow","shar pei","weimaraner","vizsla","pointer","setter",
    ],
  },
  // === Tier 5 — niche ===
  {
    name: "Minerals",
    tier: 5,
    examples: [
      "quartz","feldspar","mica","calcite","dolomite","gypsum","halite","fluorite",
      "pyrite","hematite","magnetite","galena","sphalerite","cinnabar","malachite",
      "azurite","turquoise","lapis lazuli","obsidian","olivine","topaz","beryl",
      "emerald","aquamarine","corundum","ruby","sapphire","diamond","graphite","talc",
      "kaolinite","bauxite","apatite","zircon","garnet","amethyst","citrine","jade",
      "jadeite","nephrite","opal","tourmaline","spinel","peridot","agate","jasper",
      "chalcedony","pyroxene","amphibole","serpentine","chlorite",
    ],
  },
  {
    name: "Animal phyla",
    tier: 5,
    examples: [
      "chordata","arthropoda","mollusca","annelida","nematoda","platyhelminthes",
      "cnidaria","porifera","echinodermata","bryozoa","brachiopoda","rotifera",
      "tardigrada","onychophora","nemertea","ctenophora","hemichordata","sipuncula",
      "placozoa","xenacoelomorpha","gastrotricha","kinorhyncha","priapulida","loricifera",
      "entoprocta","cycliophora","gnathostomulida","micrognathozoa","phoronida",
    ],
  },
  {
    name: "Programming languages",
    tier: 5,
    examples: [
      "python","javascript","typescript","java","c","c++","c#","go","rust","ruby",
      "php","swift","kotlin","scala","haskell","ocaml","elixir","erlang","clojure",
      "lisp","scheme","racket","perl","lua","r","matlab","julia","fortran","cobol",
      "ada","pascal","basic","assembly","sql","bash","shell","zsh","powershell",
      "dart","nim","crystal","zig","elm","f#","groovy","objective-c","prolog","smalltalk",
      "tcl","vb","vhdl","verilog","solidity","apl","forth","apl","abap","sas","stata",
    ],
  },
  {
    name: "Greek gods",
    tier: 5,
    examples: [
      "zeus","hera","poseidon","hades","demeter","hestia","ares","athena","apollo",
      "artemis","hephaestus","aphrodite","hermes","dionysus","persephone","hecate",
      "eros","pan","nike","nemesis","tyche","hypnos","thanatos","morpheus","helios",
      "selene","eos","gaia","uranus","cronus","rhea","oceanus","tethys","hyperion",
      "theia","iapetus","coeus","phoebe","crius","mnemosyne","themis","atlas","prometheus",
      "epimetheus","asclepius","heracles","hercules","chiron","iris","hebe","ganymede",
    ],
  },
  {
    name: "Constellations",
    tier: 5,
    examples: [
      "orion","ursa major","ursa minor","big dipper","little dipper","cassiopeia",
      "cepheus","draco","lyra","cygnus","aquila","hercules","bootes","corona borealis",
      "virgo","leo","cancer","gemini","taurus","aries","pisces","aquarius","capricornus",
      "capricorn","sagittarius","scorpius","scorpio","libra","ophiuchus","perseus",
      "andromeda","pegasus","canis major","canis minor","hydra","centaurus","crux",
      "southern cross","carina","vela","puppis","phoenix","eridanus","cetus","lepus",
      "auriga","corvus","crater","lupus","lynx","camelopardalis",
    ],
  },
];

export function categoriesForTier(tier: number): CategoryDef[] {
  // Include current tier and one below for variety; clamp
  const t = Math.max(1, Math.min(5, tier));
  return CATEGORIES.filter((c) => c.tier === t || c.tier === t - 1);
}

export function pickTwoCategories(tier: number, rng: () => number): [CategoryDef, CategoryDef] {
  const pool = categoriesForTier(tier).slice();
  if (pool.length < 2) throw new Error("Not enough categories for tier");
  const i = Math.floor(rng() * pool.length);
  const a = pool.splice(i, 1)[0];
  const j = Math.floor(rng() * pool.length);
  const b = pool[j];
  return [a, b];
}

export function validateAnswer(cat: CategoryDef, answer: string): boolean | null {
  if (!cat.examples) return null; // manual review
  const a = norm(answer);
  if (!a) return false;
  return cat.examples.some((e) => norm(e) === a);
}
