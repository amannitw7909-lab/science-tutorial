# 🧪 NCERT Science Tutorials — Interactive Learning Platform

> **विज्ञान को आसान और मज़ेदार बनाना | Making Science Easy & Fun**

An interactive, bilingual (Hindi/English) tutorial website for **Class 12 Science** students following the NCERT curriculum, specifically designed for **Hindi-medium students of Madhya Pradesh Board** in association with **Hariohm Classes , Silwani Madhya Pradesh (📞 9074248383)**.

---

## 🎯 Project Goal

Bridge the gap between textbook content and conceptual understanding by providing:
- **Interactive visualizations** — sliders, calculators, animated diagrams
- **Bilingual content** — Hindi (default) with English toggle
- **Mobile-first design** — optimized for smartphone access on 3G/4G
- **Exam-focused approach** — aligned with NCERT syllabus and MP Board 2026-27 patterns

## 📚 Multi-Chapter Coverage

### Chemistry (रसायन विज्ञान)

| # | Chapter | Topics | Interactive Features | Status |
|---|---------|--------|----------------------|--------|
| 1 | **विलयन (Solutions)** | 7 Topics | Drag-and-drop matrix, dissolving animation, molarity calculator, solubility curve, Raoult's law P-x graph, deviation curves, Van't Hoff calculator | ✅ Complete |
| 2 | **d- एवं f-ब्लॉक के तत्व (d & f-Block Elements)** | 8 Topics | 4-Series switcher, 40-element configuration tables, magnetic moment calculator, 3d oxidation matrix, coloured ions test-tube palette, industrial catalyst table, alloy percentages, lanthanoid contraction, K₂Cr₂O₇ & KMnO₄ reactions | ✅ Complete |

---

### Chapter 1: विलयन (Solutions) — 7 Topics
1. **विलयन के प्रकार (Types of Solutions)** — 9 solution types, solvent & solute roles
2. **सांद्रता व्यक्त करने के तरीके (Expressing Concentration)** — Molarity, Molality, Mole fraction, Mass %, ppm
3. **विलेयता व हेनरी का नियम (Solubility & Henry's Law)** — Temperature effect, gas solubility
4. **वाष्प दाब और राउल्ट का नियम (Vapour Pressure & Raoult's Law)** — P-x diagram, relative lowering
5. **आदर्श और अनादर्श विलयन (Ideal & Non-Ideal Solutions)** — Deviations, Azeotropes
6. **अणुसंख्यक गुणधर्म (Colligative Properties)** — Elevation in BP, depression in FP, Osmotic pressure
7. **असामान्य मोलर द्रव्यमान (Abnormal Molar Masses)** — Van't Hoff factor (i), association & dissociation

---

### Chapter 2: d- एवं f-ब्लॉक के तत्व (d & f-Block Elements) — 8 Topics
1. **d-ब्लॉक तत्व एवं 4 संक्रमण श्रेणियाँ** — (n-1)d subshell, 3d, 4d, 5d, 6d series, transactinides
2. **इलेक्ट्रॉनिक विन्यास सारणियाँ (3d, 4d, 5d, 6d)** — Complete tables for all 40 elements with anomalies (Cr, Cu, Mo, Pd, Pt, Au)
3. **संक्रमण तत्व: परिभाषा, अपवाद व सामान्य गुण** — Group 12 exceptions (Zn, Cd, Hg), Group 11 (Cu, Ag, Au), 8 non-typical vs 32 typical elements, 8 general properties
4. **धात्विक प्रकृति, परमाणु आकार व ऑक्सीकरण अवस्थाएँ** — Metallic bonding, BCC/FCC/HCP, radii trends (Zeff vs shielding), 3d oxidation states (+7 for Mn), d⁵/d¹⁰ stability
5. **उत्प्रेरक गुण एवं रंगीन यौगिक (d-d संक्रमण)** — Catalytic mechanism, 7 industrial reactions, crystal field splitting (t₂g/eg), 16 coloured ions
6. **चुंबकीय गुण, अंतराकाशी, मिश्र धातुएँ, संकुल, IP व घनत्व** — Spin-only formula \(\mu = \sqrt{n(n+2)}\), interstitial compounds (steel, TiC), 7 alloys (Brass, Bronze, Stainless steel etc.), coordination complexes, IP and density trends
7. **f-ब्लॉक तत्व: लेन्थेनॉइड श्रेणी एवं संकुचन** — 4f configurations (La-Lu), +3 & anomalous states (+2/+4), chemical reactivity, lanthanoid contraction (Zr/Hf Chemical Twins), Misch metal
8. **ऐक्टिनॉइड श्रेणी, तुलना व K₂Cr₂O₇ एवं KMnO₄** — 5f actinoids, transuranics, 10-point d vs f comparison, 10-point Ln vs An comparison, preparation, reactions & structures of K₂Cr₂O₇ & KMnO₄

---

## 🛠️ Tech Stack (Strict Zero-Build)

| Layer | Technology | Why |
|-------|-----------|-----|
| Structure | HTML5 (Semantic) | Accessible, SEO-friendly, no build step |
| Styling | Custom CSS + CSS Variables | Zero dependency, lightweight, full control |
| Logic | Vanilla JavaScript (ES6+) | No framework overhead, fast, debuggable |
| Math Rendering | KaTeX 0.16 (CDN) | Blazing fast LaTeX math formulas |
| Charts | Chart.js 4.x (CDN) | Interactive diagrams and curves |
| i18n | Custom JSON-based | Hindi default + English toggle |
| Deployment | GitHub Pages | Zero build step, static hosting |

---

## 🚀 Quick Start

Open `index.html` in any web browser:
```bash
# Python local server
python3 -m http.server 8000
```
Then navigate to `http://localhost:8000/`.
