# 🗺️ SOLUTION.md — Codebase Navigation Guide

> This file helps developers and AI coding agents quickly find and understand every part of the codebase.

---

## Multi-Chapter Directory Map

```
Science Tutorial/
│
├── index.html ························· [ENTRY] Multi-Chapter Course Portal & SPA Router
├── README.md ·························· [DOCS]  Project overview, setup, deployment
├── SOLUTION.md ························ [DOCS]  This file — codebase navigation
├── AGENTS.md ·························· [DOCS]  Coding standards for agents
│
├── chapters/ ·························· [CHAPTERS] Reorganized Multi-Chapter Structure
│   ├── 01-solutions/ ·················· Chapter 1: विलयन (Solutions)
│   │   ├── index.html ················· Chapter 1 Hub & overview
│   │   └── topics/ ···················· 7 topics with index.html & script.js
│   │       ├── 01-types-of-solutions/
│   │       ├── 02-expressing-concentration/
│   │       ├── 03-solubility/
│   │       ├── 04-raoults-law/
│   │       ├── 05-ideal-nonideal/
│   │       ├── 06-colligative-properties/
│   │       └── 07-abnormal-molar-mass/
│   │
│   └── 02-d-and-f-block-elements/ ····· Chapter 2: d- एवं f-ब्लॉक के तत्व (d & f-Block Elements)
│       ├── index.html ················· Chapter 2 Hub & overview
│       └── topics/ ···················· 8 topics with index.html & script.js
│           ├── 01-intro-and-series/ ··· d-ब्लॉक तत्व एवं 4 संक्रमण श्रेणियाँ (3d, 4d, 5d, 6d)
│           ├── 02-electronic-configurations/ ·· सभी 40 तत्वों के पूर्ण विन्यास सारणियाँ
│           ├── 03-general-properties/ · समूह 12 अपवाद (Zn, Cd, Hg), Cu/Ag/Au, 8 सामान्य गुण
│           ├── 04-metallic-size-oxidation/ · धात्विक बंध, त्रिज्या क्रम, 3d ऑक्सीकरण अवस्थाएँ
│           ├── 05-catalytic-and-colours/ · उत्प्रेरक क्रियाविधि, 16 आयनों की रंग सारणी
│           ├── 06-magnetic-alloys-complexes/ · चुंबकीय सूत्र, अंतराकाशी, 7 मिश्र धातुएँ, IP व घनत्व
│           ├── 07-lanthanoids-and-contraction/ · 4f लेन्थेनॉइड, संकुचन, मिश धातु व उपयोग
│           └── 08-actinoids-and-compounds/ · 5f ऐक्टिनॉइड, d vs f तुलना, K₂Cr₂O₇ व KMnO₄
│
├── topics/ ···························· [COMPAT] Backward-compatibility redirects
│   ├── 01-types-of-solutions/ ... 07-abnormal-molar-mass/
│
├── assets/ ···························· [SHARED] Static assets used across all pages
│   ├── css/ ··························· [STYLES] Stylesheet layers (load in order)
│   │   ├── variables.css ·············· Design tokens, Chapter 1 & Chapter 2 colors
│   │   ├── base.css ··················· Reset, typography, KaTeX overrides
│   │   ├── layout.css ················· Multi-chapter header, sidebar, grid
│   │   ├── components.css ············· Cards, element tiles, test tubes, comparison tables
│   │   └── interactive.css ············ Custom sliders, calculators, simulations
│   └── js/ ···························· [SCRIPTS] Shared JavaScript modules
│       ├── utils.js ··················· DOM helpers, storage, math utilities
│       ├── i18n.js ···················· Bilingual engine (Hindi default + English)
│       ├── navigation.js ·············· Multi-chapter SPA hash router & progress tracking
│       └── components.js ·············· UI builders (sliders, calculators, charts)
│
└── i18n/ ······························ [CONTENT] Bilingual text content
    ├── hi/ ···························· Hindi (source of truth)
    │   ├── common.json ················ Shared UI, course & chapter metadata
    │   ├── solutions/ ················· Chapter 1 topic JSONs (topic-01 to 07)
    │   └── d-and-f-block/ ············· Chapter 2 topic JSONs (topic-01 to 08)
    └── en/ ···························· English (mirrored keys)
        ├── common.json
        ├── solutions/
        └── d-and-f-block/
```

---

## Chapter 2 (d- एवं f-ब्लॉक के तत्व) PDF Mapping

| PDF Pages | Content in PDF | Website View / Topic |
|-----------|----------------|----------------------|
| Pages 1-4 | Cover, d-ब्लॉक परिभाषा, (n-1)d उपकोश, 3d, 4d, 5d, 6d श्रेणियाँ, ट्रॉन्सएक्टिनाइड | `#/df-intro-and-series` |
| Pages 5-8 | 3d (Sc-Zn), 4d (Y-Cd), 5d (La, Hf-Hg), 6d (Ac, Rf-Cn) पूर्ण इलेक्ट्रॉनिक विन्यास सारणियाँ | `#/df-electronic-configurations` |
| Pages 9-10 | संक्रमण तत्व परिभाषा, समूह 12 अपवाद (Zn, Cd, Hg), Cu/Ag/Au औचित्य, 8 अविशेष व 32 विशेष तत्व, 8 सामान्य गुण | `#/df-transition-properties` |
| Pages 11-12 | धात्विक प्रकृति, BCC/FCC/HCP, Mn क्रिस्टल, परमाणु त्रिज्या (Zeff vs परिरक्षण), 3d ऑक्सीकरण अवस्थाएँ, d⁵/d¹⁰ स्थायित्व | `#/df-metallic-size-oxidation` |
| Pages 13-14 | उत्प्रेरक क्रियाविधि, 7 औद्योगिक अभिक्रियाएँ, t2g/eg विपाटन, d-d संक्रमण, 16 आयनों की रंग सारणी | `#/df-catalytic-and-colours` |
| Pages 15-18 | चक्रण सूत्र \(\mu = \sqrt{n(n+2)}\), अंतराकाशी यौगिक, 7 मिश्र धातुएँ (पीतल, कांसा, स्टील आदि), संकुल यौगिक, IP व घनत्व क्रम | `#/df-magnetic-alloys-complexes` |
| Pages 19-21, 23-25 | 4f लेन्थेनॉइड विन्यास (La-Lu), +3 व असंगत अवस्थाएँ, 5 रासायनिक अभिक्रियाएँ, लेन्थेनॉइड संकुचन (Zr/Hf रासायनिक जुड़वां), मिश धातु व उपयोग | `#/df-lanthanoids-and-contraction` |
| Pages 22, 26-31 | 5f ऐक्टिनॉइड विन्यास (Ac-Lr), परायूरेनियम तत्व, d vs f 10-बिंदु अंतर, Ln vs An 10-बिंदु अंतर, K₂Cr₂O₇ व KMnO₄ निर्माण, अभिक्रियाएँ व CrO₄²⁻/Cr₂O₇²⁻ संरचना | `#/df-actinoids-and-compounds` |
| Attribution | Hariohm Classes , Silwani Madhya Pradesh \| Class 12 Chemistry \| NCERT Based MP Board 2026-27 \| 📞 9074248383 | Present across all header, view cards, and footer |
