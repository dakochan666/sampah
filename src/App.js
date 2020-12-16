import './App.css';
import { BrowserRouter ,Switch, Route } from 'react-router-dom'
import { Home, Game, Finish } from './pages'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/'>
          <Home />
        </Route>
        <Route path='/game'>
          <Game />
        </Route>
        <Route path='/finish'>
          <Finish />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
