import cards from "../assets/cards.json";
import { Card } from "../types";

type CardData = {
  cards: Card[];
};

// Allow filtering out cards, i.e. Starting Fort
// TODO: Add seed to make deterministic
export function shuffleDeck(data: CardData, exclude: string[] = []): Card[] {
  const filtered = data.cards.filter((card) => !exclude.includes(card.name));

  for (let i = filtered.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
  }

  return filtered;
}

const deck = shuffleDeck(cards, ["Starting Fort"]);
