import { HEXAGRAMS, TRIGRAMS } from "../data/data";

export const tossCoins = (): number => {
  const coins = [0, 0, 0].map(() => (Math.random() > 0.5 ? 3 : 2)); // Heads = 3, Tails = 2
  return coins.reduce((sum, coin) => sum + coin, 0);
};

export const generateLine = (): string => {
  const total = tossCoins();
  return total % 2 === 0 ? "0" : "1"; // Even = broken (0), Odd = unbroken (1)
};

export const generateHexagram = (): string => {
  return Array.from({ length: 6 }, () => generateLine()).join("");
};

export const getTrigrams = (hexagram: string) => {
  const lower = hexagram.slice(0, 3);
  const upper = hexagram.slice(3);
  return {
    lower: TRIGRAMS.find((trigram) => trigram.value === lower),
    upper: TRIGRAMS.find((trigram) => trigram.value === upper),
  };
};

export const findHexagram = (hexagram: string) => {
  return HEXAGRAMS.find((h) => h.binary === hexagram);
};
