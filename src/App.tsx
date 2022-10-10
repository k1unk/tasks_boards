import React, {useState} from 'react';
import './styles/styles.scss';
import {observer} from "mobx-react-lite";
import DarkToggle from "./components/DarkToggle";
import Boards from "./components/Boards";

const App = observer(() => {
    return (
        <div>
            <DarkToggle/>
            <Boards/>
        </div>
    );
})

export default App;
