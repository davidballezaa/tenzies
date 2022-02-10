import React from 'react'

export default function Die({ value, isHeld, changeHeld }) {
  const styles = {
    backgroundColor: isHeld ? '#59E391' : 'white'
  }
  return (
    <div className="die--element" style={styles} onClick={changeHeld}>
      {value}
    </div>
  )
}
