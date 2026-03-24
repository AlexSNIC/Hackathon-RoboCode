import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './app.css'
import 'bootstrap-icons/font/bootstrap-icons.css';

import "./game/assets.js"
import "./game/canvas.js"
import "./game/classes.js"
import "./game/compiler.js"
import "./game/errors.js"
import "./game/game.js"
import "./game/levels.js"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
