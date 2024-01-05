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
        }
    }

    componentDidMount() {
        this.callNboardInfoApi()
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
                }
                catch (error) {
                    alert('게시글데이터 받기 오류')
                }
            })
            .catch(error => { alert('게시글데이터 받기 오류2'); return false; });

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
                                                </ul>
                                            </td>
                                        </tr>

                                    </table>
                                    <div class="btn_confirm mt20" style={{ "margin-bottom": "44px" }}>
                                        <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 saveclass"
                                            onClick={(e) => this.submitClick('file', 
                                            {fileName: this.state.fileName,
                                            folderPath: this.state.folderPath,
                                            uuid: this.state.uuid} , e)}>수정</a>
                                        <Link to={''} className="bt_ty bt_ty2 submit_ty1 saveclass">삭제</Link>
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