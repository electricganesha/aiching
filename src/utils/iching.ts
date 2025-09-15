import { HEXAGRAMS, TRIGRAMS } from "@/data/data";
import hexagramText from "../data/iching_wilhelm_translation";

export const tossCoins = (): number[] => {
  return [0, 0, 0].map(() => (Math.random() > 0.5 ? 3 : 2)); // Heads = 3, Tails = 2
};

export const generateLine = (coins: number[]): string => {
  const total = coins.reduce((sum, coin) => sum + coin, 0);
  return total % 2 === 0 ? "0" : "1"; // Even = broken (0), Odd = unbroken (1)
};

export const generateHexagram = (): {
  hexagram: string;
  coinTosses: number[][];
} => {
  const coinTosses: number[][] = [];
  const hexagram = Array.from({ length: 6 }, () => {
    const coins = tossCoins();
    coinTosses.push(coins);
    return generateLine(coins);
  }).join("");
  return { hexagram, coinTosses };
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

export const getTranslationKeysForHexagramNumber = (number: number) => {
  const text = hexagramText[number];

  return text;
};

export const getHexagramByNumber = (number: number) => {
  return HEXAGRAMS.find((h) => h.number === number) || null;
};
