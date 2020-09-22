import React, { Component } from "react";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Profile from "./components/profile.component";
import User from "./components/user.component";
import ListProcess from "./components/process/list.process.component";
import EditProcess from "./components/process/edit.process.component";


class App extends Component {
    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);

        this.state = {
            showProcess: false,
            showAdmin: false,
            currentUser: undefined,
        };
    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();

        if (user) {
            this.setState({
                currentUser: user,
                showProcess: user.roles.includes("ROLE_ADMIN") || user.roles.includes("ROLE_TRIADOR") || user.roles.includes("ROLE_FINALIZADOR"),
                showAdmin: user.roles.includes("ROLE_ADMIN"),
            });
        }
    }

    logOut() {
        AuthService.logout();
    }

    render() {
        const { currentUser, showProcess, showAdmin } = this.state;
        const user = JSON.parse(localStorage.getItem('user'));

        const PrivateRoute = ({ component: Component, ...rest }) => (
            <Route {...rest} render={(props) => (
                (user && user.accessToken)
                    ? <Component {...props} />
                    : <Redirect to='/login' />
            )} />
        )

        const LoginRoute = ({ component: Component, ...rest }) => (
            <Route {...rest} render={(props) => (
                (!user)
                    ? <Component {...props} />
                    : <Redirect to='/profile' />
            )} />
        )


        return (
            <div>
                <nav className="navbar navbar-expand navbar-dark bg-dark">
                    <Link to={"/"} className="navbar-brand">
                        Teste SoftPlan
                    </Link>
                    <div className="navbar-nav mr-auto">
                        {showAdmin && (
                            <li className="nav-item">
                                <Link to={"/user"} className="nav-link">
                                    User
                                </Link>
                            </li>
                        )}

                        {showProcess && (
                            <li className="nav-item">
                                <Link to={"/process"} className="nav-link">
                                    Process
                                </Link>
                            </li>
                        )}
                    </div>

                    {currentUser ? (
                        <div className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link to={"/profile"} className="nav-link">
                                    {currentUser.username}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <a href="/login" className="nav-link" onClick={this.logOut}>
                                    LogOut
                </a>
                            </li>
                        </div>
                    ) : (
                            <div className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <Link to={"/login"} className="nav-link">
                                        Login
                                    </Link>
                                </li>


                            </div>
                        )}
                </nav>

                <div className="container mt-3">
                    <Switch>
                        <LoginRoute exact path="/login" component={Login} />
                        <PrivateRoute exact path={["/", "/profile"]} component={Profile} />
                        <PrivateRoute path="/user" component={User} />
                        <PrivateRoute path="/process/create" component={EditProcess} />
                        <PrivateRoute path="/process/:id" component={EditProcess} />
                        <PrivateRoute path="/process" component={ListProcess} /> 
                    </Switch>
                </div>
            </div>
        );
    }
}

export default App;
