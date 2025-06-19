import React from 'react'
import Card from './Card'
import { Card as CardType } from 'game/Card'

interface HandProps {
  cards: CardType[]
  onCardSelect?: (cardID: string) => void
  selectedCardID?: string
}

const Hand: React.FC<HandProps> = ({ cards, onCardSelect, selectedCardID }) => (
  <div className="hand" style={{ display: 'flex', gap: '8px' }}>
    {cards.map(card => (
      <Card
        key={card.id}
        card={card}
        selected={selectedCardID === card.id}
        onClick={onCardSelect}
      />
    ))}
  </div>
)

export default Hand
