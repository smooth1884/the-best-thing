import React from "react";
import Home from "./routes/Home";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Details from "./routes/Details";

const App = () => {
  return (
    <div>
      <Router>
        <Route exact path="/" component={Home} />
        <Route exact path="/:id/details" component={Details} />
      </Router>
    </div>
  );
};

export default App;
