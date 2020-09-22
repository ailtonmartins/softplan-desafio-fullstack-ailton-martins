import React, { Component } from "react";
import { Link } from "react-router-dom";
import authService from "../../services/auth.service";
import userService from "../../services/user.service";

export default class ListUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
        postData: "",
        loading: false, 
    };
  }

    loadData() {
        this.setState({ loading: true }); 
        userService.getAll().then(
            res => {
                const data = res.data;
                const postData = data.map(ps => <React.Fragment>
                    <tr>
                        <th scope="row">{ps.id}</th>
                        <td>{ps.username}</td>
                        <td>{ps.email}</td>
                        <td>
                            <Link to={`/user/${ps.id}`}>Edit | View</Link>
                        </td>
                    </tr>
                </React.Fragment>)

                this.setState({
                    postData,
                    loading: false,
                })
            },
            error => {
                this.setState({
                    postData: '<h1>No results found</h1>',
                    loading: false
                });
            }
        );
    }

    componentDidMount() {
        const user = authService.getCurrentUser();
        if (user) {
            this.setState({
                showAdmin: user.roles.includes("ROLE_ADMIN"),
            });
        }
        this.loadData();
    }

  render() {
    return (
      <div className="container">
        <header className="jumbotron p-3">
          <h3>User</h3>
        </header>
            <Link className="btn btn-primary mb-2" to={`/user/create`}>New</Link>
            {!this.state.loading && this.state.postData &&
                <table class="table">
                    <thead class="thead-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Username</th>
                            <th scope="col">Email</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.postData}
                    </tbody>
                </table>
            }

      </div>
    );
  }
}
