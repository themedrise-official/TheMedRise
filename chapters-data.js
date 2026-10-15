// MedRise chapter list (names only). Prices, live status and PDF links are NOT stored here:
// the admin panel writes them to Firestore (chapters / chapterFiles) and the site reads them from there.
window.MR_CHAPTERS = [
  {id:1, cls:11, name:"The Living World", type:"Botany", desc:"Characteristics of living organisms, diversity, taxonomy"},
  {id:2, cls:11, name:"Biological Classification", type:"Botany", desc:"Five-kingdom classification, salient features"},
  {id:3, cls:11, name:"Plant Kingdom", type:"Botany", desc:"Algae, bryophytes, pteridophytes, gymnosperms"},
  {id:4, cls:11, name:"Animal Kingdom", type:"Zoology", desc:"Non-chordates to chordates overview"},
  {id:5, cls:11, name:"Morphology of Flowering Plants", type:"Botany", desc:"Root, stem, leaf, inflorescence, flower, fruits and seeds"},
  {id:6, cls:11, name:"Anatomy of Flowering Plants", type:"Botany", desc:"Plant tissues and internal structure"},
  {id:7, cls:11, name:"Structural Organisation in Animals", type:"Zoology", desc:"Animal tissues and structural organisation"},
  {id:8, cls:11, name:"Cell: The Unit of Life", type:"Botany", desc:"Cell theory, organelles and cell structure"},
  {id:9, cls:11, name:"Biomolecules", type:"Botany", desc:"Proteins, carbohydrates, lipids and enzymes"},
  {id:10, cls:11, name:"Cell Cycle and Cell Division", type:"Botany", desc:"Cell cycle, mitosis and meiosis"},
  {id:11, cls:11, name:"Photosynthesis in Higher Plants", type:"Botany", desc:"Light reactions, carbon fixation and pathways"},
  {id:12, cls:11, name:"Respiration in Plants", type:"Botany", desc:"Glycolysis, Krebs cycle and energy release"},
  {id:13, cls:11, name:"Plant Growth and Development", type:"Botany", desc:"Growth regulators and plant development"},
  {id:14, cls:11, name:"Breathing and Exchange of Gases", type:"Zoology", desc:"Respiration, gas transport and exchange"},
  {id:15, cls:11, name:"Body Fluids and Circulation", type:"Zoology", desc:"Blood, lymph, heart and circulation"},
  {id:16, cls:11, name:"Excretory Products and Their Elimination", type:"Zoology", desc:"Kidney, nephron and urine formation"},
  {id:17, cls:11, name:"Locomotion and Movement", type:"Zoology", desc:"Muscles, skeleton and movement"},
  {id:18, cls:11, name:"Neural Control and Coordination", type:"Zoology", desc:"Neurons, nervous system and reflexes"},
  {id:19, cls:11, name:"Chemical Coordination and Integration", type:"Zoology", desc:"Endocrine glands and hormones"},
  {id:20, cls:12, name:"Sexual Reproduction in Flowering Plants", type:"Botany", desc:"Flower structure, pollination and fertilisation"},
  {id:21, cls:12, name:"Human Reproduction", type:"Zoology", desc:"Reproductive systems, gametogenesis and development"},
  {id:22, cls:12, name:"Reproductive Health", type:"Zoology", desc:"Contraception, reproductive health and infertility"},
  {id:23, cls:12, name:"Principles of Inheritance and Variation", type:"Botany", desc:"Mendelian genetics, inheritance and variation"},
  {id:24, cls:12, name:"Molecular Basis of Inheritance", type:"Botany", desc:"DNA, RNA, replication and gene expression"},
  {id:25, cls:12, name:"Evolution", type:"Zoology", desc:"Origin of life, evidence and evolutionary theory"},
  {id:26, cls:12, name:"Human Health and Disease", type:"Zoology", desc:"Immunity, common diseases and prevention"},
  {id:27, cls:12, name:"Microbes in Human Welfare", type:"Botany", desc:"Microbes in food, industry and environment"},
  {id:28, cls:12, name:"Biotechnology: Principles and Processes", type:"Botany", desc:"Tools, vectors and recombinant DNA technology"},
  {id:29, cls:12, name:"Biotechnology and Its Applications", type:"Botany", desc:"Applications in medicine, agriculture and research"},
  {id:30, cls:12, name:"Organisms and Populations", type:"Botany", desc:"Population interactions and adaptations"},
  {id:31, cls:12, name:"Ecosystem", type:"Botany", desc:"Energy flow, productivity and nutrient cycles"},
  {id:32, cls:12, name:"Biodiversity and Conservation", type:"Botany", desc:"Biodiversity patterns, threats and conservation"}
];

