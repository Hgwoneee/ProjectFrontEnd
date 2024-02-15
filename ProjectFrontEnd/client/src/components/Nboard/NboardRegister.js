import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from "axios";
import $ from 'jquery';
import Swal from 'sweetalert2'
import cookie from 'react-cookies';

const NboardRegister = () => {

    let history = useHistory();

    const [memNickName] = useState(cookie.load('memNickName'));
    const [imageDTOList, setImageDTOList] = useState([]);

    const submitClick = async (type, e) => {

        const title_checker = $('#titleVal').val();
        const content_checker = $('#contentVal').val();

        const fnValidate = (e) => {
            if (title_checker === '') {
                $('#titleVal').addClass('border_validate_err');
                sweetalert('제목을 입력해주세요.', '', 'error', '닫기')
                return false;
            }
            $('#titleVal').removeClass('border_validate_err');

            if (content_checker === '') {
                $('#contentVal').addClass('border_validate_err');
                sweetalert('내용을 입력해주세요.', '', 'error', '닫기')
                return false;
            }
            $('#contentVal').removeClass('border_validate_err');

            return true;
        }

        if (fnValidate()) {
            let jsonstr = $("form[name='frm']").serialize();
            jsonstr = decodeURIComponent(jsonstr);
            let Json_form = JSON.stringify(jsonstr).replace(/\"/gi, '')
            Json_form = "{\"" + Json_form.replace(/\&/g, '\",\"').replace(/=/gi, '\":"') + "\"}";
            let Json_data = {
                ...JSON.parse(Json_form),
                imageDTOList: imageDTOList,
            };

            axios.post('/api/nBoards/write', Json_data)
                .then(response => {
                    try {
                        if (response.data == "succ") {
                            sweetalert('등록되었습니다.', '', 'success', '확인')
                            setTimeout(function () {
                                history.push('/NboardList');
                            }, 1500
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

    const sweetalert = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText
        })
    }

    const sweetalertSucc = (title, showConfirmButton) => {
        Swal.fire({
            icon: 'success',
            title: title,
            showConfirmButton: showConfirmButton,
            timer: 1000
        })
    }

    // 파일 선택 input의 값이 변경될 때 실행되는 메서드
    const handleFileInput = async (type, e) => {
        try {
            if (type === 'file') {
                $('#imagefile').val(e.target.files[0].name);
            } else if (type === 'manual') {
                $('#manualfile').val(e.target.files[0].name);
            }
    
            if (type === 'file') {
                handlePostImage(type, e.target.files[0]);
            }
        } catch (error) {
            alert('작업 중 오류가 발생하였습니다.');
        }
    }

    const [fileName, setFileName] = useState('');
    const [uuid, setUuid] = useState('');
    const [path, setPath] = useState('');
    const [thumbnailURL, setThumbnailURL] = useState('');
    const [imageURL, setImageURL] = useState('');

    // 이미지 파일 업로드 처리 메서드
    const handlePostImage = (type, file) => {
        const formData = new FormData();
        formData.append('uploadFiles', file);
        return axios.post("/uploadAjax", formData).then(res => {
            if (type == 'file') {
                setFileName(res.data[0].fileName);
                setUuid(res.data[0].uuid);
                setPath(res.data[0].folderPath);
                setThumbnailURL(res.data[0].thumbnailURL);
                setImageURL(res.data[0].imageURL);

                let str = "";

                str += `<li data-name='${fileName}' data-path='${path}' data-uuid='${uuid}'>
                        <img src='/display?fileName=${thumbnailURL}'>
                        </li>`;

                $('#upload_img').append(str)

                const imageInfo = {
                    imgName: fileName,
                    path: path,
                    uuid: uuid,

                };
                setImageDTOList(prevImageDTOList => [...prevImageDTOList, imageInfo]);
            }
        }).catch(error => {
            alert('작업중 오류가 발생하였습니다.3')
        })
    }

    const handleRemoveAllThumbnails = () => {
        $('.fileBox1 ul').empty();
        $('#imagefile').val('');
        setImageDTOList([]);
    };

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
                                            <input type="text" name="writer" id="writerVal" readOnly="readonly" value={memNickName} />
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
                                            <textarea style={{ padding: '15px' }} name="content" id="contentVal" rows="" cols=""></textarea>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            파일첨부
                                        </th>
                                        <td className="fileBox fileBox1">
                                            <label htmlFor='imageSelect' className="btn_file">파일선택</label>
                                            <input type="text" id="imagefile" className="fileName fileName1"
                                                readOnly="readonly" placeholder="선택된 파일 없음" />
                                            <input type="file" id="imageSelect" className="uploadBtn uploadBtn1"
                                                onChange={e => handleFileInput('file', e)} multiple />
                                            <button type="button" className='bt_ty2' style={{ paddingTop: 5, paddingLeft: 10, paddingRight: 10 }}
                                                onClick={handleRemoveAllThumbnails}>X</button>
                                            <ul id="upload_img">
                                            </ul>
                                        </td>
                                    </tr>

                                </table>
                                <div class="btn_confirm mt20" style={{ "margin-bottom": "44px", textAlign: "center" }}>
                                    <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 saveclass"
                                        onClick={(e) => submitClick('file',
                                            {
                                                fileName: fileName,
                                                folderPath: path,
                                                uuid: uuid
                                            }, e)}>저장</a>
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

export default NboardRegister;