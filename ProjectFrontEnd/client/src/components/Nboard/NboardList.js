import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";
import Swal from 'sweetalert2'

class NboardList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            responseNboardList: '',
            append_NboardList: '',
        }
    }

    componentDidMount() {
        this.callNboardListApi()
    }

    callNboardListApi = async () => {
        axios.get('/api/nBoard/list', {
        })
        .then( response => {
            try {
                this.setState({ responseNboardList: response });
                this.setState({ append_NboardList: this.nBoardListAppend() });
            } catch (error) {
                alert('작업중 오류가 발생하였습니다.');
            }
        })
        .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
    }

    nBoardListAppend = () => {
        let result = []
        var nBoardList = this.state.responseNboardList.data.list
        // var jsonString = JSON.stringify(nBoardList)
        // alert(jsonString);
        
        for(let i=0; i<nBoardList.length; i++){
                var data = nBoardList[i]

            result.push(
                <tr class="hidden_type">
                    <td>{data.bno}</td>
                    <td>{data.title}{'['}{data.replyCnt}{']'}</td>
                    <td>{data.writer}</td>                   
                    <td>{data.viewCnt}</td>
                    <th>{data.regidate}</th>
                </tr>
            )   
        }
        return result
    }

    // deleteSwtool = (e) => {
    //     var event_target = e.target
    //     this.sweetalertDelete('정말 삭제하시겠습니까?', function() {
    //         axios.post('/api/Swtool?type=delete', {
    //             is_SwtCd : event_target.getAttribute('id')
    //         })
    //         .then( response => {
    //             this.callSwToolListApi()
    //         }).catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
    //     }.bind(this))
    // }

    // sweetalertDelete = (title, callbackFunc) => {
    //     Swal.fire({
    //         title: title,
    //         text: "",
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Yes'
    //       }).then((result) => {
    //         if (result.value) {
    //           Swal.fire(
    //             'Deleted!',
    //             '삭제되었습니다.',
    //             'success'
    //           )
    //         }else{
    //             return false;
    //         }
    //         callbackFunc()
    //       })
    // }

    render () {
        return (
            <section class="sub_wrap" >
                <article class="s_cnt mp_pro_li ct1 mp_pro_li_admin">
                    <div class="li_top">
                        <h2 class="s_tit1">공 지 사 항</h2>
                        <div class="li_top_sch af">
                        <Link to={'/SoftwareView/register'} className="sch_bt2 wi_au">글쓰기</Link>
                        </div>
                    </div>

                    <div class="list_cont list_cont_admin">
                        <table class="table_ty1 ad_tlist">
                            <tr>
                                <th>번호</th>
                                <th>제목</th>
                                <th>작성자</th>
                                <th>조회수</th> 
                                <th>작성일</th>
                            </tr>
                        </table>	
                        <table class="table_ty2 ad_tlist">
                            {this.state.append_NboardList}
                        </table>
                    </div>
                </article>
            </section>
        );
    }
}

export default NboardList;