import React, { Component } from "react";
import processService from "../../services/process.service";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from 'react-select';
import userService from "../../services/user.service";
import authService from "../../services/auth.service";

const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
      </div>
        );
    }
};

const optionsStatus = [
    { value: 'STATUS_PENDENT', label: 'Pendent' , id : 0 },
    { value: 'STATUS_FINISH', label: 'Finish' , id : 1},
];

export default class EditProcess extends Component {
    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleRegisterFeedback = this.handleRegisterFeedback.bind(this);
        this.onChangeNewFeedback = this.onChangeNewFeedback.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
        this.handleChangeUsers = this.handleChangeUsers.bind(this);
        
        this.state = {
            loading: true,
            data: {
               name: '',
               description: '',
               status: { value: 'STATUS_PENDENT', label: 'Pendent', id: 0 } ,
               users:[] 
            },
            feedackData: false,
            newFeedback: "",
            id: false,
            listUsers: [],
            showAdmin: false,
            showEdit : false
        };
    }

    onChangeName(e) {
        let data = this.state.data;
        data.name = e.target.value;
        this.setState(
            { data }
        );
    }

    onChangeDescription(e) {
        let data = this.state.data;
        data.description = e.target.value;
        this.setState(
            { data }
        );
    }
    
    handleChangeStatus(e) {
        let data = this.state.data;
        data.status = e;
        this.setState(
            { data }
        );
    };

    handleChangeUsers(e) {
        let data = this.state.data;
        data.users = e;
        this.setState(
            { data }
        );
    };

    onChangeNewFeedback(e) {
        this.setState({
            newFeedback: e.target.value
        });        
    }

    componentDidMount() {
        const user = authService.getCurrentUser();

        if (user) {       
            this.setState({
                showEdit: user.roles.includes("ROLE_ADMIN") || user.roles.includes("ROLE_TRIADOR"),
                showAdmin: user.roles.includes("ROLE_ADMIN"),
            });
        }
       

        this.loadData();
        this.loadDataUsers();
    }

    handleRegister(e) {
        e.preventDefault();

        const dataForm = {
            name: this.state.data.name,
            description: this.state.data.description,
            status: this.state.data.status.id,
            user: this.state.data.users.map((u) => { return u.value; })
        }
        
        processService.save(this.state.id, dataForm ).then(
            res => {
                if (!this.state.id) {
                    this.props.history.push("/process/" + res.id);
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
            }
        );

    }

    handleRegisterFeedback(e) {
        e.preventDefault();
        if( this.state.newFeedback ) {
            processService.saveFeedback(this.state.id, this.state.newFeedback).then(
                res => {
                    this.loadData();
                    this.setState({
                        newFeedback: ''
                    });
                    this.setState({
                        successful: true,
                        message: "Save Feedback"
                    });  
                    setTimeout(() => {
                        this.setState({
                            successful: false,
                            message: ""
                        });
                    }, 1000);
                }
            );
        }
    }

    handleDelete(e) {
        e.preventDefault();
        if (this.state.id) {
            processService.delete(this.state.id).then(
                res => {
                    this.props.history.push("/process");
                    window.location.reload();
                },
                error => { }
            );
        }
    }

    loadDataUsers() {
        userService.getAll().then(
            res => {
                let data = res.data;
                data = data.map((u) => {
                    return {
                        value: u.id,
                        label: u.username
                    };
                });
                
                this.setState({
                    listUsers: data
                });
            }
        )
    }

    loadData() {
        const { match: { params } } = this.props;
        if (params.id) {
            this.setState({ loading: true, id: params.id });
            processService.get(params.id).then(
                res => {
                    const data = res.data;
                    const feedbackData = data.feedback.map(fd => <React.Fragment>
                        <li>
                            <label className="small" >{fd.user.username} | {fd.createDateTime}</label>
                            <p>{fd.text}</p>
                        </li>
                    </React.Fragment>)

                    data.status = optionsStatus.find(s => s.value === data.status  );

                    data.users = data.users.map((u) => {
                         return {
                             value: u.id,
                             label: u.username 
                         };
                    });

                    this.setState({
                        feedbackData,
                        data,
                        loading: false,
                    })
                },
                error => {
                    this.setState({
                        feedackData: false,
                        loading: false
                    });
                }
            );
        } else {
            this.setState({
                feedackData: false,
                loading: false
            });
        }
    }
    
    render() {
        return (
            <div className="container">
                <header className="jumbotron p-3">
                    <h2>Process: {this.state.data.id ? this.state.data.id : 'New'} </h2>
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
                        <div className="col-6">
                            <header className="jumbotron p-2">
                                <h2>Process</h2>
                            </header>
                            <Form
                                onSubmit={this.handleRegister}
                                ref={c => {
                                    this.form = c;
                                }}>

                                <div>
                                    <div className="form-group">
                                        <label htmlFor="username">Name</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="Name"
                                            disabled={!this.state.showEdit}
                                            value={this.state.data.name}
                                            onChange={this.onChangeName}
                                            validations={[required]}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="description">Description</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="description"
                                            disabled={!this.state.showEdit}
                                            value={this.state.data.description}
                                            onChange={this.onChangeDescription}
                                            validations={[required]}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="status">Status</label>
                                        <Select
                                            value={this.state.data.status}
                                            isDisabled={!this.state.showEdit}
                                            onChange={this.handleChangeStatus}
                                            options={optionsStatus}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="status">Users</label>
                                        <Select
                                            isMulti
                                            isDisabled={!this.state.showEdit}
                                            value={this.state.data.users}
                                            onChange={this.handleChangeUsers}
                                            options={this.state.listUsers}
                                        />
                                    </div>
                                    {this.state.showEdit &&
                                        <div className="form-group">
                                            <button className="btn btn-primary btn-block">Save</button>
                                        </div>
                                    }

                                    {this.state.data.id && this.state.showAdmin  &&
                                        <div className="form-group">
                                           <button type="button" onClick={this.handleDelete} className="btn btn-danger btn-block">Delete</button>
                                        </div>
                                    }
                                </div>
                            </Form>
                        </div>
                        {this.state.data.id &&
                        <div className="col-6">
                            <header className="jumbotron p-2">
                                <h2>Feedback</h2>
                            </header>
                            <Form> 
                                <div className="row"> 
                                   
                                    <div className="form-group col-8 ">
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="feedback"
                                            value={this.state.newFeedback}
                                            onChange={this.onChangeNewFeedback}
                                        />
                                    </div>
                                    
                                    <div className="form-group col-4">
                                        <button type="button" onClick={this.handleRegisterFeedback} className="btn btn- btn-block btn-secondary">Send</button>
                                    </div>
                                    
                               </div>
                            </Form>

                            <div className="container mt-5 mb-5">
                                <div className="row">
                                    <div className="col-12">
                                        <h4>Latest News</h4>
                                        <ul className="timeline">
                                           {this.state.feedbackData}                                     
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        }
                    </div>
                }
            </div>
        );
    }
}
