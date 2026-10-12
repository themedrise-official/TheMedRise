// Default chapter list. Admin panel overrides price / availability / file link via Firestore.
window.MR_CHAPTERS = [
      {id:1, cls:11, name:"The Living World", type:"Botany", desc:"Characteristics of living organisms, diversity, taxonomy", available:false, price:"Free", file:""},
      {id:2, cls:11, name:"Biological Classification", type:"Botany", desc:"Five-kingdom classification, salient features", available:false, price:"Free", file:""},
      {id:3, cls:11, name:"Plant Kingdom", type:"Botany", desc:"Algae, bryophytes, pteridophytes, gymnosperms", available:false, price:"Free", file:""},
      {id:4, cls:11, name:"Animal Kingdom", type:"Zoology", desc:"Non-chordates to chordates overview", available:false, price:"Free", file:""},
      {id:5, cls:11, name:"Morphology of Flowering Plants", type:"Botany", desc:"Root, stem, leaf, inflorescence, flower, fruits and seeds", available:false, price:"Paid", file:""},
      {id:6, cls:11, name:"Anatomy of Flowering Plants", type:"Botany", desc:"Plant tissues and internal structure", available:false, price:"Paid", file:""},
      {id:7, cls:11, name:"Structural Organisation in Animals", type:"Zoology", desc:"Animal tissues and structural organisation", available:false, price:"Paid", file:""},
      {id:8, cls:11, name:"Cell: The Unit of Life", type:"Botany", desc:"Cell theory, organelles and cell structure", available:false, price:"Free", file:""},
      {id:9, cls:11, name:"Biomolecules", type:"Botany", desc:"Proteins, carbohydrates, lipids and enzymes", available:false, price:"Free", file:""},
      {id:10, cls:11, name:"Cell Cycle and Cell Division", type:"Botany", desc:"Cell cycle, mitosis and meiosis", available:false, price:"Free", file:""},
      {id:11, cls:11, name:"Photosynthesis in Higher Plants", type:"Botany", desc:"Light reactions, carbon fixation and pathways", available:false, price:"Paid", file:""},
      {id:12, cls:11, name:"Respiration in Plants", type:"Botany", desc:"Glycolysis, Krebs cycle and energy release", available:false, price:"Paid", file:""},
      {id:13, cls:11, name:"Plant Growth and Development", type:"Botany", desc:"Growth regulators and plant development", available:false, price:"Paid", file:""},
      {id:14, cls:11, name:"Breathing and Exchange of Gases", type:"Zoology", desc:"Respiration, gas transport and exchange", available:false, price:"Free", file:""},
      {id:15, cls:11, name:"Body Fluids and Circulation", type:"Zoology", desc:"Blood, lymph, heart and circulation", available:false, price:"Free", file:""},
      {id:16, cls:11, name:"Excretory Products and Their Elimination", type:"Zoology", desc:"Kidney, nephron and urine formation", available:false, price:"Free", file:""},
      {id:17, cls:11, name:"Locomotion and Movement", type:"Zoology", desc:"Muscles, skeleton and movement", available:false, price:"Paid", file:""},
      {id:18, cls:11, name:"Neural Control and Coordination", type:"Zoology", desc:"Neurons, nervous system and reflexes", available:false, price:"Paid", file:""},
      {id:19, cls:11, name:"Chemical Coordination and Integration", type:"Zoology", desc:"Endocrine glands and hormones", available:false, price:"Paid", file:""},
      {id:20, cls:12, name:"Sexual Reproduction in Flowering Plants", type:"Botany", desc:"Flower structure, pollination and fertilisation", available:false, price:"Free", file:""},
      {id:21, cls:12, name:"Human Reproduction", type:"Zoology", desc:"Reproductive systems, gametogenesis and development", available:false, price:"Free", file:""},
      {id:22, cls:12, name:"Reproductive Health", type:"Zoology", desc:"Contraception, reproductive health and infertility", available:false, price:"Free", file:""},
      {id:23, cls:12, name:"Principles of Inheritance and Variation", type:"Botany", desc:"Mendelian genetics, inheritance and variation", available:false, price:"Paid", file:""},
      {id:24, cls:12, name:"Molecular Basis of Inheritance", type:"Botany", desc:"DNA, RNA, replication and gene expression", available:false, price:"Paid", file:""},
      {id:25, cls:12, name:"Evolution", type:"Zoology", desc:"Origin of life, evidence and evolutionary theory", available:false, price:"Paid", file:""},
      {id:26, cls:12, name:"Human Health and Disease", type:"Zoology", desc:"Immunity, common diseases and prevention", available:false, price:"Free", file:""},
      {id:27, cls:12, name:"Microbes in Human Welfare", type:"Botany", desc:"Microbes in food, industry and environment", available:false, price:"Paid", file:""},
      {id:28, cls:12, name:"Biotechnology: Principles and Processes", type:"Botany", desc:"Tools, vectors and recombinant DNA technology", available:false, price:"Paid", file:""},
      {id:29, cls:12, name:"Biotechnology and Its Applications", type:"Botany", desc:"Applications in medicine, agriculture and research", available:false, price:"Paid", file:""},
      {id:30, cls:12, name:"Organisms and Populations", type:"Botany", desc:"Population interactions and adaptations", available:false, price:"Free", file:""},
      {id:31, cls:12, name:"Ecosystem", type:"Botany", desc:"Energy flow, productivity and nutrient cycles", available:false, price:"Free", file:""},
      {id:32, cls:12, name:"Biodiversity and Conservation", type:"Botany", desc:"Biodiversity patterns, threats and conservation", available:false, price:"Free", file:""}
    ];

// Human-readable label for a product key ("5_short", "5_full", "t_<testId>").
window.mrLabel = window.mrLabel || function (k, tests) {
  var p = String(k).split("_");
  if (p[0] === "t") { var t = (tests || {})[String(k).slice(2)]; return "Test: " + ((t && t.title) || String(k).slice(2)); }
  var c = window.MR_CHAPTERS.find(function (x) { return String(x.id) === p[0]; });
  return (c ? c.name : "Chapter " + p[0]) + " \u00b7 " + (p[1] === "short" ? "Short Notes" : "Full Notes");
};
