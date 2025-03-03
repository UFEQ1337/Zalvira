import { io, Socket } from "socket.io-client";
import { API_BASE_URL } from "@/config/site";
import { getSession } from "@/lib/auth/session";

export interface ChatMessage {
  room: string;
  user: string;
  message: string;
  timestamp?: Date;
}

export type MessageListener = (message: ChatMessage) => void;
export type RoomJoinListener = (roomData: { room: string }) => void;

class ChatService {
  private socket: Socket | null = null;
  private messageListeners: MessageListener[] = [];
  private roomJoinListeners: RoomJoinListener[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;

  constructor() {
    this.initSocket();
  }

  private async initSocket() {
    try {
      const session = await getSession();

      if (!session?.token) {
        console.warn("Cannot initialize chat: User not authenticated");
        return;
      }

      this.socket = io(`${API_BASE_URL}/chat`, {
        auth: {
          token: session.token,
        },
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: this.reconnectDelay,
        reconnectionAttempts: this.maxReconnectAttempts,
      });

      this.setupSocketListeners();
    } catch (error) {
      console.error("Error initializing chat socket:", error);
    }
  }

  private setupSocketListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Connected to chat server");
      this.reconnectAttempts = 0;
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from chat server");
    });

    this.socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error("Max reconnect attempts reached. Giving up.");
        this.socket?.disconnect();
      }
    });

    this.socket.on("message", (message: ChatMessage) => {
      this.messageListeners.forEach((listener) => listener(message));
    });

    this.socket.on("joinedRoom", (data: { room: string }) => {
      this.roomJoinListeners.forEach((listener) => listener(data));
    });
  }

  public joinRoom(room: string) {
    if (!this.socket?.connected) {
      console.warn("Cannot join room: Socket not connected");
      return false;
    }

    this.socket.emit("joinRoom", room);
    return true;
  }

  public sendMessage(room: string, message: string) {
    if (!this.socket?.connected) {
      console.warn("Cannot send message: Socket not connected");
      return false;
    }

    getSession().then((session) => {
      if (!session) {
        console.warn("Cannot send message: User not authenticated");
        return;
      }

      const payload: ChatMessage = {
        room,
        user: session.email,
        message,
      };

      this.socket?.emit("sendMessage", payload);
    });

    return true;
  }

  public onMessage(listener: MessageListener) {
    this.messageListeners.push(listener);
    return () => {
      this.messageListeners = this.messageListeners.filter(
        (l) => l !== listener
      );
    };
  }

  public onRoomJoin(listener: RoomJoinListener) {
    this.roomJoinListeners.push(listener);
    return () => {
      this.roomJoinListeners = this.roomJoinListeners.filter(
        (l) => l !== listener
      );
    };
  }

  public disconnect() {
    this.socket?.disconnect();
  }

  public reconnect() {
    if (this.socket) {
      this.socket.connect();
    } else {
      this.initSocket();
    }
  }
}

// Singleton instance
export const chatService = new ChatService();
