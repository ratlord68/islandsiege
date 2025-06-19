import React, { useState } from 'react'
import PlayerPanel from './PlayerPanel'
import { Player } from '../game/Player'
import GameSetup from './GameSetup'
import { StartingFort } from '../game/forts/StartingFort'

const PLAYER_COLORS = ['#1e90ff', '#e67e22', '#27ae60', '#8e44ad']

const GameBoard: React.FC = () => {
  const [players, setPlayers] = useState<Player[] | null>(() => {
    const cached = window.sessionStorage.getItem('players')
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        // Rehydrate Player and Fort instances
        return parsed.map((p: any, idx: number) => {
          const player = new Player(p.name, idx + 1, p)
          player.forts = p.forts.map(() => new StartingFort())
          return player
        })
      } catch {
        return null
      }
    }
    return null
  })

  React.useEffect(() => {
    if (players) {
      window.sessionStorage.setItem('players', JSON.stringify(players))
    }
  }, [players])

  const handleStart = (names: string[]) => {
    const players = [new Player(names[0], 1), new Player(names[1], 2)]
    players.forEach(p => p.forts.push(new StartingFort()))
    setPlayers(players)
    window.sessionStorage.setItem('players', JSON.stringify(players))
  }

  const moveColonists = (playerIndex: number) => {
    if (!players) return
    const updated = [...players]
    const player = updated[playerIndex]
    if (player.colonists > 0) {
      player.forts.forEach(fort => {
        if (fort.openSlots > 0 && player.colonists > 0) {
          fort.placeColonists()
          player.colonists -= 1
        }
      })
      setPlayers(updated)
    }
  }

  const destroyFort = (playerIndex: number, fortIndex: number) => {
    if (!players) return
    const updated = [...players]
    const player = updated[playerIndex]
    const fort = player.forts[fortIndex]
    if (fort) {
      fort.destroy(player) // This should return colonists to player
      player.forts.splice(fortIndex, 1)
      setPlayers(updated)
    }
  }

  if (!players) {
    return <GameSetup onStart={handleStart} />
  }

  return (
    <div style={{ padding: 20, position: 'relative' }}>
      <button
        style={{ position: 'absolute', top: 20, right: 20, zIndex: 1 }}
        onClick={() => {
          window.sessionStorage.removeItem('players')
          setPlayers(null)
        }}>
        New Game
      </button>
      <h1>Island Siege Game Board</h1>
      <div style={{ display: 'flex', gap: 40 }}>
        {players.map((player, idx) => (
          <PlayerPanel
            key={player.id}
            player={player}
            onMoveColonist={() => moveColonists(idx)}
            onDestroyFort={fortIdx => destroyFort(idx, fortIdx)}
            color={PLAYER_COLORS[idx % PLAYER_COLORS.length]}
          />
        ))}
      </div>
    </div>
  )
}

export default GameBoard
