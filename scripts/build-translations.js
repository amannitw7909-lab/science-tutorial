/**
 * scripts/build-translations.js
 * Generates assets/js/translations-data.js with complete translations
 * for index.html (all 15 topics + home views + common UI).
 */
const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  fs.readdirSync(dir).forEach(file => {
    let full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) results = results.concat(walk(full));
    else if (file.endsWith('.json')) results.push(full);
  });
  return results;
}

const bundle = {
  hi: { common: {}, solutions: {}, dfBlock: {} },
  en: { common: {}, solutions: {}, dfBlock: {} }
};

['hi', 'en'].forEach(lang => {
  const commonP = `i18n/${lang}/common.json`;
  if (fs.existsSync(commonP)) {
    bundle[lang].common = JSON.parse(fs.readFileSync(commonP, 'utf8'));
  }
  for (let i = 1; i <= 7; i++) {
    const num = '0' + i;
    const p = `i18n/${lang}/solutions/topic-${num}.json`;
    if (fs.existsSync(p)) {
      bundle[lang].solutions[num] = JSON.parse(fs.readFileSync(p, 'utf8'));
    }
  }
  for (let i = 1; i <= 8; i++) {
    const num = '0' + i;
    const p = `i18n/${lang}/d-and-f-block/topic-${num}.json`;
    if (fs.existsSync(p)) {
      bundle[lang].dfBlock[num] = JSON.parse(fs.readFileSync(p, 'utf8'));
    }
  }
});

const dict = {};

function add(hi, en) {
  if (hi && en) {
    dict[hi.trim()] = en.trim();
  }
}

// ──────────────────────────────────────────────
// COMMON UI & GLOBAL HEADERS
// ──────────────────────────────────────────────
add("NCERT विज्ञान ट्यूटोरियल", "NCERT Science Tutorial");
add("कक्षा 12 • रसायन विज्ञान", "Class 12 • Chemistry");
add("NCERT • कक्षा 12", "NCERT • Class 12");
add("NCERT • Class 12", "NCERT • Class 12");
add("अध्याय 1: विलयन (Solutions)", "Chapter 1: Solutions");
add("अध्याय 2: d- एवं f-ब्लॉक के तत्व", "Chapter 2: d- & f-Block Elements");
add("अध्याय 1: विलयन", "Chapter 1: Solutions");
add("अध्याय 2: d-एवं f-ब्लॉक के तत्व", "Chapter 2: d- & f-Block Elements");
add("NCERT कक्षा 12 रसायन विज्ञान", "NCERT Class 12 Chemistry");
add("पाठ्यक्रम अवलोकन (Home)", "Course Overview (Home)");
add("All Chapters Portal", "All Chapters Portal");
add("विषय सूची (Topics)", "Topics (Syllabus)");
add("विषय सूची (Chapter Topics)", "Chapter Topics");
add("अध्याय प्रगति", "Chapter Progress");
add("अध्याय प्रगति:", "Chapter Progress:");
add("अध्याय अवलोकन", "Chapter Overview");
add("अध्याय परिचय (Chapter Overview)", "Chapter Overview");
add("संपूर्ण पाठ्यक्रम व इंटरैक्टिव अध्ययन सामग्री", "Complete Syllabus & Interactive Study Material");
add("🏠 मुख्य पृष्ठ", "🏠 Course Home");
add("पिछला (Previous)", "Previous");
add("अगला (Next)", "Next");
add("← 🏠 होम पेज", "← 🏠 Course Home");
add("← अध्याय 1 ओवरव्यू", "← Chapter 1 Overview");
add("← अध्याय 2 ओवरव्यू", "← Chapter 2 Overview");
add("स्व-मूल्यांकन प्रश्न", "Self-Assessment Question");
add("जाँचें", "Check Answer");
add("रीसेट", "Reset");
add("एनिमेशन शुरू करें", "Start Animation");
add("एनिमेशन रोकें", "Pause Animation");
add("गति:", "Speed:");
add("तापमान (Temperature):", "Temperature:");
add("दाब (Pressure):", "Pressure:");
add("सही उत्तर ✓!", "Correct Answer ✓!");
add("गलत उत्तर ✗. पुनः प्रयास करें!", "Incorrect ✗. Try again!");
add("पूर्ण (Done)", "Completed");
add("🏠 अध्याय अवलोकन पर वापस जाएँ →", "🏠 Return to Chapter Overview →");

// ──────────────────────────────────────────────
// VIEW 1: HOME
// ──────────────────────────────────────────────
add(
  `कक्षा 12 रसायन विज्ञान <br>\n              <span class="hero__title-gradient">इंटरैक्टिव अध्ययन मंच</span>`,
  `Class 12 Chemistry <br>\n              <span class="hero__title-gradient">Interactive Learning Portal</span>`
);
add(
  "MP Board एवं NCERT अद्यतन पाठ्यक्रम पर आधारित सचित्र नोट्स, विन्यास सारणियाँ, रासायनिक अभिक्रियाएँ, लाइव सिमुलेटर एवं स्व-मूल्यांकन क्विज़।",
  "Comprehensive illustrated notes, configuration tables, chemical reactions, live simulators, and self-assessment quizzes based on the latest NCERT & MP Board syllabus."
);
add("⚗️ अध्याय 1: विलयन", "⚗️ Chapter 1: Solutions");
add("⚛️ अध्याय 2: d- एवं f-ब्लॉक", "⚛️ Chapter 2: d- & f-Block");
add("अध्याय सूची", "Chapter List");
add("कक्षा 12 रसायन विज्ञान के अध्याय", "Class 12 Chemistry Chapters");
add(
  "अध्ययन करने के लिए नीचे दिए गए किसी भी अध्याय पर क्लिक करें। प्रत्येक अध्याय में व्यापक नोट्स और सिमुलेटर शामिल हैं।",
  "Click on any chapter below to begin studying. Each chapter includes comprehensive notes, interactive widgets, and self-assessment quizzes."
);
add("⚗️ अध्याय 01 • 7 विषय", "⚗️ Chapter 01 • 7 Topics");
add("विलयन (Solutions)", "Solutions");
add(
  "समांगी मिश्रण के 9 प्रकार, सांद्रता इकाइयाँ (मोलरता, मोललता, मोल अंश), विलेयता व हेनरी का नियम, वाष्प दाब व राउल्ट का नियम, आदर्श व अनादर्श विलयन, 4 अणुसंख्यक गुणधर्म तथा वान्ट हॉफ गुणक (i)।",
  "9 types of homogeneous mixtures, concentration units (molarity, molality, mole fraction), solubility & Henry's law, vapour pressure & Raoult's law, ideal & non-ideal solutions, 4 colligative properties, and van 't Hoff factor (i)."
);
add("🧪 7 विषय", "🧪 7 Topics");
add("🧮 5 इंटरैक्टिव सिमुलेटर", "🧮 5 Interactive Simulators");
add("📊 3 Chart.js आरेख", "📊 3 Chart.js Graphs");
add("⚛️ अध्याय 02 • 8 विषय", "⚛️ Chapter 02 • 8 Topics");
add("d- एवं f-ब्लॉक के तत्व", "d- & f-Block Elements");
add(
  `d-ब्लॉक के 40 तत्व, 4 संक्रमण श्रेणियाँ (3d, 4d, 5d, 6d), समूह 12 अपवाद, परिवर्ती ऑक्सीकरण अवस्थाएँ, उत्प्रेरक गुण, रंगीन आयन (d-d संक्रमण), चक्रण सूत्र \\(\\mu = \\sqrt{n(n+2)}\\), 7 मिश्र धातुएँ, f-ब्लॉक (लेन्थेनॉइड व ऐक्टिनॉइड), लेन्थेनॉइड संकुचन, \\(K_2Cr_2O_7\\) तथा \\(KMnO_4\\)।`,
  `40 d-block elements, 4 transition series (3d, 4d, 5d, 6d), Group 12 exceptions, variable oxidation states, catalytic properties, coloured ions (d-d transition), spin-only formula \\(\\mu = \\sqrt{n(n+2)}\\), 7 alloys, f-block (lanthanoids & actinoids), lanthanoid contraction, \\(K_2Cr_2O_7\\) and \\(KMnO_4\\).`
);
add("📋 8 विषय (40 तत्व सारणियाँ)", "📋 8 Topics (40 Element Tables)");
add("🧲 चुंबकीय कैलकुलेटर", "🧲 Magnetic Calculator");
add("🎨 रंगीन आयन पैलेट", "🎨 Coloured Ions Palette");
add(
  "Class 12 Chemistry | NCERT Based MP Board 2026-27 | संपर्क: 📞 9074248383",
  "Class 12 Chemistry | NCERT Based MP Board 2026-27 | Contact: 📞 9074248383"
);

// ──────────────────────────────────────────────
// VIEW 2: SOLUTIONS HUB
// ──────────────────────────────────────────────
add("अध्याय 01", "Chapter 01");
add("अध्याय 1: विलयन (Solutions)", "Chapter 1: Solutions");
add(
  "विलयन दो या दो से अधिक पदार्थों का समांगी मिश्रण है — संपूर्ण 7 विषय",
  "A solution is a homogeneous mixture of two or more substances — Complete 7 Topics"
);
add("पहला विषय शुरू करें: विलयन के प्रकार →", "Start Topic 01: Types of Solutions →");
add("01. विलयन के प्रकार", "01. Types of Solutions");
add("ठोस, द्रव और गैस विलयनों के 9 प्रकार, विलेय और विलायक", "9 types of solid, liquid and gaseous solutions, solute & solvent roles");
add("02. सांद्रता व्यक्त करने के तरीके", "02. Expressing Concentration");
add("द्रव्यमान %, मोल अंश, मोलरता (M), मोललता (m), ppm व कैलकुलेटर", "Mass %, mole fraction, molarity (M), molality (m), ppm and live calculator");
add("03. विलेयता व हेनरी का नियम", "03. Solubility & Henry's Law");
add("ठोस और गैसों की विलेयता, तापमान प्रभाव, हेनरी का नियम", "Solubility of solids & gases, temperature effect, Henry's law");
add("04. वाष्प दाब और राउल्ट का नियम", "04. Vapour Pressure & Raoult's Law");
add("वाष्प दाब अवनमन, राउल्ट का नियम, P-x आरेख", "Lowering of vapour pressure, Raoult's law, P-x diagram");
add("05. आदर्श और अनादर्श विलयन", "05. Ideal & Non-Ideal Solutions");
add("धनात्मक व ऋणात्मक विचलन, स्थिरक्वाथी मिश्रण (Azeotropes)", "Positive & negative deviations, azeotropic mixtures");
add("06. अणुसंख्यक गुणधर्म", "06. Colligative Properties");
add("क्वथनांक उन्नयन (ΔTb), हिमांक अवनमन (ΔTf), परासरण दाब (π)", "Boiling point elevation (ΔTb), freezing point depression (ΔTf), osmotic pressure (π)");
add("07. असामान्य मोलर द्रव्यमान", "07. Abnormal Molar Masses");
add("वान्ट हॉफ गुणक (i), वियोजन एवं संगुणन, संशोधित सूत्र", "Van 't Hoff factor (i), association & dissociation, modified formulas");

// ──────────────────────────────────────────────
// VIEW 3: d- & f-BLOCK HUB
// ──────────────────────────────────────────────
add("अध्याय 02", "Chapter 02");
add("d- एवं f-ब्लॉक के तत्व", "d- & f-Block Elements");
add(
  `आवर्त सारणी के <strong>s-ब्लॉक</strong> और <strong>p-ब्लॉक</strong> के मध्य स्थित तत्वों को <strong>d-ब्लॉक के तत्व</strong> कहा जाता है। इनके (n-1)d उपकोश आंशिक भरे होते हैं और इनमें 4 श्रेणियाँ (3d, 4d, 5d, 6d) होती हैं.\n            आवर्त सारणी के मुख्य ढांचे के नीचे स्थित तत्वों को <strong>f-ब्लॉक (आंतरिक संक्रमण तत्व)</strong> कहते हैं, जिनमें लेन्थेनॉइड (4f) और ऐक्टिनॉइड (5f) श्रेणियाँ सम्मिलित हैं।`,
  `Elements positioned between the <strong>s-block</strong> and <strong>p-block</strong> of the periodic table are termed <strong>d-block elements</strong>. Their (n-1)d subshells are partially filled across 4 transition series (3d, 4d, 5d, 6d).\n            Elements located below the main body of the periodic table are known as <strong>f-block (inner transition elements)</strong>, comprising the lanthanoid (4f) and actinoid (5f) series.`
);
add(
  `आवर्त सारणी के <strong>s-ब्लॉक</strong> और <strong>p-ब्लॉक</strong> के मध्य स्थित तत्वों को <strong>d-ब्लॉक के तत्व</strong> कहा जाता है। इनके (n-1)d उपकोश आंशिक भरे होते हैं और इनमें 4 श्रेणियाँ (3d, 4d, 5d, 6d) होती हैं।\n            आवर्त सारणी के मुख्य ढांचे के नीचे स्थित तत्वों को <strong>f-ब्लॉक (आंतरिक संक्रमण तत्व)</strong> कहते हैं, जिनमें लेन्थेनॉइड (4f) और ऐक्टिनॉइड (5f) श्रेणियाँ सम्मिलित हैं।`,
  `Elements positioned between the <strong>s-block</strong> and <strong>p-block</strong> of the periodic table are termed <strong>d-block elements</strong>. Their (n-1)d subshells are partially filled across 4 transition series (3d, 4d, 5d, 6d).\n            Elements located below the main body of the periodic table are known as <strong>f-block (inner transition elements)</strong>, comprising the lanthanoid (4f) and actinoid (5f) series.`
);
add("कुल 40 d-ब्लॉक तत्व", "Total 40 d-Block Elements");
add("28 f-ब्लॉक तत्व (14+14)", "28 f-Block Elements (14+14)");
add("समूह 12 अपवाद (Zn, Cd, Hg)", "Group 12 Exceptions (Zn, Cd, Hg)");
add("लेन्थेनॉइड संकुचन", "Lanthanoid Contraction");
add("K₂Cr₂O₇ व KMnO₄", "K₂Cr₂O₇ & KMnO₄");
add("पहला विषय शुरू करें: d-ब्लॉक तत्व एवं 4 श्रेणियाँ →", "Start Topic 01: d-Block Elements & 4 Series →");
add("01. d-ब्लॉक तत्व एवं 4 संक्रमण श्रेणियाँ", "01. d-Block Elements & 4 Transition Series");
add("परिभाषा, (n-1)d उपकोश, 3d, 4d, 5d, 6d श्रेणियाँ, परमाणु संख्या 21 से 112 एवं ट्रॉन्सएक्टिनाइड", "Definition, (n-1)d subshell, 3d, 4d, 5d, 6d series, atomic numbers 21-112 & transactinides");
add("02. इलेक्ट्रॉनिक विन्यास सारणियाँ (3d, 4d, 5d, 6d)", "02. Electronic Configurations (3d, 4d, 5d, 6d)");
add("चारों संक्रमण श्रेणियों के सभी 40 तत्वों के पूर्ण विन्यास, उत्कृष्ट गैस संकेतन व अपवाद (Cr, Cu, Mo, Pd, Pt, Au)", "Complete electronic configurations of all 40 elements across 4 series, noble gas notation & anomalies (Cr, Cu, Mo, Pd, Pt, Au)");
add("03. संक्रमण तत्व: परिभाषा, अपवाद व सामान्य गुण", "03. Transition Elements: Definition, Exceptions & Properties");
add("यथार्थ परिभाषा, समूह 12 अपवाद (Zn, Cd, Hg), समूह 11 औचित्य, 8 अविशेष व 32 विशेष तत्व, 8 सामान्य गुण", "Rigorous definition, Group 12 exceptions (Zn, Cd, Hg), Group 11 rationale, 8 non-typical vs 32 typical elements, 8 general properties");
add("04. धात्विक प्रकृति, परमाणु आकार व ऑक्सीकरण अवस्थाएँ", "04. Metallic Nature, Atomic Size & Oxidation States");
add("धात्विक बंध, कठोरता, BCC/FCC/HCP संरचना, त्रिज्या क्रम (Zeff vs परिरक्षण), 3d ऑक्सीकरण सारणी, d⁵/d¹⁰ स्थायित्व", "Metallic bonding, crystal lattices (BCC/FCC/HCP), radii trends (Zeff vs shielding), 3d oxidation states, d⁵/d¹⁰ stability");
add("05. उत्प्रेरक गुण एवं रंगीन यौगिक (d-d संक्रमण)", "05. Catalytic Properties & Coloured Compounds (d-d Transition)");
add("5 चरणीय उत्प्रेरक क्रियाविधि, 7 औद्योगिक अभिक्रियाएँ सारणी, t₂g/eg विपाटन व 16 आयनों की रंग सारणी", "5-step catalytic mechanism, 7 industrial reactions table, t2g/eg splitting & 16 coloured ions palette");
add("06. चुंबकीय गुण, अंतराकाशी, मिश्र धातुएँ, संकुल, IP व घनत्व", "06. Magnetic Moment, Interstitial, Alloys, Complexes, IP & Density");
add(`चक्रण सूत्र \\(\\mu = \\sqrt{n(n+2)}\\), अंतराकाशी यौगिक, 7 प्रमुख मिश्र धातुएँ सारणी, संकुल यौगिक, आयनन एन्थैल्पी व घनत्व क्रम`, `Spin-only formula \\(\\mu = \\sqrt{n(n+2)}\\), interstitial compounds, 7 major alloys, coordination complexes, ionization enthalpy & density trends`);
add("07. f-ब्लॉक तत्व: लेन्थेनॉइड श्रेणी एवं संकुचन", "07. f-Block Elements: Lanthanoid Series & Contraction");
add("4f उपकोश, 15 तत्वों की पूर्ण विन्यास व ऑक्सीकरण सारणी, +3 व असंगत अवस्थाएँ, संकुचन व 3 परिणाम, मिश धातु", "4f subshell, 15 lanthanoid configurations & oxidation states table, +2/+4 stability, contraction & 3 consequences, Misch metal");
add("08. ऐक्टिनॉइड श्रेणी, तुलना व K₂Cr₂O₇ एवं KMnO₄", "08. Actinoid Series, Comparisons & K₂Cr₂O₇ / KMnO₄");
add("5f ऐक्टिनॉइड सारणी, परायूरेनियम तत्व, d vs f 10-बिंदु तुलना, Ln vs An 10-बिंदु तुलना, K₂Cr₂O₇ व KMnO₄ निर्माण, अभिक्रियाएँ व संरचना", "5f actinoids table, transuranics, 10-point d vs f comparison, 10-point Ln vs An comparison, K₂Cr₂O₇ & KMnO₄ preparation, reactions & structures");

