import React, { Component } from "react";
import Web3 from "web3";
import Identicon from "identicon.js";
import "./App.css";
import AirportDatabase from "../abis/AirportDatabase.json";
import Navbar from "./Navbar";
import Main from "./Main";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    // await this.checkUser();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    // Network ID
    const networkId = await web3.eth.net.getId();
    const networkData = AirportDatabase.networks[networkId];
    if (networkData) {
      const airportDatabase = new web3.eth.Contract(
        AirportDatabase.abi,
        networkData.address
      );
      this.setState({ airportDatabase });
      const postCount = await airportDatabase.methods.postCount().call();
      this.setState({ postCount });
      // Load Posts
      for (var i = 1; i <= postCount; i++) {
        const post = await airportDatabase.methods.posts(i).call();
        this.setState({
          posts: [...this.state.posts, post]
        });
      }

      this.setState({ loading: false });
    } else {
      window.alert("SocialNetwork contract not deployed to detected network.");
    }
  }

  // async checkUser() {
  //   this.state.accounts.forEach((val, ind) => {
  //     if (val == this.state.account) {
  //       var currentUser = this.state.accountName[ind];

  //       this.setState({ currentUser });
  //     }
  //   });
  // }

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      airportDatabase: null,
      postCount: 0,
      posts: [],
      loading: false,
      accounts: {
        "0x16d5D02500185fF0b887b9BF8715e461B649afA7": "Deputy",
        "0xd1D9c9CfD55350cE2861F33EDb082A01fe19aeC2": "Chief",
        "0x07CC72c9A488EF452b132E349eD19e1038Aa1f5c": "The Project Manager"
      }
    };
  }

  render() {
    return (
      <div>
        <Navbar accounts={this.state.accounts} account={this.state.account} />
        {this.state.loading ? (
          <div id="loader" className="text-center mt-5">
            <p>Loading...</p>
          </div>
        ) : (
          <Main
            posts={this.state.posts}
            createPost={this.createPost}
            tipPost={this.tipPost}
            account={this.state.account}
            airportDatabase={this.state.airportDatabase}
            accounts={this.state.accounts}
          />
        )}
      </div>
    );
  }
}

export default App;
