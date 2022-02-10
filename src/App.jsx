import React, { useState, useEffect } from 'react'
import Die from './components/Die'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'

function App() {
  const [dice, setDice] = useState(AllNewDice())
  const [tenzies, setTenzies] = useState(false)

  useEffect(() => {
    let value = dice[0].value
    if (
      dice.every(die => die.value == value) &&
      dice.every(die => die.isHeld)
    ) {
      setTenzies(true)
    }
  }, [dice])

  function AllNewDice() {
    let newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push(createDie())
    }
    return newDice
  }

  function createDie() {
    return {
      value: Math.floor(Math.random() * 6) + 1,
      isHeld: false,
      id: nanoid()
    }
  }

  function changeHeld(id) {
    setDice(prevDice =>
      prevDice.map(die =>
        die.id == id ? { ...die, isHeld: !die.isHeld } : die
      )
    )
  }

  function rollDice() {
    if (!tenzies) {
      setDice(prevDice => prevDice.map(die => (die.isHeld ? die : createDie())))
    } else {
      setTenzies(false)
      setDice(AllNewDice())
    }
  }

  const diceElements = dice.map(die => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      changeHeld={() => changeHeld(die.id)}
    />
  ))

  return (
    <main>
      {tenzies && <Confetti />}
      <div className="dice">
        <div className="dice--header">
          <h1>Tenzies</h1>
          <h2>
            Roll until all dice are the same. Click each die to freeze it at its
            current value between rolls.
          </h2>
        </div>
        <div className="dice--container">{diceElements}</div>
        <button className="dice--button" onClick={rollDice}>
          {tenzies ? 'Play Again' : 'Roll'}
        </button>
      </div>
    </main>
  )
}

export default App