// ──────────────────────────────────────────────
// ALL CHAPTER 1 TOPICS (01 - 07)
// ──────────────────────────────────────────────
add("विलयन के प्रकार", "Types of Solutions");
add("परिचय", "Introduction");
add(
  "विलयन दो या दो से अधिक पदार्थों का समांगी मिश्रण है जिसमें पदार्थ आणविक या आयनिक स्तर पर मिले होते हैं। विलयन में जो घटक अधिक मात्रा में होता है उसे <strong>विलायक (Solvent)</strong> और जो कम मात्रा में होता है उसे <strong>विलेय (Solute)</strong> कहते हैं।",
  "A solution is a homogeneous mixture of two or more substances in which components are mixed at molecular or ionic levels. The component in greater amount is the <strong>solvent</strong>, and the component in lesser amount is the <strong>solute</strong>."
);
add("विलयन के नौ प्रकार", "Nine Types of Solutions");
add("विलयन प्रकार", "Solution Type");
add("विलेय (Solute)", "Solute");
add("विलायक (Solvent)", "Solvent");
add("उदाहरण (Examples)", "Examples");
add("गैसीय विलयन", "Gaseous Solutions");
add("द्रव विलयन", "Liquid Solutions");
add("ठोस विलयन", "Solid Solutions");
add("गैस", "Gas");
add("द्रव", "Liquid");
add("ठोस", "Solid");
add("ऑक्सीजन व नाइट्रोजन का मिश्रण (वायु)", "Mixture of oxygen and nitrogen (Air)");
add("क्लोरोफॉर्म का नाइट्रोजन में मिश्रण, नमी", "Chloroform in nitrogen gas, air humidity");
add("कपूर का नाइट्रोजन गैस में विलयन", "Camphor vapour in nitrogen gas");
add("जल में घुली ऑक्सीजन, सोडा वॉटर (CO₂ जल में)", "Oxygen in water, Soda water (CO₂ in water)");
add("जल में एथेनॉल", "Ethanol in water");
add("जल में घुला ग्लूकोस या नमक (NaCl)", "Glucose or common salt (NaCl) in water");
add("पैलेडियम में हाइड्रोजन गैस का अधिशोषण", "Adsorption of hydrogen gas on palladium");
add("सोडियम के साथ पारे का अमलगम (Na-Hg)", "Sodium amalgam with mercury (Na-Hg)");
add("पीतल (Zn + Cu), ताँबे का सोने में विलयन", "Brass (Zn + Cu), copper dissolved in gold");
add("विलयन प्रकार मैट्रिक्स अभ्यास (Drag &amp; Drop)", "Solution Types Matrix Exercise (Drag & Drop)");
add("विलयन प्रकार मैट्रिक्स अभ्यास (Drag & Drop)", "Solution Types Matrix Exercise (Drag & Drop)");
add("नीचे दिए गए उदाहरणों को सही विलयन प्रकार में खींचकर रखें:", "Drag and drop the examples below into their correct solution type:");
add("विलयन बनने की आणविक प्रक्रिया (NaCl Dissolving Simulator)", "Molecular Dissolution Process (NaCl Dissolving Simulator)");
add("🔵 जल अणु", "🔵 Water Molecule");
add("🟣 Na⁺ आयन", "🟣 Na⁺ Ion");
add("🟢 Cl⁻ आयन", "🟢 Cl⁻ Ion");
add("प्रश्न: पीतल (Brass) मिश्रधातु किस प्रकार का विलयन है?", "Question: What type of solution is brass alloy?");
add("द्रव में ठोस", "Solid in liquid");
add("ठोस में ठोस (Solid in Solid)", "Solid in solid");
add("गैस में ठोस", "Solid in gas");
add("02. सांद्रता व्यक्त करने के तरीके →", "02. Expressing Concentration →");
add("← 01. विलयन के प्रकार", "← 01. Types of Solutions");

add("सांद्रता व्यक्त करने के तरीके", "Expressing Concentration of Solutions");
add("सांद्रता की प्रमुख इकाइयाँ", "Key Concentration Units");
add("1. मोल अंश (Mole Fraction - x)", "1. Mole Fraction (x)");
add("2. मोलरता (Molarity - M)", "2. Molarity (M)");
add("1 लीटर विलयन में घुले विलेय के मोलों की संख्या (यह ताप पर निर्भर करती है):", "Number of moles of solute dissolved in 1 litre of solution (temperature-dependent):");
add("3. मोललता (Molality - m)", "3. Molality (m)");
add("1 kg विलायक में घुले विलेय के मोलों की संख्या (यह ताप से स्वतंत्र है):", "Number of moles of solute dissolved in 1 kg of solvent (temperature-independent):");
add("लाइव सांद्रता कैलकुलेटर (Concentration Calculator)", "Live Concentration Calculator");
add("विलेय द्रव्यमान (wB in g):", "Solute Mass (wB in g):");
add("मोलर द्रव्यमान (MB in g/mol):", "Molar Mass (MB in g/mol):");
add("विलयन आयतन (V in mL):", "Solution Volume (V in mL):");
add("विलेय के मोल (nB)", "Solute Moles (nB)");
add("मोलरता (M)", "Molarity (M)");
add("द्रव्यमान % (w/v)", "Mass % (w/v)");
add("प्रश्न: कौन सी इकाई ताप परिवर्तन से अप्रभावित रहती है?", "Question: Which concentration unit remains unaffected by temperature changes?");
add("मोलरता", "Molarity");
add("मोललता (Molality)", "Molality");
add("नॉर्मलता", "Normality");
add("03. विलेयता व हेनरी का नियम →", "03. Solubility & Henry's Law →");
add("← 02. सांद्रता व्यक्त करने के तरीके", "← 02. Expressing Concentration");

add("विलेयता व हेनरी का नियम", "Solubility & Henry's Law");
add("हेनरी का नियम (Henry's Law)", "Henry's Law");
add(
  "स्थिर ताप पर द्रव में गैस की विलेयता द्रव की सतह पर गैस के आंशिक दाब के समानुपाती होती है:",
  "At constant temperature, the solubility of a gas in a liquid is directly proportional to the partial pressure of the gas above the liquid surface:"
);
add(
  `ताप बढ़ने पर \\(K_H\\) बढ़ता है, अतः गैस की विलेयता घटती है।`,
  `As temperature increases, \\(K_H\\) increases, so gas solubility decreases.`
);
add("विलेयता वक्र (Solubility Curves Simulation)", "Solubility Curves Simulation");
add("प्रश्न: ठंडे जल में जलीय जीव अधिक सहज क्यों रहते हैं?", "Question: Why are aquatic species more comfortable in cold water than in warm water?");
add("क्योंकि कम ताप पर अधिक ऑक्सीजन घुली होती है", "Because more oxygen is dissolved at lower temperatures");
add("क्योंकि कम ताप पर जल भारी होता है", "Because water is heavier at lower temperatures");
add("04. वाष्प दाब और राउल्ट का नियम →", "04. Vapour Pressure & Raoult's Law →");
add("← 03. विलेयता व हेनरी का नियम", "← 03. Solubility & Henry's Law");

add("वाष्प दाब और राउल्ट का नियम", "Vapour Pressure & Raoult's Law");
add("राउल्ट का नियम (Raoult's Law)", "Raoult's Law");
add("P-x वाष्प दाब आरेख सिमुलेटर", "P-x Vapour Pressure Diagram Simulator");
add("मोल अंश x₂:", "Mole Fraction x₂:");
add("प्रश्न: अवाष्पशील विलेय मिलाने पर वाष्प दाब में क्या परिवर्तन होता है?", "Question: What happens to vapour pressure when a non-volatile solute is added?");
add("वाष्प दाब कम हो जाता है (अवनमन)", "Vapour pressure decreases (lowering)");
add("वाष्प दाब घटता है (अवनमन)", "Vapour pressure decreases (lowering)");
add("वाष्प दाब बढ़ता है", "Vapour pressure increases");
add("अपरिवर्तित रहता है", "Remains unchanged");
add("05. आदर्श और अनादर्श विलयन →", "05. Ideal & Non-Ideal Solutions →");
add("← 04. वाष्प दाब और राउल्ट का नियम", "← 04. Vapour Pressure & Raoult's Law");

add("आदर्श और अनादर्श विलयन", "Ideal & Non-Ideal Solutions");
add("आदर्श बनाम अनादर्श विलयन", "Ideal vs Non-Ideal Solutions");
add("आदर्श विलयन (Ideal)", "Ideal Solution");
add("धनात्मक विचलन (+ve Dev)", "Positive Deviation (+ve Dev)");
add("ऋणात्मक विचलन (-ve Dev)", "Negative Deviation (-ve Dev)");
add(`राउल्ट नियम का पालन, \\(\\Delta H_{\\text{mix}} = 0\\), \\(\\Delta V_{\\text{mix}} = 0\\), \\(A-B \\approx A-A, B-B\\)`, `Obeys Raoult's law, \\(\\Delta H_{\\text{mix}} = 0\\), \\(\\Delta V_{\\text{mix}} = 0\\), \\(A-B \\approx A-A, B-B\\)`);
add(`\\(p > p_{\\text{calc}}\\), \\(\\Delta H > 0\\), \\(\\Delta V > 0\\), \\(A-B < A-A, B-B\\) (उदा: एथेनॉल + एसीटोन)`, `\\(p > p_{\\text{calc}}\\), \\(\\Delta H > 0\\), \\(\\Delta V > 0\\), \\(A-B < A-A, B-B\\) (e.g. Ethanol + Acetone)`);
add(`\\(p < p_{\\text{calc}}\\), \\(\\Delta H < 0\\), \\(\\Delta V < 0\\), \\(A-B > A-A, B-B\\) (उदा: क्लोरोफॉर्म + एसीटोन)`, `\\(p < p_{\\text{calc}}\\), \\(\\Delta H < 0\\), \\(\\Delta V < 0\\), \\(A-B > A-A, B-B\\) (e.g. Chloroform + Acetone)`);
add("विचलन वक्र तुलनात्मक आरेख", "Deviation Curves Comparison Diagram");
add("आदर्श रेखा", "Ideal Line");
add("धनात्मक विचलन (+ve)", "Positive Deviation (+ve)");
add("ऋणात्मक विचलन (-ve)", "Negative Deviation (-ve)");
add("प्रश्न: क्लोरोफॉर्म + एसीटोन का मिश्रण किस प्रकार का विचलन प्रदर्शित करता है?", "Question: What type of deviation is exhibited by a mixture of chloroform and acetone?");
add("धनात्मक विचलन", "Positive Deviation");
add("ऋणात्मक विचलन (Negative Deviation)", "Negative Deviation");
add("ऋणात्मक विचलन (H-बंध निर्माण के कारण)", "Negative Deviation (due to H-bonding)");
add("आदर्श व्यवहार", "Ideal Behaviour");
add("06. अणुसंख्यक गुणधर्म →", "06. Colligative Properties →");
add("← 05. आदर्श और अनादर्श विलयन", "← 05. Ideal & Non-Ideal Solutions");

