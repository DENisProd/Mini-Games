// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import Content from "./components/Content/Content";
import Game from "./components/RocketGame/Game";
import GameLayout from "./components/GameLayout/GameLayout";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";

function App() {
    return (
        <>
            <Header />
            <GameLayout>
                <Sidebar />
                <Content>
                    <Game />
                </Content>
            </GameLayout>
        </>
    );
}

export default App;
