import React from 'react'

interface PlayerProps {
  children?: React.ReactNode
}

const Player: React.FC<PlayerProps> = ({ children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    {children}
  </div>
)

export default Player
