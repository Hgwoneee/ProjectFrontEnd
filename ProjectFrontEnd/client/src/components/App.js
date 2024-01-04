import React, { Component } from 'react';
import { Route } from "react-router-dom";
import cookie from 'react-cookies';
import axios from "axios";
import $ from 'jquery';

// css
import '../css/new.css';

// header
import Header from './Header/Header';

// main
import MainForm from './Main/MainForm';
import MapForm from './MapForm';

// footer
import Footer from './Footer/Footer';

// login
import LoginForm from './LoginForm';

// member
import CarRegister from './Member/CarRegister';
import Register from './Member/Register';
import Modify from './Member/Modify';
import MyPage from './Member/MyPage';


// find station
import FindStation from './FindStation/App';

// board
import NboardList from './Nboard/NboardList';
import NboardRegister from './Nboard/NboardRegister';



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memId: '',
      memPw: '',
    }
  }

  componentDidMount() {
   
    if (window.location.pathname.indexOf('/MainForm') != -1) {
      
      axios.post('/api/member/loginCookie', {
        memId: cookie.load('memId'),
        memPw: cookie.load('memPw')
      }).then(response => {
        if (response.data.memId == undefined) {
          this.noPermission();
        } else {
          
        }
      }).catch(error => {
        this.noPermission();
      })
    }
  }

  noPermission = (e) => {
    if (window.location.hash != 'nocookie') {
      this.remove_cookie();
      window.location.href = '/login/#nocookie';
    }
  };

  remove_cookie = (e) => {
    cookie.remove('memId', { path: '/' });
    cookie.remove('memNickName', { path: '/' });
    cookie.remove('memPw', { path: '/' });
  }

  render() {
    return (

      <div className="App">

        <Header />
        <Route exact path='/' component={LoginForm} />
        <Route path='/login' component={LoginForm} />
        <Route path='/MainForm' component={MainForm} />
        <Route path='/MapForm' component={MapForm} />
    
        <Route path='/Register' component={Register} />
        <Route path='/MyPage' component={MyPage} />
        <Route path='/Modify/' component={Modify} />
        <Route path='/CarRegister' component={CarRegister} />


        <Route path='/findStation' component={FindStation} />

        <Route path='/NboardList' component={NboardList} />
        <Route path='/NboardRegister' component={NboardRegister} />



        <Footer />
      </div>

    );

  };
}

export default App;


