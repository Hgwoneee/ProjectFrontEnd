import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import cookie from 'react-cookies';
import Swal from 'sweetalert2';
import $ from 'jquery';

class LoginForm extends Component {
    submitClick = (e) => {
        this.memId_val = $('#memId_val').val();
        this.memPw_val = $('#memPw_val').val();
        if (this.memId_val === '' || this.memPw_val === '') {
            this.sweetalert('이메일과 비밀번호를 확인해주세요.', '', 'error', '닫기')
        } else {
            axios.post('/api/member/loginPost', {
                memId: this.memId_val,
                memPw: this.memPw_val
            })
                .then(response => {
                    var memId = response.data.memId
                    var memNickName = response.data.memNickName
                    var memPw = response.data.memPw

                    if (response.data.memId != undefined) {
                        const expires = new Date()
                        expires.setMinutes(expires.getMinutes() + 60)
                        cookie.save('memId', response.data.memId
                            , { path: '/', expires })
                        cookie.save('memNickName', response.data.memNickName
                            , { path: '/', expires })
                        cookie.save('memPw', response.data.memPw
                            , { path: '/', expires })
                        setTimeout(function () {
                            window.location.href = '/MainForm';
                        }.bind(this), 1000);
                    } else {
                        this.sweetalert('이메일과 비밀번호를 확인해주세요.', '', 'error', '닫기')
                    }
                })
                .catch(error => { this.sweetalert('이메일과 비밀번호를 확인해주세요.', '', 'error', '닫기') });
        }
    }

    sweetalert = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText
        })
    }
   

    render() {
        return (
            <section className="main">

                <div className="m_login signin">
                    {/* <span><img src={require("../img/layout/carlogo001.png")}></img></span> */}
                    <h3>LOGIN</h3>
                    <div className="log_box">
                        <div className="in_ty1">
                            <span><img src={require("../img/main/m_log_i3.png")} alt="" /></span>
                            <input type="email" id="memId_val" placeholder="이메일" />
                        </div>
                        <div className="in_ty1">
                            <span className="ic_2">
                                <img src={require("../img/main/m_log_i2.png")} alt="" />
                            </span>
                            <input type="password" id="memPw_val" placeholder="비밀번호" />
                        </div>
                        
                        <br></br>
                        <div className="s_bt" type="button" onClick={(e) => this.submitClick(e)} >로그인</div>
                        <br></br>
                        <div className="s_bt" type="button" onClick={(e) => this.registerClick(e)} >회원가입</div>
                    </div>
                </div>
            </section>
        );
    }
}

export default LoginForm;