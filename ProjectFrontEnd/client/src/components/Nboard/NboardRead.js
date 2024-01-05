import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import $ from 'jquery';
import Swal from 'sweetalert2'
import cookie from 'react-cookies';

class NboardRead extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bno: props.match.params.bno,
            selectedFile: null,
            memNickName: cookie.load('memNickName'),
            thumbnailURL:'',
            title:'',
            content:'',
            writer:'',
            viewCnt:'',
            regidate: '',
            imageDTOList:[],
        }
    }

    componentDidMount() {
        this.callNboardInfoApi();
        $("#modifyButton").hide();
    }

    callNboardInfoApi = async () => {

        
        axios.post('/api/nBoard/read', {
            bNo: this.state.bno,
        })
            .then(response => {
                try {
                    var data = response.data
                    this.setState({ title: data.title })
                    this.setState({ content: data.content })
                    this.setState({ writer: data.writer })
                    this.setState({ viewCnt: data.viewCnt })
                    this.setState({ regidate: data.regidate })
                    this.setState({ imageDTOList: data.imageDTOList })
                    if(this.state.memNickName == this.state.writer) {
                        $("#modifyButton").show();
                    }
                }
                catch (error) {
                    alert('게시글데이터 받기 오류')
                }
            })
            .catch(error => { alert('게시글데이터 받기 오류2'); return false; });

            }

    nBoardFileAppend = () => {
        let result = []
        var nBoardFiles = this.state.imageDTOList
        // var jsonString = JSON.stringify(nBoardList)
        // alert(jsonString);

        for (let i = 0; i < nBoardFiles.length; i++) {
            var data = nBoardFiles[i]
            
            result.push(
                <li class="hidden_type">
                    <img src={`/display?fileName=${data.thumbnailURL}`} alt="Thumbnail" />
                </li>
            )
        }
        return result
    }

    deleteArticle = (e) => {

        this.sweetalertDelete('삭제하시겠습니까?', function () {
            axios.post('/api/nBoard/delete', {
                bNo: this.state.bno
            })
                .then(response => {
                }).catch(error => { alert('작업중 오류가 발생하였습니다.'); return false; });
        }.bind(this))
    }
        
    sweetalertDelete = (title, callbackFunc) => {
        Swal.fire({
            title: title,
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
                }).then((result) => {
                    if (result.value) {
                        Swal.fire(
                            '삭제되었습니다.',
                            '',
                            'success'
                        ).then(() => {
                            window.location.href = '/NboardList';
                        });
                    } else {
                        return false;
                    }
                    callbackFunc()
                })
            }
    

            

    render() {
        return (
            <section class="sub_wrap">
                <article class="s_cnt mp_pro_li ct1">
                    <div class="li_top">
                        <h2 class="s_tit1">게 시 글</h2>
                    </div>
                    <div class="bo_w re1_wrap re1_wrap_writer">
                        <form name="frm" id="frm" action="" onsubmit="" method="post" >
                            <article class="res_w">
                                <div class="tb_outline">
                                    <table class="table_ty1">
                                        <tr>
                                            <th>
                                                <label for="writer">작성자</label>
                                            </th>
                                            <td>
                                                <input type="text" name="writer" id="writerVal" readOnly="readonly" value={this.state.writer} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <label for="regDate">작성일</label>
                                            </th>
                                            <td>
                                                <input type="text" name="regiDate" id="regiDateVal" readOnly="readonly" value={this.state.regidate} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <label for="writer">조회수</label>
                                            </th>
                                            <td>
                                                <input type="text" name="viewCnt" id="viewCntVal" readOnly="readonly" value={this.state.viewCnt} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <label for="title">제목</label>
                                            </th>
                                            <td>
                                                <input type="text" name="title" id="titleVal" readOnly="readonly" value={this.state.title}/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <label for="Content">내용</label>
                                            </th>
                                            <td>
                                                <textarea name="content" id="contentVal" rows="" cols="" readOnly="readonly" value={this.state.content}></textarea>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                파일목록
                                            </th>
                                            <td className="fileBox fileBox1">
                                                <ul id="upload_img">
                                                {this.nBoardFileAppend()}
                                                </ul>
                                            </td>
                                        </tr>

                                    </table>
                                    <div id="modifyButton" class="btn_confirm mt20" style={{ "margin-bottom": "44px" }}>
                                        <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 saveclass"
                                            onClick={(e) => this.submitClick('file', 
                                            {fileName: this.state.fileName,
                                            folderPath: this.state.folderPath,
                                            uuid: this.state.uuid} , e)}>수정</a>
                                        <a href='javascript:' className="bt_ty bt_ty2 submit_ty1 saveclass"
                                            onClick={(e) => this.deleteArticle(e)}>삭제</a>
                                    </div>
                                </div>
                            </article>
                        </form>
                    </div>
                </article>
            </section>
        );
    }
}

export default NboardRead;