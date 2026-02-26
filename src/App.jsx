import { useState, useEffect, useRef } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --earth: #1a1208;
    --soil: #2d1f0a;
    --clay: #3d2b0f;
    --wheat: #d4a843;
    --harvest: #e8c05a;
    --seedling: #4caf50;
    --leaf: #66bb6a;
    --sprout: #a5d6a7;
    --sky: #81d4fa;
    --water: #29b6f6;
    --alert: #ff7043;
    --muted: rgba(212,168,67,0.15);
    --surface: rgba(45,31,10,0.8);
    --glass: rgba(61,43,15,0.6);
    --text: #f5e6c8;
    --text-dim: rgba(245,230,200,0.55);
  }

  html, body { height: 100%; }

  .app {
    min-height: 100vh;
    background: var(--earth);
    color: var(--text);
    font-family: 'Syne', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  /* Terrain background */
  .app::before {
    content: '';
    position: fixed; inset: 0;
    background: 
      radial-gradient(ellipse 80% 60% at 20% 80%, rgba(76,175,80,0.06) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 20%, rgba(41,182,246,0.05) 0%, transparent 50%),
      radial-gradient(ellipse 100% 80% at 50% 100%, rgba(212,168,67,0.08) 0%, transparent 40%),
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(212,168,67,0.015) 2px,
        rgba(212,168,67,0.015) 4px
      );
    pointer-events: none; z-index: 0;
  }

  /* NAVBAR */
  .navbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: rgba(26,18,8,0.92);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(212,168,67,0.2);
    padding: 0 2rem;
    display: flex; align-items: center; gap: 2rem;
    height: 64px;
  }

  .nav-logo {
    display: flex; align-items: center; gap: 0.75rem;
    font-size: 1.4rem; font-weight: 800; letter-spacing: -0.02em;
    color: var(--harvest);
  }

  .nav-logo .icon {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, var(--seedling), var(--leaf));
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; box-shadow: 0 0 20px rgba(76,175,80,0.4);
  }

  .nav-logo .sub { font-size: 0.65rem; color: var(--text-dim); font-weight: 400; letter-spacing: 0.12em; display: block; line-height: 1; }

  .nav-tabs {
    display: flex; gap: 0.25rem; margin-left: auto;
  }

  .nav-tab {
    padding: 0.5rem 1.1rem;
    border-radius: 8px;
    border: none;
    background: transparent;
    color: var(--text-dim);
    font-family: 'Syne', sans-serif;
    font-size: 0.82rem; font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.02em;
  }

  .nav-tab:hover { background: var(--muted); color: var(--text); }
  .nav-tab.active { background: var(--muted); color: var(--harvest); border: 1px solid rgba(212,168,67,0.3); }

  .nav-badge {
    background: var(--seedling); color: white;
    font-size: 0.6rem; padding: 1px 5px; border-radius: 4px;
    margin-left: 4px; font-weight: 700;
  }

  /* MAIN */
  .main { padding-top: 64px; position: relative; z-index: 1; }

  /* HERO */
  .hero {
    padding: 3rem 2rem 2rem;
    max-width: 1400px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr; gap: 3rem;
    align-items: start;
  }

  .hero-title {
    font-size: clamp(2.2rem, 4vw, 3.5rem);
    font-weight: 800; line-height: 1.05;
    letter-spacing: -0.03em;
  }

  .hero-title .accent { color: var(--harvest); }
  .hero-title .green { color: var(--leaf); }

  .hero-sub {
    font-family: 'Noto Sans Devanagari', sans-serif;
    font-size: 1.1rem; color: var(--text-dim);
    margin-top: 0.75rem; line-height: 1.6;
  }

  .hero-stats {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;
    margin-top: 2rem;
  }

  .stat-card {
    background: var(--glass);
    border: 1px solid rgba(212,168,67,0.15);
    border-radius: 12px; padding: 1rem;
    backdrop-filter: blur(10px);
    transition: all 0.3s;
  }

  .stat-card:hover { border-color: rgba(212,168,67,0.4); transform: translateY(-2px); }

  .stat-val {
    font-size: 1.8rem; font-weight: 800;
    color: var(--harvest); letter-spacing: -0.03em;
  }

  .stat-label { font-size: 0.72rem; color: var(--text-dim); margin-top: 2px; line-height: 1.3; }

  /* CRISIS PANEL */
  .crisis-panel {
    background: rgba(255,112,67,0.08);
    border: 1px solid rgba(255,112,67,0.25);
    border-radius: 16px; padding: 1.5rem;
    position: relative; overflow: hidden;
  }

  .crisis-panel::before {
    content: '⚠';
    position: absolute; right: -0.5rem; top: -1rem;
    font-size: 8rem; opacity: 0.05;
  }

  .crisis-title {
    font-size: 0.75rem; font-weight: 700;
    letter-spacing: 0.15em; color: var(--alert);
    text-transform: uppercase; margin-bottom: 1rem;
  }

  .crisis-item {
    display: flex; align-items: flex-start; gap: 0.75rem;
    padding: 0.6rem 0;
    border-bottom: 1px solid rgba(255,112,67,0.1);
    font-size: 0.85rem; line-height: 1.4;
  }

  .crisis-item:last-child { border-bottom: none; }
  .crisis-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--alert); margin-top: 4px; flex-shrink: 0; }

  /* CONTENT AREA */
  .content {
    max-width: 1400px; margin: 0 auto;
    padding: 0 2rem 4rem;
  }

  /* SECTION HEADER */
  .section-header {
    display: flex; align-items: center; gap: 1rem;
    margin-bottom: 1.5rem; padding-top: 1.5rem;
  }

  .section-icon {
    width: 44px; height: 44px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem; flex-shrink: 0;
  }

  .section-title { font-size: 1.4rem; font-weight: 800; letter-spacing: -0.02em; }
  .section-sub { font-size: 0.8rem; color: var(--text-dim); margin-top: 2px; }

  /* TOOL GRID */
  .tool-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
    gap: 1.5rem;
  }

  /* CARD */
  .card {
    background: var(--surface);
    border: 1px solid rgba(212,168,67,0.12);
    border-radius: 16px;
    backdrop-filter: blur(12px);
    overflow: hidden;
    transition: all 0.3s;
  }

  .card:hover { border-color: rgba(212,168,67,0.25); box-shadow: 0 8px 32px rgba(0,0,0,0.4); }

  .card-header {
    padding: 1.25rem 1.5rem 0;
    display: flex; align-items: center; gap: 0.75rem;
  }

  .card-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; flex-shrink: 0;
  }

  .card-title { font-size: 1rem; font-weight: 700; }
  .card-desc { font-size: 0.75rem; color: var(--text-dim); margin-top: 2px; }

  .card-body { padding: 1.25rem 1.5rem 1.5rem; }

  /* UPLOAD ZONE */
  .upload-zone {
    border: 2px dashed rgba(76,175,80,0.3);
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    position: relative; overflow: hidden;
  }

  .upload-zone:hover, .upload-zone.dragover {
    border-color: var(--seedling);
    background: rgba(76,175,80,0.05);
  }

  .upload-zone.has-image {
    border-color: var(--harvest);
    padding: 0;
  }

  .upload-zone.has-image img {
    width: 100%; max-height: 200px; object-fit: cover;
    border-radius: 10px; display: block;
  }

  .upload-text { color: var(--text-dim); font-size: 0.85rem; margin-top: 0.5rem; }

  /* FORM ELEMENTS */
  .form-row {
    display: grid; gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .form-row.cols-2 { grid-template-columns: 1fr 1fr; }

  label {
    display: block; font-size: 0.72rem; font-weight: 600;
    letter-spacing: 0.08em; color: var(--text-dim);
    text-transform: uppercase; margin-bottom: 0.3rem;
  }

  select, input[type="text"], input[type="number"], textarea {
    width: 100%;
    background: rgba(26,18,8,0.6);
    border: 1px solid rgba(212,168,67,0.15);
    border-radius: 8px;
    color: var(--text);
    font-family: 'Syne', sans-serif;
    font-size: 0.85rem;
    padding: 0.6rem 0.85rem;
    transition: all 0.2s;
    outline: none;
  }

  select:focus, input:focus, textarea:focus {
    border-color: rgba(212,168,67,0.4);
    background: rgba(26,18,8,0.8);
    box-shadow: 0 0 0 3px rgba(212,168,67,0.08);
  }

  textarea { resize: vertical; min-height: 80px; }

  /* BUTTONS */
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
    border: none; border-radius: 10px;
    font-family: 'Syne', sans-serif;
    font-size: 0.85rem; font-weight: 700;
    cursor: pointer; transition: all 0.2s;
    padding: 0.7rem 1.4rem;
    letter-spacing: 0.02em;
  }

  .btn-primary {
    background: linear-gradient(135deg, var(--seedling), #388e3c);
    color: white;
    box-shadow: 0 4px 15px rgba(76,175,80,0.3);
    width: 100%; margin-top: 0.75rem;
  }

  .btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(76,175,80,0.4); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-amber {
    background: linear-gradient(135deg, var(--wheat), #c8961a);
    color: var(--earth);
    box-shadow: 0 4px 15px rgba(212,168,67,0.3);
    width: 100%; margin-top: 0.75rem;
  }

  .btn-amber:hover:not(:disabled) { transform: translateY(-1px); }
  .btn-amber:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-water {
    background: linear-gradient(135deg, var(--water), #0277bd);
    color: white;
    box-shadow: 0 4px 15px rgba(41,182,246,0.3);
    width: 100%; margin-top: 0.75rem;
  }

  .btn-water:hover:not(:disabled) { transform: translateY(-1px); }
  .btn-water:disabled { opacity: 0.5; cursor: not-allowed; }

  /* RESPONSE */
  .ai-response {
    margin-top: 1rem;
    background: rgba(26,18,8,0.7);
    border: 1px solid rgba(76,175,80,0.2);
    border-radius: 12px;
    overflow: hidden;
    animation: fadeSlide 0.4s ease;
  }

  @keyframes fadeSlide {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .ai-response-header {
    background: rgba(76,175,80,0.1);
    border-bottom: 1px solid rgba(76,175,80,0.15);
    padding: 0.6rem 1rem;
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.72rem; font-weight: 700;
    color: var(--leaf); letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .ai-response-body {
    padding: 1rem;
    font-size: 0.85rem; line-height: 1.7;
    color: var(--text);
    white-space: pre-wrap; word-break: break-word;
  }

  .ai-response.amber-border { border-color: rgba(212,168,67,0.2); }
  .ai-response.amber-border .ai-response-header { background: rgba(212,168,67,0.08); border-color: rgba(212,168,67,0.15); color: var(--harvest); }

  .ai-response.water-border { border-color: rgba(41,182,246,0.2); }
  .ai-response.water-border .ai-response-header { background: rgba(41,182,246,0.08); border-color: rgba(41,182,246,0.15); color: var(--sky); }

  /* LOADING */
  .loading-dots {
    display: inline-flex; gap: 4px; align-items: center;
  }

  .loading-dots span {
    width: 6px; height: 6px; border-radius: 50%;
    background: currentColor; opacity: 0.6;
    animation: dot 1.2s infinite;
  }

  .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
  .loading-dots span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes dot {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
    40% { transform: scale(1); opacity: 1; }
  }

  /* MARKET TABLE */
  .market-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
  .market-table th {
    text-align: left; padding: 0.5rem 0.75rem;
    font-size: 0.68rem; letter-spacing: 0.1em; color: var(--text-dim);
    text-transform: uppercase; border-bottom: 1px solid rgba(212,168,67,0.15);
  }
  .market-table td { padding: 0.6rem 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .market-table tr:last-child td { border-bottom: none; }

  .price-up { color: var(--leaf); }
  .price-down { color: var(--alert); }
  .price-badge {
    display: inline-block;
    padding: 2px 8px; border-radius: 4px;
    font-size: 0.68rem; font-weight: 700;
  }

  /* DASHBOARD METRICS */
  .metrics-row {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .metric-card {
    background: var(--glass);
    border: 1px solid rgba(212,168,67,0.1);
    border-radius: 12px; padding: 1rem 1.25rem;
    position: relative; overflow: hidden;
  }

  .metric-card::after {
    content: ''; position: absolute;
    bottom: 0; left: 0; right: 0; height: 3px;
  }

  .metric-card.green::after { background: linear-gradient(90deg, var(--seedling), transparent); }
  .metric-card.amber::after { background: linear-gradient(90deg, var(--harvest), transparent); }
  .metric-card.blue::after { background: linear-gradient(90deg, var(--water), transparent); }
  .metric-card.red::after { background: linear-gradient(90deg, var(--alert), transparent); }

  .metric-val { font-size: 1.6rem; font-weight: 800; letter-spacing: -0.03em; }
  .metric-label { font-size: 0.7rem; color: var(--text-dim); margin-top: 2px; }
  .metric-change { font-size: 0.72rem; margin-top: 0.25rem; font-weight: 600; }

  /* WEATHER WIDGET */
  .weather-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; }
  .weather-day {
    background: rgba(26,18,8,0.5);
    border: 1px solid rgba(41,182,246,0.12);
    border-radius: 10px; padding: 0.75rem;
    text-align: center; font-size: 0.8rem;
  }
  .weather-temp { font-size: 1.2rem; font-weight: 700; color: var(--sky); }
  .weather-icon { font-size: 1.5rem; margin: 0.3rem 0; }
  .weather-label { font-size: 0.68rem; color: var(--text-dim); }

  /* TABS */
  .tab-bar {
    display: flex; gap: 0.25rem;
    background: rgba(26,18,8,0.5);
    border: 1px solid rgba(212,168,67,0.1);
    border-radius: 12px; padding: 4px;
    margin-bottom: 1.5rem;
  }

  .tab-btn {
    flex: 1; padding: 0.5rem 1rem;
    border-radius: 8px; border: none;
    background: transparent;
    color: var(--text-dim);
    font-family: 'Syne', sans-serif;
    font-size: 0.8rem; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
  }

  .tab-btn.active {
    background: var(--clay);
    color: var(--harvest);
  }

  /* ALERT BANNER */
  .alert-banner {
    display: flex; align-items: flex-start; gap: 0.75rem;
    background: rgba(255,112,67,0.08);
    border: 1px solid rgba(255,112,67,0.2);
    border-radius: 10px; padding: 0.75rem 1rem;
    font-size: 0.82rem; margin-bottom: 1rem;
    line-height: 1.5;
  }

  /* FOOTER */
  .footer {
    background: rgba(26,18,8,0.9);
    border-top: 1px solid rgba(212,168,67,0.1);
    padding: 1.5rem 2rem;
    text-align: center;
    font-size: 0.75rem; color: var(--text-dim);
  }

  .footer strong { color: var(--harvest); }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--earth); }
  ::-webkit-scrollbar-thumb { background: var(--clay); border-radius: 3px; }

  /* TAG */
  .tag {
    display: inline-block; padding: 2px 8px;
    border-radius: 5px; font-size: 0.68rem; font-weight: 700;
    letter-spacing: 0.05em;
  }

  .tag-green { background: rgba(76,175,80,0.15); color: var(--leaf); border: 1px solid rgba(76,175,80,0.2); }
  .tag-amber { background: rgba(212,168,67,0.12); color: var(--harvest); border: 1px solid rgba(212,168,67,0.2); }
  .tag-red { background: rgba(255,112,67,0.12); color: var(--alert); border: 1px solid rgba(255,112,67,0.2); }
  .tag-blue { background: rgba(41,182,246,0.12); color: var(--sky); border: 1px solid rgba(41,182,246,0.2); }

  @media (max-width: 768px) {
    .hero { grid-template-columns: 1fr; }
    .metrics-row { grid-template-columns: repeat(2, 1fr); }
    .weather-grid { grid-template-columns: repeat(2, 1fr); }
    .tool-grid { grid-template-columns: 1fr; }
  }
`;

// Simulated market prices data
const MARKET_DATA = [
  { crop: "Wheat (गेहूँ)", mandi: 2125, market: 2380, msp: 2275, state: "Punjab", trend: "up", pct: "+3.2%" },
  { crop: "Rice (धान)", mandi: 2180, market: 2490, msp: 2300, state: "UP", trend: "up", pct: "+5.1%" },
  { crop: "Cotton (कपास)", mandi: 6420, market: 7100, msp: 6620, state: "Maharashtra", trend: "down", pct: "-1.8%" },
  { crop: "Soybean (सोयाबीन)", mandi: 4250, market: 4780, msp: 4600, state: "MP", trend: "up", pct: "+2.7%" },
  { crop: "Maize (मक्का)", mandi: 1780, market: 2100, msp: 2090, state: "Bihar", trend: "up", pct: "+4.5%" },
  { crop: "Onion (प्याज)", mandi: 1850, market: 2900, msp: "—", state: "Maharashtra", trend: "up", pct: "+18%" },
];

const WEATHER = [
  { day: "Today", icon: "⛅", high: 28, low: 18, rain: "20%", label: "Partly Cloudy" },
  { day: "Thu", icon: "🌧️", high: 24, low: 16, rain: "80%", label: "Rain" },
  { day: "Fri", icon: "🌩️", high: 22, low: 15, rain: "90%", label: "Thunderstorm" },
  { day: "Sat", icon: "☀️", high: 30, low: 19, rain: "5%", label: "Sunny" },
];

const CROPS_LIST = ["Wheat", "Rice", "Cotton", "Soybean", "Maize", "Sugarcane", "Tomato", "Potato", "Onion", "Chilli", "Mustard", "Gram/Chickpea"];
const STATES = ["Andhra Pradesh", "Bihar", "Gujarat", "Haryana", "Karnataka", "Madhya Pradesh", "Maharashtra", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"];
const SOIL_TYPES = ["Alluvial (Sandy Loam)", "Black Cotton (Regur)", "Red Laterite", "Sandy Desert", "Clay Loam", "Silt Loam"];

export default function KisanAI() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [diseaseResult, setDiseaseResult] = useState(null);
  const [diseaseLoading, setDiseaseLoading] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [cropImageData, setCropImageData] = useState(null);
  const [diseaseDesc, setDiseaseDesc] = useState("");

  const [marketResult, setMarketResult] = useState(null);
  const [marketLoading, setMarketLoading] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState("Wheat");
  const [selectedState, setSelectedState] = useState("Punjab");
  const [quantity, setQuantity] = useState("100");

  const [irrigResult, setIrrigResult] = useState(null);
  const [irrigLoading, setIrrigLoading] = useState(false);
  const [irrigCrop, setIrrigCrop] = useState("Wheat");
  const [irrigState, setIrrigState] = useState("Punjab");
  const [soilType, setSoilType] = useState("Alluvial (Sandy Loam)");
  const [fieldSize, setFieldSize] = useState("5");
  const [growthStage, setGrowthStage] = useState("Flowering");
  const [lastRain, setLastRain] = useState("5 days ago");

  const fileRef = useRef();

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCropImage(ev.target.result);
      setCropImageData(ev.target.result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };

  const callClaude = async (messages, system) => {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system,
        messages,
      }),
    });
    const data = await resp.json();
    return data.content?.map(b => b.text || "").join("") || "No response";
  };

  const analyzeCropDisease = async () => {
    setDiseaseLoading(true);
    setDiseaseResult(null);
    try {
      const content = [];
      if (cropImageData) {
        content.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: cropImageData } });
      }
      content.push({
        type: "text",
        text: `You are an expert agronomist specializing in Indian crops. ${diseaseDesc ? `Farmer's description: "${diseaseDesc}"` : ""}
Analyze this crop for diseases, pest attacks, or nutrient deficiencies.

Provide a structured response with:
🔍 DIAGNOSIS: [disease/issue name in English and Hindi]
⚠️ SEVERITY: [Low/Medium/High/Critical]
📋 SYMPTOMS: [observed symptoms]
🦠 CAUSE: [pathogen/pest/deficiency]
💊 TREATMENT:
  • Organic: [organic/natural remedy]
  • Chemical: [specific pesticide/fungicide - Indian brand names]
  • Dosage: [exact dosage per acre]
📅 TIMELINE: [when to expect recovery]
🛡️ PREVENTION: [2-3 future prevention tips]
💰 ESTIMATED CROP LOSS IF UNTREATED: [percentage]

Be specific to Indian farming conditions. Mention product names available in Indian markets.`
      });

      const result = await callClaude(
        [{ role: "user", content }],
        "You are KisanAI's crop diagnostics engine. You help Indian farmers identify and treat crop diseases. Always provide actionable, specific advice using products and methods available in India."
      );
      setDiseaseResult(result);
    } catch (e) {
      setDiseaseResult("Error connecting to AI. Please check your connection.");
    }
    setDiseaseLoading(false);
  };

  const analyzeMarket = async () => {
    setMarketLoading(true);
    setMarketResult(null);
    try {
      const result = await callClaude(
        [{
          role: "user",
          content: `You are India's agricultural market intelligence system. Analyze optimal selling strategy for:
- Crop: ${selectedCrop}
- Location: ${selectedState}  
- Quantity: ${quantity} quintals
- Date: ${new Date().toLocaleDateString("en-IN")}

Provide:
📊 PRICE ANALYSIS:
  • Current mandi price range: ₹/quintal
  • National market average: ₹/quintal
  • MSP 2024-25: ₹/quintal
  • Projected trend (next 2 weeks): ↑/↓

🏪 TOP SELLING OPTIONS (ranked by profit):
  1. [Option]: [platform/buyer] - Expected ₹___ /quintal | Why: ___
  2. [Option]: [platform/buyer] - Expected ₹___ /quintal | Why: ___
  3. [Option]: [platform/buyer] - Expected ₹___ /quintal | Why: ___

💡 RECOMMENDATION: [specific advice]
📦 STORAGE ADVICE: [store or sell now?]
🚜 LOGISTICS: [transport options]
💰 ESTIMATED PROFIT on ${quantity} quintals: ₹___

Use platforms like eNAM, APMC, Agribazaar, Ninjacart, DeHaat, Cargill, ITC e-Choupal where relevant.`
        }],
        "You are KisanAI's market intelligence engine specializing in Indian agricultural commodity markets. Provide accurate, current market analysis for Indian farmers."
      );
      setMarketResult(result);
    } catch (e) {
      setMarketResult("Error connecting to AI. Please check your connection.");
    }
    setMarketLoading(false);
  };

  const analyzeIrrigation = async () => {
    setIrrigLoading(true);
    setIrrigResult(null);
    try {
      const result = await callClaude(
        [{
          role: "user",
          content: `You are India's smart irrigation advisory system. Create a precise irrigation plan:

Farm Details:
- Crop: ${irrigCrop}
- State/Region: ${irrigState}
- Soil Type: ${soilType}
- Field Size: ${fieldSize} acres
- Growth Stage: ${growthStage}
- Last Rainfall: ${lastRain}
- Season: ${new Date().toLocaleString('default', {month: 'long'})}
- Upcoming forecast: Rain expected Thursday-Friday

Provide:
💧 CURRENT WATER STRESS LEVEL: [None/Low/Medium/High] + why

📅 IRRIGATION SCHEDULE (next 7 days):
  Day 1 (Today): [Irrigate YES/NO] | Volume: ___ mm | Duration: ___ hours | Time: [morning/evening]
  Day 2: [continue for each day...]
  ...Day 7

🌊 METHOD RECOMMENDATION:
  • Best for this crop/soil: [Drip/Furrow/Sprinkler/Flood]
  • Water savings vs current: ____%

💰 WATER & COST CALCULATION:
  • Total water needed (7 days): ___ liters
  • Electricity cost estimate: ₹___
  • Water cost (if paid): ₹___
  • Potential savings with drip: ₹___

⚠️ ALERTS: [any critical warnings]
🌾 YIELD IMPACT: [yield effect of following this plan]

Be specific for ${irrigState} conditions and ${irrigCrop} crop requirements.`
        }],
        "You are KisanAI's precision irrigation advisory engine for Indian farmers. Provide water-efficient, scientifically accurate irrigation schedules optimized for Indian crops, soils, and climate conditions."
      );
      setIrrigResult(result);
    } catch (e) {
      setIrrigResult("Error connecting to AI. Please check your connection.");
    }
    setIrrigLoading(false);
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        {/* NAVBAR */}
        <nav className="navbar">
          <div className="nav-logo">
            <div className="icon">🌾</div>
            <div>
              KisanAI
              <span className="sub">DIGITAL FARM INTELLIGENCE</span>
            </div>
          </div>
          <div className="nav-tabs">
            {[
              { id: "dashboard", label: "Dashboard" },
              { id: "disease", label: "Crop Doctor", badge: "AI" },
              { id: "market", label: "Market Intel", badge: "AI" },
              { id: "irrigation", label: "Smart Water", badge: "AI" },
            ].map(t => (
              <button
                key={t.id}
                className={`nav-tab ${activeTab === t.id ? "active" : ""}`}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
                {t.badge && <span className="nav-badge">{t.badge}</span>}
              </button>
            ))}
          </div>
        </nav>

        <main className="main">
          {/* HERO - shown on dashboard */}
          {activeTab === "dashboard" && (
            <div className="hero">
              <div>
                <div className="hero-title">
                  Intelligent Infrastructure<br />
                  for <span className="accent">140M</span> <span className="green">Indian Farmers</span>
                </div>
                <div className="hero-sub">
                  किसान AI — Real-time crop diagnostics, market intelligence & precision water management powered by artificial intelligence
                </div>
                <div className="hero-stats">
                  {[
                    { val: "₹1.8L Cr", label: "Annual crop losses from preventable diseases" },
                    { val: "40-60%", label: "Price gap farmers lose to intermediaries" },
                    { val: "78%", label: "Groundwater depletion in agri-zones" },
                  ].map((s, i) => (
                    <div className="stat-card" key={i}>
                      <div className="stat-val">{s.val}</div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="crisis-panel">
                <div className="crisis-title">🚨 Real Challenges We Solve</div>
                {[
                  { text: "300,000+ farmer suicides in 20 years — mostly due to crop failure & debt from information gaps", tag: "crisis" },
                  { text: "Farmers receive only 15-20 paisa of every rupee consumers pay — massive middlemen exploitation", tag: "economic" },
                  { text: "India loses 40% more water in agriculture than global average — groundwater crisis is acute", tag: "resource" },
                  { text: "Only 30% of farmers have access to agricultural extension services — advice gap is severe", tag: "access" },
                ].map((item, i) => (
                  <div className="crisis-item" key={i}>
                    <div className="crisis-dot" />
                    <div>{item.text} <span className={`tag tag-${["red","amber","blue","green"][i]}`}>{item.tag}</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="content">
            {/* DASHBOARD TAB */}
            {activeTab === "dashboard" && (
              <>
                <div className="metrics-row">
                  {[
                    { val: "2.4M+", label: "Farmers Using Platform", change: "+12% this month", color: "green" },
                    { val: "₹8,400", label: "Avg Extra Income/Year", change: "vs pre-platform baseline", color: "amber" },
                    { val: "31%", label: "Water Saved per Farm", change: "via smart irrigation", color: "blue" },
                    { val: "94.2%", label: "Disease Detection Accuracy", change: "validated field trials", color: "green" },
                  ].map((m, i) => (
                    <div className={`metric-card ${m.color}`} key={i}>
                      <div className="metric-val">{m.val}</div>
                      <div className="metric-label">{m.label}</div>
                      <div className={`metric-change ${m.color === "blue" ? "price-up" : "price-up"}`}>{m.change}</div>
                    </div>
                  ))}
                </div>

                <div className="alert-banner">
                  <span>🌧️</span>
                  <div>
                    <strong>Weather Alert — Punjab, Haryana, UP:</strong> Heavy rainfall forecast Thu-Fri. Avoid irrigation until Saturday. Check drainage in low-lying cotton fields. High humidity may trigger fungal disease in wheat — monitor leaf blotch symptoms.
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  {/* Market Prices Card */}
                  <div className="card">
                    <div className="card-header">
                      <div className="card-icon" style={{ background: "rgba(212,168,67,0.15)" }}>📈</div>
                      <div>
                        <div className="card-title">Live Mandi Prices</div>
                        <div className="card-desc">vs Market & MSP — Updated hourly</div>
                      </div>
                    </div>
                    <div className="card-body">
                      <table className="market-table">
                        <thead>
                          <tr>
                            <th>Crop</th>
                            <th>Mandi ₹</th>
                            <th>Market ₹</th>
                            <th>Gap</th>
                          </tr>
                        </thead>
                        <tbody>
                          {MARKET_DATA.map((row, i) => {
                            const gap = row.market - row.mandi;
                            const gapPct = Math.round((gap / row.mandi) * 100);
                            return (
                              <tr key={i}>
                                <td>
                                  <div style={{ fontWeight: 600, fontSize: "0.8rem" }}>{row.crop}</div>
                                  <div style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>{row.state}</div>
                                </td>
                                <td style={{ fontFamily: "JetBrains Mono" }}>₹{row.mandi}</td>
                                <td style={{ fontFamily: "JetBrains Mono" }}>
                                  <span className={row.trend === "up" ? "price-up" : "price-down"}>
                                    ₹{row.market} {row.trend === "up" ? "↑" : "↓"}
                                  </span>
                                </td>
                                <td>
                                  <span className="price-badge tag-amber">+{gapPct}%</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Weather Card */}
                  <div className="card">
                    <div className="card-header">
                      <div className="card-icon" style={{ background: "rgba(41,182,246,0.15)" }}>🌤</div>
                      <div>
                        <div className="card-title">Agro-Weather Forecast</div>
                        <div className="card-desc">Lucknow, Uttar Pradesh</div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="weather-grid">
                        {WEATHER.map((w, i) => (
                          <div className="weather-day" key={i}>
                            <div className="weather-label">{w.day}</div>
                            <div className="weather-icon">{w.icon}</div>
                            <div className="weather-temp">{w.high}°</div>
                            <div className="weather-label">lo {w.low}°</div>
                            <div style={{ marginTop: "0.25rem" }}>
                              <span className="tag tag-blue">{w.rain} rain</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(41,182,246,0.06)", borderRadius: "8px", fontSize: "0.78rem", color: "var(--text-dim)", lineHeight: 1.6 }}>
                        <strong style={{ color: "var(--sky)" }}>🌊 Agro Advisory:</strong> Expected 35-50mm rainfall Thursday. Delay spraying operations. Ensure field drainage. Good sowing window opens Saturday for rabi crops.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Platform Architecture */}
                <div className="card" style={{ marginTop: "1.5rem" }}>
                  <div className="card-header">
                    <div className="card-icon" style={{ background: "rgba(76,175,80,0.15)" }}>🏗️</div>
                    <div>
                      <div className="card-title">Platform Architecture & Infrastructure Design</div>
                      <div className="card-desc">Scalable, secure, AI-native agricultural intelligence stack</div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                      {[
                        {
                          layer: "Farmer Access Layer",
                          icon: "📱",
                          color: "rgba(76,175,80,0.1)",
                          border: "rgba(76,175,80,0.2)",
                          items: ["Progressive Web App (works on 2G)", "IVR Voice System (Hindi/regional)", "WhatsApp Bot Integration", "SMS fallback (feature phones)", "Rural Agent Network"]
                        },
                        {
                          layer: "Intelligence Core",
                          icon: "🧠",
                          color: "rgba(212,168,67,0.08)",
                          border: "rgba(212,168,67,0.2)",
                          items: ["Claude AI (Disease + Market)", "Computer Vision (crop images)", "Satellite NDVI Analysis", "Soil Sensor IoT Integration", "Federated ML (on-device)"]
                        },
                        {
                          layer: "Data & Security",
                          icon: "🔐",
                          color: "rgba(41,182,246,0.08)",
                          border: "rgba(41,182,246,0.2)",
                          items: ["Aadhaar-based KYC auth", "End-to-end encryption", "DPDP Act compliance", "Geo-redundant cloud (AWS India)", "Real-time mandi API feeds"]
                        }
                      ].map((block, i) => (
                        <div key={i} style={{
                          background: block.color, border: `1px solid ${block.border}`,
                          borderRadius: "10px", padding: "1rem"
                        }}>
                          <div style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: "0.75rem" }}>
                            {block.icon} {block.layer}
                          </div>
                          {block.items.map((item, j) => (
                            <div key={j} style={{ fontSize: "0.75rem", color: "var(--text-dim)", padding: "0.2rem 0", display: "flex", gap: "0.5rem" }}>
                              <span style={{ color: "var(--seedling)", flexShrink: 0 }}>✓</span>
                              {item}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* CROP DOCTOR TAB */}
            {activeTab === "disease" && (
              <>
                <div className="section-header">
                  <div className="section-icon" style={{ background: "rgba(76,175,80,0.15)" }}>🔬</div>
                  <div>
                    <div className="section-title">AI Crop Doctor — फसल चिकित्सक</div>
                    <div className="section-sub">Upload a photo or describe symptoms to get instant disease diagnosis and treatment plan</div>
                  </div>
                </div>

                <div className="tool-grid">
                  <div className="card">
                    <div className="card-header">
                      <div className="card-icon" style={{ background: "rgba(76,175,80,0.15)" }}>📸</div>
                      <div>
                        <div className="card-title">Disease Detector</div>
                        <div className="card-desc">Photo + symptom description → AI diagnosis</div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div
                        className={`upload-zone ${cropImage ? "has-image" : ""}`}
                        onClick={() => !cropImage && fileRef.current.click()}
                      >
                        {cropImage ? (
                          <div>
                            <img src={cropImage} alt="crop" />
                            <div style={{ padding: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>Image ready for analysis</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); setCropImage(null); setCropImageData(null); }}
                                style={{ background: "none", border: "none", color: "var(--alert)", cursor: "pointer", fontSize: "0.75rem" }}
                              >✕ Remove</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div style={{ fontSize: "2.5rem" }}>📷</div>
                            <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Click to upload crop photo</div>
                            <div className="upload-text">JPEG/PNG — leaf, fruit, stem, or full plant</div>
                            <div className="upload-text">OR describe symptoms below (no photo needed)</div>
                          </>
                        )}
                      </div>
                      <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />

                      <div style={{ marginTop: "0.75rem" }}>
                        <label>Symptom Description (in English or Hindi)</label>
                        <textarea
                          value={diseaseDesc}
                          onChange={e => setDiseaseDesc(e.target.value)}
                          placeholder="e.g. Yellow spots on wheat leaves, powdery white coating, wilting despite watering, holes in leaves... / पत्तियों पर पीले धब्बे, सफेद परत..."
                        />
                      </div>

                      <button
                        className="btn btn-primary"
                        onClick={analyzeCropDisease}
                        disabled={(!cropImage && !diseaseDesc) || diseaseLoading}
                      >
                        {diseaseLoading ? (
                          <>Analyzing <div className="loading-dots"><span/><span/><span/></div></>
                        ) : "🔍 Diagnose & Get Treatment Plan"}
                      </button>

                      {diseaseResult && (
                        <div className="ai-response">
                          <div className="ai-response-header">🤖 KisanAI Crop Doctor Analysis</div>
                          <div className="ai-response-body">{diseaseResult}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div className="card">
                      <div className="card-header">
                        <div className="card-icon" style={{ background: "rgba(255,112,67,0.15)" }}>🚨</div>
                        <div>
                          <div className="card-title">Disease Outbreak Alerts</div>
                          <div className="card-desc">Live crowdsourced field reports</div>
                        </div>
                      </div>
                      <div className="card-body">
                        {[
                          { disease: "Wheat Rust (रतुआ)", region: "Punjab, Haryana", severity: "High", cases: "1,240" },
                          { disease: "Rice Blast (ब्लास्ट)", region: "UP, Bihar", severity: "Medium", cases: "876" },
                          { disease: "Cotton Bollworm", region: "Maharashtra, Gujarat", severity: "High", cases: "2,108" },
                          { disease: "Tomato Leaf Curl Virus", region: "Karnataka, AP", severity: "Critical", cases: "3,400" },
                        ].map((alert, i) => (
                          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: "0.82rem" }}>{alert.disease}</div>
                              <div style={{ fontSize: "0.68rem", color: "var(--text-dim)" }}>{alert.region} • {alert.cases} reports</div>
                            </div>
                            <span className={`tag tag-${alert.severity === "Critical" ? "red" : alert.severity === "High" ? "red" : "amber"}`}>
                              {alert.severity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="card">
                      <div className="card-header">
                        <div className="card-icon" style={{ background: "rgba(76,175,80,0.15)" }}>📊</div>
                        <div>
                          <div className="card-title">Platform Impact</div>
                          <div className="card-desc">Disease module outcomes</div>
                        </div>
                      </div>
                      <div className="card-body">
                        {[
                          { label: "Avg time to diagnosis", before: "7-10 days", after: "< 3 minutes", icon: "⏱" },
                          { label: "Crop loss prevented", before: "₹0 guidance", after: "₹12,000/acre avg", icon: "💰" },
                          { label: "Correct treatment rate", before: "38% (guessing)", after: "94.2% (AI verified)", icon: "✅" },
                          { label: "Farmer reach", before: "30 km to expert", after: "Instant on phone", icon: "📱" },
                        ].map((row, i) => (
                          <div key={i} style={{ display: "flex", gap: "0.75rem", padding: "0.5rem 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: "0.78rem" }}>
                            <span style={{ fontSize: "1rem" }}>{row.icon}</span>
                            <div>
                              <div style={{ fontWeight: 600, marginBottom: "2px" }}>{row.label}</div>
                              <div style={{ color: "var(--alert)", fontSize: "0.7rem" }}>Before: {row.before}</div>
                              <div style={{ color: "var(--leaf)", fontSize: "0.7rem" }}>After: {row.after}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* MARKET INTELLIGENCE TAB */}
            {activeTab === "market" && (
              <>
                <div className="section-header">
                  <div className="section-icon" style={{ background: "rgba(212,168,67,0.15)" }}>📈</div>
                  <div>
                    <div className="section-title">Market Intelligence — बाजार विश्लेषण</div>
                    <div className="section-sub">AI-powered selling strategy to maximize your profit against intermediary exploitation</div>
                  </div>
                </div>

                <div className="tool-grid">
                  <div className="card">
                    <div className="card-header">
                      <div className="card-icon" style={{ background: "rgba(212,168,67,0.15)" }}>🧮</div>
                      <div>
                        <div className="card-title">Profit Maximizer</div>
                        <div className="card-desc">Best selling platform for your crop & location</div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="form-row cols-2">
                        <div>
                          <label>Crop</label>
                          <select value={selectedCrop} onChange={e => setSelectedCrop(e.target.value)}>
                            {CROPS_LIST.map(c => <option key={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label>State</label>
                          <select value={selectedState} onChange={e => setSelectedState(e.target.value)}>
                            {STATES.map(s => <option key={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="form-row">
                        <div>
                          <label>Quantity (Quintals)</label>
                          <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="e.g. 100" />
                        </div>
                      </div>

                      <button
                        className="btn btn-amber"
                        onClick={analyzeMarket}
                        disabled={marketLoading}
                      >
                        {marketLoading ? (
                          <>Analyzing markets <div className="loading-dots"><span/><span/><span/></div></>
                        ) : "📊 Get Selling Strategy & Best Price"}
                      </button>

                      {marketResult && (
                        <div className="ai-response amber-border">
                          <div className="ai-response-header">🤖 Market Intelligence Report</div>
                          <div className="ai-response-body">{marketResult}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div className="card">
                      <div className="card-header">
                        <div className="card-icon" style={{ background: "rgba(212,168,67,0.15)" }}>🏪</div>
                        <div>
                          <div className="card-title">Connected Marketplaces</div>
                          <div className="card-desc">Platforms integrated for live price feeds</div>
                        </div>
                      </div>
                      <div className="card-body">
                        {[
                          { name: "eNAM", desc: "Govt national agri market", type: "Government", status: "Live" },
                          { name: "Agribazaar", desc: "B2B commodity exchange", type: "Digital", status: "Live" },
                          { name: "Ninjacart", desc: "Fresh produce direct", type: "Startup", status: "Live" },
                          { name: "DeHaat", desc: "End-to-end agri network", type: "Startup", status: "Live" },
                          { name: "ITC e-Choupal", desc: "Rural procurement network", type: "Corporate", status: "Live" },
                          { name: "Cargill Direct", desc: "International commodity buyer", type: "Corporate", status: "Live" },
                        ].map((p, i) => (
                          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: "0.8rem" }}>
                            <div>
                              <span style={{ fontWeight: 700 }}>{p.name}</span>
                              <span style={{ color: "var(--text-dim)", fontSize: "0.7rem" }}> — {p.desc}</span>
                            </div>
                            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                              <span className="tag tag-green" style={{ fontSize: "0.6rem" }}>● {p.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="card">
                      <div className="card-header">
                        <div className="card-icon" style={{ background: "rgba(212,168,67,0.15)" }}>💰</div>
                        <div>
                          <div className="card-title">Middlemen Savings Calculator</div>
                          <div className="card-desc">What farmers gain by direct selling</div>
                        </div>
                      </div>
                      <div className="card-body">
                        <div style={{ textAlign: "center", padding: "1rem 0" }}>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginBottom: "0.5rem" }}>Average extra income via KisanAI direct market</div>
                          <div style={{ fontSize: "3rem", fontWeight: 800, color: "var(--harvest)", letterSpacing: "-0.04em" }}>₹18,400</div>
                          <div style={{ fontSize: "0.8rem", color: "var(--leaf)" }}>per year per farmer</div>
                          <div style={{ marginTop: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                            {[
                              { val: "23%", label: "Commission saved", color: "leaf" },
                              { val: "4.2 hrs", label: "Saved per transaction", color: "sky" },
                              { val: "3.8x", label: "Better price access", color: "harvest" },
                              { val: "₹0", label: "Platform fee", color: "leaf" },
                            ].map((s, i) => (
                              <div key={i} style={{ background: "rgba(26,18,8,0.5)", borderRadius: "8px", padding: "0.5rem", textAlign: "center" }}>
                                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: `var(--${s.color})` }}>{s.val}</div>
                                <div style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>{s.label}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* IRRIGATION TAB */}
            {activeTab === "irrigation" && (
              <>
                <div className="section-header">
                  <div className="section-icon" style={{ background: "rgba(41,182,246,0.15)" }}>💧</div>
                  <div>
                    <div className="section-title">Smart Irrigation — जल प्रबंधन</div>
                    <div className="section-sub">Precision water scheduling to save 30-50% water while improving yields</div>
                  </div>
                </div>

                <div className="tool-grid">
                  <div className="card">
                    <div className="card-header">
                      <div className="card-icon" style={{ background: "rgba(41,182,246,0.15)" }}>🗓️</div>
                      <div>
                        <div className="card-title">Irrigation Schedule Generator</div>
                        <div className="card-desc">AI plan based on crop, soil, weather, growth stage</div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="form-row cols-2">
                        <div>
                          <label>Crop</label>
                          <select value={irrigCrop} onChange={e => setIrrigCrop(e.target.value)}>
                            {CROPS_LIST.map(c => <option key={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label>State</label>
                          <select value={irrigState} onChange={e => setIrrigState(e.target.value)}>
                            {STATES.map(s => <option key={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="form-row cols-2">
                        <div>
                          <label>Soil Type</label>
                          <select value={soilType} onChange={e => setSoilType(e.target.value)}>
                            {SOIL_TYPES.map(s => <option key={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label>Field Size (acres)</label>
                          <input type="number" value={fieldSize} onChange={e => setFieldSize(e.target.value)} />
                        </div>
                      </div>
                      <div className="form-row cols-2">
                        <div>
                          <label>Growth Stage</label>
                          <select value={growthStage} onChange={e => setGrowthStage(e.target.value)}>
                            {["Germination", "Seedling", "Vegetative", "Flowering", "Grain Filling", "Maturity"].map(s => <option key={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label>Last Rainfall</label>
                          <select value={lastRain} onChange={e => setLastRain(e.target.value)}>
                            {["Yesterday", "2 days ago", "5 days ago", "1 week ago", "2 weeks ago", "No rain this month"].map(s => <option key={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>

                      <button
                        className="btn btn-water"
                        onClick={analyzeIrrigation}
                        disabled={irrigLoading}
                      >
                        {irrigLoading ? (
                          <>Calculating schedule <div className="loading-dots"><span/><span/><span/></div></>
                        ) : "💧 Generate Smart Irrigation Plan"}
                      </button>

                      {irrigResult && (
                        <div className="ai-response water-border">
                          <div className="ai-response-header">🤖 Precision Irrigation Advisory</div>
                          <div className="ai-response-body">{irrigResult}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div className="card">
                      <div className="card-header">
                        <div className="card-icon" style={{ background: "rgba(41,182,246,0.15)" }}>🌊</div>
                        <div>
                          <div className="card-title">India's Water Crisis</div>
                          <div className="card-desc">Why this module is critical</div>
                        </div>
                      </div>
                      <div className="card-body">
                        {[
                          { stat: "78%", desc: "of India's groundwater used in agriculture", color: "sky" },
                          { stat: "58%", desc: "of India overexploiting groundwater", color: "alert" },
                          { stat: "₹2.3L Cr", desc: "economic loss from water mismanagement annually", color: "harvest" },
                          { stat: "30-50%", desc: "water can be saved with smart scheduling", color: "leaf" },
                        ].map((s, i) => (
                          <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "center", padding: "0.6rem 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                            <div style={{ fontSize: "1.3rem", fontWeight: 800, color: `var(--${s.color})`, minWidth: "4.5rem", fontFamily: "'JetBrains Mono'" }}>{s.stat}</div>
                            <div style={{ fontSize: "0.78rem", color: "var(--text-dim)", lineHeight: 1.4 }}>{s.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="card">
                      <div className="card-header">
                        <div className="card-icon" style={{ background: "rgba(41,182,246,0.15)" }}>⚡</div>
                        <div>
                          <div className="card-title">IoT Integration</div>
                          <div className="card-desc">Connected sensors & automation</div>
                        </div>
                      </div>
                      <div className="card-body">
                        {[
                          { sensor: "Soil Moisture Sensor", icon: "🌱", status: "Active", reading: "42% VWC" },
                          { sensor: "Rain Gauge", icon: "🌧️", status: "Active", reading: "0mm today" },
                          { sensor: "Tensiometer", icon: "📡", status: "Active", reading: "28 kPa" },
                          { sensor: "Drip Controller", icon: "🔧", status: "Standby", reading: "Auto mode" },
                        ].map((d, i) => (
                          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: "0.8rem" }}>
                            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                              <span>{d.icon}</span>
                              <span style={{ fontWeight: 600 }}>{d.sensor}</span>
                            </div>
                            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                              <span style={{ color: "var(--text-dim)", fontSize: "0.72rem" }}>{d.reading}</span>
                              <span className={`tag tag-${d.status === "Active" ? "green" : "amber"}`}>{d.status}</span>
                            </div>
                          </div>
                        ))}
                        <div style={{ marginTop: "0.75rem", fontSize: "0.72rem", color: "var(--text-dim)", background: "rgba(41,182,246,0.06)", borderRadius: "6px", padding: "0.5rem 0.75rem" }}>
                          💡 KisanAI integrates with IoT devices via MQTT. Low-cost sensors (₹2,500/set) available through partner network.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>

        <footer className="footer">
          <strong>KisanAI</strong> — Intelligent Digital Infrastructure for Indian Agriculture &nbsp;|&nbsp;
          Solving crop diseases • market exploitation • water waste for <strong>140M farmers</strong> &nbsp;|&nbsp;
          Powered by <strong>Claude AI</strong> &nbsp;|&nbsp; Built with ❤️ for भारत
        </footer>
      </div>
    </>
  );
}