add("अणुसंख्यक गुणधर्म", "Colligative Properties");
add("चार अणुसंख्यक गुणधर्म", "Four Colligative Properties");
add("क्वथनांक उन्नयन व हिमांक अवनमन सिमुलेटर", "Boiling Point Elevation & Freezing Point Depression Simulator");
add("विलेय यूरिया की मात्रा (in 1 kg water):", "Amount of urea solute (in 1 kg water):");
add("प्रश्न: प्रोटीन और बहुलकों का मोलर द्रव्यमान ज्ञात करने की सर्वोत्तम विधि कौन सी है?", "Question: Which is the best method for determining molar masses of proteins and polymers?");
add("परासरण दाब विधि (Osmotic Pressure)", "Osmotic Pressure Method");
add("परासरण दाब विधि (कम ताप व कमरे के ताप पर मापन)", "Osmotic pressure method (measured at room temperature)");
add("क्वथनांक उन्नयन", "Boiling point elevation");
add("हिमांक अवनमन", "Freezing point depression");
add("07. असामान्य मोलर द्रव्यमान →", "07. Abnormal Molar Masses →");
add("← 06. अणुसंख्यक गुणधर्म", "← 06. Colligative Properties");

add("असामान्य मोलर द्रव्यमान", "Abnormal Molar Masses");
add("वान्ट हॉफ गुणक (Van't Hoff Factor — i)", "Van 't Hoff Factor (i)");
add(`वियोजन: \\(i > 1\\)`, `Dissociation: \\(i > 1\\)`);
add(`संगुणन: \\(i < 1\\)`, `Association: \\(i < 1\\)`);
add(`अनपघट्य: \\(i = 1\\)`, `Non-electrolyte: \\(i = 1\\)`);
add("वान्ट हॉफ गुणक (i) कैलकुलेटर", "Van 't Hoff Factor (i) Calculator");
add("विद्युत अपघट्य:", "Electrolyte Type:");
add("वियोजन की मात्रा (α):", "Degree of Dissociation (α):");
add("प्रश्न: 0.1 M जलीय विलयनों में से किसका हिमांक अवनमन सर्वाधिक होगा?", "Question: Which of the following 0.1 M aqueous solutions will show maximum freezing point depression?");
add("0.1 M ग्लूकोस (i = 1)", "0.1 M Glucose (i = 1)");
add("प्रश्न: बेन्जीन में ऐसीटिक अम्ल के संगुणन (डिमर) के लिए वान्ट हॉफ गुणक (i) का मान क्या होगा?", "Question: What is the value of van 't Hoff factor (i) for complete dimerization of acetic acid in benzene?");
add("i = 0.5 (आधा)", "i = 0.5 (half)");
add("i = 2.0 (दोगुना)", "i = 2.0 (double)");
add("i = 1.0", "i = 1.0");

// ──────────────────────────────────────────────
// ALL CHAPTER 2 TOPICS (01 - 08)
// ──────────────────────────────────────────────
add("d-ब्लॉक तत्व एवं 4 संक्रमण श्रेणियाँ", "d-Block Elements & 4 Transition Series");
add("d-ब्लॉक तत्व (d-Block Elements)", "d-Block Elements: Definition & Position");
add(
  "<strong>परिभाषा:</strong> वे तत्त्व, जिनके परमाणुओं में अन्तिम इलेक्ट्रॉन d- कक्षक में भरे जाते हों, <strong>d-ब्लॉक के तत्व</strong> कहलाते है।",
  "<strong>Definition:</strong> Elements in whose atoms the last electron enters into the d-orbital are called <strong>d-block elements</strong>."
);
add(
  "इन तत्वों में <strong>(n-1) d उपकोश आंशिक भरे होते हैं</strong> या इनमें आने वाला इलेक्ट्रॉन (n-1) d उपकोश में प्रवेश करता है।",
  "In these elements, the <strong>(n-1)d subshell is partially filled</strong> or the incoming electron enters the (n-1)d subshell."
);
add(
  "इन तत्वों में बाहरी कोश (n) में इलेक्ट्रॉनों की संख्या समान रहती है इसलिये इन तत्वों के गुणों में समानता पाई जाती है।",
  "In these elements, the number of electrons in the outermost shell (n) remains similar, hence similarity is observed in their properties."
);
add(
  "d- ब्लॉक तत्वों को <strong>संक्रमण तत्व (Transition Elements)</strong> भी कहते हैं।",
  "d-block elements are also termed <strong>transition elements</strong>."
);
add(
  "आवर्त सारणी में कुल d-ब्लॉक तत्वों की संख्या <strong>40</strong> है।",
  "Total number of d-block elements in the periodic table is <strong>40</strong>."
);
add(
  "संक्रमण तत्वों को <strong>चार संक्रमण श्रेणियों</strong> में विभाजित किया गया है।",
  "Transition elements are divided into <strong>four transition series</strong>."
);
add("चार संक्रमण श्रेणियाँ (Four Transition Series)", "Four Transition Series (3d, 4d, 5d, 6d)");
add("(a) प्रथम संक्रमण श्रेणी (First Transition Series — 3d श्रेणी)", "(a) First Transition Series (3d Series)");
add("इस श्रेणी को <strong>3d संक्रमण श्रेणी</strong> भी कहते हैं।", "This series is also known as the <strong>3d transition series</strong>.");
add("इस श्रेणी में <strong>10 तत्व</strong> होते हैं (परमाणु संख्या 21 से 30)।", "This series contains <strong>10 elements</strong> (Atomic numbers 21 to 30).");
add("इस श्रेणी के निम्न तत्व हैं:", "The elements of this series are:");
add("इनमें अपूर्ण 3d उपकोश होते हैं, जबकि 4s कक्षक में दो अथवा एक इलेक्ट्रॉन होते हैं।", "These have an incomplete 3d subshell, while the 4s orbital contains one or two electrons.");
add("इस श्रेणी का सामान्य इलेक्ट्रॉनिक विन्यास:", "General electronic configuration of this series:");

add("(b) द्वितीय संक्रमण श्रेणी (Second Transition Series — 4d श्रेणी)", "(b) Second Transition Series (4d Series)");
add("यह श्रेणी <strong>4d संक्रमण श्रेणी</strong> भी कहलाती है।", "This series is also known as the <strong>4d transition series</strong>.");
add("इस श्रेणी में <strong>10 तत्व</strong> होते हैं (परमाणु क्रमांक 39 से 48)।", "This series contains <strong>10 elements</strong> (Atomic numbers 39 to 48).");
add("इसमें अपूर्ण 4d उपकोश होते हैं, जबकि 5s में दो अथवा एक इलेक्ट्रॉन होते हैं।", "These have an incomplete 4d subshell, while 5s has one, two or zero electrons.");
add("इस श्रेणी का इलेक्ट्रॉनिक विन्यास:", "Electronic configuration of this series:");

add("(c) तृतीय संक्रमण श्रेणी (Third Transition Series — 5d श्रेणी)", "(c) Third Transition Series (5d Series)");
add("इसे <strong>5d संक्रमण श्रेणी</strong> भी कहते हैं।", "This is also called the <strong>5d transition series</strong>.");
add("इसमें <strong>10 तत्व</strong> होते हैं (परमाणु संख्या 57, फिर 72 से 80)।", "It contains <strong>10 elements</strong> (Atomic number 57, then 72 to 80).");
add("इसमें अपूर्ण 5d उपकोश होते हैं जबकि 6s कक्षक में एक या दो इलेक्ट्रॉन होते है।", "It has an incomplete 5d subshell while the 6s orbital contains one or two electrons.");
add("इनका इलेक्ट्रॉनिक विन्यास:", "Their electronic configuration:");

add("(d) चतुर्थ संक्रमण श्रेणी (Fourth Transition Series — 6d श्रेणी)", "(d) Fourth Transition Series (6d Series)");
add("इसे <strong>6d-संक्रमण श्रेणी</strong> भी कहते हैं।", "This is also called the <strong>6d transition series</strong>.");
add("इस श्रेणी में <strong>10 तत्व</strong> होते हैं इसलिये यह श्रेणी भी पूर्ण होती है (परमाणु संख्या 89, 104 से 112)।", "This series has <strong>10 elements</strong>, making it complete as well (Atomic numbers 89, 104 to 112).");
add(
  "<strong>104 से 112 परमाणु क्रमांक</strong> के तत्वों को <strong>ट्रॉन्सएक्टिनाइड तत्व (Transactinide elements)</strong> भी कहते हैं।",
  "Elements from <strong>atomic number 104 to 112</strong> are also called <strong>transactinide elements</strong>."
);
add("इसमें अपूर्ण 6d उपकोश होते हैं जबकि 7s कक्षक में एक या दो इलेक्ट्रॉन होते है।", "These contain an incomplete 6d subshell while the 7s orbital contains one or two electrons.");
add("इंटरैक्टिव संक्रमण श्रेणी अन्वेषक (Transition Series Explorer)", "Transition Series Explorer");
add("किसी भी श्रेणी पर क्लिक करें और उसके सभी 10 तत्वों के प्रतीक व परमाणु संख्या देखें:", "Click on any series to view all 10 elements with symbols and atomic numbers:");
add("3d श्रेणी (Sc - Zn)", "3d Series (Sc - Zn)");
add("4d श्रेणी (Y - Cd)", "4d Series (Y - Cd)");
add("5d श्रेणी (La, Hf - Hg)", "5d Series (La, Hf - Hg)");
add("6d श्रेणी (Ac, Rf - Cn)", "6d Series (Ac, Rf - Cn)");
add("प्रश्न: परमाणु क्रमांक 104 से 112 के तत्वों को क्या कहा जाता है?", "Question: What are elements with atomic numbers 104 to 112 called?");
add("लैन्थेनाइड तत्व", "Lanthanoid elements");
add("ट्रॉन्सएक्टिनाइड तत्व", "Transactinide elements");
add("क्षार धातुएँ", "Alkali metals");
add("02. इलेक्ट्रॉनिक विन्यास सारणियाँ →", "02. Electronic Configurations Tables →");
add("← 01. d-ब्लॉक तत्व व 4 श्रेणियाँ", "← 01. d-Block Elements & 4 Series");

add("इलेक्ट्रॉनिक विन्यास सारणियाँ (3d, 4d, 5d, 6d)", "Electronic Configurations (3d, 4d, 5d, 6d)");
add("(a) प्रथम संक्रमण श्रेणी (3d Series)", "(a) First Transition Series (3d Series)");
add("(b) द्वितीय संक्रमण श्रेणी (4d Series)", "(b) Second Transition Series (4d Series)");
add("(c) तृतीय संक्रमण श्रेणी (5d Series)", "(c) Third Transition Series (5d Series)");
add("(d) चतुर्थ संक्रमण श्रेणी (6d Series)", "(d) Fourth Transition Series (6d Series)");
add("<code>[Ar] 3d⁵ 4s¹</code> (अपवाद: अर्धपूरित d⁵ स्थायित्व)", "<code>[Ar] 3d⁵ 4s¹</code> (Anomaly: half-filled d⁵ stability)");
add("<code>[Ar] 3d¹⁰ 4s¹</code> (अपवाद: पूर्णपूरित d¹⁰ स्थायित्व)", "<code>[Ar] 3d¹⁰ 4s¹</code> (Anomaly: fully-filled d¹⁰ stability)");
add("<code>[Kr] 4d⁶ 5s¹</code> (मानव-निर्मित रेडियोधर्मी)", "<code>[Kr] 4d⁶ 5s¹</code> (Man-made radioactive)");
add("<code>[Kr] 4d¹⁰ 5s⁰</code> (विशेष: 5s में 0 इलेक्ट्रॉन)", "<code>[Kr] 4d¹⁰ 5s⁰</code> (Unique: 0 electrons in 5s)");
add("प्रश्न: पैलेडियम (Pd, Z = 46) का बाह्यतम इलेक्ट्रॉनिक विन्यास क्या है?", "Question: What is the outermost electronic configuration of Palladium (Pd, Z=46)?");
add("03. संक्रमण तत्व: परिभाषा व गुण →", "03. Transition Elements: Definition & Properties →");
add("← 02. इलेक्ट्रॉनिक विन्यास", "← 02. Electronic Configurations");

add("संक्रमण तत्व: परिभाषा, अपवाद एवं सामान्य गुण", "Transition Elements: Definition, Exceptions & Properties");
add("संक्रमण तत्व (Transition Elements)", "Transition Elements: Concept");
add(
  "संक्रमण तत्व उन तत्वों को कहा जाता है जिनके परमाणुओं के <strong>ग्राउंड स्टेट (मूल अवस्था) या किसी भी सामान्य ऑक्सीकरण अवस्था में d-उपकोश आंशिक रूप से भरे होते हैं।</strong>",
  "Transition elements are defined as elements whose atoms possess <strong>partially filled d-subshells either in their ground state or in any common oxidation state.</strong>"
);
add(
  "d-ब्लॉक के वे सभी तत्व जिनके d-ऑर्बिटल पूरी तरह से भरे हुए नहीं होते हैं, संक्रमण तत्व कहलाते हैं। आवर्त सारणी (periodic table) में बिल्कुल <strong>s-ब्लॉक और p-block के मध्य</strong> में स्थित होते हैं।",
  "All d-block elements whose d-orbitals are not completely filled are termed transition elements. In the periodic table, they are situated right <strong>between the s-block and p-block</strong>."
);
add(
  "ये अत्यधिक विद्युत-धनात्मक s-ब्लॉक की धातुओं और विद्युत-ऋणात्मक p-ब्लॉक की अधातुओं के बीच एक संक्रमण के रूप में कार्य करते हैं।",
  "They act as a transition between highly electropositive s-block metals and electronegative p-block non-metals."
);
add("अपवाद: समूह 12 के तत्व (Zn, Cd, Hg, Cn)", "Exceptions: Group 12 Elements (Zn, Cd, Hg, Cn)");
add(
  "आवर्त सारणी के समूह 12 (group 12) के तत्व जैसे जिंक (Zn), कैडमियम (Cd), मरकरी (Hg), और कॉपरनिशियम (Cn/Uub) भी d-ब्लॉक के सदस्य हैं, लेकिन इन्हें संक्रमण तत्व नहीं माना जाता है।",
  "Group 12 elements such as Zinc (Zn), Cadmium (Cd), Mercury (Hg), and Copernicium (Cn/Uub) are members of the d-block, but are not considered transition elements."
);
add("11 वर्ग के तत्व (Cu, Ag, Au व Uuu)", "Group 11 Elements (Cu, Ag, Au and Rg)");
add(
  "11 वर्ग के <strong>Cu, Ag, Au व Uuu</strong> में परमाण्वीय अवस्था में d-कक्षक पूर्ण भरे होते हैं (\\(d^{10} s^1\\)), परन्तु इनकी ऑक्सीकरण अवस्थाओं:",
  "In Group 11 elements <strong>Cu, Ag, Au and Rg</strong>, the d-orbitals are fully filled in atomic ground state (\\(d^{10} s^1\\)), but in their common oxidation states:"
);
add(
  "में d-कक्षक अपूर्ण भरे होते हैं, <strong>अतः इन्हें संक्रमण तत्व माना जाता है।</strong>",
  "the d-orbitals are partially filled, <strong>hence they are classified as transition elements.</strong>"
);
add("अविशेष (Non-typical) व विशेष (Typical) संक्रमण तत्व", "Non-Typical vs Typical Transition Elements");
add(
  "<strong>वर्ग 3 [Sc, Y, La, Ac] के तत्व:</strong> इनके गुण दूसरे संक्रमण तत्वों के गुणों से अलग होते हैं। इनके यौगिक <em>त्रिसंयोजी, प्रतिचुंबकीय व रंगहीन</em> होते हैं, जबकि अन्य संक्रमण तत्व विभिन्न ऑक्सीकरण अवस्थाएँ, रंगीन आयन व अनुचुंबकीय होते हैं।",
  "<strong>Group 3 Elements [Sc, Y, La, Ac]:</strong> Their properties differ from other transition elements: their compounds are <em>trivalent, diamagnetic, and colourless</em>, whereas other transition elements exhibit variable oxidation states, coloured ions, and paramagnetism."
);
add(
  "<strong>अविशेष संक्रमण तत्व (8 तत्व):</strong> वर्ग 3 [Sc, Y, La, Ac] के तत्व व वर्ग 12 [Zn, Cd, Hg, Uub] के तत्व अविशेष संक्रमण तत्व कहलाते हैं। ये कुल <strong>8 तत्व</strong> हैं।",
  "<strong>Non-typical Transition Elements (8 Elements):</strong> Group 3 [Sc, Y, La, Ac] and Group 12 [Zn, Cd, Hg, Uub] elements are called non-typical transition elements. These are <strong>8 elements</strong> in total."
);
add(
  "<strong>विशेष संक्रमण तत्व (32 तत्व):</strong> शेष दूसरे संक्रमण तत्त्व विशेष संक्रमण तत्व कहलाते हैं। ये <strong>32 तत्व</strong> हैं।",
  "<strong>Typical Transition Elements (32 Elements):</strong> The remaining transition elements are called typical transition elements. These are <strong>32 elements</strong>."
);
add("संक्रमण तत्वों के 8 सामान्य गुण (General Properties)", "8 General Properties of Transition Elements");
add("प्रश्न: जिंक (Zn) को d-ब्लॉक का सदस्य होने के बावजूद संक्रमण तत्व क्यों नहीं माना जाता है?", "Question: Why is Zinc (Zn) not considered a transition element despite being in the d-block?");
add("क्योंकि यह धातु नहीं है", "Because it is not a metal");
add("क्योंकि मूल व Zn²⁺ दोनों अवस्थाओं में d-ऑर्बिटल पूर्ण भरे होते हैं", "Because d-orbitals are fully filled (d¹⁰) in both elemental and Zn²⁺ states");
add("क्योंकि यह रंगीन आयन बनाता है", "Because it forms coloured ions");
add("04. धात्विक प्रकृति, आकार व ऑक्सीकरण →", "04. Metallic Nature, Size & Oxidation →");
add("← 03. संक्रमण तत्व: परिभाषा व गुण", "← 03. Transition Elements: Definition & Properties");

