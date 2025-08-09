import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type LastMessage = {
  content: string;
  timestamp: string; // или Date
};

type Chat = {
  chatId: string;
  userId: string;
  lastMessage: LastMessage;
  noReadMessagesCount: number;
};

type ChatState = {
  chatList: Chat[];
};

const initialState: ChatState = {
  chatList: [],
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Обновить последнее сообщение
    changeLastMesage: (
      state,
      action: PayloadAction<{
        chatId: string;
        content: string;
        timestamp: string;
      }>
    ) => {
      const chat = state.chatList.find((c) => c.chatId === action.payload.chatId);
      if (chat) {
        chat.lastMessage = {
          content: action.payload.content,
          timestamp: action.payload.timestamp,
        };
      }
    },

    // Изменить количество непрочитанных
    changeNoReadCount: (
      state,
      action: PayloadAction<{
        chatId: string;
        count: number;
      }>
    ) => {
      const chat = state.chatList.find((c) => c.chatId === action.payload.chatId);
      if (chat) {
        chat.noReadMessagesCount = action.payload.count;
      }
    },

    // Удалить чат
    deleteChat: (state, action: PayloadAction<string>) => {
      state.chatList = state.chatList.filter((c) => c.chatId !== action.payload);
    },

    // Добавить или обновить чат (опционально)
    upsertChat: (state, action: PayloadAction<Chat>) => {
      const index = state.chatList.findIndex((c) => c.chatId === action.payload.chatId);
      if (index !== -1) {
        state.chatList[index] = action.payload;
      } else {
        state.chatList.unshift(action.payload);
      }
    },
  },
});

export const {
  changeLastMesage,
  changeNoReadCount,
  deleteChat,
  upsertChat,
} = chatSlice.actions;

export default chatSlice.reducer;
