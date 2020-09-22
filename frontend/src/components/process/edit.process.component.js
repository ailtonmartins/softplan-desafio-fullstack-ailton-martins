import React, { Component } from "react";
import processService from "../../services/process.service";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";

const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
      </div>
        );
    }
};

export default class EditProcess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: false,
            id: 0
        };
    }
    componentDidMount() {
        const { match: { params } } = this.props;
        if (params.id) {
            this.setState({ loading: true, id: params.id });
            processService.get(params.id).then(
                res => {
                    const data = res.data;
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
        }

    }

    handleRegister(e) {
        e.preventDefault();

    }


    render() {
        return (
            <div className="container">
                <header className="jumbotron p-3">
                    <h2>Process: {this.state.data.id ? this.state.data.id : 'New'} </h2>
                </header>
                {this.state.loading && <h2> loading... </h2>}

                {!this.state.loading &&
                    <div className="row">
                        <div className="col-5">
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
                                            value={this.state.data.name}
                                            onChange={this.onChangeUsername}
                                            validations={[required]}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email">Description</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="email"
                                            value={this.state.data.description}
                                            onChange={this.onChangeEmail}
                                            validations={[required]}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <button className="btn btn-primary btn-block">Save</button>
                                    </div>

                                    <div className="form-group">
                                        <button type="button" className="btn btn-danger btn-block">Delete</button>
                                    </div>
                                </div>


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
                            </Form>
                        </div>
                        <div className="col-7">
                            <header className="jumbotron p-2">
                                <h2>Feedback</h2>
                            </header>
                            <Form> 
                                <div class="row"> 
                                    <div className="form-group col-8 ">
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="feedback"
                                        />
                                    </div>
                                    <div className="form-group col-4">
                                        <button type="button" className="btn btn- btn-block btn-secondary">Send</button>
                                    </div>
                               </div>
                            </Form>

                            <div class="container mt-5 mb-5">
                                <div class="row">
                                    <div class="col-12">
                                        <h4>Latest News</h4>
                                        <ul class="timeline">
                                            <li>
                                                <label>New Web Design</label>
                                                <label class="float-right">21 March, 2014</label>
                                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque scelerisque diam non nisi semper, et elementum lorem ornare. Maecenas placerat facilisis mollis. Duis sagittis ligula in sodales vehicula....</p>
                                            </li>
                                            <li>
                                                <label>New Web Design</label>
                                                <label class="float-right">21 March, 2014</label>
                                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque scelerisque diam non nisi semper, et elementum lorem ornare. Maecenas placerat facilisis mollis. Duis sagittis ligula in sodales vehicula....</p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                }
            </div>
        );
    }
}