add("धात्विक प्रकृति, परमाणु आकार एवं ऑक्सीकरण अवस्थाएँ", "Metallic Nature, Atomic Size & Oxidation States");
add("धात्विक प्रकृति (Metallic Nature)", "Metallic Nature & Bonding");
add(
  "संक्रमण तत्व प्रबल धात्विक प्रकृति के होते हैं क्योंकि इनमें <strong>(n-1)d तथा ns इलेक्ट्रॉनों की अधिक संख्या</strong> धात्विक बंध (metallic bond) में भाग लेती है।",
  "Transition elements are strongly metallic in nature because a <strong>large number of (n-1)d and ns electrons</strong> participate in metallic bonding."
);
add(
  "इसी कारण इनमें <em>अधिक कठोरता, धात्विक चमक, उच्च गलनांक, उच्च क्वथनांक, उच्च वाष्पीकरण ऊष्मा</em> तथा उच्च ऊष्मीय व विद्युत चालकता पाई जाती है।",
  "This imparts <em>high hardness, metallic lustre, high melting and boiling points, high enthalpy of atomization</em>, and excellent thermal and electrical conductivity."
);
add("परमाणु तथा आयनिक आकार (Atomic & Ionic Radii)", "Atomic & Ionic Radii");
add(
  "3d श्रेणी में बाएँ से दाएँ जाने पर नाभिकीय आवेश (\\(Z_{\\text{eff}}\\)) बढ़ता है, जिससे <strong>परमाणु त्रिज्या पहले घटती है (Sc से Cr)</strong>, मध्य में लगभग <strong>समान रहती है (Mn से Ni)</strong> क्योंकि परिरक्षण प्रभाव नाभिकीय आकर्षण को संतुलित करता है, तथा अंत में (Cu, Zn) में इलेक्ट्रॉन-इलेक्ट्रॉन प्रतिकर्षण के कारण <strong>हल्की सी बढ़ जाती है</strong>।",
  "In the 3d series from left to right, nuclear charge (\\(Z_{\\text{eff}}\\)) increases, so <strong>atomic radius initially decreases (Sc to Cr)</strong>, remains almost <strong>constant in the middle (Mn to Ni)</strong> due to shielding effect balancing nuclear attraction, and <strong>increases slightly at the end (Cu, Zn)</strong> due to d-electron repulsion."
);
add("परिवर्ती ऑक्सीकरण अवस्थाएँ (Variable Oxidation States)", "Variable Oxidation States");
add(
  "संक्रमण तत्व परिवर्ती ऑक्सीकरण अवस्थाएँ प्रदर्शित करते हैं क्योंकि <strong>(n-1)d और ns कक्षकों की ऊर्जा में बहुत कम अंतर</strong> होता है। दोनों कक्षकों के इलेक्ट्रॉन रासायनिक बंध बनाने में भाग ले सकते हैं।",
  "Transition elements exhibit variable oxidation states because the <strong>energy difference between (n-1)d and ns orbitals is very small</strong>, allowing electrons from both levels to participate in bonding."
);
add("3d श्रेणी की ऑक्सीकरण अवस्थाएँ (Table):", "3d Series Oxidation States (Table):");
add("प्रश्न: Fe²⁺ और Fe³⁺ में से कौन सा आयन अधिक स्थायी है और क्यों?", "Question: Which ion between Fe²⁺ and Fe³⁺ is more stable and why?");
add("Fe²⁺ क्योंकि इसमें 6 इलेक्ट्रॉन हैं", "Fe²⁺ because it has 6 electrons");
add("Fe³⁺ क्योंकि इसमें 3d⁵ (अर्ध-पूरित) विन्यास होता है जो अधिक स्थायी है", "Fe³⁺ because it has a 3d⁵ (half-filled) configuration which is exceptionally stable");
add("05. उत्प्रेरक गुण व रंगीन यौगिक →", "05. Catalytic Properties & Coloured Compounds →");
add("← 04. धात्विक प्रकृति व आकार", "← 04. Metallic Nature & Radii");

add("उत्प्रेरक गुण एवं रंगीन यौगिक (d-d संक्रमण)", "Catalytic Properties & Coloured Compounds (d-d Transition)");
add("उत्प्रेरक का गुण (Catalytic Property)", "Catalytic Properties");
add(
  "संक्रमण तत्वों में उत्प्रेरक गुण पाया जाता है, जिसके कारण वे रासायनिक अभिक्रियाओं की गति बढ़ा देते हैं। यह गुण मुख्यतः उनकी <strong>परिवर्ती ऑक्सीकरण अवस्थाओं</strong> तथा <strong>खाली अथवा आंशिक रूप से भरे हुए d-कक्षकों</strong> के कारण होता है।",
  "Transition elements and their compounds exhibit remarkable catalytic activity due to their <strong>variable oxidation states</strong> and <strong>vacant or partially filled d-orbitals</strong> that provide suitable reaction pathways."
);
add("उत्प्रेरक कैसे काम करता है?", "How Does a Catalyst Work?");
add("संक्रमण धातु अपने खाली d-कक्षक की मदद से अभिकारक से जुड़ती है", "The transition metal binds to reactant molecules using its vacant d-orbitals");
add("एक अस्थायी यौगिक (intermediate) बनता है", "An unstable intermediate complex is formed");
add("इससे संक्रियण ऊर्जा (Activation Energy) कम हो जाती है", "This lowers the activation energy of the reaction");
add("जिससे अभिक्रिया की गति तेज हो जाती है", "Thereby significantly increasing the rate of reaction");
add("अंत में, उत्पाद बनने के बाद उत्प्रेरक जैसा का तैसा वापस मिल जाता है", "Finally, after product formation, the catalyst is regenerated unchanged");
add("प्रमुख औद्योगिक उत्प्रेरक (Industrial Catalysts Table)", "Major Industrial Catalysts Table");
add("रंगीन यौगिक (Coloured Compounds)", "Coloured Compounds & d-d Transition");
add(
  "अधिकांश संक्रमण तत्वों के आयन एवं यौगिक रंगीन होते हैं क्योंकि इनमें <strong>अपूर्ण d-उपकोश</strong> पाया जाता है।",
  "Most transition metal ions and their compounds are coloured due to the presence of <strong>partially filled d-subshells</strong>."
);
add(
  "लिगेंडों की उपस्थिति में d-कक्षक दो ऊर्जा स्तरों (<strong>\\(t_{2g}\\) तथा \\(e_g\\)</strong>) में विभाजित हो जाते हैं। जब इन पर श्वेत प्रकाश पड़ता है, तो इलेक्ट्रॉन निम्न ऊर्जा स्तर से उच्च ऊर्जा स्तर में चला जाता है।",
  "In the presence of ligands or surrounding ions, the five degenerate d-orbitals split into two sets (<strong>\\(t_{2g}\\) and \\(e_g\\)</strong>). On absorbing white light, an electron is promoted from the lower to higher energy level."
);
add(
  "इस प्रक्रिया को <strong>d-d संक्रमण (d-d Transition)</strong> कहते हैं। प्रकाश के किसी विशेष रंग के अवशोषण के बाद शेष <strong>पूरक रंग</strong> दिखाई देता है, जिसके कारण आयन रंगीन दिखाई देते हैं।",
  "This process is termed <strong>d-d transition</strong>. After absorption of a specific wavelength of light, the transmitted <strong>complementary colour</strong> is observed, rendering the ion coloured."
);
add("संक्रमण धातु आयनों के रंग (16 Examples Table)", "Colours of Transition Metal Ions (16 Examples Table)");
add("इंटरैक्टिव आयन टेस्ट ट्यूब रैक (Interactive Coloured Ions Rack)", "Interactive Coloured Ions Test Tube Rack");
add("परखनली पर क्लिक करके उसका रंग और d-d संक्रमण विन्यास देखें:", "Click on any test tube to view its colour and d-d configuration:");
add("प्रश्न: निम्नलिखित में से कौन सा आयन जलीय विलयन में रंगहीन (colourless) होगा?", "Question: Which of the following ions is colourless in aqueous solution?");
add("Sc³⁺ तथा Zn²⁺ (d⁰ या d¹⁰ विन्यास के कारण)", "Sc³⁺ and Zn²⁺ (due to d⁰ or d¹⁰ configuration)");
add("Cu²⁺ (नीला)", "Cu²⁺ (blue)");
add("Fe³⁺ (पीला)", "Fe³⁺ (yellow)");
add("06. चुंबकीय गुण, मिश्र धातुएँ व IP →", "06. Magnetic Moment, Alloys & IP →");
add("← 05. उत्प्रेरक गुण व रंग", "← 05. Catalytic Properties & Colours");

add("चुंबकीय गुण, अंतराकाशी यौगिक, मिश्र धातुएँ, संकुल, IP व घनत्व", "Magnetic Moment, Interstitial, Alloys, Complexes, IP & Density");
add("चुम्बकीय गुण (Magnetic Properties)", "Magnetic Properties & Spin-Only Formula");
add(
  "अधिकांश संक्रमण तत्व और उनके यौगिक <strong>अनुचुंबकीय (Paramagnetic)</strong> होते हैं।",
  "Most transition elements and their compounds are <strong>paramagnetic</strong> in nature."
);
add(
  "संक्रमण तत्वों का चुंबकीय व्यवहार उनमें उपस्थित <strong>अयुग्मित इलेक्ट्रॉनों (unpaired electrons)</strong> पर निर्भर करता है।",
  "The magnetic behaviour of transition metals depends directly on the number of <strong>unpaired electrons</strong> present in their (n-1)d orbitals."
);
add(
  `चुंबकीय आघूर्ण की गणना <strong>स्पिन-ओनली सूत्र (Spin-only formula)</strong> द्वारा की जाती है:`,
  `The magnetic moment is calculated using the <strong>spin-only formula</strong>:`
);
add("जहाँ n = अयुग्मित इलेक्ट्रॉनों की संख्या तथा BM = बोहर मैग्नेटन (Bohr Magneton)", "where n = number of unpaired electrons and BM = Bohr Magneton");
add("अंतराकाशी यौगिक (Interstitial Compounds)", "Interstitial Compounds");
add("मुख्य गुण:", "Key Properties:");
add("मिश्र धातु (Alloys)", "Alloys (Composition & Uses Table)");
add("संकुल यौगिक (Complex Compounds)", "Coordination Complexes");
add("आयनन एन्थैल्पी (Ionization Enthalpy)", "Ionization Enthalpy Trends");
add("घनत्व (Density)", "Density Trends across 3d Series");
add("3d श्रेणी के घनत्व का क्रम:", "Density Order in 3d Series:");
add("प्रश्न: जर्मन सिल्वर (German Silver) में सिल्वर (चाँदी) का प्रतिशत कितना होता है?", "Question: What is the percentage of silver in German Silver alloy?");
add("0% (इसमें Cu, Zn, Ni होते हैं, चाँदी नहीं होती)", "0% (Contains Cu, Zn, Ni; zero silver)");
add("50%", "50%");
add("80%", "80%");
add("07. f-ब्लॉक: लेन्थेनॉइड व संकुचन →", "07. f-Block: Lanthanoids & Contraction →");
add("← 06. चुंबकीय गुण व मिश्र धातुएँ", "← 06. Magnetic Moment & Alloys");

