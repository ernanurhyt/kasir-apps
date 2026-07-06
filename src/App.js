import React, { Component } from 'react'
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";

import { ComNavbar } from './components/Index';
import { Home, Sukses, Loginform } from './pages/Index';

import { AuthProvider } from './authentication/AuthContext';
// import { AuthContext } from '.../authentication/AuthContext';


export default class App extends Component {
// const user = localStorage.getItem('user');
  // userlogout = () => {
  //   alert("logout!!");
  //   localStorage.removeItem('user');
  //   window.location.reload();
  //   // this.props.history.push('/');
  // };

  render() {
    return (
      <BrowserRouter>
        <AuthProvider>
          <ComNavbar />
          <main>
              <Switch>
                <Route exact path="/home" component={Home} /> 
                <Route exact path="/sukses" component={Sukses} />
                <Route exact path="/" component={Loginform} />
              </Switch>
          </main> 
        </AuthProvider>
      </BrowserRouter>
    )
  }
}
