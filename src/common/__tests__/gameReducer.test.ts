import { gameReducer } from '../gameReducer'
import { GamePhases } from '../phases'

import type { GameState } from 'game/GameState'
import { CardType } from 'game/Card'
import { Fort } from 'game/Fort'

import { mockGameState } from 'common/__mocks__/mockGameState'
import { createMockFortCard } from 'game/__mocks__'

import * as AttackRollModule from 'game/AttackRoll'
import { DieValue } from 'game/Die'
import { FortGridSpec } from 'game/FortGrid'

describe('gameReducer', () => {
  let gs: GameState
  beforeEach(() => {
    gs = mockGameState()
  })
  afterEach(() => {
    jest.restoreAllMocks()
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

  it('colonize - will move colonists to forts', () => {
    let fort = new Fort(createMockFortCard())
    expect(fort.colonists).toBe(0)
    gs.players[0].addFort(fort)
    const payload = { type: GamePhases.colonize }
    const state = gameReducer(gs, payload)
    expect(state.phase).toBe('action')
    expect(fort.colonists).toBe(1)
  })

  it('action - move on to next phase if action can be performed', () => {
    let payload = { type: GamePhases.action, payload: { actionChosen: 'draw' } }
    let state = gameReducer(gs, payload)
    expect(state.phase).toBe('draw')

    // TODO: Fail if player has no fort cards in hand
    payload.payload.actionChosen = 'buildFort'
    state = gameReducer(gs, payload)
    expect(state.phase).toBe('buildFort')

    // TODO: Fail if player has no ship cards in hand
    // or ship cost not met
    payload.payload.actionChosen = 'buildShip'
    state = gameReducer(gs, payload)
    expect(state.phase).toBe('buildShip')

    // TODO: Fail if player has no building cards in hand
    // or building cost not met
    payload.payload.actionChosen = 'buildBuilding'
    state = gameReducer(gs, payload)
    expect(state.phase).toBe('buildBuilding')

    payload.payload.actionChosen = 'attack'
    state = gameReducer(gs, payload)
    expect(state.phase).toBe('attackStart')
  })

  it('buildFort - will build a fort, add shells, give coins', () => {
    let payload = {
      type: GamePhases.buildFort,
      payload: { fortID: 'spyOutpost', fortGridSpec: [] as FortGridSpec },
    }
    let state = gameReducer(gs, payload)
    let fort = state.players[0].forts[0]
    expect(fort.id).toBe('spyOutpost')
    expect(fort.shellsRemaining).toEqual(1)
    expect(state.phase).toBe('endTurn')
    // reset
    state.players[0].forts = []

    state.players[0].cubes = { B: 2, G: 2, W: 2 }
    payload.payload.fortGridSpec = [
      [0, 3, 'B'],
      [1, 3, 'G'],
      [2, 0, 'W'],
    ]
    state = gameReducer(gs, payload)
    let player = state.players[0]
    fort = player.forts[0]
    expect(fort.id).toBe('spyOutpost')
    expect(fort.shellsRemaining).toEqual(4)
    expect(player.cubes).toEqual({ B: 1, G: 1, W: 1 })
    // fail if player does not have cubes
    state.players[0].forts = []
    payload.payload.fortGridSpec = [
      [0, 3, 'B'],
      [1, 3, 'B'],
      [2, 0, 'B'],
    ]
    expect(() => gameReducer(gs, payload)).toThrow(
      'Player does not have enough B',
    )
  })

  test.todo('buildShip - will build a ship, move colonists, give coins')

  test.todo('buildBuilding - will build a building, move coloinsts, give coins')

  it('attackStart - will initiate attack', () => {
    let payload = {
      type: GamePhases.attackStart,
      payload: {
        targetPlayerIndex: 1,
        fortID: undefined as string | undefined,
      },
    }
    let state = gameReducer(gs, payload)
    expect(state.players[1].forts).toEqual([])
    expect(state.attackIsOpenWater).toBe(true)
    expect(state.phase).toBe('attackRoll')

    gs.players[1].addFort(new Fort(createMockFortCard()))
    payload.payload.fortID = 'testFort'
    state = gameReducer(gs, payload)
    expect(state.attackIsOpenWater).toBe(false)
    expect(state.shipLocations[0].targetPlayerIndex).toBe(1)
    expect(state.shipLocations[0].fortID).toBe('testFort')
    expect(state.phase).toBe('attackRoll')
  })

  it('attackRoll - roll the dice, use rerolls, keep roll', () => {
    // mock for tests
    const mockInitRoll: DieValue[] = ['L', 'B', 'W']
    let payload = {
      type: GamePhases.attackRoll,
      payload: { action: 'init', diceIndicesReroll: [] as number[] },
    }
    jest.spyOn(AttackRollModule, 'rollDice').mockReturnValue(mockInitRoll)
    let state = gameReducer(gs, payload)
    expect(state.attackRoll).toEqual(mockInitRoll)
    expect(state.attackRerollsRemaining).toBe(1)
    expect(state.phase).toBe('attackRoll')

    payload.payload = { action: 'reroll', diceIndicesReroll: [1, 2] }
    const mockSingleRoll: DieValue = 'B'
    jest
      .spyOn(AttackRollModule, 'rollSingleDie')
      .mockReturnValue(mockSingleRoll)
    state = gameReducer(gs, payload)
    expect(state.attackRoll).toEqual(['L', 'B', 'B'])
    expect(state.attackRerollsRemaining).toBe(0)
    expect(state.phase).toBe('attackRoll')

    // even if reroll is called again, we will finalize
    state = gameReducer(gs, payload)
    expect(state.attackValueCounts).toEqual({ B: 2, L: 1 })
    expect(state.phase).toBe('attackLeadership')
  })

  test.todo('attackLeadership - use Leadership abilities once implemented')

  it('attackWave1 - all dice of one color used, optional grid destruction', () => {
    // initialize roll values, fort to attack
    gs.attackValueCounts = { B: 1, W: 2, G: 1 }
    let fort = new Fort(createMockFortCard())
    gs.players[1].addFort(fort)
    expect(fort.shellsRemaining).toBe(3)
    // add attacking state information
    gs.shipLocations[0] = { targetPlayerIndex: 1, fortID: 'testFort' }

    let payload = {
      type: GamePhases.attackWave1,
      payload: { attackColor: 'W', attackLoc: [2, 2] },
    }
    let state = gameReducer(gs, payload)

    expect(state.phase).toBe('attackReinforceOrWave2')
    expect(state.attackValueCounts).toEqual({ B: 1, G: 1 })
    fort = state.players[1].findFort('testFort')
    expect(fort.shellsRemaining).toBe(2)
    expect(state.players[1].findFort('testFort').shellsRemaining).toBe(2)
  })

  it('attackReinforceOrWave2 - reinforce if no target', () => {
    gs.attackValueCounts = { B: 2 }
    let payload = {
      type: GamePhases.attackReinforceOrWave2,
      payload: { choice: 'attackWave2' },
    }

    let fort = new Fort(createMockFortCard())
    gs.players[1].addFort(fort)
    gs.shipLocations[0] = { targetPlayerIndex: 1, fortID: 'testFort' }

    let state = gameReducer(gs, payload)
    // no target rolls, so default to reinforce
    expect(state.phase).toBe('attackReinforce')
    // now with target, wave2
    gs.attackValueCounts = { B: 2, T: 1 }
    state = gameReducer(gs, payload)
    expect(state.phase).toBe('attackWave2')
    payload.payload.choice = 'reinforce'
    state = gameReducer(gs, payload)
    expect(state.phase).toBe('attackReinforce')
  })

  test.todo('attackReinforce - add cubes to player reserve')
  // gs.attackValueCounts = {'B': 1, 'W': 1, 'T': 1};
})