add("f-ब्लॉक तत्व: लेन्थेनॉइड श्रेणी एवं संकुचन", "f-Block Elements: Lanthanoid Series & Contraction");
add("F-ब्लॉक तत्व (आंतरिक संक्रमण तत्व)", "f-Block Elements (Inner Transition Elements)");
add(
  "वे तत्व जिनमें अंतिम इलेक्ट्रॉन <strong>(n – 2)f कक्षक</strong> में प्रवेश करता है, f-ब्लॉक के तत्व कहलाते हैं।",
  "Elements in which the differentiating electron enters the <strong>(n – 2)f orbital</strong> are called f-block elements."
);
add(
  "ये तत्व आधुनिक आवर्त सारणी के मुख्य सारणी के नीचे <strong>क्षैतिज पंक्तियों (horizontal rows)</strong> में अलग से रखे गए हैं।",
  "These elements are placed separately in <strong>two horizontal rows</strong> at the bottom of the periodic table."
);
add("लेन्थेनॉइड श्रेणी या प्रथम आंतरिक संक्रमण श्रेणी (4f)", "Lanthanoid Series or First Inner Transition Series (4f)");
add("लेन्थेनॉइड तत्वों का इलेक्ट्रॉनिक विन्यास एवं ऑक्सीकरण अवस्था", "Electronic Configurations & Oxidation States of Lanthanoids");
add("ऑक्सीकरण अवस्था का रासायनिक विश्लेषण", "Chemical Analysis of Oxidation States");
add("1. मुख्य या सामान्य ऑक्सीकरण अवस्था (+3):", "1. Principal Oxidation State (+3):");
add("2. असंगत ऑक्सीकरण अवस्थाएँ (+2 तथा +4):", "2. Anomalous Oxidation States (+2 and +4):");
add("लेन्थेनॉइड तत्वों की रासायनिक अभिक्रियाशीलता", "Chemical Reactivity of Lanthanoid Elements");
add("लेन्थेनॉइड संकुचन (Lanthanoid Contraction)", "Lanthanoid Contraction: Definition & Cause");
add("लेन्थेनॉइड संकुचन के 3 मुख्य परिणाम:", "3 Major Consequences of Lanthanoid Contraction:");
add("लेन्थेनॉइड तत्वों के मुख्य उपयोग (मिश धातु)", "Major Applications & Misch Metal");
add("प्रश्न: ज़िरकोनियम (Zr) और हाफ़्नियम (Hf) को 'रासायनिक जुड़वां' (Chemical Twins) क्यों कहा जाता है?", "Question: Why are Zirconium (Zr) and Hafnium (Hf) called 'Chemical Twins'?");
add("लेन्थेनॉइड संकुचन के कारण दोनों की त्रिज्या लगभग समान (160 pm व 159 pm) होती है", "Due to lanthanoid contraction, their atomic radii are nearly identical (160 pm and 159 pm)");
add("क्योंकि दोनों एक ही आवर्त में हैं", "Because both belong to the same period");
add("क्योंकि दोनों गैस हैं", "Because both are gases");
add("08. ऐक्टिनॉइड, तुलना व K₂Cr₂O₇/KMnO₄ →", "08. Actinoids, Comparisons & K₂Cr₂O₇/KMnO₄ →");
add("← 07. f-ब्लॉक व लेन्थेनॉइड संकुचन", "← 07. f-Block & Lanthanoids");

add("ऐक्टिनॉइड श्रेणी, तुलना व K₂Cr₂O₇ एवं KMnO₄", "Actinoid Series, Comparisons & K₂Cr₂O₇ / KMnO₄");
add("ऐक्टिनॉइड श्रेणी या द्वितीय आंतरिक संक्रमण श्रेणी (5f)", "Actinoid Series or Second Inner Transition Series (5f)");
add("मुख्य विशेषताएँ:", "Key Characteristics:");
add("ऐक्टिनॉइड तत्वों का इलेक्ट्रॉनिक विन्यास एवं ऑक्सीकरण अवस्था", "Electronic Configurations & Oxidation States of Actinoids");
add("d-ब्लॉक और f-ब्लॉक तत्वों में अंतर (10 मुख्य बिंदु)", "Differences between d-Block and f-Block Elements (10-Point Comparison)");
add("K₂Cr₂O₇ Potassium dichromate (पोटैशियम डाइक्रोमेट)", "Potassium Dichromate (K₂Cr₂O₇)");
add("K₂Cr₂O₇ बनाने की विधि (Preparation of K₂Cr₂O₇):", "Preparation of K₂Cr₂O₇:");
add("K₂Cr₂O₇ की रासायनिक अभिक्रियाएँ (Chemical Reactions):", "Chemical Reactions of K₂Cr₂O₇:");
add("उपयोग K₂Cr₂O₇:", "Uses of K₂Cr₂O₇:");
add("Structure of CrO₄²⁻ and Cr₂O₇²⁻ (संरचना एवं गुण)", "Structure & Properties of CrO₄²⁻ and Cr₂O₇²⁻");
add("गुण CrO₄²⁻ (क्रोमेट आयन)", "Properties of CrO₄²⁻ (Chromate Ion)");
add("गुण Cr₂O₇²⁻ (डाइक्रोमेट आयन)", "Properties of Cr₂O₇²⁻ (Dichromate Ion)");
add("Potassium Permanganate KMnO₄ (पोटैशियम परमैंगनेट)", "Potassium Permanganate (KMnO₄)");
add("KMnO₄ के बनाने की विधियाँ:", "Preparation of KMnO₄:");
add("KMnO₄ की रासायनिक अभिक्रियाएँ:", "Chemical Reactions of KMnO₄:");
add("भौतिक गुण KMnO₄:", "Physical Properties of KMnO₄:");
add("उपयोग KMnO₄:", "Uses of KMnO₄:");
add("लेन्थेनॉइड और एक्टिनॉइड में मुख्य अंतर (10 बिंदु सारणी)", "Differences between Lanthanoids and Actinoids (10-Point Table)");
add("प्रश्न: डाइक्रोमेट आयन (Cr₂O₇²⁻) में Cr—O—Cr बंध कोण कितना होता है?", "Question: What is the Cr—O—Cr bond angle in the dichromate ion (Cr₂O₇²⁻)?");
add("126°", "126°");
add("109.5°", "109.5°");
add("180°", "180°");


