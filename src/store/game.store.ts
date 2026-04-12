import { defineStore } from 'pinia'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import { ref } from 'vue'

import router from '@/router'
import type { Card } from '@/types'

import { useAuthStore } from './auth.store'

export interface ServerBoard {
  score: number
  activeCard: (Card & { currentHp: number }) | null
  deck: Card[]
  hand: Card[]
}

export interface ServerPlayer {
  socketId: string
  board: ServerBoard
}

export interface ServerGameState {
  roomId: number | string
  status: string
  currentPlayerSocketId: string
  host: ServerPlayer
  guest: ServerPlayer
}

export interface GameEventPayload {
  message?: string
  lastActionMessage?: string
  gameState?: ServerGameState
}

export interface Room {
  id: string
}

export interface PlayerBoard {
  score: number
  activeCard: (Card & { currentHp: number }) | null
  deckCount: number
  hand: Card[]
}

export const useGameStore = defineStore('game', () => {
  const authStore = useAuthStore()

  const socket = ref<Socket | null>(null)
  const rooms = ref<Room[]>([])
  const currentRoomId = ref<string | null>(null)
  const isMyTurn = ref<boolean>(false)
  const role = ref<'host' | 'guest' | null>(null)
  const gameResult = ref<'win' | 'lose' | null>(null)
  const gameMessages = ref<string>('')

  const playerBoard = ref<PlayerBoard>({
    score: 0,
    activeCard: null,
    deckCount: 0,
    hand: [],
  })

  const opponentBoard = ref<PlayerBoard>({
    score: 0,
    activeCard: null,
    deckCount: 0,
    hand: [],
  })

  const syncState = (gameState: ServerGameState) => {
    if (!gameState || !socket.value) return

    const myId = socket.value.id
    const isHost = gameState.host.socketId === myId

    role.value = isHost ? 'host' : 'guest'
    isMyTurn.value = String(gameState.currentPlayerSocketId) === String(myId)

    const mapBoard = (serverBoard: ServerBoard): PlayerBoard => ({
      score: serverBoard.score,
      activeCard: serverBoard.activeCard,
      hand: serverBoard.hand || [],
      deckCount: serverBoard.deck?.length || 0,
    })

    if (isHost) {
      playerBoard.value = mapBoard(gameState.host.board)
      opponentBoard.value = mapBoard(gameState.guest.board)
    } else {
      playerBoard.value = mapBoard(gameState.guest.board)
      opponentBoard.value = mapBoard(gameState.host.board)
    }
  }

  const connect = () => {
    if (socket.value?.connected) return

    const socketUrl = new URL(import.meta.env.VITE_SOCKET_URL as string)
    let socketPath = socketUrl.pathname
    if (!socketPath.endsWith('/')) socketPath += '/'
    socketPath += 'socket.io/'

    socket.value = io(socketUrl.origin, {
      path: socketPath,
      auth: { token: authStore.token },
      reconnection: true,
    })

    socket.value.on('roomsList', (roomsList: Room[]) => {
      rooms.value = roomsList
    })
    socket.value.on('roomsListUpdated', (roomsList: Room[]) => {
      rooms.value = roomsList
    })

    socket.value.on(
      'roomCreated',
      (payload: string | number | { roomId: string | number }) => {
        if (
          typeof payload === 'object' &&
          payload !== null &&
          'roomId' in payload
        ) {
          currentRoomId.value = String(payload.roomId)
        } else {
          currentRoomId.value = String(payload)
        }
      },
    )

    socket.value.on('gameStarted', (payload: GameEventPayload) => {
      if (payload.gameState) syncState(payload.gameState)

      gameMessages.value = payload.message || 'La partie commence !'
      router.push('/game')
    })

    socket.value.on(
      'gameStateUpdated',
      (payload: GameEventPayload | ServerGameState) => {
        const stateToSync =
          'gameState' in payload
            ? payload.gameState
            : (payload as ServerGameState)

        if (stateToSync) syncState(stateToSync)

        if ('message' in payload || 'lastActionMessage' in payload) {
          const p = payload as GameEventPayload
          gameMessages.value = p.message || p.lastActionMessage || ''
        }
      },
    )

    socket.value.on('error', (errorMsg: string) => {
      gameMessages.value = `Erreur: ${errorMsg}`
    })

    socket.value.on('gameEnded', (result: 'win' | 'lose') => {
      gameResult.value = result
    })
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
    }
  }

  const resetGame = () => {
    isMyTurn.value = false
    role.value = null
    gameResult.value = null
    gameMessages.value = ''
    playerBoard.value = { score: 0, activeCard: null, deckCount: 0, hand: [] }
    opponentBoard.value = { score: 0, activeCard: null, deckCount: 0, hand: [] }
    currentRoomId.value = null
  }

  const drawCards = () => {
    if (isMyTurn.value && socket.value) socket.value.emit('drawCard')
  }

  const playCard = (cardId: number) => {
    if (isMyTurn.value && socket.value) socket.value.emit('playCard', cardId)
  }

  const attack = () => {
    if (isMyTurn.value && socket.value) socket.value.emit('attack')
  }

  const endTurn = () => {
    if (isMyTurn.value && socket.value) socket.value.emit('endTurn')
  }

  return {
    rooms,
    currentRoomId,
    isMyTurn,
    role,
    playerBoard,
    opponentBoard,
    gameResult,
    gameMessages,
    connect,
    disconnect,
    resetGame,
    createRoom: (deckId: string) => socket.value?.emit('createRoom', deckId),
    joinRoom: (roomId: string, deckId: string) => {
      currentRoomId.value = String(roomId)
      socket.value?.emit('joinRoom', { roomId, deckId })
    },
    drawCards,
    playCard,
    attack,
    endTurn,
  }
})
