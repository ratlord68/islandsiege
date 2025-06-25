import { Deck } from '../../game/Deck'
import { GameState } from 'game/GameState'
import { Player } from 'game/Player'
import { FortRegistry } from 'game/forts'

export function handleInitGame(
  state: GameState,
  payload: { playerNames: string[]; playerColors: string[] },
): GameState {
  const { playerNames, playerColors } = payload
  // TODO: Seed randomness
  const players = playerNames.map(
    (name, idx) => new Player(name, idx + 1, { color: playerColors[idx] }),
  )
  const deck = new Deck()
  const currentPlayerIndex = Math.floor(Math.random() * players.length)

  players.forEach(player => {
    const fort = new FortRegistry.startingFort()
    player.addFort(fort)
    player.shells = { ...player.shells, black: 1, white: 1 }
    player.addCardsToHand(deck.draw(3))
  })

  return {
    ...state,
    players,
    deck,
    currentPlayerIndex,
    shellReserve: { black: 5, white: 5, gray: 5 }, // regardless of player count
    phase: 'initDiscard',
  }
}
