import type { SocketEvent } from "../types/socket"

export const mockSocketEvents: SocketEvent[] = [
  {
    id: "1",
    type: "connect",
    name: "client:connect",
    payload: { clientId: "usr_abc123", room: "general" },
    timestamp: new Date(),
    direction: "client-to-server",
    status: "success",
  },
  {
    id: "2",
    type: "message",
    name: "message:send",
    payload: { text: "Hello World", room: "general" },
    timestamp: new Date(),
    direction: "client-to-server",
    status: "success",
  },
  {
    id: "3",
    type: "broadcast",
    name: "server:broadcast",
    payload: { text: "Hello World", from: "usr_abc123", room: "general" },
    timestamp: new Date(),
    direction: "server-to-all",
    status: "success",
  },
  {
    id: "4",
    type: "notification",
    name: "notification:push",
    payload: { type: "NEW_MESSAGE", room: "general" },
    timestamp: new Date(),
    direction: "server-to-client",
    status: "success",
  },
]

export const eventScenarios = [
  {
    id: "chat",
    label: "채팅 메시지",
    description: "클라이언트가 메시지를 보내면 서버가 같은 방의 모든 클라이언트에 broadcast",
    events: [
      { name: "client:connect", direction: "client-to-server", delay: 0 },
      { name: "message:send", direction: "client-to-server", delay: 500 },
      { name: "server:broadcast", direction: "server-to-all", delay: 600 },
      { name: "notification:push", direction: "server-to-client", delay: 700 },
    ],
  },
  {
    id: "join",
    label: "Room 참여",
    description: "클라이언트가 특정 채널(Room)에 참여하는 흐름",
    events: [
      { name: "room:join", direction: "client-to-server", delay: 0 },
      { name: "room:members", direction: "server-to-client", delay: 400 },
      { name: "room:announce", direction: "server-to-all", delay: 500 },
    ],
  },
  {
    id: "disconnect",
    label: "연결 종료",
    description: "클라이언트 연결 종료 및 정리 흐름",
    events: [
      { name: "client:disconnect", direction: "client-to-server", delay: 0 },
      { name: "room:leave", direction: "server-to-all", delay: 300 },
      { name: "server:cleanup", direction: "server-to-client", delay: 400 },
    ],
  },
]
