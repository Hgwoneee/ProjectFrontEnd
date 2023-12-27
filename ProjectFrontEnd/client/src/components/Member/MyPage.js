import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import cookie from 'react-cookies';

class MyPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            memId: '',  
            memName: '',
            memNickName: '',
            memNo: '',
            memPw: '',
            carNum: '',
            carBrand: '',
            carModel: '',
            charType:'',
            responseCarList:'',
            appendCarList:'',

        }
    }
    
    componentDidMount = async () => {

        var cookie_memNickName = await cookie.load('memNickName')
        var cookie_memId = await cookie.load('memId')
        var cookie_memPw = await cookie.load('memPw')
        this.setState({ memNickName: cookie_memNickName })
        this.setState({ memId: cookie_memId })
        this.setState({ memPw: cookie_memPw })

        this.callMemberInfoApi()
    }


    callMemberInfoApi = async () => {

        
        axios.post('/api/member/readMember', {
            memId: this.state.memId,
        })
            .then(response => {
                try {
                    var data1 = response.data
                    this.setState({ memNickName: data1.memNickName })
                    this.setState({ memName: data1.memName })
                    this.setState({ memNo: data1.memNo })
                }
                catch (error) {
                    alert('회원데이터 받기 오류')
                }
            })
            .catch(error => { alert('회원데이터 받기 오류2'); return false; });

            axios.post('/api/car/read', {
                memNickName: this.state.memNickName,
            })
                .then(response => {
                    try {
                        this.setState({responseCarList: response});
                        this.setState({appendCarList: this.carListAppend()});
                    }
                    catch (error) {
                        alert('차량데이터 받기 오류')
                    }
                })
                .catch(error => { alert('차량데이터 받기 오류2'); return false; });    
    
    
            }
        
    carListAppend = () => {
        let result = []
        var carList = this.state.responseCarList.data
        //var jsonString = JSON.stringify(carList)

        for(let i=0; i<carList.length; i++){
            var data2 = carList[i]

            result.push(
                <tr class="hidden_type">
                    <th>차량{'['}{i+1}{']'}</th>
                    <td>
                       <input name="carInfo" id="carInfo_val" readOnly="readonly" 
                       value={data2.carBrand + ' ' + '/' + ' ' + data2.carModel + ' ' + '/' + ' ' + data2.carNum + ' ' + '/' + ' ' + '충전타입 : ' + data2.charType} />
                    </td>
                </tr>
            )
        }
        return result
    }



    render() {
        return (
            <div>
                <section className="sub_wrap" >
                    <article className="s_cnt re_1 ct1">
                        <div className="li_top">
                            <h2 className="s_tit1">마이페이지</h2>
                            <form method="post" name="frm">
                                <div className="re1_wrap">
                                    <div className="re_cnt ct2">
                                        <table className="table_ty1">
                                            <tr className="re_email">
                                                <th>이메일</th>
                                                <td>
                                                    <input name="memId" id="memId_val" readOnly="readonly" value={this.state.memId} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>이름</th>
                                                <td>
                                                    <input name="memName" id="memName_val" readOnly="readonly" value={this.state.memName} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>닉네임</th>
                                                <td>
                                                    <input id="memNickName_val" type="text" name="memNickName" readOnly="readonly" value={this.state.memNickName}
                                                        />
                                                </td>
                                            </tr>
                                            {this.state.appendCarList}
                                        </table>
                                    </div>
                                </div>
                                <div className="btn_confirm">
                                    <Link to= {'/Modify'} className="bt_ty bt_ty2 submit_ty1 modifyclass">프로필수정</Link>
                                    <Link to= {'/CarRegister'} className="bt_ty bt_ty2 submit_ty1 modifyclass">차량등록</Link>
                                </div>
                            </form>
                        </div>
                    </article>
                </section>
            </div>
        );
    }
}

export default MyPage;