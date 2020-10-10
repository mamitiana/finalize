import * as React from 'react'
import Auth from '../auth/Auth'
import { Button } from 'semantic-ui-react'

import logo from '../sary.jpg'; 

interface LogInProps {
  auth: Auth
}

interface LogInState {}

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <div>
        <h1>Welcome to Our Receipe store!! Please log in First</h1>
        <p>You can post and share your receipe here and provide images</p>
        <img src={logo} alt="Logo" />

        <Button onClick={this.onLogin} size="small" color="orange">
          Log in
        </Button>
      </div>
    )
  }
}
