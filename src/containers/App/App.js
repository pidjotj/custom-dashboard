import React from 'react';
import '../../App.css';
import { Helmet } from "react-helmet";
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import HomePage from "../HomePage";

function App() {
  return (
    <div className="App">
      <Helmet
          titleTemplate="%s - My DashBoad"
          defaultTitle="My DashBoard"
      >
        <meta name="description" content="A React.js application for Ercom technicl task" />
      </Helmet>
      <header className="App-header">
        <BrowserRouter>
          <Switch>
              <Route exact path="/" component={HomePage} />
          </Switch>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
