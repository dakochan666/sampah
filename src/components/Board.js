// import React, { Component } from 'react'
import React, { useEffect, useState } from 'react'
import Phaser from 'phaser'
import { IonPhaser } from '@ion-phaser/react'
import {config} from '../js/game'
import { useHistory } from 'react-router-dom'

const game = new Phaser.Game(config);

// class Board extends Component { 
  
//   render() {
//     const history = useHistory()
//     return (
//       <IonPhaser game={game} />
//     )
//   }
// }

function Board() {
  const [result, setResult] = useState(localStorage.getItem('result'))
  const [initialize, setinitialize] = useState(true)
  const history = useHistory()
  // let game 
  // useEffect(() => {
  //   game = new Phaser.Game(config);
  // })
  
  // let result
  setInterval(() => {
    setResult(localStorage.getItem("result"))
    // setinitialize(false)
  }, 1000)

  useEffect(() => {
    console.log(result);
    if(result === "endgame") {
      history.push('/finish')
    }
  }, [result])

  return (
      <>
          <IonPhaser game={game} initialize={initialize} />
      </>
  )
}

export default Board
 
// export default Board;