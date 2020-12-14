import React, { Component } from 'react'
import Phaser from 'phaser'
import { IonPhaser } from '@ion-phaser/react'
import {config} from '../js/game'

var game = new Phaser.Game(config);
class Board extends Component { 
  render() {
    return (
      <IonPhaser game={game} />
    )
  }
}
 
export default Board;