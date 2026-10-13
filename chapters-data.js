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

// Every chapter has two sellable sections.
window.MR_KINDS = { short: "Short Notes", full: "Full Notes", dia: "Diagrams & Tables" };

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
  var kind = window.MR_KINDS[p[1]];
  return c && kind ? "Class " + c.cls + " \u00B7 " + c.name + " \u2014 " + kind : key;
};

// Item keys look like "3_short", "3_full" or "t_<testId>".
window.mrValidKey = function (k) { return /^(\d+_(short|full|dia)|t_[A-Za-z0-9]+)$/.test(String(k)); };
