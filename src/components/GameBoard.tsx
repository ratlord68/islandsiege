import React from 'react'
import PlayerPanel from './PlayerPanel'
import { GameState } from '../game/GameState'

interface GameBoardProps {
  state: GameState
  dispatch: React.Dispatch<any>
}

const GameBoard: React.FC<GameBoardProps> = ({ state, dispatch }) => {
  const players = state.players
  const activeIdx = state.currentPlayerIndex
  const isSimultaneousPhase = state.phase === 'initDiscard'

  return (
    <div style={{ padding: 20, position: 'relative' }}>
      <h1>Island Siege Game Board</h1>
      <div style={{ display: 'flex', gap: 40 }}>
        {players.map((player, idx) => {
          const isPending =
            state.pending &&
            (state.pending as Record<number, any>)[idx] !== undefined
          const isActive = isSimultaneousPhase ? !isPending : idx === activeIdx
          return (
            <PlayerPanel
              key={player.id}
              player={player}
              color={player.color}
              active={isActive}
            />
          )
        })}
      </div>
    </div>
  )
}

export default GameBoard
