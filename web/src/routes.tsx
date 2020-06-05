import React from 'react';
import {Route, BrowserRouter} from 'react-router-dom';
import Home from './pages/Home';
import CreatePoint from './pages/CreatePoint';
import Success from './pages/Success'
const Routes: React.FC = () =>{
  return (
    <BrowserRouter>
      <Route component={Home} exact path="/"/>
      <Route component={CreatePoint} path="/create-point"/>
      <Route component={Success}  path="/success" />
    </BrowserRouter>
  );
}

export default Routes;