import React, { useState, useEffect } from 'react';
import axios from "axios";
import Swal from 'sweetalert2';
import $ from 'jquery';
import cookie from 'react-cookies';

const CarRegister = () => {

    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [subCarOptionsList, setSubCarOptionList] = useState([]);
    const [memId, setMemid] = useState(cookie.load('memId'));


    // 차량 정보를 서버에 제출하는 메서드
    const submitClick = async (type, e) => {

        // 차량 번호 입력값 검증을 위한 변수 초기화
        const carNum_val_checker = $('#carNum_val').val()

        // 입력값 검증 함수 정의
        const fnValidate = (e) => {
            if (carNum_val_checker === '') {
                $('#carNum_val').addClass('border_validate_err');
                sweetalert('차량번호를 입력해주세요.', '', 'error', '닫기')
                return false;
            }

            if (carNum_val_checker.search(/\s/) !== -1) {
                $('#carNum_val').addClass('border_validate_err');
                sweetalert('차량번호 공백없이 입력해주세요.', '', 'error', '닫기')
                return false;
            }
            $('#carNum_val').removeClass('border_validate_err');
            return true;
        }

        // 검증 함수 호출 및 통과 시 서버에 차량번호 중복 확인 요청
        if (fnValidate()) {
            axios.post('/api/cars/carNumCK', {
                carNum: carNum_val_checker
            })
                .then(response => {
                    try {
                        const carNumck = response.data.carNum;

                        if (carNumck != null) {
                            $('#carNum_val').addClass('border_validate_err');
                            sweetalert('이미 존재하는 차량번호입니다.', '', 'error', '닫기')
                            return false;
                        } else {
                            $('#carNum_val').removeClass('border_validate_err');
                        }
                    } catch (error) {
                        sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
                    }
                })

            var jsonstr = $("form[name='frm']").serialize();
            jsonstr = decodeURIComponent(jsonstr);
            var Json_form = JSON.stringify(jsonstr).replace(/\"/gi, '')
            Json_form = "{\"" + Json_form.replace(/\&/g, '\",\"').replace(/=/gi, '\":"') + "\"}";
            var Json_data = JSON.parse(Json_form);

            // 서버에 차량 등록 요청
            axios.post('/api/cars/regi', Json_data)
                .then(response => {
                    try {
                        if (response.data == "succ") {
                            if (type == 'signup') {
                                sweetalertSucc('차량정보가 등록 되었습니다.', true)
                            }
                        }
                    }
                    catch (error) {
                        alert('1. 작업중 오류가 발생하였습니다.')
                    }
                })
                .catch(error => { sweetalert('입력사항을 확인해주세요.', '', 'error', '닫기'); return false; });
        };
    }

    // SweetAlert로 메시지를 표시하는 함수
    const sweetalert = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText
        })
    }

    // 등록 성공 시 SweetAlert로 메시지를 표시하고 페이지를 이동하는 함수
    const sweetalertSucc = (title, showConfirmButton) => {
        Swal.fire({
            icon: 'success',
            title: title,
            showConfirmButton: showConfirmButton,
        }).then(function () {
            window.location.href = '/Mypage';
        })
    }

    // 브랜드 선택 시 호출되는 이벤트 핸들러
    const handleBrandChange = (event) => {
        const brand = event.target.value;
        setSelectedBrand(brand)

        // 선택한 브랜드에 따라 가능한 모델 목록 업데이트
        switch (brand) {
            case 'Hyundai':
                setSubCarOptionList(['아이오닉 5', '아이오닉 일렉트릭', '코나 일렉트릭', '포터2 EV', '아이오닉 6'])
                break;
            case 'Kia':
                setSubCarOptionList(['EV6', 'EV6 GT', '니로 EV', '쏘울 부스터 EV', '봉고 3 EV', '쏘울 EV', '레이 EV', '니로 플러스', 'EV9'])
                break;
            case 'Genesis':
                setSubCarOptionList(['일렉트리파이드 G80', 'GV60', '일렉트리파이드 GV70'])
                break;
            case 'tesla':
                setSubCarOptionList(['모델 3', '모델 S', '모델 X', '모델 Y'])
                break;
            case 'Renault Samsung':
                setSubCarOptionList(['트위지', '조에', 'SM3 전기차', 'SM3 네오전기차'])
                break;
            case 'BMW':
                setSubCarOptionList(['i3', 'i3S', 'BMW 530a', 'i4', 'iX', 'iX3', 'BMW 330e', 'BMW320e'])
                break;
            case 'Benz':
                setSubCarOptionList(['EQC', 'EQA', 'EQS', 'EQE', 'GLC 350E', 'EQB'])
                break;
            case 'Nissan':
                setSubCarOptionList(['리프'])
                break;
            case 'Chevrolet':
                setSubCarOptionList(['볼트 EV', '스파크 EV', '볼트 EUV'])
                break;
            case 'Audi':
                setSubCarOptionList(['E-트론', 'E-트론 스포트백'])
                break;
            case 'Peugeot':
                setSubCarOptionList(['e-208', 'e-2008'])
                break;
            case 'Jaguar':
                setSubCarOptionList(['I-페이스'])
                break;
            case 'Porsche':
                setSubCarOptionList(['타이칸', '파나메라 HEV'])
                break;
            case 'Volkswagen':
                setSubCarOptionList(['ID.4'])
                break;
            case 'DS':
                setSubCarOptionList(['3 크로스백 E-텐스'])
                break;
            case 'Dipico':
                setSubCarOptionList(['포트로 EV 픽업', '포트로 EV 탑'])
                break;
            case 'Zidou':
                setSubCarOptionList(['D2'])
                break;
            case 'Mia':
                setSubCarOptionList(['미아 파리', '미아 블루스타', '미아 카다브라', '미아 L'])
                break;
            case 'Edison motors':
                setSubCarOptionList(['SMART T1'])
                break;
            case 'Jeep':
                setSubCarOptionList(['랭글러 4XE'])
                break;
            case 'Volvo':
                setSubCarOptionList(['C40 리차지', 'XC40 리차지', 'XC60', 'XC90'])
                break;
            case 'EV KMC':
                setSubCarOptionList(['MASADA 2인승 벤'])
                break;
            case 'Polestar':
                setSubCarOptionList(['폴스타1', '폴스타2'])
                break;
            case 'Mini':
                setSubCarOptionList(['쿠퍼 SE 일렉트릭'])
                break;
            case 'Lexus':
                setSubCarOptionList(['UX 300e'])
                break;
            case 'Viva Mobility':
                setSubCarOptionList(['젤라 EV'])
                break;
            case 'Myve':
                setSubCarOptionList(['M1'])
                break;
            case 'Ibion':
                setSubCarOptionList(['E6'])
                break;
            case 'Jayce Mobility':
                setSubCarOptionList(['ETVAN'])
                break;
            case 'Daechang Motors':
                setSubCarOptionList(['다니고 C', '다니고 C2', '다니고 T', '다니고 R', '다니고 R2', '다니고 L', '다니고 W'])
                break;
            case 'KG mobility':
                setSubCarOptionList(['토레스 EVX'])
                break;

            default:
                setSubCarOptionList([])
                break;
        }
    };

    // 모델 선택 시 호출되는 이벤트 핸들러
    const handleModelChange = (event) => {
        const model = event.target.value;
        setSelectedModel(model)
    };

        return (
            <div>
                <section className="sub_wrap" >
                    <article className="s_cnt re_1 ct1">
                        <div className="li_top">
                            <h2 className="s_tit1">차량정보등록</h2>
                            <form method="post" name="frm">
                                <div className="re1_wrap">
                                    <div className="re_cnt ct2">
                                        <table className="table_ty1">
                                            <tr className="re_email">

                                                <th>브랜드</th>
                                                <td>
                                                    <select value={selectedBrand} onChange={handleBrandChange} id="email2_val" name="carBrand" className="main-car" >
                                                        <option value="">브랜드를 선택하세요</option>
                                                        <option value='Hyundai'>현대자동차</option>
                                                        <option value='Kia'>기아자동차</option>
                                                        <option value='Genesis'>제네시스</option>
                                                        <option value='tesla'>테슬라</option>
                                                        <option value='Renault Samsung'>르노 삼성</option>
                                                        <option value='BMW'>BMW</option>
                                                        <option value='Benz'>벤츠</option>
                                                        <option value='Nissan'>닛산</option>
                                                        <option value='Chevrolet'>쉐보레</option>
                                                        <option value='Audi'>아우디</option>
                                                        <option value='Peugeot'>푸조</option>
                                                        <option value='Jaguar'>재규어</option>
                                                        <option value='Porsche'>포르쉐</option>
                                                        <option value='Volkswagen'>폭스바겐</option>
                                                        <option value='DS'>DS</option>
                                                        <option value='Dipico'>디피코</option>
                                                        <option value='Zidou'>쯔더우</option>
                                                        <option value='Mia'>미아</option>
                                                        <option value='Edison motors'>에디슨 모터스</option>
                                                        <option value='Jeep'>지프</option>
                                                        <option value='Volvo'>볼보</option>
                                                        <option value='EV KMC'>EV KMC</option>
                                                        <option value='Polestar'>폴스타</option>
                                                        <option value='Mini'>미니</option>
                                                        <option value='Lexus'>렉서스</option>
                                                        <option value='Viva Mobility'>비바모빌리티</option>
                                                        <option value='Myve'>마이브</option>
                                                        <option value='Ibion'>이비온</option>
                                                        <option value='Jayce Mobility'>제이스 모빌리티</option>
                                                        <option value='Daechang Motors'>대창모터스</option>
                                                        <option value='KG mobility'>KG 모빌리티</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>차량 모델</th>
                                                <td>
                                                    <select value={selectedModel} onChange={handleModelChange} id="email2_val" name="carModel" className="sub-car" >
                                                        <option value="">모델을 선택하세요</option>
                                                        {subCarOptionsList.map((option) => (
                                                            <option key={option} value={option}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>

                                            </tr>
                                            <tr>
                                                <th>차량번호</th>
                                                <td>
                                                    <input id="carNum_val" type="text" name="carNum"
                                                        placeholder="예) 123가4567 (공백없이)" />
                                                </td>
                                            </tr>
                                            <tr style={{ display: 'none' }}>
                                                <th>아이디</th>
                                                <td>
                                                    <input id="memId_val" type="text" name="memId" value={memId} />
                                                </td>
                                            </tr>
                                            <tr className="tr_tel">
                                                <th>충전방식</th>
                                                <td>
                                                    <select id="phone1_val" name="charType">
                                                        <option value="">선택</option>
                                                        <option value="DC차데모">DC차데모</option>
                                                        <option value="DC콤보">DC콤보</option>
                                                        <option value="AC3상">AC3상</option>
                                                        <option value="AC완속">AC완속</option>
                                                        <option value="슈퍼차저">슈퍼차저</option>
                                                    </select>

                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                <div className="btn_confirm">
                                    <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 modifyclass"
                                        onClick={(e) => submitClick('signup', e)}>등록</a>
                                </div>
                            </form>
                        </div>
                    </article >
                </section >
            </div >
        );
};


export default CarRegister;