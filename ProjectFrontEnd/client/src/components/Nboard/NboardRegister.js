import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import $ from 'jquery';
import Swal from 'sweetalert2'
import cookie from 'react-cookies';

class NboardRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
            memNickName: cookie.load('memNickName')
        }
    }

    componentDidMount() {

    }

    submitClick = async (type, e) => {

        this.title_checker = $('#titleVal').val();
        this.content_checker = $('#contentVal').val();

        this.fnValidate = (e) => {
            if (this.title_checker === '') {
                $('#titleVal').addClass('border_validate_err');
                this.sweetalert('제목을 입력해주세요.', '', 'error', '닫기')
                return false;
            }
            $('#titleVal').removeClass('border_validate_err');

            if (this.content_checker === '') {
                $('#contentVal').addClass('border_validate_err');
                this.sweetalert('내용을 입력해주세요.', '', 'error', '닫기')
                return false;
            }
            $('#contentVal').removeClass('border_validate_err');

            return true;
        }

        if (this.fnValidate()) {
            var jsonstr = $("form[name='frm']").serialize();
            jsonstr = decodeURIComponent(jsonstr);
            var Json_form = JSON.stringify(jsonstr).replace(/\"/gi, '')
            Json_form = "{\"" + Json_form.replace(/\&/g, '\",\"').replace(/=/gi, '\":"') + "\"}";
            alert(Json_form)
            var Json_data = JSON.parse(Json_form);
            

            axios.post('/api/nBoard/write', Json_data)
            .then(response => {
                alert(response)
                try {
                    if (response.data == "succ") {
                            this.sweetalert('등록되었습니다.','','success','확인' )
                            setTimeout(function () {
                                this.props.history.push('/NboardList');
                            }.bind(this), 1500
                        );
                    }
                }
                catch (error) {
                    alert('1. 작업중 오류가 발생하였습니다.')
                }
            })
            .catch(error => { alert('2. 작업중 오류가 발생하였습니다.'); return false; });
        }
    };

    sweetalert = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText
        })
    }

    sweetalertSucc = (title, showConfirmButton) => {
        Swal.fire({
            icon: 'success',
            title: title,
            showConfirmButton: showConfirmButton,
            timer: 1000
        })
    }

    handleFileInput(type, e) {
        if (type == 'file') {
            $('#imagefile').val(e.target.files[0].name)
        } else if (type == 'manual') {
            $('#manualfile').val(e.target.files[0].name)
        }
        this.setState({
            selectedFile: e.target.files[0],
        })
        setTimeout(function () {
            if (type == 'manual') {
                this.handlePostMenual()
            } else {
                this.handlePostImage(type)
            }
        }.bind(this), 1
        );
    }

    handlePostMenual() {
        const formData = new FormData();
        formData.append('file', this.state.selectedFile);
        return axios.post("/api/upload?type=uploads/swmanual/", formData).then(res => {
            this.setState({ menualName: res.data.filename })
            $('#is_MenualName').remove()
            $('#upload_menual').prepend('<input id="is_MenualName" type="hidden"'
                + 'name="is_MenualName" value="/swmanual/' + this.state.menualName + '"}/>')
        }).catch(error => {
            alert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
        })
    }

    handlePostImage(type) {
        const formData = new FormData();
        formData.append('uploadFiles', this.state.selectedFile);
        return axios.post("/uploadAjax", formData).then(res => {
            if (type == 'file') {
                this.setState({ fileName: res.data[0].fileName })
                alert(this.state.fileName)
                this.setState({ uuid: res.data[0].uuid })
                alert(this.state.uuid)
                this.setState({ path: res.data[0].path })
                alert(this.state.path)
                this.setState({ thumbnailURL: res.data[0].thumbnailURL })
                alert(this.state.thumbnailURL)
                this.setState({ imageURL: res.data[0].imageURL })
                alert(this.state.imageURL)
                // $('#is_MainImg').remove()
                // $('#uploadimg').remove()
                $('#upload_img').prepend('<img id="uploadimg" name="thumbnailURL" src="display?fileName='
                    + this.state.thumbnailURL + '"/>')
                // $('#upload_img').prepend('<input id="is_MainImg" type="hidden"'
                //     + 'name="imageURL" value="' + this.state.imageURL + '"}/>')
            }
        }).catch(error => {
            alert('작업중 오류가 발생하였습니다.')
        })
    }

    render() {
        return (
            <section class="sub_wrap">
                <article class="s_cnt mp_pro_li ct1">
                    <div class="li_top">
                        <h2 class="s_tit1">게 시 글 등 록</h2>
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
                                                <input type="text" name="writer" id="writerVal" readOnly="readonly" value={this.state.memNickName} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <label for="title">제목</label>
                                            </th>
                                            <td>
                                                <input type="text" name="title" id="titleVal" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <label for="Content">내용</label>
                                            </th>
                                            <td>
                                                <textarea name="content" id="contentVal" rows="" cols=""></textarea>
                                            </td>
                                        </tr>
                                        <tr class="div_tb_tr fileb">
                                            <th>
                                                파일첨부
                                            </th>
                                            <td class="fileBox fileBox_w1">
                                                <label for="uploadBtn1" class="btn_file">파일선택</label>
                                                <input type="text" id="manualfile" class="fileName fileName1"
                                                    readonly="readonly" placeholder="선택된 파일 없음" />
                                                <input type="file" id="uploadBtn1" class="uploadBtn uploadBtn1"
                                                    onChange={e => this.handleFileInput('manual', e)} />
                                                <div id="upload_menual">
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                이미지첨부
                                            </th>
                                            <td className="fileBox fileBox1">
                                                <label htmlFor='imageSelect' className="btn_file">파일선택</label>
                                                <input type="text" id="imagefile" className="fileName fileName1"
                                                    readOnly="readonly" placeholder="선택된 파일 없음" />
                                                <input type="file" id="imageSelect" className="uploadBtn uploadBtn1"
                                                    onChange={e => this.handleFileInput('file', e)} />
                                                <ul id="upload_img">
                                                </ul>
                                            </td>
                                        </tr>

                                    </table>
                                    <div class="btn_confirm mt20" style={{ "margin-bottom": "44px" }}>
                                        <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 saveclass"
                                            onClick={(e) => this.submitClick(e)}>저장</a>
                                        <Link to={'/NboardList'} className="bt_ty bt_ty2 submit_ty1 saveclass">취소</Link>
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

export default NboardRegister;