// ---- Physics (ids 101+) and Chemistry (ids 201+). Names follow NCERT; edit freely, but never change an id once students bought it.
(function () {
  var P = function (id, cls, name, desc) { return { id: id, cls: cls, name: name, type: "Physics", subj: "Physics", desc: desc }; };
  var C = function (id, cls, branch, name, desc) { return { id: id, cls: cls, name: name, type: "Chemistry", subj: "Chemistry", branch: branch, desc: desc }; };
  window.MR_CHAPTERS = window.MR_CHAPTERS.concat([
    P(101,11,"Units and Measurements","SI units, dimensions, errors"),
    P(102,11,"Motion in a Straight Line","Kinematics in 1D, graphs"),
    P(103,11,"Motion in a Plane","Vectors, projectile and circular motion"),
    P(104,11,"Laws of Motion","Newton's laws, friction"),
    P(105,11,"Work, Energy and Power","Work-energy theorem, collisions"),
    P(106,11,"System of Particles and Rotational Motion","Centre of mass, torque, moment of inertia"),
    P(107,11,"Gravitation","Kepler's laws, g, satellites"),
    P(108,11,"Mechanical Properties of Solids","Stress, strain, elasticity"),
    P(109,11,"Mechanical Properties of Fluids","Pressure, viscosity, surface tension"),
    P(110,11,"Thermal Properties of Matter","Heat, calorimetry, heat transfer"),
    P(111,11,"Thermodynamics","Laws of thermodynamics, heat engines"),
    P(112,11,"Kinetic Theory","Gas laws, degrees of freedom"),
    P(113,11,"Oscillations","SHM, spring and pendulum"),
    P(114,11,"Waves","Wave motion, standing waves, beats"),
    P(115,12,"Electric Charges and Fields","Coulomb's law, Gauss's law"),
    P(116,12,"Electrostatic Potential and Capacitance","Potential, capacitors"),
    P(117,12,"Current Electricity","Ohm's law, Kirchhoff, circuits"),
    P(118,12,"Moving Charges and Magnetism","Biot-Savart, Ampere's law"),
    P(119,12,"Magnetism and Matter","Magnets, magnetic materials"),
    P(120,12,"Electromagnetic Induction","Faraday, Lenz, inductance"),
    P(121,12,"Alternating Current","AC circuits, resonance, transformers"),
    P(122,12,"Electromagnetic Waves","EM spectrum, properties"),
    P(123,12,"Ray Optics and Optical Instruments","Reflection, refraction, lenses"),
    P(124,12,"Wave Optics","Interference, diffraction, polarisation"),
    P(125,12,"Dual Nature of Radiation and Matter","Photoelectric effect, de Broglie"),
    P(126,12,"Atoms","Atomic models, hydrogen spectrum"),
    P(127,12,"Nuclei","Radioactivity, binding energy"),
    P(128,12,"Semiconductor Electronics","Diodes, transistors, logic gates"),

    C(201,11,"Physical","Some Basic Concepts of Chemistry","Mole concept, stoichiometry"),
    C(202,11,"Physical","Structure of Atom","Quantum numbers, orbitals, configuration"),
    C(203,11,"Inorganic","Classification of Elements and Periodicity","Periodic trends"),
    C(204,11,"Inorganic","Chemical Bonding and Molecular Structure","VSEPR, hybridisation, MOT"),
    C(205,11,"Physical","Chemical Thermodynamics","Enthalpy, entropy, Gibbs energy"),
    C(206,11,"Physical","Equilibrium","Chemical and ionic equilibrium"),
    C(207,11,"Physical","Redox Reactions","Oxidation number, balancing"),
    C(208,11,"Organic","Organic Chemistry: Basic Principles and Techniques","IUPAC, isomerism, electronic effects"),
    C(209,11,"Organic","Hydrocarbons","Alkanes, alkenes, alkynes, aromatic"),
    C(210,12,"Physical","Solutions","Concentration, colligative properties"),
    C(211,12,"Physical","Electrochemistry","Cells, Nernst equation"),
    C(212,12,"Physical","Chemical Kinetics","Rate law, order, Arrhenius"),
    C(213,12,"Inorganic","The p-Block Elements","Groups 15-18"),
    C(214,12,"Inorganic","The d- and f-Block Elements","Transition elements, properties"),
    C(215,12,"Inorganic","Coordination Compounds","Werner, CFT, nomenclature"),
    C(216,12,"Organic","Haloalkanes and Haloarenes","SN1, SN2, reactions"),
    C(217,12,"Organic","Alcohols, Phenols and Ethers","Preparation, reactions"),
    C(218,12,"Organic","Aldehydes, Ketones and Carboxylic Acids","Named reactions"),
    C(219,12,"Organic","Amines","Basicity, reactions, diazonium salts"),
    C(220,12,"Organic","Biomolecules","Carbohydrates, proteins, vitamins")
  ]);
})();

