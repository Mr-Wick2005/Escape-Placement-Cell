import React from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from './components/Game';
import { Toaster } from './components/ui/toaster';

export const useAuth = () => ({
  user: { id: "player", email: "player@game.local" },
  loading: false,
  signOut: () => {},
});

export const AuthProvider = ({ children }) => <>{children}</>;

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Game />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
