import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./profile/profile.store";
import usersReducer from "./users/user.store";
import bannerReducer from "./banner/banner.store";
import genreReducer from "./genre/genre.store";
import roomLayoutReducer from "./room-layout/room-layout.store";
import roomReducer from "./room/room.store";
import movieReducer from "./movie/movie.store";
import newsReducer from "./news/news.store";
import showtimeReducer from "./showtime/showtime.store";
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    users: usersReducer,
    banner: bannerReducer,
    genre: genreReducer,
    roomLayout: roomLayoutReducer,
    room: roomReducer,
    movie: movieReducer,
    news: newsReducer,
    showtime: showtimeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
