import React from 'react'

interface DeckProps {
  count: number
  onDraw?: () => void
}

export const Deck: React.FC<DeckProps> = ({ count, onDraw }) => (
  <div
    onClick={onDraw}
    style={{
      width: 80,
      height: 120,
      borderRadius: 12,
      background: '#e0e0e0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      cursor: onDraw ? 'pointer' : 'default',
      userSelect: 'none',
      fontWeight: 'bold',
      fontSize: 18,
      margin: 8,
    }}>
    <div>Deck</div>
    <div style={{ fontSize: 24 }}>{count}</div>
  </div>
)

interface DiscardProps {
  count: number
}

export const Discard: React.FC<DiscardProps> = ({ count }) => (
  <div
    style={{
      width: 80,
      height: 120,
      borderRadius: 12,
      background: '#222',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: 18,
      margin: 8,
    }}>
    <div>Discard</div>
    <div style={{ fontSize: 24 }}>{count}</div>
  </div>
)
