import { useEffect, useMemo, useState } from 'react';
import {
  Archive,
  BadgeDollarSign,
  BarChart3,
  ChevronRight,
  CloudLightning,
  Compass,
  Crown,
  Gem,
  Grid3X3,
  LockKeyhole,
  Menu,
  RotateCw,
  Settings,
  Sparkles,
  Star,
  Sun,
  Tag,
  Trophy,
  Wand2,
  WalletCards,
  X,
  Zap,
} from 'lucide-react';
import { auras, type Aura } from '@/auras';
import { shopItems, type ShopItem } from '@/shopItems';

type Weather = {
  name: string;
  subtitle: string;
  icon: string;
  accent: string;
  effect: string;
  theme: string;
};

type Quest = {
  title: string;
  goal: number;
  reward: number;
  key: 'rolls' | 'discoveries' | 'rare';
};

const weatherOptions: Weather[] = [
  { name: 'Clear Skies', subtitle: 'STABLE ATMOSPHERE', icon: '☀', accent: '#facc15', effect: 'No active modifier', theme: 'celestial' },
  { name: 'Sandstorm', subtitle: 'DUST FRONT APPROACHING', icon: '≋', accent: '#fb923c', effect: 'Fire auras ×1.6', theme: 'fire' },
  { name: 'Aurora Field', subtitle: 'POLAR SIGNAL DETECTED', icon: '◒', accent: '#2dd4bf', effect: 'Celestial auras ×1.8', theme: 'celestial' },
  { name: 'Tidal Surge', subtitle: 'PRESSURE RISING', icon: '≈', accent: '#38bdf8', effect: 'Water auras ×1.8', theme: 'water' },
  { name: 'Static Rain', subtitle: 'IONIZATION WARNING', icon: 'ϟ', accent: '#a78bfa', effect: 'Storm auras ×1.8', theme: 'storm' },
];

const quests: Quest[] = [
  { title: 'Warm Up', goal: 10, reward: 120, key: 'rolls' },
  { title: 'First Contact', goal: 3, reward: 350, key: 'discoveries' },
  { title: 'Signal Hunter', goal: 1, reward: 800, key: 'rare' },
];

const categoryIcons: Record<ShopItem['category'], typeof Tag> = {
  POTION: Wand2,
  COSMETIC: Sparkles,
  HELPER: Zap,
  NAMETAG: Tag,
};

const categoryLabels: Record<ShopItem['category'], string> = {
  POTION: 'POTIONS',
  COSMETIC: 'COSMETICS',
  HELPER: 'GAMEPLAY HELPERS',
  NAMETAG: 'NAMETAGS',
};

const formatChance = (rarity: number): string => `1 in ${rarity.toLocaleString()}`;
const formatMoney = (money: number): string => money.toLocaleString().padStart(6, '0');

