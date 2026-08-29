export type ShopItem = {
  id: string;
  name: string;
  category: 'POTION' | 'COSMETIC' | 'HELPER' | 'NAMETAG';
  tier: 'COMMON' | 'RARE' | 'EPIC';
  price: number;
  icon: string;
  color: string;
  description: string;
  rareStock?: boolean;
};

export const shopItems: ShopItem[] = [
  { id: 'fortune', name: 'Fortune Potion', category: 'POTION', tier: 'COMMON', price: 120, icon: '✦', color: '#96f2ad', description: 'Increases luck index by 10% for your next five rolls.' },
  { id: 'serendipity', name: 'Serendipity Brew', category: 'POTION', tier: 'COMMON', price: 280, icon: '❀', color: '#fbbf24', description: 'Boosts discovery bonus credits by 50% for ten rolls.' },
  { id: 'prismatic', name: 'Prismatic Tonic', category: 'POTION', tier: 'RARE', price: 800, icon: '◈', color: '#c6acff', description: 'Roll weight is doubled for all Mythic and above auras.', rareStock: true },
  { id: 'luckycharm', name: 'Lucky Charm', category: 'HELPER', tier: 'COMMON', price: 350, icon: '☘', color: '#4ade80', description: 'Guarantees at least a Rare-tier aura on your next roll.' },
  { id: 'weatherlock', name: 'Weather Lock', category: 'HELPER', tier: 'RARE', price: 1200, icon: '🔒', color: '#60a5fa', description: 'Freezes the current weather for 90 seconds so you can farm a theme.', rareStock: true },
  { id: 'autodice', name: 'Auto-Dice Module', category: 'HELPER', tier: 'EPIC', price: 2400, icon: '🎲', color: '#f0abfc', description: 'Enables a second invisible roll per click — double the chances, double the credits.', rareStock: true },
  { id: 'creditmultiplier', name: 'Credit Multiplier', category: 'HELPER', tier: 'RARE', price: 1500, icon: '×2', color: '#fde047', description: 'Doubles all credits earned from rolls for the next 60 seconds.', rareStock: true },
  { id: 'tag-neon', name: 'Neon Nametag', category: 'NAMETAG', tier: 'COMMON', price: 200, icon: '▱', color: '#22d3ee', description: 'Renames your operator profile with a glowing cyan underline.' },
  { id: 'tag-ember', name: 'Ember Nametag', category: 'NAMETAG', tier: 'COMMON', price: 200, icon: '▰', color: '#fb923c', description: 'Renames your operator profile with a warm flickering ember tint.' },
  { id: 'tag-void', name: 'Void Nametag', category: 'NAMETAG', tier: 'RARE', price: 900, icon: '⬢', color: '#94a3b8', description: 'Renames your operator profile with a shifting void gradient.', rareStock: true },
  { id: 'cosmic-trail', name: 'Cosmic Trail', category: 'COSMETIC', tier: 'RARE', price: 1100, icon: '✧', color: '#c4b5fd', description: 'Leaves a sparkling stardust trail behind your cursor across the dashboard.', rareStock: true },
  { id: 'aurora-frame', name: 'Aurora Frame', category: 'COSMETIC', tier: 'EPIC', price: 2200, icon: '∿', color: '#5eead4', description: 'Wraps the roll console in a living aurora border that shifts with the weather.', rareStock: true },
  { id: 'prism-cabinet', name: 'Prismatic Cabinet', category: 'COSMETIC', tier: 'EPIC', price: 3000, icon: '◈', color: '#f0abfc', description: 'Upgrades your Aura Cabinet slots with a rainbow refraction effect.', rareStock: true },
];
