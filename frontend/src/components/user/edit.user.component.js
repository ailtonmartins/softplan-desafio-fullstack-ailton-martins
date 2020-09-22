import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from 'react-select';
import userService from "../../services/user.service";
import authService from "../../services/auth.service";

const optionsRoles = [
    { value: 'ROLE_ADMIN', label: 'ADMIN', id: 'admin' },
    { value: 'ROLE_USER', label: 'USER', id: 'user' },
    { value: 'ROLE_TRIADOR', label: 'TRIADOR', id: 'triador' },
    { value: 'ROLE_FINALIZADOR', label: 'FINALIZADOR', id: 'finalizador'},
];

export default class EditUser extends Component {
    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.handleChangeRole = this.handleChangeRole.bind(this);
        
        this.state = {
            loading: true,
            data: {
               username: '',
               email: '',
               role: '',
               password: ''
            },
            id: false
        };
    }

    onChangePassword(e) {
        let data = this.state.data;
        data.password = e.target.value;
        this.setState(
            { data }
        );
    }

    onChangeUsername(e) {
        let data = this.state.data;
        data.username = e.target.value;
        this.setState(
            { data }
        );
    }

    onChangeEmail(e) {
        let data = this.state.data;
        data.email = e.target.value;
        this.setState(
            { data }
        );
    }
    
    handleChangeRole(e) {
        let data = this.state.data;
        data.role = e;
        this.setState(
            { data }
        );
    };
  
    componentDidMount() {
        const user = authService.getCurrentUser();

        if (user) {       
            this.setState({
                showAdmin: user.roles.includes("ROLE_ADMIN"),
            });
        }

        this.loadData();
    }

    handleRegister(e) {
        e.preventDefault();

        const dataForm = {
            username: this.state.data.username,
            email: this.state.data.email,
            password: this.state.data.password,
            role: this.state.data.role.map((u) => { return u.id; })
        }
        
        userService.save(this.state.id, dataForm ).then(
            res => {
                if (!this.state.id) {
                    this.props.history.push("/user/" + res.id);
                    window.location.reload();
                } else {
                    this.setState({
                        successful: true,
                        message: "Save Process"
                    });                
                    setTimeout( () => {
                        this.setState({
                            successful: false,
                            message: ""
                        }); 
                    } , 500 );    
                }
            } ,
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                this.setState({
                    loading: false,
                    message: resMessage
                });
                setTimeout(() => {
                    this.setState({
                        successful: false,
                        message: ""
                    });
                }, 5000);
            }
        );

    }

    loadData() {
        const { match: { params } } = this.props;
        if (params.id) {
            this.setState({ loading: true, id: params.id });
            userService.get(params.id).then(
                res => {
                    const data = res.data;
                    data.role = data.roles.map((r) => {
                        return optionsRoles.find( s => s.value === r.name );
                    });                    
                    this.setState({
                        data,
                        loading: false,
                    })
                },
                error => {
                    this.setState({
                        loading: false
                    });
                }
            );
        } else {
            this.setState({
                loading: false
            });
        }
    }
    
    render() {
        return (
            <div className="container">
                <header className="jumbotron p-3">
                    <h2>User: {this.state.data.id ? this.state.data.id : 'New'} </h2>
                </header>
                {this.state.message && (
                    <div className="form-group">
                        <div
                            className={
                                this.state.successful
                                    ? "alert alert-success"
                                    : "alert alert-danger"
                            }
                            role="alert"
                        >
                            {this.state.message}
                        </div>
                    </div>
                )}
                {this.state.loading && <h2> loading... </h2>}

                {!this.state.loading &&
                    <div className="row">
                        <div className="col-12">
                            <Form
                                onSubmit={this.handleRegister}
                                ref={c => {
                                    this.form = c;
                                }}>

                                <div>
                                    <div className="form-group">
                                        <label htmlFor="username">Username</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="Name"
                                            disabled={!this.state.showAdmin}
                                            value={this.state.data.username}
                                            onChange={this.onChangeUsername}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="description">Email</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="email"
                                            disabled={!this.state.showAdmin}
                                            value={this.state.data.email}
                                            onChange={this.onChangeEmail}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="description">Password</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="password"
                                            disabled={!this.state.showAdmin}
                                            value={this.state.data.password}
                                            onChange={this.onChangePassword}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="status">Roles</label>
                                        <Select
                                            isMulti
                                            value={this.state.data.role}
                                            isDisabled={!this.state.showAdmin}
                                            onChange={this.handleChangeRole}
                                            options={optionsRoles}
                                        />
                                    </div>
                                    {this.state.showAdmin &&
                                        <div className="form-group">
                                            <button className="btn btn-primary btn-block">Save</button>
                                        </div>
                                    }                                   
                                </div>
                            </Form>
                        </div>                       
                    </div>
                }
            </div>
        );
    }
}
