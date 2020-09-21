import React, { Component } from "react";
import processService from "../services/process.service";
import ReactPaginate from "react-paginate";

export default class Process extends Component {
  constructor(props) {
    super(props);

    this.state = {
        offset: 0,
        data: [],
        perPage: 5,
        currentPage: 0
    };
  }
    receivedData(page = 0) {
        processService.getAll(this.state.currentPage).then(
            res => {
                const data = res.data;

                //const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                const postData = data.process.map(ps => <React.Fragment>
                    <p>{ps.id} - {ps.name} - {ps.description} - {ps.status == 'STATUS_FINISH' ? 'Finalizado' : 'Pedente' }</p>
                </React.Fragment>)
                
                this.setState({
                    postData,
                    pageCount: Math.ceil(data.totalItems / this.state.perPage),
                })
            },
            error => {
                this.setState({
                    content:
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString()
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
            this.receivedData()
        });

    };
    componentDidMount() {
        this.receivedData();
    }


  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>Process</h3>
        </header>
            {this.state.postData}
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
      </div>
    );
  }
}
