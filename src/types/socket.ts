export interface SocketEvent {
  id: string
  type: "connect" | "message" | "broadcast" | "notification" | "disconnect" | "error" | "room"
  name: string
  payload?: Record<string, unknown>
  timestamp: Date
  direction: "client-to-server" | "server-to-client" | "server-to-all"
  status: "success" | "error" | "pending"
}

export interface SocketNode {
  id: string
  label: string
  type: "client" | "server" | "handler" | "db" | "notification"
  active: boolean
}
