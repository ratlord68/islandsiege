import { gameReducer } from '../gameReducer'
import { GamePhases } from '../phases'

import type { GameState } from 'game/GameState'
import { CardType } from 'game/Card'

import { mockGameState } from 'common/__mocks__/mockGameState'

describe('gameReducer', () => {
  let gs: GameState
  beforeEach(() => {
    gs = mockGameState()
  })
  it('initDraw - will initialize the game', () => {
    const payload = {
      type: GamePhases.initGame,
      payload: { playerNames: ['Jack', 'Sparrow'] },
    }
    const state = gameReducer(gs, payload)
    expect(state.players.length).toBe(2)
    expect(state.players[0].name).toBe('Jack')
    expect(state.players[1].name).toBe('Sparrow')
    expect(state.phase).toBe('initDraw')
  })

  it('initDiscard - will handle initial draw phase', () => {
    const payload = { type: GamePhases.initDraw }
    let state = gameReducer(gs, payload)
    expect(state.players.every(player => player.hand.length === 3))
    expect(state.phase).toBe('initDiscard')
  })
  it('draw - will handle individual draw', () => {
    const payload = { type: GamePhases.draw }

    let state = gameReducer(gs, payload)
    expect(state.players[0].hand).toHaveLength(3)
    expect(state.players[1].hand).toHaveLength(0)
    expect(state.deck.remaining).toBe(33) // deck reflect the draw
    expect(state.phase).toBe('discard')
  })
  it('discard - will discard to opponent', () => {
    const p0hand = [
      { name: 'A', id: 'a', type: 'fort' as CardType, description: 'test' },
      { name: 'B', id: 'b', type: 'ship' as CardType, description: 'test' },
      { name: 'C', id: 'c', type: 'building' as CardType, description: 'test' },
    ]
    gs.players[0].hand = p0hand

    const payload = {
      type: GamePhases.discard,
      payload: { targetPlayerIndex: 1, cardID: 'c' },
    }
    let state = gameReducer(gs, payload)
    expect(state.players[0].hand).toHaveLength(2)
    expect(state.players[1].hand).toHaveLength(1)
    expect(state.phase).toBe('endTurn')
  })
  it('victory - will check for victory conditions', () => {
    const payload = { type: GamePhases.victory }
    let state = gameReducer(gs, payload)
    expect(state.phase).toBe('colonize')
    // instant victory if all colonists are gone
    gs.players[0].colonists = 0
    state = gameReducer(gs, payload)
    expect(state.winningPlayerIndex).toBe(0)
    expect(state.phase).toBe('gameOver')
    // but coins depend on other players
    gs.players[0].colonists = 1
    gs.players[0].coins = 20
    gs.players[1].coins = 21
    state = gameReducer(gs, payload)
    expect(state.phase).toBe('colonize')
    gs.players[1].coins = 19
    state = gameReducer(gs, payload)
    expect(state.phase).toBe('gameOver')
  })
  // TODO: Test other conditions
})
