import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import cookie from 'react-cookies';
import $ from 'jquery';
import Swal from 'sweetalert2';


class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            memNickName: '',
        };
    }
    componentDidMount() {

        if (window.location.pathname.endsWith('/')) {
            $('header').hide()
           
        }
        
        if (window.location.pathname.indexOf('/login') != -1) {
            $('header').hide()
           
        }

        if (window.location.pathname.indexOf('/Register') != -1) {
            $('header').hide()
          
        }

        var cookie_memId = cookie.load('memId')
        var cookie_memNickName = cookie.load('memNickName')
        var cookie_memPw = cookie.load('memPw')
        this.setState({ memNickName: cookie_memNickName })

        if (cookie_memId != undefined) {
            const expires = new Date()
            expires.setMinutes(expires.getMinutes() + 60)

            cookie.save('memId', cookie_memId
                , { path: '/', expires })
            cookie.save('memNickName', cookie_memNickName
                , { path: '/', expires })
            cookie.save('memPw', cookie_memPw
                , { path: '/', expires })

            $('.menulist').show()
            $('.hd_top').show()
        } else {
            $('.menulist').hide()
            $('.hd_top').hide()
        }
    }

    callSessionInfoApi = (type) => {
        axios.post('/api/member/loginPost', {
            token1: cookie.load('memId'),
            token2: cookie.load('memNickName')
        })
            .then(response => {
                this.setState({ memNickName: response.data.memNickName })
            })
            .catch(error => {
                this.sweetalert('작업중 오류가 발생하였습니다.', '', 'error', '닫기');
            });
    }

    sweetalert = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText
        })
    }

    myInfoHover() {
        $(".hd_left > li > .box1").stop().fadeIn(400);
    }

    myInfoLeave() {
        $(".hd_left > li > .box1").stop().fadeOut(400);
    }

    logout = async e => {
        cookie.remove('memId', { path: '/' });
        cookie.remove('memNickName', { path: '/' });
        cookie.remove('memPw', { path: '/' });
        window.location.href = '/login';
    }

    render() {
        return (
            <header className="gnb_box">
                <div className="hd_top">
                    <div className="top_wrap ct1 af">
                        <ul className="hd_left af">
                            <li className="my1" onMouseEnter={this.myInfoHover}
                                onMouseLeave={this.myInfoLeave}><b>MENU</b>
                                <div className="box0 box1">
                                    <ul>
                                        <li><a href="javascript:" onClick={this.logout}>로그아웃</a></li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                        <div className="hd_right">
                            <p><span>'{this.state.memNickName}'</span>님 반갑습니다.</p>
                        </div>
                    </div>
                </div>
                <div className="h_nav ct1 af">
                    <div className="logo">
                        <img src={require("../../img/layout/carlogo001.png")} height="65px" width="200px" alt="" />
                    </div>
                    <nav className="gnb gnb_admin">
                        <ul className="af">
                            <li className="menulist">
                                <Link to={'/MainForm'}>홈</Link>
                            </li>
                            <li className="menulist">
                                <Link to={''}>충전소 검색</Link>
                            </li>
                            <li className="menulist">
                                <Link to={''}>공지사항</Link>
                            </li>
                            <li className="menulist" >
                                <Link to={''}>커뮤니티</Link>
                            </li>
                            <li className="menulist">
                                <Link to={''}>리뷰</Link>
                            </li>
                            <li className="menulist">
                                <Link to={''}>문의</Link>
                            </li>
                            <li className="menulist">
                                <Link to={'/MyPage'}>마이페이지</Link>
                            </li>

                        </ul>
                    </nav>
                </div>
            </header>
        );
    }
}

export default Header;