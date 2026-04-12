import { defineStore } from 'pinia'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import { ref } from 'vue'

import router from '@/router'
import type { Card } from '@/types'

import { useAuthStore } from './auth.store'

export interface Room {
  id: string
}

export interface PlayerBoard {
  score: number
  activeCard: (Card & { currentHp: number }) | null
  deckCount?: number
  hand?: Card[]
}

export interface GameStatePayload {
  isMyTurn: boolean
  role: 'host' | 'guest'
  playerBoard: PlayerBoard
  opponentBoard: PlayerBoard
  lastActionMessage?: string
}

export type RoomCreatedPayload =
  | string
  | number
  | { roomId: string | number; message?: string }

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
  })

  const syncState = (gameState: unknown) => {
    if (!gameState || !socket.value) return

    const myId = socket.value.id
    const isHost = gameState.host?.socketId === myId

    role.value = isHost ? 'host' : 'guest'
    isMyTurn.value = gameState.currentPlayerSocketId === myId

    if (isHost) {
      playerBoard.value = {
        ...gameState.host.board,
        deckCount: gameState.host.board.deck?.length || 0,
      }

      opponentBoard.value = {
        ...gameState.guest.board,
        deckCount: gameState.guest.board.deck?.length || 0,
      }
    } else {
      playerBoard.value = {
        ...gameState.guest.board,
        deckCount: gameState.guest.board.deck?.length || 0,
      }

      opponentBoard.value = {
        ...gameState.host.board,
        deckCount: gameState.host.board.deck?.length || 0,
      }
    }
  }

  const connect = () => {
    if (socket.value && socket.value.connected) {
      return
    }

    const socketUrl = new URL(import.meta.env.VITE_SOCKET_URL as string)
    let socketPath = socketUrl.pathname
    if (!socketPath.endsWith('/')) socketPath += '/'
    socketPath += 'socket.io/'

    const newSocket = io(socketUrl.origin, {
      path: socketPath,
      auth: { token: authStore.token },
    })

    socket.value = newSocket
    socket.value.on('roomsList', (roomsList: Room[]) => {
      rooms.value = roomsList
    })

    socket.value.on('roomsListUpdated', (roomsList: Room[]) => {
      rooms.value = roomsList
    })

    socket.value.on('roomCreated', (payload: RoomCreatedPayload) => {
      if (
        typeof payload === 'object' &&
        payload !== null &&
        'roomId' in payload
      ) {
        currentRoomId.value = String(payload.roomId)
      } else {
        currentRoomId.value = String(payload)
      }
    })

    socket.value.on('gameStarted', (payload: unknown) => {
      if (payload.gameState) syncState(payload.gameState)
      gameMessages.value = payload.message || 'La partie commence !'
      router.push('/game')
    })

    socket.value.on('error', (errorMsg: string) => {
      gameMessages.value = `Erreur: ${errorMsg}`
    })

    socket.value.on('gameStateUpdated', (payload: unknown) => {
      const stateToSync = payload.gameState ? payload.gameState : payload
      syncState(stateToSync)
      gameMessages.value = payload.message || payload.lastActionMessage || ''
    })

    socket.value.on('gameEnded', (result: 'win' | 'lose') => {
      gameResult.value = result
    })

    socket.value.on('opponentDisconnected', () => {
      gameMessages.value = "L'adversaire s'est déconnecté."
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
    opponentBoard.value = { score: 0, activeCard: null }
    currentRoomId.value = null
  }

  const createRoom = (deckId: string) => {
    socket.value?.emit('createRoom', deckId)
  }

  const joinRoom = (roomId: string, deckId: string) => {
    currentRoomId.value = String(roomId)
    socket.value?.emit('joinRoom', { roomId, deckId })
  }

  const drawCards = () => {
    if (socket.value) socket.value.emit('drawCards')
  }

  const playCard = (cardId: number) => {
    if (isMyTurn.value && socket.value) socket.value?.emit('playCard', cardId)
  }

  const attack = () => {
    if (isMyTurn.value) socket.value?.emit('attack')
  }

  const endTurn = () => {
    if (isMyTurn.value && socket.value) socket.value?.emit('endTurn')
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
    createRoom,
    joinRoom,
    drawCards,
    playCard,
    attack,
    endTurn,
  }
})