// ──────────────────────────────────────────────
// CHAPTER 2 REMAINING ENTRIES (TOPICS 03 - 08)
// ──────────────────────────────────────────────
add("क्योंकि मूल व Zn²⁺ दोनों अवस्थाओं में d-ऑर्बिटल पूर्ण भरे (d¹⁰) होते हैं", "Because d-orbitals are completely filled (d¹⁰) in both ground state and Zn²⁺ state");
add("क्योंकि इसका परमाणु भार बहुत कम है", "Because its atomic weight is very low");
add("संक्रमण तत्व प्रबल धात्विक प्रकृति के होते हैं क्योंकि इनमें <strong>उच्च प्रभावी नाभिकीय आवेश</strong> तथा <strong>अयुग्मित d-इलेक्ट्रॉन</strong> होते हैं, जो मजबूत धात्विक बंध बनाते हैं।", "Transition elements exhibit strong metallic nature because they possess <strong>high effective nuclear charge</strong> and <strong>unpaired d-electrons</strong>, which form strong metallic bonds.");
add("इसी कारण इनमें <em>अधिक कठोरता, धात्विक चमक, उच्च गलनांक, उच्च क्वथनांक, उच्च परमाण्वीकरण एन्थैल्पी, आघातवर्धनीयता तथा तन्यता</em> पाई जाती है।", "Consequently, they display <em>high hardness, metallic lustre, high melting point, high boiling point, high enthalpy of atomization, malleability, and ductility</em>.");
add("क्रिस्टल संरचनाएँ (Crystal Lattices)", "Crystal Lattices");
add("संक्रमण तत्वों में मुख्य रूप से तीन प्रकार की क्रिस्टल संरचनाएँ पाई जाती हैं:", "Transition elements mainly crystallize in three types of lattices:");
add("📌 <strong>मैंगनीज (Mn)</strong> अपने अर्धपूरित d⁵ विन्यास के कारण एक विशेष जटिल क्रिस्टल संरचना प्रदर्शित करता है।", "📌 <strong>Manganese (Mn)</strong> exhibits a unique complex crystal lattice due to its half-filled d⁵ configuration.");
add("परमाणु का आकार (Atomic Radii Trends)", "Atomic Radii Trends");
add("संक्रमण तत्वों की परमाणु त्रिज्या s-ब्लॉक तत्वों से कम तथा p-ब्लॉक तत्वों से अधिक होती है:", "Atomic radii of transition elements are smaller than s-block elements but larger than p-block elements:");
add("\\(\\text{Ca (s-ब्लॉक, 197 pm)} > \\text{Sc (d-ब्लॉक, 144 pm)}\\)", "\\(\\text{Ca (s-block, 197 pm)} > \\text{Sc (d-block, 144 pm)}\\)");
add("\\(\\text{Zn (d-ब्लॉक, 125 pm)} > \\text{Ga (p-ब्लॉक, 122.5 pm)}\\)", "\\(\\text{Zn (d-block, 125 pm)} > \\text{Ga (p-block, 122.5 pm)}\\)");
add("संक्रमण श्रेणी में <strong>प्रभावी नाभिकीय आवेश (Z_eff)</strong> तथा <strong>परिरक्षण प्रभाव (σ)</strong> दो विपरीत कारक कार्य करते हैं:", "In transition series, <strong>effective nuclear charge (Z_eff)</strong> and <strong>shielding effect (σ)</strong> act as opposing factors:");
add("<strong>Sc - Cr :</strong> नाभिकीय आवेश &gt; परिरक्षण प्रभाव \\(\\Rightarrow\\) <strong>आकार घटेगा</strong>", "<strong>Sc - Cr :</strong> Nuclear charge &gt; Shielding effect \\(\\Rightarrow\\) <strong>Size decreases</strong>");
add("<strong>Cr - Ni :</strong> नाभिकीय आवेश \\(\\approx\\) परिरक्षण प्रभाव \\(\\Rightarrow\\) <strong>आकार समान रहेगा</strong>", "<strong>Cr - Ni :</strong> Nuclear charge \\(\\approx\\) Shielding effect \\(\\Rightarrow\\) <strong>Size remains nearly constant</strong>");
add("<strong>Cu - Zn :</strong> नाभिकीय आवेश &lt; परिरक्षण प्रभाव \\(\\Rightarrow\\) <strong>आकार बढ़ेगा</strong>", "<strong>Cu - Zn :</strong> Nuclear charge &lt; Shielding effect \\(\\Rightarrow\\) <strong>Size increases slightly</strong>");
add("<strong>4d ≈ 5d :</strong> <strong>लैन्थेनाइड संकुचन</strong> के कारण 4d तथा 5d श्रेणी के संगत तत्वों का आकार लगभग समान होता है।", "<strong>4d ≈ 5d :</strong> Due to <strong>Lanthanoid Contraction</strong>, elements of 4d and 5d series have nearly identical size.");
add("ऑक्सीकरण अवस्थाएं (Oxidation States)", "Oxidation States");
add("d-ब्लॉक के तत्व अपने यौगिकों में एक से ज्यादा ऑक्सीकरण अवस्थाएं दिखाते हैं क्योंकि इनके <strong>अंदर वाले d-कक्षक</strong> और <strong>बाहर वाले s-कक्षक</strong>, दोनों के इलेक्ट्रॉन बंध (bond) बनाने में हिस्सा लेते हैं।", "d-block elements show multiple oxidation states in compounds because electrons from both <strong>inner d-orbitals</strong> and <strong>outer s-orbitals</strong> participate in bonding.");
add("Sc से Mn तक d उपकोश में अयुग्मित इलेक्ट्रॉनों की संख्या बढ़ने के कारण ऑक्सीकरण अवस्था बढ़ती है। Mn के बाद Zn तक इलेक्ट्रॉनों का युग्मन (Pairing) शुरू होने से अयुग्मित इलेक्ट्रॉनों की संख्या घटती है, जिससे ऑक्सीकरण अवस्था भी घटती है।", "From Sc to Mn, oxidation states increase as unpaired d-electrons increase. After Mn up to Zn, electron pairing begins, decreasing unpaired electrons and lowering oxidation states.");
add("📌 <strong>उदाहरण:</strong> मैंगनीज (Mn) सबसे ज्यादा यानी <strong>+7</strong> तक ऑक्सीकरण अवस्था दिखा सकता है, जबकि रूथेनियम (Ru) और ऑस्मियम (Os) <strong>+8</strong> तक अवस्था दिखाते हैं।", "📌 <strong>Example:</strong> Manganese (Mn) exhibits up to <strong>+7</strong>, while Ruthenium (Ru) and Osmium (Os) show up to <strong>+8</strong> oxidation state.");
add("प्रश्न: Fe³⁺ आयन Fe²⁺ आयन से अधिक स्थायी क्यों होता है?", "Question: Why is Fe³⁺ ion more stable than Fe²⁺ ion?");
add("क्योंकि Fe³⁺ में d⁶ विन्यास होता है", "Because Fe³⁺ has a d⁶ configuration");
add("क्योंकि Fe³⁺ में d⁵ (अर्धपूरित) विन्यास होता है जो अधिक स्थायी है", "Because Fe³⁺ has a d⁵ (half-filled) configuration which is more stable");
add("क्योंकि Fe³⁺ का आकार बड़ा होता है", "Because Fe³⁺ has a larger size");
add("क्रमांक", "S.No.");
add("उत्प्रेरक", "Catalyst");
add("अभिक्रिया", "Reaction");
add("उपयोग", "Application");
add("हैबर प्रक्रिया (\\(\\text{N}_2 + 3\\text{H}_2 \\rightarrow 2\\text{NH}_3\\))", "Haber Process (\\(\\text{N}_2 + 3\\text{H}_2 \\rightarrow 2\\text{NH}_3\\))");
add("अमोनिया बनाने में", "In manufacture of ammonia");
add("हाइड्रोजनीकरण", "Hydrogenation");
add("तेल से घी बनाने में", "In converting vegetable oil to vanaspati ghee");
add("\\(\\text{SO}_2 \\rightarrow \\text{SO}_3\\) (संपर्क प्रक्रिया)", "\\(\\text{SO}_2 \\rightarrow \\text{SO}_3\\) (Contact Process)");
add("\\(\\text{H}_2\\text{SO}_4\\) बनाने में", "In manufacture of \\(\\text{H}_2\\text{SO}_4\\)");
add("\\(\\text{H}_2\\text{O}_2\\) का विघटन", "Decomposition of \\(\\text{H}_2\\text{O}_2\\)");
add("ऑक्सीजन गैस बनाने में", "In production of oxygen gas");
add("ब्लीचिंग पाउडर का अपघटन", "Decomposition of bleaching powder");
add("रासायनिक अभिक्रियाओं में", "In chemical reactions");
add("ओस्टवाल्ड प्रक्रिया", "Ostwald Process");
add("\\(\\text{HNO}_3\\) बनाने में", "In manufacture of \\(\\text{HNO}_3\\)");
add("ऑर्गेनिक क्रिया में", "In organic reactions");
add("colourless (रंगहीन)", "Colourless");
add("purple (बैंगनी)", "Purple");
add("blue (नीला)", "Blue");
add("green (हरा)", "Green");
add("violet (बैंगनी)", "Violet");
add("pink (गुलाबी)", "Pink");
add("yellow (पीला)", "Yellow");
add("bluepink (नीला-गुलाबी)", "Blue-pink");
add("blue (चमकदार नीला)", "Bright Blue");
add("अधिकांश संक्रमण तत्व और उनके यौगिक <strong>अनुचुंबकीय (Paramagnetic)</strong> व्यवहार प्रदर्शित करते हैं।", "Most transition elements and their compounds exhibit <strong>paramagnetic</strong> behaviour.");
add("संक्रमण तत्वों का चुंबकीय व्यवहार उनमें उपस्थित <strong>अयुग्मित इलेक्ट्रॉनों</strong> पर निर्भर करता है। जिन पदार्थों में अयुग्मित इलेक्ट्रॉन उपस्थित होते हैं वे अनुचुंबकीय होते हैं तथा चुंबकीय क्षेत्र में आकर्षित होते हैं। \\(d^1\\) से \\(d^9\\) विन्यास वाले अधिकांश संक्रमण तत्व एवं उनके आयन अनुचुंबकीय होते हैं।", "The magnetic behaviour of transition metals depends on the <strong>unpaired electrons</strong> present. Substances with unpaired electrons are paramagnetic and attracted into magnetic fields. Most transition elements and ions with \\(d^1\\) to \\(d^9\\) configurations are paramagnetic.");
add("जिन पदार्थों में सभी इलेक्ट्रॉन युग्मित होते हैं, जैसे <strong>d⁰ तथा d¹⁰</strong> विन्यास वाले आयन, वे <strong>प्रतिचुंबकीय (Diamagnetic)</strong> होते हैं और चुंबकीय क्षेत्र में प्रतिकर्षित होते हैं।", "Substances in which all electrons are paired, such as ions with <strong>d⁰ and d¹⁰</strong> configurations, are <strong>diamagnetic</strong> and repelled by magnetic fields.");
add("जहाँ \\(\\mu\\) = चुंबकीय आघूर्ण (Magnetic Moment) | \\(n\\) = अयुग्मित इलेक्ट्रॉनों (Unpaired Electrons) की संख्या | इकाई: <strong>B.M. (बोर मैग्नेटॉन - Bohr Magneton)</strong>", "where \\(\\mu\\) = Magnetic Moment | \\(n\\) = Number of Unpaired Electrons | Unit: <strong>B.M. (Bohr Magneton)</strong>");
add("अयुग्मित इलेक्ट्रॉन = अनुचुंबकीय", "Unpaired electrons = Paramagnetic");
add("युग्मित इलेक्ट्रॉन = प्रतिचुंबकीय", "Paired electrons = Diamagnetic");
add("जितने अधिक अयुग्मित इलेक्ट्रॉन, उतना अधिक चुंबकीय आघूर्ण", "More unpaired electrons = Greater magnetic moment");
add("चक्रण-मात्र चुंबकीय आघूर्ण (\\(\\mu\\)) कैलकुलेटर", "Spin-Only Magnetic Moment (\\(\\mu\\)) Calculator");
add("अयुग्मित इलेक्ट्रॉनों की संख्या (n):", "Number of unpaired electrons (n):");
add("त्वरित आयन चयन:", "Quick Ion Select:");
add("संक्रमण धातुओं के क्रिस्टल में उपस्थित छोटी-छोटी खाली जगहों को <strong>अंतराकाश</strong> कहते हैं। जब इन अंतराकाशों में <strong>हाइड्रोजन, बोरॉन, कार्बन अथवा नाइट्रोजन (H, B, C, N)</strong> जैसे छोटे अधातु परमाणु प्रवेश कर जाते हैं, तब बनने वाले यौगिकों को <strong>अंतराकाशी यौगिक</strong> कहते हैं।", "Small vacant spaces in transition metal lattices are called <strong>interstices</strong>. When small non-metal atoms like <strong>H, B, C, N</strong> occupy these spaces, the resulting compounds are called <strong>interstitial compounds</strong>.");
add("ये यौगिक <strong>अत्यधिक कठोर</strong> होते हैं।", "These compounds are <strong>extremely hard</strong>.");
add("इनके <strong>गलनांक एवं क्वथनांक उच्च</strong> होते हैं।", "They have <strong>high melting and boiling points</strong>.");
add("ये <strong>अच्छे विद्युत चालक</strong> होते हैं।", "They are <strong>good conductors of electricity</strong>.");
add("रासायनिक रूप से अपेक्षाकृत <strong>अक्रियाशील</strong> होते हैं।", "They are chemically relatively <strong>inert</strong>.");
add("इनकी तन्यता एवं आघातवर्धनीयता सामान्य धातुओं की अपेक्षा कम होती है।", "Their ductility and malleability are lower than normal metals.");
add("संक्रमण (d-ब्लॉक) धातुओं में एक-दूसरे के साथ मिलकर मिश्र धातु बनाने का गुण पाया जाता है। जब दो या दो से अधिक धातुओं को पिघलाकर मिलाया जाता है, तो उनके मिश्रण से मिश्र धातु बनती है।", "Transition metals possess the characteristic property of forming alloys with each other. When two or more metals are melted together and cooled, the resulting mixture forms an alloy.");
add("मिश्र धातुएँ शुद्ध धातु की तुलना में अधिक उपयोगी होती हैं: <strong>बहुत अधिक कठोर (Hard)</strong>, <strong>उच्च गलनांक (Melting points)</strong>, तथा <strong>जंग-रोधी (संक्षारण प्रतिरोधकता)</strong>।", "Alloys are far more useful than pure metals: <strong>much harder</strong>, <strong>higher melting points</strong>, and <strong>corrosion resistant</strong>.");
add("क्र.", "No.");
add("मिश्र धातु का नाम", "Alloy Name");
add("मुख्य अवयव तत्व", "Constituent Elements");
add("प्रतिशत (लगभग)", "Composition (Approx)");
add("मुख्य उपयोग", "Major Applications");
add("<strong>पीतल (Brass)</strong>", "<strong>Brass</strong>");
add("बर्तन, तार, वाद्य यंत्र, कारतूस", "Utensils, wires, musical instruments, cartridges");
add("<strong>कांसा (Bronze)</strong>", "<strong>Bronze</strong>");
add("मूर्तियाँ, सिक्के, पदक, बर्तन", "Statues, coins, medals, utensils");
add("<strong>स्टेनलेस स्टील</strong>", "<strong>Stainless Steel</strong>");
add("बर्तन, सर्जिकल उपकरण, साइकिल के पार्ट्स", "Utensils, surgical instruments, bicycle parts");
add("<strong>क्रोम स्टील</strong>", "<strong>Chrome Steel</strong>");
add("क्रेन, पुल, मशीनें", "Cranes, bridges, heavy machinery");
add("<strong>टंगस्टन स्टील</strong>", "<strong>Tungsten Steel</strong>");
add("हाई-स्पीड cutting tools, रॉकेट इंजन", "High-speed cutting tools, rocket engines");
add("<strong>जर्मन सिल्वर</strong>", "<strong>German Silver</strong>");
add("सजावटी वस्तुएँ, बर्तन, चश्मा फ्रेम", "Decorative items, cutlery, spectacle frames");
add("<strong>गन मेटल</strong>", "<strong>Gun Metal</strong>");
add("बंदूकें, गियर, बेयरिंग, बटन", "Guns, gears, bearings, buttons");
add("संक्रमण धातुएँ लिगेंडों के साथ उपसहसंयोजक बंध बनाकर संकुल यौगिक बनाती हैं।", "Transition metals form coordinate bonds with ligands to form complex compounds (coordination complexes).");
add("इनके द्वारा बनाए गए संकुल यौगिक अत्यधिक स्थायी होते हैं और विलयन में भी अपना स्वतंत्र अस्तित्व बनाए रखते हैं।", "The complexes formed are highly stable and maintain their identity even in solution.");
add("<strong>उदाहरण:</strong> \\(\\text{K}_4[\\text{Fe}(\\text{CN})_6]\\), \\([\\text{Cu}(\\text{NH}_3)_4]\\text{SO}_4\\) तथा \\([\\text{Co}(\\text{NH}_3)_6]\\text{Cl}_3\\)।", "<strong>Examples:</strong> \\(\\text{K}_4[\\text{Fe}(\\text{CN})_6]\\), \\([\\text{Cu}(\\text{NH}_3)_4]\\text{SO}_4\\), and \\([\\text{Co}(\\text{NH}_3)_6]\\text{Cl}_3\\).");
add("किसी परमाणु के बाह्यतम कोश से एक इलेक्ट्रॉन को बाहर निकालने के लिए आवश्यक न्यूनतम ऊर्जा को उसकी <strong>आयनन एन्थैल्पी</strong> कहते हैं।", "The minimum energy required to remove an electron from the outermost shell of an isolated gaseous atom is called its <strong>ionization enthalpy</strong>.");
add("संक्रमण तत्वों की आयनन एन्थैल्पी का मान <strong>s-ब्लॉक से अधिक लेकिन p-ब्लॉक तत्वों से कम</strong> होता है। इसलिए ये s-ब्लॉक से कम विद्युत धनी और p-ब्लॉक से अधिक विद्युत धनी होते हैं।", "Ionization enthalpies of transition elements are <strong>greater than s-block but lower than p-block elements</strong>. Thus, they are less electropositive than s-block and more electropositive than p-block elements.");
add("श्रेणी में बाएं से दाएं जाने पर आयनन एन्थैल्पी में होने वाली <strong>वृद्धि बहुत धीमी</strong> होती है, जिसका मुख्य कारण <strong>परिरक्षण प्रभाव</strong> है जो नाभिक द्वारा लगाए जाने वाले आकर्षण बल को संतुलित करता है।", "Along a transition series from left to right, the <strong>increase in ionization enthalpy is very gradual</strong>, primarily due to the <strong>shielding effect</strong> counteracting increasing nuclear charge.");
add("चूँकि बढ़ता हुआ नाभिकीय आवेश और बढ़ता हुआ परिरक्षण प्रभाव एक-दूसरे के विपरीत कार्य करते हैं, इसलिए आयनन एन्थैल्पी का मान नियमित रूप से बढ़ने के बजाय बहुत धीमी गति से और सीमित रूप से बढ़ता है।", "Because increasing nuclear charge and increasing shielding effect work against each other, ionization enthalpy increases very slowly and moderately across the series.");
add("इन तत्वों का घनत्व <strong>धात्विक त्रिज्या में कमी</strong> और <strong>द्रव्यमान में वृद्धि</strong> के साथ बढ़ता है। इस प्रकार, <strong>Ti से Cu तक घनत्व में वृद्धि</strong> देखी जाती है।", "The density of these elements increases with <strong>decreasing metallic radius</strong> and <strong>increasing atomic mass</strong>, leading to an <strong>increase in density from Ti to Cu</strong>.");
add("डी-ब्लॉक में <strong>Os और Ir</strong> का घनत्व सबसे अधिक है, जबकि प्रथम 3d श्रृंखला में <strong>Cu</strong> का घनत्व सबसे अधिक है।", "In the entire d-block, <strong>Os and Ir</strong> have the highest densities, while in the 3d series, <strong>Cu</strong> has the highest density.");
add("0% (इसमें Cu, Zn और Ni होते हैं, सिल्वर नहीं होता)", "0% (Contains Cu, Zn, and Ni; contains no silver)");
add("वे तत्व जिनमें अंतिम इलेक्ट्रॉन <strong>(n – 2)f कक्षक</strong> में प्रवेश करता है, उन्हें f-ब्लॉक तत्व कहते हैं। इन्हें <strong>'आंतरिक/अंतः संक्रमण तत्व'</strong> भी कहा जाता है।", "Elements in which the last electron enters the <strong>(n – 2)f orbital</strong> are called f-block elements. They are also known as <strong>'inner transition elements'</strong>.");
add("ये तत्व आधुनिक आवर्त सारणी के मुख्य सारणी के नीचे <strong>क्षैतिज पंक्तियों में अलग से</strong> रखे गए हैं। इनकी कुल संख्या <strong>28</strong> है। ये तत्व आवर्त सारणी के <strong>वर्ग 3 (III B)</strong> में रखे गये हैं।", "These elements are placed separately in <strong>two horizontal rows</strong> at the bottom of the periodic table. They total <strong>28 elements</strong>, all assigned to <strong>Group 3 (III B)</strong>.");
add("इन तत्वों को दो श्रेणियों में बांटा गया है— <strong>(A) लेन्थेनॉइड</strong> व <strong>(B) एक्टिनॉइड</strong>, जिनमें प्रत्येक श्रेणी में <strong>14-14 तत्व</strong> हैं।", "These elements are divided into two series: <strong>(A) Lanthanoids</strong> and <strong>(B) Actinoids</strong>, each containing <strong>14 elements</strong>.");
add("वे तत्व जिनमें अंतिम इलेक्ट्रॉन <strong>4f उपकोश</strong> में प्रवेश करता है, उन्हें 4f-ब्लॉक तत्व या लेन्थेनॉइड कहा जाता है।", "Elements in which the differentiating electron enters the <strong>4f subshell</strong> are termed 4f-block elements or lanthanoids.");
add("ये तत्व आवर्त सारणी के <strong>छठे आवर्त</strong> में रखे गये हैं। ये 'लैन्थेनम' (La-57) के बाद आते हैं, इसी कारण इन्हें लेन्थेनाइड कहा जाता है।", "These elements belong to the <strong>6th period</strong> of the periodic table. They follow Lanthanum (La-57), which is why they are called lanthanoids.");
add("कुल <strong>14 तत्व</strong> होते हैं जो <strong>क्रमांक 58 (सीरियम – Ce-58) से प्रारंभ होकर क्रमांक 71 (ल्यूटेशियम – Lu-71)</strong> तक होते हैं। लेन्थेनॉइड तत्वों को <strong>Ln</strong> प्रतीक द्वारा प्रदर्शित किया जाता है।", "There are <strong>14 elements</strong>, starting from <strong>atomic number 58 (Cerium – Ce) to 71 (Lutetium – Lu)</strong>. Lanthanoid elements are denoted by the general symbol <strong>Ln</strong>.");
add("लैन्थेनम (La) सहित सभी 15 तत्व रासायनिक और भौतिक गुणों में अधिक समानता रखते हैं, इसलिए इन सभी को सारणी के एक ही वर्ग 3 (III B) में लैन्थेनम के साथ रखा गया है।", "All 15 elements including Lanthanum (La) show close resemblance in physical and chemical properties, hence all are grouped together with Lanthanum in Group 3 (III B).");
add("<strong>रेडियोऐक्टिव तत्व:</strong> इस श्रेणी में केवल एक तत्व <strong>प्रोमिथियम (Pm-61) रेडियोऐक्टिव</strong> है, शेष सभी तत्व स्थायी हैं।", "<strong>Radioactive Element:</strong> In this series, only <strong>Promethium (Pm-61) is radioactive</strong>; all other lanthanoids are non-radioactive (stable).");
add("<strong>इट्रियम से समानता:</strong> ये सभी तत्व इट्रियम (Y-39) के साथ आयनिक त्रिज्या में अधिक समानता रखते हैं, इसलिए ये प्रकृति में इट्रियम के खनिजों के साथ पाए जाते हैं।", "<strong>Resemblance to Yttrium:</strong> These elements closely match Yttrium (Y-39) in ionic radii, which is why they co-occur in nature with Yttrium minerals.");
add("तत्व", "Element");
add("प्रतीक", "Symbol");
add("परमाणु क्रमांक", "Atomic No.");
add("विन्यास", "Configuration");
add("ऑक्सीकरण अवस्था", "Oxidation States");
add("लेन्थेनम (Lanthanum)", "Lanthanum");
add("सीरियम (Cerium)", "Cerium");
add("<strong>+3, +4</strong> (Ce⁴⁺ प्रबल ऑक्सीकारक)", "<strong>+3, +4</strong> (Ce⁴⁺ strong oxidizing agent)");
add("प्रेकियोडाइमियम (Praseodymium)", "Praseodymium");
add("नियोडाइमियम (Neodymium)", "Neodymium");
add("प्रोमिथियम (Promethium)", "Promethium");
add("+3 (☢️ एकमात्र रेडियोऐक्टिव)", "+3 (☢️ Only radioactive lanthanoid)");
add("समेरियम (Samarium)", "Samarium");
add("<strong>+2, +3</strong> (Sm²⁺ अपचायक)", "<strong>+2, +3</strong> (Sm²⁺ reducing agent)");
add("यूरोपियम (Europium)", "Europium");
add("<strong>+2, +3</strong> (Eu²⁺ f⁷ अर्द्धपूरित)", "<strong>+2, +3</strong> (Eu²⁺ half-filled f⁷)");
add("गैडोलिनियम (Gadolinium)", "Gadolinium");
add("+3 (f⁷ स्थायित्व)", "+3 (f⁷ stability)");
add("टर्बियम (Terbium)", "Terbium");
add("डिस्प्रोसियम (Dysprosium)", "Dysprosium");
add("होल्मियम (Holmium)", "Holmium");
add("अरबियम (Erbium)", "Erbium");
add("थूलियम (Thulium)", "Thulium");
add("इटर्बियम (Ytterbium)", "Ytterbium");
add("ल्यूटेशियम (Lutetium)", "Lutetium");
add("+3 (f¹⁴ पूर्णपूरित स्थायित्व)", "+3 (f¹⁴ fully-filled stability)");
add("लेन्थेनॉइड तत्वों की सबसे महत्वपूर्ण और सामान्य ऑक्सीकरण अवस्था <strong>+3</strong> होती है। +3 अवस्था प्राप्त करने के लिए परमाणु अपने बाह्यतम कक्षक (6s) से 2 इलेक्ट्रॉन और अंदर वाले कक्षक (4f या 5d) में से 1 इलेक्ट्रॉन त्याग देते हैं।\n                <br><em>विशेष उदाहरण:</em> सीरियम (Ce), गैडोलिनियम (Gd) और ल्यूटेशियम (Lu) अपनी +3 अवस्था में अपना तीसरा इलेक्ट्रॉन <strong>5d कक्षक से</strong> बाहर निकालते हैं।", "The primary and most common oxidation state of lanthanoid elements is <strong>+3</strong>. To achieve +3, atoms lose 2 electrons from the outer 6s orbital and 1 electron from inner (4f or 5d) orbitals.\n                <br><em>Notable example:</em> Cerium (Ce), Gadolinium (Gd), and Lutetium (Lu) lose their third electron from the <strong>5d orbital</strong> in the +3 state.");
add("नियम के अनुसार, यदि कोई उपकोश <strong>पूरी तरह खाली (f⁰), आधा भरा (f⁷), या पूरा भरा हो (f¹⁴)</strong>, तो वह अत्यधिक स्थायी माना जाता है। इसी स्थायित्व को पाने के लिए तत्व +2 या +4 अवस्था दर्शाते हैं।", "By rule, extra stability is associated with empty (f⁰), half-filled (f⁷), or completely filled (f¹⁴) subshells. To attain this electronic stability, certain elements exhibit +2 or +4 oxidation states.");
add("\\(\\text{Ln} + \\text{O}_2 \\rightarrow \\text{Ln}_2\\text{O}_3\\) (ऑक्साइड)", "\\(\\text{Ln} + \\text{O}_2 \\rightarrow \\text{Ln}_2\\text{O}_3\\) (Oxide)");
add("\\(\\text{Ln} + \\text{H}_2\\text{O} \\rightarrow \\text{Ln}(\\text{OH})_3 + \\text{H}_2\\) (हाइड्रॉक्साइड)", "\\(\\text{Ln} + \\text{H}_2\\text{O} \\rightarrow \\text{Ln}(\\text{OH})_3 + \\text{H}_2\\) (Hydroxide)");
add("\\(\\text{Ln} + \\text{X}_2 \\rightarrow \\text{LnX}_3\\) (हैलाइड)", "\\(\\text{Ln} + \\text{X}_2 \\rightarrow \\text{LnX}_3\\) (Halide)");
add("\\(\\text{Ln} + \\text{N}_2 \\rightarrow \\text{LnN}\\) (नाइट्राइड)", "\\(\\text{Ln} + \\text{N}_2 \\rightarrow \\text{LnN}\\) (Nitride)");
add("\\(\\text{Ln} + \\text{S} \\rightarrow \\text{Ln}_2\\text{S}_3\\) (सल्फाइड)", "\\(\\text{Ln} + \\text{S} \\rightarrow \\text{Ln}_2\\text{S}_3\\) (Sulphide)");
add("<strong>परिभाषा:</strong> लेन्थेनॉइड श्रेणी में बाएं से दाएं जाने पर तत्वों की <strong>परमाण्वीय तथा आयनिक त्रिज्याओं में कमी</strong> होने लगती है। लगातार होने वाली इस कमी को ही <strong>लेन्थेनॉइड संकुचन</strong> कहते हैं।", "<strong>Definition:</strong> In the lanthanoid series from left to right, there is a steady <strong>decrease in atomic and ionic radii</strong>. This steady decrease is called <strong>lanthanoid contraction</strong>.");
add("<strong>उपयोग:</strong> प्रबल अपचायक, बंदूक की गोली, लाइटर की चकमक (Flint) और हवाई जहाज के कल-पुर्जे बनाने में।", "<strong>Applications:</strong> Strong reducing agent, bullets, lighter flint, and aircraft structural components.");
add("<strong>Mg-मिश धातु:</strong> मैग्नीशियम के साथ (30% मिश धातु + 1% Zr) मिलाकर जेट इंजन के पुर्जे बनाए जाते हैं क्योंकि यह एल्युमीनियम को उच्च ताप सहने की क्षमता और तांबे को जंगरोधी गुण प्रदान करती है।", "<strong>Mg-Misch Metal:</strong> Mixed with Magnesium (30% Misch metal + 1% Zr) to manufacture jet engine parts, imparting high temperature tolerance and corrosion resistance.");
add("<strong>उत्प्रेरक के रूप में (As a Catalyst)</strong>", "<strong>As a Catalyst</strong>");
add("<strong>चश्मों के कांच बनाने में:</strong> सीरियम (Ce) में उच्च ताप और पराबैंगनी प्रकाश (UV Rays) दोनों को अवशोषित करने की क्षमता होती है, इसलिए धूप के चश्मों को बनाने में प्रयुक्त होता है।", "<strong>In Glassware & Sunglasses:</strong> Cerium (Ce) absorbs both high temperature and ultraviolet (UV) radiation, making it ideal for sunglasses.");
add("<strong>रंगीन काँच और ग्लास पॉलिश में:</strong> नियोडिमियम व प्रेडोडिमियम के ऑक्साइडों से रंगीन काँच; सीरियम ऑक्साइड से ग्लास पॉलिश व गैस मेंटल।", "<strong>In Coloured Glass & Glass Polishing:</strong> Neodymium and praseodymium oxides produce tinted glass; cerium oxide is used for glass polishing and gas mantles.");
add("<strong>पेट्रोलियम उद्योग में:</strong> भारी हाइड्रोकार्बन को पेट्रोल, डीजल में तोड़ने (भंजन) के लिए सीरियम फॉस्फेट प्रमुख उत्प्रेरक के रूप में।", "<strong>In Petroleum Industry:</strong> Cerium phosphate serves as a key cracking catalyst to crack heavy hydrocarbons into petrol and diesel.");
add("<strong>लेसर तकनीक में (Nd:YAG लेसर आदि)</strong>", "<strong>In Laser Technology (Nd:YAG lasers, etc.)</strong>");
add("क्योंकि दोनों एक ही आवर्त में स्थित हैं", "Because both are located in the same period");
add("लेन्थेनॉइड संकुचन के कारण दोनों की परमाणु त्रिज्याएँ लगभग समान (160 pm व 159 pm) होती हैं", "Due to lanthanoid contraction, both have nearly identical atomic radii (160 pm and 159 pm)");
add("क्योंकि दोनों गैसें हैं", "Because both are gases");
add("वे तत्व जिनमें अंतिम इलेक्ट्रॉन <strong>5f उपकोश</strong> में प्रवेश करता है, उन्हें 5f-ब्लॉक तत्व या <strong>ऐक्टिनॉइड</strong> कहा जाता है।", "Elements in which the differentiating electron enters the <strong>5f subshell</strong> are termed 5f-block elements or <strong>actinoids</strong>.");
add("ये आवर्त सारणी के <strong>सातवें (7th) आवर्त</strong> में रखे गये हैं।", "These belong to the <strong>7th period</strong> of the periodic table.");
add("ये तत्व डी-ब्लॉक के तत्व ऐक्टिनियम Ac-89 के बाद आते हैं, इसी कारण इन्हें ऐक्टिनॉइड कहते हैं। इसमें कुल <strong>14 तत्व</strong> शामिल हैं (क्रमांक 90 थोरियम Th से 103 लॉरेंसियम Lr तक)। इन तत्वों को <strong>An</strong> से प्रदर्शित किया जाता है।", "These follow Actinium (Ac-89), which is why they are called actinoids. This includes <strong>14 elements</strong> (Thorium 90 Th to Lawrencium 103 Lr). They are denoted by <strong>An</strong>.");
add("ऐक्टिनियम (Ac) सहित सभी 15 तत्व आवर्त सारणी के <strong>वर्ग 3 (III B)</strong> में एक साथ रखे गए हैं।", "All 15 elements including Actinium (Ac) are placed together in <strong>Group 3 (III B)</strong>.");
add("<strong>ऊर्जा समानता:</strong> ऐक्टिनॉइड तत्वों में 5f और 6d उपकोशों (Subshells) की ऊर्जाएँ लगभग समान होती हैं।", "<strong>Energy Equivalence:</strong> In actinoids, 5f and 6d subshells have comparable energies.");
add("<strong>पूर्णतः रेडियोऐक्टिव प्रकृति:</strong> इस श्रेणी के <em>सभी तत्व रेडियोऐक्टिव (Radioactive)</em> हैं।", "<strong>Completely Radioactive:</strong> <em>All elements</em> of this series are radioactive.");
add("<strong>अध्ययन में कठिनाई (अर्ध-आयु काल):</strong> इस श्रेणी के शुरुआती तत्वों (जैसे थोरियम, यूरेनियम) की अर्ध-आयु (Half-life) बहुत लंबी होती है, लेकिन बाद वाले तत्वों की अर्ध-आयु बहुत कम होती है (कुछ दिनों से लेकर मात्र 3 मिनट तक)। यही कारण है कि प्रयोगशाला में इनके अध्ययन में अत्यधिक कठिनाई आती है।", "<strong>Study Challenges (Half-lives):</strong> Early members (e.g. Th, U) have long half-lives, but later elements have very short half-lives (from days down to minutes), making laboratory investigation extremely challenging.");
add("ऐक्टिनियम (Actinium)", "Actinium");
add("थोरियम (Thorium)", "Thorium");
add("प्रोटैक्टिनियम (Protactinium)", "Protactinium");
add("यूरेनियम (Uranium)", "Uranium");
add("नेप्च्यूनियम (Neptunium)", "Neptunium");
add("+3, +4, +5, +6 (परायूरेनियम)", "+3, +4, +5, +6 (Transuranic)");
add("प्लूटोनियम (Plutonium)", "Plutonium");
add("अमेरिशियम (Americium)", "Americium");
add("क्यूरियम (Curium)", "Curium");
add("बर्केलियम (Berkelium)", "Berkelium");
add("<code>[Rn] 5f⁸ 6d¹ 7s² या [Rn] 5f⁹ 6d⁰ 7s²</code>", "<code>[Rn] 5f⁸ 6d¹ 7s² or [Rn] 5f⁹ 6d⁰ 7s²</code>");
add("कैलिफ़ोर्नियम (Californium)", "Californium");
add("आइंस्टीनियम (Einsteinium)", "Einsteinium");
add("फर्मियम (Fermium)", "Fermium");
add("मेण्डेलीवियम (Mendelevium)", "Mendelevium");
add("नोबेलियम (Nobelium)", "Nobelium");
add("लॉरेंसियम (Lawrencium)", "Lawrencium");
add("d-ब्लॉक तत्व", "d-Block Elements");
add("f-ब्लॉक तत्व", "f-Block Elements");
add("इन्हें संक्रमण तत्व (transition elements) कहा जाता है।", "These are called transition elements.");
add("इन्हें आंतरिक संक्रमण तत्व (inner transition elements) कहा जाता है।", "These are called inner transition elements.");
add("अंतिम इलेक्ट्रॉन (n-1)d कक्षक में प्रवेश करता है।", "The last electron enters the (n-1)d orbital.");
add("अंतिम इलेक्ट्रॉन (n-2)f कक्षक में प्रवेश करता है।", "The last electron enters the (n-2)f orbital.");
add("इनके दो बाह्यतम कोश, (n-1) और n, अपूर्ण होते हैं।", "Their two outermost shells, (n-1) and n, are incomplete.");
add("इनके तीन बाह्यतम कोश, (n-2), (n-1), और n, अपूर्ण होते हैं।", "Their three outermost shells, (n-2), (n-1), and n, are incomplete.");
add("इनका सामान्य इलेक्ट्रॉनिक विन्यास: <code>(n-1)d¹⁻¹⁰ ns¹⁻²</code>", "Their general electronic configuration: <code>(n-1)d¹⁻¹⁰ ns¹⁻²</code>");
add("इनका सामान्य इलेक्ट्रॉनिक विन्यास: <code>(n-2)f¹⁻¹⁴ (n-1)d⁰⁻¹ ns²</code>", "Their general electronic configuration: <code>(n-2)f¹⁻¹⁴ (n-1)d⁰⁻¹ ns²</code>");
add("ये आवर्त सारणी के मुख्य ढांचे में समूह 3 से 12 तक (बीच में) स्थित हैं।", "They are located in the main body of the periodic table in Groups 3 to 12.");
add("इन्हें मुख्य आवर्त सारणी के नीचे दो क्षैतिज पंक्तियों में अलग से रखा गया है।", "They are placed separately below the main periodic table in two horizontal rows.");
add("इन्हें 4 श्रेणियों में बांटा गया है: 3d, 4d, 5d और 6d श्रेणी।", "They are divided into 4 series: 3d, 4d, 5d, and 6d series.");
add("इन्हें 2 श्रेणियों में बांटा गया है: लेन्थेनॉइड (4f) और एक्टिनॉइड (5f)।", "They are divided into 2 series: Lanthanoids (4f) and Actinoids (5f).");
add("ये तत्व अत्यधिक परिवर्तनशील ऑक्सीकरण अवस्थाएं दर्शाते हैं।", "These elements display wide variable oxidation states.");
add("ये कम परिवर्तनशील ऑक्सीकरण अवस्थाएं दर्शाते हैं। इनकी प्रमुख और सामान्य ऑक्सीकरण अवस्था +3 होती है।", "They exhibit less variable oxidation states; their principal state is +3.");
add("छोटे आकार के कारण, ये जटिल यौगिक (complex compounds) आसानी से बनाते हैं।", "Due to smaller ionic radii and higher charge density, they readily form complex compounds.");
add("बड़े आकार के कारण, इनकी जटिल यौगिक बनाने की प्रवृत्ति d-ब्लॉक तत्वों की तुलना में कम होती है।", "Due to larger ionic radii, their tendency to form complexes is comparatively lower.");
add("इनमें से केवल टेक्नीशियम (Tc) ही मानव-निर्मित रेडियोधर्मी तत्व है।", "Among these, only Technetium (Tc) is a man-made radioactive element.");
add("इनमें से अधिकांश तत्व (विशेष रूप से एक्टिनॉइड श्रेणी के सभी तत्व) रेडियोधर्मी हैं।", "Most of these elements (all actinoids) are radioactive.");
add("ये तत्व एक ही समूह (ऊर्ध्वाधर स्तंभ) में अधिक समानता दर्शाते हैं।", "These elements show greater similarities along vertical columns (groups).");
add("ये तत्व एक ही श्रेणी (क्षैतिज पंक्ति) में एक-दूसरे के साथ उच्च समानता दर्शाते हैं।", "These elements display high mutual similarity along horizontal rows (series).");
add("<strong>(1) गर्म करने पर (Thermal Decomposition):</strong>", "<strong>(1) On Heating (Thermal Decomposition):</strong>");
add("<strong>(2) H₂SO₄ के साथ अभिक्रिया:</strong>", "<strong>(2) Reaction with H₂SO₄:</strong>");
add("तनु:", "Dilute:");
add("सांद्र:", "Concentrated:");
add("(हरा रंग Cr₂(SO₄)₃ (क्रोमिक सल्फेट) बनने से आता है)", "(Green colour results from formation of chromic sulphate Cr₂(SO₄)₃)");
add("<strong>(3) कार्बन (H₂O के साथ) से अपचयन:</strong>", "<strong>(3) Reduction by Carbon (with H₂O):</strong>");
add("<strong>(4) H₂O₂ से अपचयन:</strong>", "<strong>(4) Reduction by H₂O₂:</strong>");
add("(नीली परत — क्रोमिक डाइपराक्साइड CrO₅ बनने से)", "(Blue layer — due to formation of chromic peroxide CrO₅)");
add("यह एक प्रबल ऑक्सीकारक है, कार्बनिक रसायन में ऑक्सीकरण अभिक्रियाओं में।", "It is a powerful oxidizing agent widely used in organic redox reactions.");
add("चमड़ा रंगने (टैनिंग) उद्योग में।", "In leather tanning industry (chrome tanning).");
add("कपड़ा रंगाई व छपाई (डाइंग व प्रिंटिंग) में मॉर्डेंट के रूप में।", "As a mordant in textile dyeing and calico printing.");
add("माचिस उद्योग में।", "In the safety match industry.");
add("प्रयोगशाला में अभिकर्मक के रूप में तथा रक्त में अल्कोहल परीक्षण (ब्रेथ एनालाइज़र) में।", "As a laboratory volumetric reagent and in breathalyzer alcohol testing.");
add("फोटोग्राफी व इलेक्ट्रोप्लेटिंग में भी प्रयुक्त होता है।", "Used in photography and chromium electroplating.");
add("इलेक्ट्रॉनिक विन्यास: \\(\\text{Cr}^{6+} \\rightarrow 3d^0\\)", "Electronic Configuration: \\(\\text{Cr}^{6+} \\rightarrow 3d^0\\)");
add("अयुगलित इलेक्ट्रॉन (\\(n\\)) \\(\\rightarrow 0\\)", "Unpaired electrons (\\(n\\)) \\(\\rightarrow 0\\)");
add("चुंबकीय प्रकृति \\(\\rightarrow\\) <strong>प्रतिचुंबकीय (Diamagnetic)</strong>", "Magnetic Nature \\(\\rightarrow\\) <strong>Diamagnetic</strong>");
add("रंग \\(\\rightarrow\\) <strong>पीला (Yellow)</strong>", "Colour \\(\\rightarrow\\) <strong>Yellow</strong>");
add("सभी M—O बंध लंबाई \\(\\rightarrow\\) समान", "All M—O bond lengths \\(\\rightarrow\\) Equal");
add("संकरण \\(\\rightarrow\\) <strong>sd³</strong>", "Hybridisation \\(\\rightarrow\\) <strong>sd³</strong>");
add("ज्यामिति \\(\\rightarrow\\) <strong>चतुष्फलकीय (Tetrahedral)</strong>", "Geometry \\(\\rightarrow\\) <strong>Tetrahedral</strong>");
add("अयुगलित इलेक्ट्रॉन \\(\\rightarrow 0\\)", "Unpaired electrons \\(\\rightarrow 0\\)");
add("रंग \\(\\rightarrow\\) <strong>नारंगी-लाल (Orange-red)</strong>", "Colour \\(\\rightarrow\\) <strong>Orange-red</strong>");
add("संरचना \\(\\rightarrow\\) दो टेट्राहेड्रॉन एक O परमाणु से जुड़े", "Structure \\(\\rightarrow\\) Two tetrahedra sharing a corner O atom");
add("Cr—O—Cr कोण \\(\\rightarrow\\) <strong>126°</strong> (सेतु Cr-O = 179 pm, अंत्य Cr-O = 163 pm)", "Cr—O—Cr Angle \\(\\rightarrow\\) <strong>126°</strong> (Bridge Cr-O = 179 pm, Terminal Cr-O = 163 pm)");
add("संकरण \\(\\rightarrow\\) <strong>sd³ (प्रत्येक Cr)</strong>", "Hybridisation \\(\\rightarrow\\) <strong>sd³ (Each Cr)</strong>");
add("ज्यामिति \\(\\rightarrow\\) <strong>प्रत्येक Cr चतुष्फलकीय</strong>", "Geometry \\(\\rightarrow\\) <strong>Each Cr is tetrahedral</strong>");
add("<strong>(i) पायरोलुसाइट (MnO₂) से:</strong>", "<strong>(i) From Pyrolusite (MnO₂):</strong>");
add("<strong>(ii) अम्लीय माध्यम में:</strong>", "<strong>(ii) In Acidic Medium:</strong>");
add("<strong>क्षारीय माध्यम में:</strong>", "<strong>In Alkaline Medium:</strong>");
add("<strong>उदासीन माध्यम में:</strong>", "<strong>In Neutral Medium:</strong>");
add("<strong>अम्लीय माध्यम में:</strong>", "<strong>In Acidic Medium:</strong>");
add("<strong>H₂S के साथ:</strong>", "<strong>With H₂S:</strong>");
add("<strong>रंग \\(\\rightarrow\\)</strong> गहरा बैंगनी / काला-बैंगनी चमकदार क्रिस्टल", "<strong>Colour \\(\\rightarrow\\)</strong> Deep purple / dark lustrous crystals");
add("<strong>घुलनशीलता \\(\\rightarrow\\)</strong> जल में घुलनशील, बैंगनी रंग का विलयन बनाता है", "<strong>Solubility \\(\\rightarrow\\)</strong> Soluble in water, giving deep purple solutions");
add("<strong>प्रकृति \\(\\rightarrow\\)</strong> प्रबल ऑक्सीकारक", "<strong>Nature \\(\\rightarrow\\)</strong> Powerful oxidizing agent");
add("<strong>चुंबकीय गुण \\(\\rightarrow\\)</strong> अनुचुंबकीय, क्योंकि Mn⁷⁺ में 1 अयुगलित इलेक्ट्रॉन", "<strong>Magnetic Nature \\(\\rightarrow\\)</strong> Paramagnetic (temperature-dependent weak paramagnetism)");
add("<strong>गलनांक \\(\\rightarrow\\)</strong> लगभग 240°C", "<strong>Melting Point \\(\\rightarrow\\)</strong> Approximately 240°C");
add("<strong>संरचना \\(\\rightarrow\\)</strong> चतुष्फलकीय", "<strong>Structure \\(\\rightarrow\\)</strong> Tetrahedral");
add("प्रबल ऑक्सीकारक के रूप में", "As a powerful oxidizing agent");
add("जल शुद्धिकरण में", "In municipal water purification");
add("विसंक्रामक (एंटीसेप्टिक) के रूप में", "As an antiseptic and disinfectant");
add("कार्बनिक रसायन में ऑक्सीकरण अभिक्रियाओं में", "In organic redox synthesis");
add("प्रयोगशाला अभिकर्मक के रूप में", "As a standard volumetric analytical reagent");
add("विरंजक (ब्लीचिंग) एजेंट के रूप में", "As a bleaching agent in textiles");
add("लेन्थेनॉइड श्रेणी", "Lanthanoid Series");
add("एक्टिनॉइड श्रेणी", "Actinoid Series");
add("इनमें अंतिम इलेक्ट्रॉन 4f कक्षक में प्रवेश करता है।", "The last electron enters the 4f orbital.");
add("इनमें अंतिम इलेक्ट्रॉन 5f कक्षक में प्रवेश करता है।", "The last electron enters the 5f orbital.");
add("ये आवर्त सारणी के छठे आवर्त के तत्व हैं।", "These belong to the 6th period of the periodic table.");
add("ये आवर्त सारणी के सातवें आवर्त के तत्व हैं।", "These belong to the 7th period of the periodic table.");
add("ये क्रमांक 58 Ce से 71 Lu तक होते हैं।", "These range from atomic number 58 Ce to 71 Lu.");
add("ये क्रमांक 90 Th से 103 Lr तक होते हैं।", "These range from atomic number 90 Th to 103 Lr.");
add("ये मुख्य रूप से +3 ऑक्सीकरण अवस्था दर्शाते हैं।", "They exhibit mainly the +3 oxidation state.");
add("ये +3 के अलावा अत्यधिक परिवर्तनशील अवस्थाएँ (जैसे +4, +5, +6, +7) दर्शाते हैं।", "They display a wide range of oxidation states (+3, +4, +5, +6, +7).");
add("प्रोमिथियम Pm61 को छोड़कर शेष सभी लेन्थेनॉइड गैर-रेडियोऐक्टिव (स्थायी) हैं।", "Except Promethium (Pm-61), all lanthanoids are non-radioactive (stable).");
add("इस श्रेणी के सभी तत्व रेडियोऐक्टिव होते हैं और इनमें से अधिकांश मानव-निर्मित हैं।", "All actinoids are radioactive and most are synthetic (man-made).");
add("4f इलेक्ट्रॉनों का परिरक्षण प्रभाव, 5f की तुलना में अधिक होता है।", "Shielding effect of 4f electrons is greater than that of 5f electrons.");
add("5f इलेक्ट्रॉनों का परिरक्षण प्रभाव, 4f की तुलना में बहुत दुर्बल (कमजोर) होता है।", "Shielding effect of 5f electrons is poorer and weaker than 4f electrons.");
add("इनमें होने वाले आकार की कमी को 'लेन्थेनॉइड संकुचन' कहते हैं, जो कम प्रभावी होता है।", "The decrease in atomic/ionic size is called 'lanthanoid contraction', which is moderate.");
add("इनमें होने वाली कमी को 'एक्टिनॉइड संकुचन' कहते हैं, जो लेन्थेनॉइड की तुलना में बहुत अधिक प्रभावी होता है।", "The decrease in size is called 'actinoid contraction', which is more pronounced than lanthanoid contraction.");
add("ये तत्व ऑक्सो-आयन नहीं बनाते हैं।", "These elements do not form oxo-cations.");
add("ये तत्व बहुत आसानी से ऑक्सो-आयन बनाते हैं।", "These elements readily form oxo-cations (e.g., UO₂²⁺, PuO₂²⁺).");
add("इनके ऑक्साइड और हाइड्रॉक्साइड कम क्षारीय होते हैं।", "Their oxides and hydroxides are less basic.");
add("इनके ऑक्साइड और हाइड्रॉक्साइड लेन्थेनॉइड की तुलना में अधिक क्षारीय होते हैं।", "Their oxides and hydroxides are more basic than those of lanthanoids.");
add("इनके बड़े आकार के कारण इनमें जटिल यौगिक बनाने की प्रवृत्ति कम होती है।", "Due to larger size, they have lesser tendency to form complex compounds.");
add("उच्च नाभिकीय आवेश के कारण इनमें जटिल यौगिक बनाने की प्रवृत्ति अधिक होती है।", "Due to higher nuclear charge and lower shielding, they have greater tendency to form complex compounds.");
add("सभी नोट्स, सूत्र व रासायनिक समीकरण NCERT एवं MP Board पाठ्यक्रम के पूर्णतः अनुरूप हैं।", "All notes, formulas and chemical reactions fully conform to NCERT & State Board syllabus.");