function App() {
  const [currentAura, setCurrentAura] = useState<Aura>(auras[0]);
  const [lastAura, setLastAura] = useState<Aura | null>(null);
  const [discovered, setDiscovered] = useState<string[]>(['drizzle', 'ember']);
  const [pinned, setPinned] = useState<string[]>(['ember']);
  const [money, setMoney] = useState(1240);
  const [rolls, setRolls] = useState(0);
  const [rareHits, setRareHits] = useState(0);
  const [cutscene, setCutscene] = useState(false);
  const [cutsceneStage, setCutsceneStage] = useState<'charge' | 'reveal'>('charge');
  const [weatherIndex, setWeatherIndex] = useState(2);
  const [shopStock, setShopStock] = useState(5);
  const [shopTimer, setShopTimer] = useState(299);
  const [activePanel, setActivePanel] = useState<'index' | 'cabinet' | 'shop' | 'quests' | null>(null);
  const [shopCategory, setShopCategory] = useState<ShopItem['category']>('POTION');
  const [ownedItems, setOwnedItems] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState('SYSTEM READY');
  const [settings, setSettings] = useState({ sound: true, flash: true, auto: false });

  const weather = weatherOptions[weatherIndex];
  const discoveredAuras = useMemo(() => auras.filter((aura) => discovered.includes(aura.id)), [discovered]);
  const pinnedAuras = useMemo(() => auras.filter((aura) => pinned.includes(aura.id)), [pinned]);
  const questProgress = { rolls, discoveries: discovered.length, rare: rareHits };
  const filteredShopItems = useMemo(() => shopItems.filter((item) => item.category === shopCategory), [shopCategory]);

  useEffect(() => {
    const saved = localStorage.getItem('sols-rng-save');
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<{ discovered: string[]; pinned: string[]; money: number; rolls: number; rareHits: number; ownedItems: string[] }>;
      if (parsed.discovered) setDiscovered(parsed.discovered);
      if (parsed.pinned) setPinned(parsed.pinned);
      if (typeof parsed.money === 'number') setMoney(parsed.money);
      if (typeof parsed.rolls === 'number') setRolls(parsed.rolls);
      if (typeof parsed.rareHits === 'number') setRareHits(parsed.rareHits);
      if (parsed.ownedItems) setOwnedItems(parsed.ownedItems);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sols-rng-save', JSON.stringify({ discovered, pinned, money, rolls, rareHits, ownedItems }));
  }, [discovered, pinned, money, rolls, rareHits, ownedItems]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setShopTimer((value) => {
        if (value <= 1) {
          setShopStock(Math.floor(Math.random() * 4) + 3);
          setToast('SHOP STOCK REFRESHED');
          return 300;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setWeatherIndex((index) => (index + 1) % weatherOptions.length), 45000);
    return () => window.clearInterval(timer);
  }, []);

  const rollAura = (): void => {
    if (cutscene) return;
    const modifierTheme = weather.theme;
    const weighted = auras.map((aura) => ({ aura, weight: (1 / aura.rarity) * (aura.theme === modifierTheme ? 1.8 : 1) }));
    const total = weighted.reduce((sum, item) => sum + item.weight, 0);
    let cursor = Math.random() * total;
    let result = auras[0];
    for (const item of weighted) {
      cursor -= item.weight;
      if (cursor <= 0) {
        result = item.aura;
        break;
      }
    }
    setLastAura(currentAura);
    setCurrentAura(result);
    setRolls((value) => value + 1);
    setMoney((value) => value + 8);
    setCutsceneStage('charge');
    setCutscene(true);
    window.setTimeout(() => setCutsceneStage('reveal'), result.rarity >= 10000 ? 1900 : 1100);
    window.setTimeout(() => setCutscene(false), result.rarity >= 10000 ? 3800 : 2500);
    if (!discovered.includes(result.id)) {
      setDiscovered((value) => [...value, result.id]);
      setMoney((value) => value + Math.min(2000, Math.max(35, Math.floor(600000 / result.rarity))));
      setToast(`NEW DISCOVERY // ${result.name.toUpperCase()}`);
    } else {
      setToast(`ROLL COMPLETE // ${result.name.toUpperCase()}`);
    }
    if (result.rarity >= 10000) setRareHits((value) => value + 1);
  };

  const buyRefresh = (): void => {
    if (money < 250) {
      setToast('INSUFFICIENT CREDITS');
      return;
    }
    setMoney((value) => value - 250);
    setShopStock(Math.floor(Math.random() * 4) + 3);
    setShopTimer(300);
    setToast('SHOP STOCK RE-SYNCED');
  };

  const buyItem = (item: ShopItem): void => {
    if (ownedItems.includes(item.id)) {
      setToast(`${item.name.toUpperCase()} ALREADY OWNED`);
      return;
    }
    if (item.rareStock && shopStock <= 6) {
      setToast(`${item.name.toUpperCase()} IS SOLD OUT`);
      return;
    }
    if (money < item.price) {
      setToast('INSUFFICIENT CREDITS');
      return;
    }
    setMoney((value) => value - item.price);
    setOwnedItems((value) => [...value, item.id]);
    setToast(`${item.name.toUpperCase()} ACQUIRED`);
  };

  const togglePin = (id: string): void => {
    setPinned((value) => value.includes(id) ? value.filter((item) => item !== id) : value.length < 4 ? [...value, id] : value);
  };

  const selectAura = (aura: Aura): void => {
    if (!discovered.includes(aura.id)) return;
    setCurrentAura(aura);
    setActivePanel(null);
    setToast(`CABINET FOCUS // ${aura.name.toUpperCase()}`);
  };

  return (
    <div className={`app-shell weather-${weather.theme}`}>
      <div className="ambient-glow glow-left" />
      <div className="ambient-glow glow-right" />
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark"><Compass size={22} /><span>09</span></div>
          <div><div className="eyebrow">SOL'S RNG // PERSONAL INSTANCE</div><h1>ROLLING <span>SIMULATOR</span></h1></div>
        </div>
        <div className="top-actions">
          <div className="system-pill"><span className="online-dot" /> SYSTEM ONLINE <b>v2.7.4</b></div>
          <button className="icon-button" onClick={() => setActivePanel('index')} aria-label="Open index"><Grid3X3 size={17} /></button>
          <button className="icon-button" onClick={() => setActivePanel('quests')} aria-label="Open quests"><Trophy size={17} /></button>
          <button className="icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu"><Menu size={19} /></button>
        </div>
      </header>

      <main className="dashboard">
        <aside className="sidebar">
          <div className="sidebar-intro"><span className="section-kicker">PLAYER PROFILE</span><div className="profile-row"><div className="avatar"><Star size={18} /></div><div><strong>OPERATOR 09</strong><span>SECTOR: LUMEN</span></div></div></div>
          <nav className="nav-stack">
            <button className={`nav-item ${activePanel === null ? 'active' : ''}`} onClick={() => setActivePanel(null)}><Zap size={16} /><span>Roll Console</span><ChevronRight size={14} /></button>
            <button className={`nav-item ${activePanel === 'index' ? 'active' : ''}`} onClick={() => setActivePanel('index')}><Archive size={16} /><span>Aura Index</span><em>{discovered.length}/{auras.length}</em></button>
            <button className={`nav-item ${activePanel === 'cabinet' ? 'active' : ''}`} onClick={() => setActivePanel('cabinet')}><Crown size={16} /><span>Aura Cabinet</span><em>{pinned.length}/4</em></button>
            <button className={`nav-item ${activePanel === 'shop' ? 'active' : ''}`} onClick={() => setActivePanel('shop')}><WalletCards size={16} /><span>Supply Shop</span><em className="live-badge">LIVE</em></button>
          </nav>
          <div className="weather-card" style={{ '--weather-accent': weather.accent } as React.CSSProperties}><div className="weather-head"><span className="section-kicker">LIVE WEATHER</span><span className="signal">●</span></div><div className="weather-icon">{weather.icon}</div><strong>{weather.name}</strong><span>{weather.subtitle}</span><div className="weather-effect">{weather.effect}</div></div>
          <div className="sidebar-footer"><span>BUILD 2.7.4 / LUMEN</span><span>MEMORY OK</span></div>
        </aside>

        <section className="main-column">
          <div className="hero-panel panel-grid">
            <div className="hero-copy"><span className="section-kicker">CURRENT OUTPUT // AURA SIGNAL</span><h2 className={`aura-display tier-${currentAura.tier.toLowerCase()}`} style={{ '--aura-color': currentAura.color, '--aura-accent': currentAura.accent } as React.CSSProperties}><span className="aura-symbol">{currentAura.icon}</span>{currentAura.name}</h2><p>{currentAura.description}</p></div>
            <div className="hero-meta"><div><span>ODDS</span><strong>{formatChance(currentAura.rarity)}</strong></div><div><span>TIER</span><strong className="accent-text">{currentAura.tier}</strong></div><div><span>WEATHER</span><strong>{weather.name}</strong></div></div>
            <div className="signal-orbit"><div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" /><div className="orbit-core">{currentAura.icon}</div></div>
          </div>

          <div className="stats-strip"><div><span className="stat-icon"><RotateCw size={15} /></span><span>ROLLS</span><strong>{rolls.toLocaleString()}</strong></div><div><span className="stat-icon green"><Gem size={15} /></span><span>DISCOVERED</span><strong>{discovered.length}<small> / {auras.length}</small></strong></div><div><span className="stat-icon gold"><BadgeDollarSign size={15} /></span><span>CREDITS</span><strong>{formatMoney(money)}</strong></div><div><span className="stat-icon violet"><BarChart3 size={15} /></span><span>LUCK INDEX</span><strong>+{Math.min(999, Math.floor(rolls / 4) + 12)}%</strong></div></div>

          <div className="roll-zone panel-grid">
            <div className="roll-heading"><div><span className="section-kicker">SEQUENCE MONITOR</span><h3>ROLL CONSOLE</h3></div><div className="weather-chip" style={{ '--weather-accent': weather.accent } as React.CSSProperties}><span>{weather.icon}</span> {weather.name.toUpperCase()} <b>×1.8</b></div></div>
            <div className="roll-stage"><div className="scanline" /><div className="stage-label">READY FOR INPUT</div><div className="stage-number">{String(rolls % 999).padStart(3, '0')}</div><div className="stage-note">Each roll adds <b>+8 credits</b> · New discoveries pay bonus credits</div></div>
            <button className="roll-button" onClick={rollAura} disabled={cutscene}><span className="roll-button-icon"><Sparkles size={22} /></span><span><b>{cutscene ? 'PROCESSING SIGNAL' : 'START ROLLING'}</b><small>PRESS TO GENERATE AURA</small></span><span className="roll-cost">+8 <BadgeDollarSign size={13} /></span></button>
            <div className="roll-footer"><span><span className="online-dot" /> AUTO-SAVE ENABLED</span><button onClick={() => setSettings((value) => ({ ...value, auto: !value.auto }))} className={settings.auto ? 'toggle active' : 'toggle'}><span /> AUTO ROLL {settings.auto ? 'ON' : 'OFF'}</button></div>
          </div>

          <div className="bottom-grid"><section className="mini-panel panel-grid"><div className="panel-title"><span className="section-kicker">RECENT SIGNALS</span><button onClick={() => setActivePanel('index')}>VIEW ALL <ChevronRight size={13} /></button></div>{[currentAura, lastAura, ...discoveredAuras].filter(Boolean).slice(0, 3).map((aura, index) => <button key={`${aura?.id}-${index}`} className="recent-row" onClick={() => aura && selectAura(aura)}><span className="recent-glyph" style={{ color: aura?.color }}>{aura?.icon}</span><span><b>{aura?.name}</b><small>{aura?.tier} · {formatChance(aura?.rarity ?? 1)}</small></span><span className="recent-time">{index === 0 ? 'NOW' : `${index}M AGO`}</span></button>)}</section><section className="mini-panel panel-grid"><div className="panel-title"><span className="section-kicker">AURA CABINET</span><button onClick={() => setActivePanel('cabinet')}>MANAGE <ChevronRight size={13} /></button></div><div className="cabinet-row">{[0, 1, 2, 3].map((slot) => { const aura = pinnedAuras[slot]; return <button key={slot} className="cabinet-slot" onClick={() => aura ? selectAura(aura) : setActivePanel('cabinet')} style={aura ? { '--slot-color': aura.color } as React.CSSProperties : undefined}>{aura ? <><span>{aura.icon}</span><small>{aura.name}</small></> : <LockKeyhole size={14} />}</button>; })}</div></section></div>
        </section>

        <aside className="right-column">
          <div className="credits-card panel-grid"><div><span className="section-kicker">AVAILABLE CREDITS</span><strong>{formatMoney(money)}</strong></div><div className="credit-orb"><BadgeDollarSign size={20} /></div></div>
          <section className="side-panel panel-grid"><div className="panel-title"><span className="section-kicker">DAILY OBJECTIVES</span><button onClick={() => setActivePanel('quests')}>ALL <ChevronRight size={13} /></button></div>{quests.map((quest) => { const progress = Math.min(quest.goal, questProgress[quest.key]); return <div className="quest" key={quest.title}><div className="quest-line"><span>{quest.title}</span><b>{progress}/{quest.goal}</b></div><div className="progress-track"><span style={{ width: `${(progress / quest.goal) * 100}%` }} /></div><small>REWARD +{quest.reward} CREDITS</small></div>; })}</section>
          <section className="side-panel panel-grid shop-preview"><div className="panel-title"><span className="section-kicker">SUPPLY SHOP</span><button onClick={() => setActivePanel('shop')}>OPEN <ChevronRight size={13} /></button></div><div className="shop-item"><div className="potion"><span>✦</span></div><div><b>Fortune Potion</b><small>+10% luck for 5 rolls</small></div><strong>120 <BadgeDollarSign size={12} /></strong></div><div className="shop-item muted"><div className="potion prism"><span>◈</span></div><div><b>Prismatic Tonic</b><small>RARE STOCK · +50% luck</small></div><strong>{shopStock > 6 ? '1' : '—'}</strong></div><div className="shop-refresh"><span>RESTOCK IN <b>{Math.floor(shopTimer / 60)}:{String(shopTimer % 60).padStart(2, '0')}</b></span><button onClick={buyRefresh}><RotateCw size={12} /> 250</button></div></section>
          <div className="tip-card"><Sun size={15} /><span><b>FIELD NOTE</b> Weather rotates every 45 seconds. Match your roll timing to the active signal.</span></div>
        </aside>
      </main>

      <footer className="footer-bar"><span>© 2026 SOL'S RNG // LUMEN LABS</span><span>SIMULATION IS FOR ENTERTAINMENT ONLY</span><span>LATENCY <b>12ms</b> · <i>SECURE</i></span></footer>

      {menuOpen && <div className="settings-popover panel-grid"><div className="panel-title"><span className="section-kicker">SYSTEM SETTINGS</span><button onClick={() => setMenuOpen(false)}><X size={15} /></button></div><label><span><Settings size={15} /> Flash effects</span><button className={settings.flash ? 'switch on' : 'switch'} onClick={() => setSettings((value) => ({ ...value, flash: !value.flash }))}><span /></button></label><label><span><CloudLightning size={15} /> Audio feedback</span><button className={settings.sound ? 'switch on' : 'switch'} onClick={() => setSettings((value) => ({ ...value, sound: !value.sound }))}><span /></button></label></div>}

      {activePanel && <div className="modal-backdrop" onClick={() => setActivePanel(null)}><div className="modal panel-grid" onClick={(event) => event.stopPropagation()}><div className="modal-header"><div><span className="section-kicker">MODULE // {activePanel.toUpperCase()}</span><h3>{activePanel === 'index' ? 'AURA INDEX' : activePanel === 'cabinet' ? 'AURA CABINET' : activePanel === 'shop' ? 'SUPPLY SHOP' : 'DAILY OBJECTIVES'}</h3></div><button className="icon-button" onClick={() => setActivePanel(null)}><X size={17} /></button></div>{activePanel === 'index' && <div className="index-grid">{auras.map((aura) => <button className={`index-card ${discovered.includes(aura.id) ? 'unlocked' : 'locked'}`} key={aura.id} onClick={() => selectAura(aura)}><span className="index-glyph" style={{ color: discovered.includes(aura.id) ? aura.color : undefined }}>{discovered.includes(aura.id) ? aura.icon : '?'}</span><span><b>{discovered.includes(aura.id) ? aura.name : 'UNKNOWN SIGNAL'}</b><small>{formatChance(aura.rarity)}</small></span><em>{aura.tier}</em></button>)}</div>}{activePanel === 'cabinet' && <div className="cabinet-modal-content"><p>Pin up to four discovered auras for quick access.</p><div className="index-grid">{discoveredAuras.map((aura) => <button className={`index-card unlocked ${pinned.includes(aura.id) ? 'selected' : ''}`} key={aura.id} onClick={() => togglePin(aura.id)}><span className="index-glyph" style={{ color: aura.color }}>{aura.icon}</span><span><b>{aura.name}</b><small>{pinned.includes(aura.id) ? 'PINNED TO CABINET' : 'CLICK TO PIN'}</small></span><em>{pinned.includes(aura.id) ? 'PINNED' : aura.tier}</em></button>)}</div></div>}{activePanel === 'shop' && <div className="shop-modal"><div className="shop-tabs">{(Object.keys(categoryLabels) as ShopItem['category'][]).map((category) => { const Icon = categoryIcons[category]; return <button key={category} className={shopCategory === category ? 'active' : ''} onClick={() => setShopCategory(category)}><Icon size={14} /> {categoryLabels[category]}</button>; })}</div><div className="shop-item-list">{filteredShopItems.map((item) => { const owned = ownedItems.includes(item.id); const soldOut = !!item.rareStock && shopStock <= 6; return <div className={`large-shop-item ${item.rareStock ? 'rare-stock' : ''}`} key={item.id}><div className="shop-item-icon" style={{ color: item.color, borderColor: item.color }}>{item.icon}</div><div><span className="section-kicker">{item.tier === 'COMMON' ? 'COMMON STOCK' : `RARE STOCK · ${soldOut ? 'SOLD OUT' : 'AVAILABLE'}`}</span><h4>{item.name}</h4><p>{item.description}</p></div><button disabled={owned || soldOut} onClick={() => buyItem(item)}>{owned ? 'OWNED' : `BUY · ${item.price}`}</button></div>; })}</div><button className="refresh-button" onClick={buyRefresh}><RotateCw size={14} /> FORCE RESTOCK · 250 CREDITS</button></div>}{activePanel === 'quests' && <div className="quest-modal">{quests.map((quest) => { const progress = Math.min(quest.goal, questProgress[quest.key]); const done = progress >= quest.goal; return <div className={`quest-large ${done ? 'done' : ''}`} key={quest.title}><div><span className="quest-number">0{quests.indexOf(quest) + 1}</span><div><span className="section-kicker">{done ? 'COMPLETE' : 'IN PROGRESS'}</span><h4>{quest.title}</h4></div></div><strong>+{quest.reward} <small>CREDITS</small></strong><div className="progress-track"><span style={{ width: `${(progress / quest.goal) * 100}%` }} /></div></div>; })}</div>}</div></div>}

      {cutscene && <div className={`cutscene ${cutsceneStage === 'reveal' ? 'reveal' : ''} ${settings.flash ? 'flash-enabled' : ''}`}><div className="cutscene-stars">{Array.from({ length: 18 }, (_, index) => <span key={index} style={{ '--i': index } as React.CSSProperties} />)}</div><div className="cutscene-core"><div className="cutscene-ring" /><div className="cutscene-spark">{cutsceneStage === 'reveal' ? currentAura.icon : '✦'}</div></div><span className="cutscene-label">{cutsceneStage === 'reveal' ? 'SIGNAL CONFIRMED' : 'DECODING AURA'}</span><strong className={cutsceneStage === 'reveal' ? 'cutscene-result' : ''}>{cutsceneStage === 'reveal' ? currentAura.name : '•••'}</strong>{cutsceneStage === 'reveal' && <small>{formatChance(currentAura.rarity)} · {currentAura.tier}</small>}</div>}
      <div className="toast">{toast}<span /></div>
    </div>
  );
}

export default App;
