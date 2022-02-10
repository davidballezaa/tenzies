import React, { useState, useEffect } from 'react'
import Die from './components/Die'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'

function App() {
  const [dice, setDice] = useState(AllNewDice())
  const [tenzies, setTenzies] = useState(false)
  const [rollCount, setRollCount] = useState(0)
  const [seeStats, setSeeStats] = useState(false)
  const [stats, setStats] = useState([])

  useEffect(() => {
    let value = dice[0].value
    if (
      dice.every(die => die.value === value) &&
      dice.every(die => die.isHeld)
    ) {
      setTenzies(true)
    }
  }, [dice])

  useEffect(() => {
    if (tenzies) {
      setStats(prevStats => [
        {
          id: nanoid(),
          rollCount: rollCount,
          date: new Date().toLocaleString('en-US')
        },
        ...prevStats
      ])
    }
  }, [tenzies])

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
    if (!tenzies) {
      setDice(prevDice =>
        prevDice.map(die =>
          die.id === id ? { ...die, isHeld: !die.isHeld } : die
        )
      )
    }
  }

  function rollDice() {
    if (!tenzies) {
      setDice(prevDice => prevDice.map(die => (die.isHeld ? die : createDie())))
      setRollCount(prevCount => prevCount + 1)
    } else {
      setTenzies(false)
      setRollCount(0)
      setDice(AllNewDice())
    }
  }

  function handlePlayAgain() {
    setSeeStats(false)
    setTenzies(false)
    setRollCount(0)
    setDice(AllNewDice())
  }

  const diceElements = dice.map(die => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      changeHeld={() => changeHeld(die.id)}
    />
  ))

  if (!seeStats) {
    return (
      <main>
        {tenzies && <Confetti />}
        <div className="dice">
          <div className="dice--header">
            <h1>Tenzies</h1>
            <h2>
              Roll until all dice are the same. Click each die to freeze it at
              its current value between rolls.
            </h2>
            {!tenzies && <div>Current Rolles: {rollCount}</div>}
          </div>
          <div className="dice--container">{diceElements}</div>
          <div className="buttons--container">
            <button className="dice--button button" onClick={rollDice}>
              {tenzies ? 'Play Again' : 'Roll'}
            </button>
            <button
              className="button stats--button"
              onClick={() => setSeeStats(true)}
            >
              Stats
            </button>
          </div>
        </div>
      </main>
    )
  } else {
    return (
      <main>
        <div className="stats--container" style={{ textAlign: 'center' }}>
          <h2>My Stats</h2>
          {stats.length > 0 ? (
            stats.map(item => (
              <div key={item.id} className="stats--element">
                <p className="stats--date">
                  {item.date}{' '}
                  <span className="stats--count">{item.rollCount} rolls</span>
                </p>
              </div>
            ))
          ) : (
            <p className="stats--warning">
              It seems like you don't have any stats yet...
            </p>
          )}
          <button className="button back--button" onClick={handlePlayAgain}>
            Play Again
          </button>
        </div>
      </main>
    )
  }
}

export default App