add("<strong>+2, +3</strong> (Yb²⁺ f¹⁴ पूर्णपूरित)", "<strong>+2, +3</strong> (Yb²⁺ fully-filled f¹⁴)");
add("+3 (f¹⁴ पूर्णपूरित)", "+3 (f¹⁴ fully-filled stability)");
add("लेन्थेनॉइड तत्वों की सर्वाधिक स्थायी और सामान्य ऑक्सीकरण अवस्था <strong>+3</strong> होती है। पूरा लेन्थेनॉइड रसायन मुख्य रूप से <strong>Ln³⁺ आयनों के चारों ओर</strong> ही घूमता है। +3 अवस्था प्राप्त करने के लिए परमाणु अपने बाह्यतम कक्षक (6s) से 2 इलेक्ट्रॉन और अंदर वाले कक्षक (4f या 5d) में से 1 इलेक्ट्रॉन त्याग देते हैं।\n                <br><em>विशेष उदाहरण:</em> सीरियम (Ce), गैडोलिनियम (Gd) और ल्यूटेशियम (Lu) अपनी +3 अवस्था में अपना तीसरा इलेक्ट्रॉन <strong>5d कक्षक से</strong> बाहर निकालते हैं।", "The most stable and principal oxidation state of lanthanoid elements is <strong>+3</strong>. The entirety of lanthanoid chemistry revolves predominantly around <strong>Ln³⁺ cations</strong>. To attain the +3 state, an atom releases 2 electrons from the outermost 6s orbital and 1 electron from inner (4f or 5d) orbitals.\n                <br><em>Notable examples:</em> Cerium (Ce), Gadolinium (Gd), and Lutetium (Lu) lose their third electron from the <strong>5d orbital</strong> in the +3 state.");
// Save bundled JS file
let fileContent = `/**
 * @file translations-data.js — Synchronously bundled bilingual dataset
 * @description Bundles all i18n JSONs and complete phrase dictionary into memory.
 * Eliminates fetch() CORS errors on local file:// protocol.
 */
var ScienceTutorialData = ${JSON.stringify({
  bundle,
  dict
}, null, 2)};

if (typeof window !== 'undefined') {
  window.ScienceTutorial = window.ScienceTutorial || {};
  window.ScienceTutorial.TranslationsData = ScienceTutorialData;
}
if (typeof module !== 'undefined') {
  module.exports = ScienceTutorialData;
}
`;

fs.writeFileSync('assets/js/translations-data.js', fileContent);
console.log('✅ Generated assets/js/translations-data.js successfully!');
console.log('Dictionary entries count:', Object.keys(dict).length);
