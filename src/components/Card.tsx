import React from 'react'
import { Card as CardType, FortCard, BuildingCard, ShipCard } from 'game/Card'

interface CardProps {
  card: CardType
  selected?: boolean
  onClick?: (cardID: string) => void
}

const Card: React.FC<CardProps> = ({ card, selected, onClick }) => (
  <div
    className={`card${selected ? ' selected' : ''}`}
    style={{
      border: selected ? '2px solid #007bff' : '1px solid #ccc',
      borderRadius: '4px',
      padding: '8px',
      cursor: onClick ? 'pointer' : 'default',
      background: '#fff',
      minWidth: '120px',
      textAlign: 'center',
    }}
    onClick={() => onClick?.(card.id)}>
    <div style={{ fontWeight: 'bold' }}>{card.name}</div>
    <div style={{ fontStyle: 'italic', fontSize: '0.9em' }}>{card.type}</div>
    {card.type === 'fort' && (
      <>
        <div style={{ marginTop: 4 }}>
          <strong>Grid:</strong>{' '}
          {Array.isArray((card as FortCard).gridSpec)
            ? JSON.stringify((card as FortCard).gridSpec)
            : 'N/A'}
        </div>
        <div>
          <strong>Slots:</strong> {(card as FortCard).slots}
        </div>
      </>
    )}
    {(card.type === 'ship' || card.type === 'building') && (
      <div style={{ marginTop: 4 }}>
        <strong>Cost:</strong> {(card as ShipCard | BuildingCard).cost}
      </div>
    )}
    <div style={{ marginTop: 6, fontSize: '0.95em' }}>
      {(card as any).description}
    </div>
  </div>
)

export default Card
