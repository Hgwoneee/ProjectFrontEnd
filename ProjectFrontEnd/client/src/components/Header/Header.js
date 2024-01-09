import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import cookie from 'react-cookies';
import $ from 'jquery';
import Swal from 'sweetalert2';

const Header = () => {
    const [memNickName, setMemNickName] = useState('');
    const [activeMenu, setActiveMenu] = useState('/');
    const [menuVisible, setMenuVisible] = useState(false);//햄버거

    useEffect(() => {
        // componentDidMount 역할
        if (
            window.location.pathname.endsWith('/') ||
            window.location.pathname.includes('/login') ||
            window.location.pathname.includes('/Register')
        ) {
            $('header').hide();
        }

        const cookie_memId = cookie.load('memId');
        const cookie_memNickName = cookie.load('memNickName');
        const cookie_memPw = cookie.load('memPw');
        setMemNickName(cookie_memNickName);

        if (cookie_memId !== undefined) {
            const expires = new Date();
            expires.setMinutes(expires.getMinutes() + 60);

            cookie.save('memId', cookie_memId, { path: '/', expires });
            cookie.save('memNickName', cookie_memNickName, { path: '/', expires });
            cookie.save('memPw', cookie_memPw, { path: '/', expires });

            $('.menulist').show();
            $('.hd_top').show();
        } else {
            $('.menulist').hide();
            $('.hd_top').hide();
        }
    }, []);

    const callSessionInfoApi = (type) => {
        axios
            .post('/api/member/loginPost', {
                token1: cookie.load('memId'),
                token2: cookie.load('memNickName'),
            })
            .then((response) => {
                setMemNickName(response.data.memNickName);
            })
            .catch((error) => {
                sweetalert('작업중 오류가 발생하였습니다.', '', 'error', '닫기');
            });
    };

    const sweetalert = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText,
        });
    };

    const myInfoHover = () => {
        $('.hd_left > li > .box1').stop().fadeIn(400);
    };

    const myInfoLeave = () => {
        $('.hd_left > li > .box1').stop().fadeOut(400);
    };

    const logout = async () => {
        cookie.remove('memId', { path: '/' });
        cookie.remove('memNickName', { path: '/' });
        cookie.remove('memPw', { path: '/' });
        window.location.href = '/login';
    };

    const handleMenuClick = (path) => {
        setActiveMenu(path);
        setMenuVisible(false);
    };

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    return (
        <header className="gnb_box">
            <div className="hd_top">
                <div className="top_wrap ct1 af">
                    <span>Where?</span>
                    <div className="hd_right">
                        <p>
                            <span>'{memNickName}'</span>님 안녕하세요.
                        </p>
                        <button type="button" onClick={logout}>
                            로그아웃
                        </button>
                    </div>
                </div>

            </div>
            <div className="h_nav ct1 af">
                <div className="logo">
                    <img src={require('../../img/layout/자동차2.gif')} height="65px" width="200px" alt="" />
                </div>
                {/* 햄버거 */}
                <div className={`menu-icon ${menuVisible ? 'open' : ''}`} onClick={toggleMenu}>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                </div>
                <div className="hbrfont">
                    <nav className={`nav ${menuVisible ? 'show-menu' : ''}`}>
                        <ul className="menubar">
                            <li className={`menulist ${window.location.pathname === '/MainForm' ? 'active' : ''}`}>
                                <Link to={'/MainForm'} onClick={() => handleMenuClick('/MainForm')}>
                                    홈
                                </Link>
                            </li>
                            <li className={`menulist ${window.location.pathname === '/findStation' ? 'active' : ''}`}>
                                <Link to={'/findStation'} onClick={() => handleMenuClick('/findStation')}>
                                    충전소 검색
                                </Link>
                            </li>
                            <li className={`menulist ${window.location.pathname === '/NboardList' ? 'active' : ''}`}>
                                <Link to={'/NboardList'} onClick={() => handleMenuClick('/NboardList')}>
                                    공지사항
                                </Link>
                            </li>
                            <li className="menulist">
                                <Link to={'/NboardList'} onClick={() => handleMenuClick('')}>
                                    커뮤니티
                                </Link>
                            </li>
                            <li className="menulist">
                                <Link to={'/NboardList'} onClick={() => handleMenuClick('')}>
                                    리뷰
                                </Link>
                            </li>
                            <li className="menulist">
                                <Link to={'/NboardList'} onClick={() => handleMenuClick('')}>
                                    문의
                                </Link>
                            </li>
                            <li className={`menulist ${window.location.pathname === '/MyPage' ? 'active' : ''}`}>
                                <Link to={'/MyPage'} onClick={() => handleMenuClick('/MyPage')}>
                                    마이페이지
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