// Biology chapters had no subject field: tag them.
window.MR_CHAPTERS.forEach(function (c) { if (!c.subj) c.subj = "Biology"; });

// Subjects shown as folders in Notes. 'extra' is the 3rd section; its name depends on the subject.
window.MR_SUBJECTS = {
  Biology:   { icon: "\uD83E\uDDEC", extra: "Diagrams & Tables" },
  Physics:   { icon: "\u26A1",       extra: "Formula Sheet" },
  Chemistry: { icon: "\uD83E\uDDEA", extra: "Important Reactions" }
};
window.MR_BRANCHES = ["Physical", "Organic", "Inorganic"];

// Every chapter has three sellable sections: short, full, extra (extra's label depends on the subject).
window.MR_KINDS = { short: "Short Notes", full: "Full Notes", extra: "Diagrams / Formula / Reactions" };
window.mrKindList = function (ch) {
  var sj = (window.MR_SUBJECTS || {})[ch && ch.subj] || {};
  return [["short", "Short Notes"], ["full", "Full Notes"], ["extra", sj.extra || "Extra"]];
};

// Human readable name of an item key:  "3_short" -> chapter note,  "t_abc" -> test.
window.mrLabel = function (key, tests) {
  key = String(key || "");
  if (key === "batch") return "\uD83C\uDF93 Full Batch (saare notes + tests)";
  if (key.indexOf("t_") === 0) {
    var t = (tests || {})[key.slice(2)];
    return "\uD83D\uDCDD " + (t && t.title ? t.title : "Test");
  }
  var p = key.split("_"), id = Number(p[0]);
  var c = (window.MR_CHAPTERS || []).find(function (x) { return x.id === id; });
  var kl = c ? window.mrKindList(c).find(function (k) { return k[0] === p[1]; }) : null;
  return c && kl ? c.subj + " \u00B7 Class " + c.cls + " \u00B7 " + c.name + " \u2014 " + kl[1] : key;
};

// Item keys look like "3_short", "3_full", "3_extra" or "t_<testId>".
window.mrValidKey = function (k) { return /^(\d+_(short|full|extra)|t_[A-Za-z0-9]+)$/.test(String(k)); };
