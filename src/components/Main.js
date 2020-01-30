import React, { Component } from "react";
import Identicon from "identicon.js";
const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https"
});

class Main extends Component {
  captureFile = event => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
      console.log("buffer", this.state.buffer);
    };
  };

  onSubmit = event => {
    event.preventDefault();
    console.log("Submitting file to ipfs...");
    // console.log("filename", this.state.fileName);
    ipfs.add(this.state.buffer, (error, result) => {
      console.log("Ipfs result", result);
      if (error) {
        console.error(error);
        return;
      }
      console.log(result[0].hash);
      this.props.airportDatabase.methods
        .createPost(result[0].hash, this.state.fileName)
        .send({ from: this.props.account })
        .then(r => {
          console.log(result[0].hash);
          return this.setState({ fileHash: result[0].hash });
        });
    });
  };

  approvePost = id => e => {
    e.preventDefault();
    console.log("Approving the post", id);
    this.props.airportDatabase.methods
      .approvePost(id)
      .send({ from: this.props.account })
      .then(r => {
        console.log("Changed Successfully");
      });
  };

  handleChange = event => {
    this.setState({ fileName: event.target.value });
  };

  constructor(props) {
    super(props);

    this.state = {
      fileHash: "",
      buffer: null,
      fileName: ""
    };
  }

  render() {
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main
            role="main"
            className="col-lg-12 ml-auto mr-auto"
            style={{ maxWidth: "500px" }}
          >
            <div className="content mr-auto ml-auto">
              <p>&nbsp;</p>
              {this.props.accounts[this.props.account] ==
              "The Project Manager" ? (
                <span></span>
              ) : (
                <form onSubmit={this.onSubmit}>
                  <div className="form-group mr-sm-2">
                    <input
                      id="filename"
                      type="text"
                      onChange={this.handleChange}
                      className="form-control my-2"
                      placeholder="Enter File Name"
                      required
                    />

                    <div className="custom-file">
                      <input
                        id="hashcode"
                        type="file"
                        ref={input => {
                          this.hashcode = input;
                        }}
                        className="custom-file-input"
                        onChange={this.captureFile}
                        required
                      />
                      <label className="custom-file-label">
                        Upload Your File
                      </label>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">
                    Upload
                  </button>
                </form>
              )}

              <p>&nbsp;</p>

              {this.props.posts.map((post, key) => {
                return (
                  <div className="card mb-4" key={key}>
                    <div className="card-header">
                      <img
                        className="mr-2"
                        width="30"
                        height="30"
                        src={`data:image/png;base64,${new Identicon(
                          post.author,
                          30
                        ).toString()}`}
                      />
                      <small className="text-muted">
                        {this.props.accounts[post.author]}
                      </small>
                    </div>
                    <ul id="postList" className="list-group list-group-flush">
                      <li className="list-group-item">
                        <p>{post.filename}</p>
                      </li>
                      <li className="list-group-item">
                        <img
                          src={`https://ipfs.infura.io/ipfs/${post.filehash}`}
                          width="400px"
                          height="auto"
                        />
                      </li>
                      <li key={key} className="list-group-item py-2">
                        <small className="float-left mt-1 text-muted">
                          Status:{" "}
                          {post.approval_status ? "Approved " : "Not Approved"}
                        </small>
                        {this.props.accounts[this.props.account] == "Chief" ? (
                          <button
                            className="btn btn-success btn-sm float-right pt-0"
                            onClick={this.approvePost(post.id)}
                          >
                            Approve This
                          </button>
                        ) : (
                          <span></span>
                        )}
                      </li>
                    </ul>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;
