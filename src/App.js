import './App.css';
import { BrowserRouter ,Switch, Route } from 'react-router-dom'
import { Home, Game } from './pages'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        {/* <Route exact path='/'>
          <Home />
        </Route> */}
        <Route exact path='/game'>
          <Game />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
