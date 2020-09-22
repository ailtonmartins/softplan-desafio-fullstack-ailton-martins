import React, { Component } from "react";
import processService from "../../services/process.service";
import ReactPaginate from "react-paginate";
import { Redirect, Link } from "react-router-dom";

export default class ListProcess extends Component {
  constructor(props) {
    super(props);

    this.state = {
        loading: true,
        offset: 0,
        data: [],
        perPage: 5,
        redirect:false,
        currentPage: 0
    };
  }

    loadData() {
        this.setState({ loading: true });
        processService.getAll(this.state.currentPage).then(
            res => {
                const data = res.data;
                const postData = data.process.map(ps => <React.Fragment>
                    <tr>
                        <th scope="row">{ps.id}</th>
                        <td>{ps.name}</td>
                        <td>{ps.description}</td>
                        <td>{ps.status === 'STATUS_FINISH' ? 'Finalizado' : 'Pedente'}</td>
                        <td>
                            <Link to={`/process/${ps.id}`}>Edit | View</Link>
                        </td>
                    </tr>
                </React.Fragment>)
                
                this.setState({
                    postData,
                    loading: false,
                    pageCount: Math.ceil(data.totalItems / this.state.perPage),
                })
            },
            error => {
                this.setState({
                    postData:'<h1>No results found</h1>',
                    loading: false
                });
            }
        );
    }
    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
                this.loadData()
        });

    };    
    componentDidMount() {
        this.loadData();
    }


  render() {    
    if (this.state.redirect) {
          return <Redirect to={this.state.redirect} />;
    }
    return (
      <div className="container">
            <header className="jumbotron">
          <h3>Process</h3>
        </header>
            {!this.state.loading && this.state.postData && 
                <table class="table">
                    <thead class="thead-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Description</th>
                            <th scope="col">Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.postData}
                    </tbody>
                </table>

               
            }
            {!this.state.loading && this.state.postData &&
            <ReactPaginate
                previousLabel={"prev"}
                nextLabel={"next"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={this.state.pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={this.handlePageClick}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"} />
             }
      </div>
    );
  }
}
