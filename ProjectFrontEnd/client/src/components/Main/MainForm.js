import React, { Component } from 'react';

class MainForm extends Component {
    
    render() {
        const backgroundStyle = {
            backgroundImage: `url(${require("../../img/메인배경.png")})`,
            backgroundSize: 'cover', // 이미지가 요소를 완전히 덮도록 설정
            backgroundPosition: 'center', // 이미지를 가운데 정렬
            backgroundRepeat: 'no-repeat', // 이미지 반복 없음
            width: '100%',
            height: '100vh', // 뷰포트의 높이에 맞게 조절
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white', // 텍스트 색상 설정
        };

        return (
            <section className="sub_wrap" style={backgroundStyle}>
                <article className="s_cnt mp_pro_li ct1 mp_pro_li_admin">
                    {/* 내용은 여기에 추가 */}
                </article>
            </section>
        );
    }
}

export default MainForm;