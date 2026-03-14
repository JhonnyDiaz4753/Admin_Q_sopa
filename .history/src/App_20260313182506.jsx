import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
 
  return (
    <div className="App">
      <div className="container">
        <div className="content">
          <h1>Admin Q sopa</h1>
          <p>Admin Q sopa is a web application designed to help administrators manage their tasks efficiently. With a user-friendly interface and powerful features, Admin Q sopa allows administrators to streamline their workflow and stay organized.</p>
          <button className="btn">Learn More</button>
        </div>
        <div className="image">
          <img src={heroImg} alt="Hero Image" />
        </div>
      </div>
    </div>
  )
   
}

export default App
