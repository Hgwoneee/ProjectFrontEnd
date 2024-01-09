import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import $ from 'jquery';
import Swal from 'sweetalert2'
import cookie from 'react-cookies';
import Modal from 'react-modal';

class NboardRead extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bno: props.match.params.bno,
            selectedFile: null,
            memNickName: cookie.load('memNickName'),
            thumbnailURL: '',
            title: '',
            content: '',
            writer: '',
            viewCnt: '',
            regidate: '',
            imageDTOList: [],
            modalIsOpen: false,
            selectedImage: '',
            imageList: [],
            replyer: '',
            replyText: '',
            reply_checker: '',
            isEditModalOpen: false,
            editedContent: ''
        }
    }

    componentDidMount() {
        this.callNboardInfoApi();
        this.callReplyListApi(this.state.bno);
        $("#modifyButton").hide();
        $("#replyerDiv").hide();
        $("#bNoDiv").hide();
    }

    callNboardInfoApi = async () => {


        axios.post('/api/nBoard/read', {
            bNo: this.state.bno,
        })
            .then(response => {
                try {
                    var data = response.data
                    this.setState({ imageList: data.imageDTOList });
                    this.setState({ title: data.title })
                    this.setState({ content: data.content })
                    this.setState({ writer: data.writer })
                    this.setState({ viewCnt: data.viewCnt })
                    this.setState({ regidate: data.regidate })
                    this.setState({ imageDTOList: data.imageDTOList })
                    if (this.state.memNickName == this.state.writer) {
                        $("#modifyButton").show();
                    }
                }
                catch (error) {
                    alert('게시글데이터 받기 오류')
                }
            })
            .catch(error => { alert('게시글데이터 받기 오류2'); return false; });

    }

    handleThumbnailClick = (thumbnailURL) => {
        this.setState({ modalIsOpen: true, selectedImage: thumbnailURL });
    };

    closeImageModal = () => {
        this.setState({ modalIsOpen: false, selectedImage: '' });
    };


    renderImages = () => {
        const { imageList } = this.state;

        return imageList.map((image, index) => (
            <li className="hidden_type" key={index}>
                <img
                    src={`/display?fileName=${image.thumbnailURL}`}
                    alt={`썸네일 ${index}`}
                    onClick={() => this.handleThumbnailClick(image.imageURL)}
                />
            </li>
        ));
    };



    deleteArticle = (e) => {

        this.sweetalertDelete1('삭제하시겠습니까?', function () {
            axios.post('/api/nBoard/delete', {
                bNo: this.state.bno
            })
                .then(response => {
                }).catch(error => { alert('작업중 오류가 발생하였습니다.'); return false; });
        }.bind(this))
    }

    sweetalertDelete1 = (title, callbackFunc) => {
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

    submitClick = async (e) => {

        this.reply_checker = $('#replyTextVal').val();

        this.fnValidate = (e) => {
            if (this.reply_checker === '') {
                $('#replyTextVal').addClass('border_validate_err');
                this.sweetalert('댓글내용을 입력해주세요.', '', 'error', '닫기')
                return false;
            }
            $('#replyTextVal').removeClass('border_validate_err');
            return true;
        }

        if (this.fnValidate()) {
            var jsonstr = $("form[name='frm2']").serialize();
            jsonstr = decodeURIComponent(jsonstr);
            var Json_form = JSON.stringify(jsonstr).replace(/\"/gi, '')
            Json_form = "{\"" + Json_form.replace(/\&/g, '\",\"').replace(/=/gi, '\":"') + "\"}";
            var Json_data = JSON.parse(Json_form);

            alert(JSON.stringify(Json_data));

            axios.post('/api/reply/add', Json_data)
                .then(response => {
                    try {
                        if (response.data == "SUCCESS") {
                            this.sweetalert('등록되었습니다.', '', 'success', '확인')
                            setTimeout(function () {
                                window.location.reload();
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

    callReplyListApi = async (bno) => {
        axios.get(`/api/reply/list/${bno}`)
            .then(response => {
                try {
                    this.setState({ responseReplyList: response });
                    this.setState({ append_ReplyList: this.ReplyListAppend() });
                } catch (error) {
                    alert('작업중 오류가 발생하였습니다1.');
                }
            })
            .catch(error => { alert('작업중 오류가 발생하였습니다2.'); return false; });
    }

    ReplyListAppend = () => {
        let result = []
        var ReplyList = this.state.responseReplyList.data
        // var jsonString = JSON.stringify(ReplyList)
        // alert(jsonString);

        const currentUser = this.state.memNickName;

        for (let i = 0; i < ReplyList.length; i++) {
            var data = ReplyList[i]
            const isCurrentUserCommentOwner = data.replyer === currentUser;
            const formattedDate = new Date(data.regdate).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }).split('.').join('/').replace(/\s/g, '');

            const trimmedDate = formattedDate.slice(0, -1);

            result.push(
                <li>
                    <div>
                        <img src={require(`../../img/댓글이미지.png`)}></img>
                    </div>
                    <div>
                        <h5>{data.replyer}</h5>
                        {data.replyText}
                    </div>
                    <div>
                        {trimmedDate}
                    </div>
                    <div>
                        {isCurrentUserCommentOwner && (
                            <div>
                                <button className="bt_ty bt_ty2 submit_ty1 saveclass" onClick={() => this.editComment(i)}>수정</button>
                                <button className="bt_ty bt_ty2 submit_ty1 saveclass" onClick={() => this.deleteComment(data.rno)}>삭제</button>
                            </div>
                        )}
                    </div>
                    <br></br>
                </li>
            )
        }
        return result
    }

    deleteComment = (rno) => {
        this.sweetalertDelete2('삭제하시겠습니까?', function () {
            axios.delete(`/api/reply/${rno}/${this.state.bno}`, {
                rNo: rno,
                bNo: this.state.bno
            })
                .then(response => {
                }).catch(error => { alert('작업중 오류가 발생하였습니다.'); return false; });
        }.bind(this))
    };

    sweetalertDelete2 = (title, callbackFunc) => {
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
                    window.location.reload();
                });
            } else {
                return false;
            }
            callbackFunc()
        })
    }

    

    render() {

        const formattedRegidate = new Date(this.state.regidate).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).split('.').join('/').replace(/\s/g, '');

        const trimmedRegidate = formattedRegidate.slice(0, -1);

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
                                                <input type="text" name="regiDate" id="regiDateVal" readOnly="readonly" value={trimmedRegidate} />
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
                                                <input type="text" name="title" id="titleVal" readOnly="readonly" value={this.state.title} />
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
                                                    {this.renderImages()}
                                                </ul>
                                            </td>
                                        </tr>
                                        <Modal
                                            isOpen={this.state.modalIsOpen}
                                            onRequestClose={this.closeImageModal}
                                            contentLabel="썸네일 이미지"
                                            style={{
                                                overlay: {
                                                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                                                },
                                                content: {
                                                    width: '75%', // 원하는 너비로 설정하세요
                                                    height: '75%', // 원하는 높이로 설정하세요
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '4px',
                                                    overflow: 'auto',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                                                }
                                            }}>
                                            {this.state.selectedImage && (
                                                <img src={`/display?fileName=${this.state.selectedImage}`} alt="선택한 썸네일" />
                                            )}
                                        </Modal>

                                    </table>
                                    <div id="modifyButton" class="btn_confirm mt20" style={{ "margin-bottom": "44px" }}>
                                        <Link to={`/NboardModify/${this.state.bno}`} className="bt_ty bt_ty2 submit_ty1 saveclass">수정</Link>
                                        <a href='javascript:' className="bt_ty bt_ty2 submit_ty1 saveclass"
                                            onClick={(e) => this.deleteArticle(e)}>삭제</a>
                                    </div>
                                </div>
                            </article>
                        </form>
                        <div>댓글</div>
                        <form name="frm2" id="frm2" action="" onsubmit="" method="post">
                            <table class="table_ty1">
                                <tr id='bNoDiv'>
                                    <td>
                                        <input type="text" name="bNo" id="bnoVal" value={this.state.bno} />
                                    </td>
                                </tr>
                                <tr id='replyerDiv'>
                                    <td>
                                        <input type="text" name="replyer" id="replyerVal" value={this.state.memNickName} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input type="text" name="replyText" id="replyTextVal" placeholder='내용을 입력해주세요.' />
                                    </td>
                                </tr>
                            </table>
                            <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 saveclass"
                                onClick={(e) => this.submitClick(e)}>등록</a>
                        </form>
                        <div id='replyarea'>
                            <ul>
                                {this.state.append_ReplyList}
                            </ul>
                        </div>
                    </div>
                    
                </article>
            </section>
        );
    }
}

export default NboardRead;