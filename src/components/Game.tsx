import React, { useReducer, useState } from 'react'
import { gameReducer } from '../common/gameReducer'
import { GamePhases } from '../common/phases'
import GameBoard from './GameBoard'
import { Deck, Discard } from './Deck'
import { createInitialGameState } from '../game/GameState'
import ColorPicker from './ColorPicker'
import { PLAYER_COLORS } from 'common/colors'
import ActionSelector from './ActionSelector'

const Game: React.FC = () => {
  const [state, dispatch] = useReducer(gameReducer, createInitialGameState())
  const [playerNames, setPlayerNames] = useState(['', ''])
  const [playerColors, setPlayerColors] = useState([
    PLAYER_COLORS[0].value,
    PLAYER_COLORS[1].value,
  ])

  const handleStartGame = (names: string[], colors: string[]) => {
    dispatch({
      type: GamePhases.initGame,
      payload: { playerNames: names, playerColors: colors },
    })
  }

  if (state.phase === GamePhases.initGame || state.players.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Start a New Game</h2>
        {[0, 1].map(idx => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 16,
            }}>
            <input
              name={`player${idx + 1}`}
              type="text"
              placeholder={`Player ${idx + 1} Name`}
              value={playerNames[idx]}
              onChange={e => {
                const names = [...playerNames]
                names[idx] = e.target.value
                setPlayerNames(names)
              }}
              style={{ marginRight: 8 }}
            />
            <ColorPicker
              allColors={PLAYER_COLORS}
              selectedColor={playerColors[idx]}
              disabledColors={playerColors.filter((c, i) => i !== idx)}
              onSelect={color => {
                const colors = [...playerColors]
                colors[idx] = color
                setPlayerColors(colors)
              }}
            />
          </div>
        ))}
        <button
          onClick={() => handleStartGame(playerNames, playerColors)}
          disabled={
            !playerNames[0] ||
            !playerNames[1] ||
            playerColors[0] === playerColors[1]
          }>
          Start Game
        </button>
      </div>
    )
  }

  if (state.phase === GamePhases.action) {
    return (
      <div>
        <ActionSelector onSelect={phase => dispatch({ type: phase })} />
        <GameBoard state={state} dispatch={dispatch} />
      </div>
    )
  }

  // Main game UI
  return (
    <div style={{ padding: 20 }}>
      <h1>Island Siege</h1>
      <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
        <Deck count={state.deck?.remaining} onDraw={() => {}} />
        <Discard count={state.deck?.discard?.length ?? 0} />
      </div>
      <GameBoard state={state} dispatch={dispatch} />
    </div>
  )
}

export default Game
