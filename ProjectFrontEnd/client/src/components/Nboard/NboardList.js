import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import $ from 'jquery';
import Swal from 'sweetalert2'

class NboardList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            responseNboardList: '',
            append_NboardList: '',
            currentPage: 1,
            totalPages: '',
            startPage: '',
            endPage: '',
            keyword: '',
            searchtype: ''
        }
    }

    componentDidMount() {
        this.callNboardListApi(this.state.currentPage)
    }

    callNboardListApi = async (page) => {
        axios.get(`/api/nBoard/list?page=${page}&searchType=${this.state.searchtype}&keyword=${this.state.keyword}`)
            .then(response => {
                try {
                    this.setState({ responseNboardList: response });
                    this.setState({ append_NboardList: this.nBoardListAppend() });
                    this.setState({ totalPages: response.data.pageMaker.totalPage });
                    this.setState({ startPages: response.data.pageMaker.startPage });
                    this.setState({ endPages: response.data.pageMaker.endPage });
                } catch (error) {
                    alert('작업중 오류가 발생하였습니다1.');
                }
            })
            .catch(error => { alert('작업중 오류가 발생하였습니다2.'); return false; });
    }

    handlePageClick = (page) => {
        this.setState({ currentPage: page }, () => {
            this.callNboardListApi(page);
        });
    }

    renderPagination = () => {
        const { currentPage, totalPages } = this.state;
        const pagesPerGroup = 5; // 페이지 그룹 당 페이지 수
        const pageNumbers = [];
        const currentPageGroup = Math.ceil(currentPage / pagesPerGroup);
        const startPage = this.state.startPage;
        const endPage = this.state.endPage;


        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <button style={{ margin: 5 }} className="sch_bt99 wi_au" key={i} onClick={() => this.handlePageClick(i)}>
                    {i}
                </button>
            );
        }

        const prevGroupStart = startPage - pagesPerGroup;
        const nextGroupStart = startPage + pagesPerGroup;

        return (
            <div className="Paging">
                {currentPageGroup > 1 && (
                    <button style={{ margin: 5 }} className="sch_bt99 wi_au" onClick={() => this.handlePageClick(prevGroupStart)}>
                        {'<'}
                    </button>
                )}
                {pageNumbers}
                {endPage < totalPages && (
                    <button style={{ margin: 5 }} className="sch_bt99 wi_au" onClick={() => this.handlePageClick(nextGroupStart)}>
                        {'>'}
                    </button>
                )}
            </div>
        );
    }


    nBoardListAppend = () => {
        let result = []
        var nBoardList = this.state.responseNboardList.data.list
        // var jsonString = JSON.stringify(nBoardList)
        // alert(jsonString);

        for (let i = 0; i < nBoardList.length; i++) {
            var data = nBoardList[i]
            const formattedDate = new Date(data.regidate).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                // hour: '2-digit',
                // minute: '2-digit',
                // second: '2-digit',
                // timeZoneName: 'short'
            });

            result.push(
                <tr class="hidden_type">
                    <td>{data.bno}</td>
                    <td>{data.title}{'['}{data.replyCnt}{']'}</td>
                    <td>{data.writer}</td>
                    <td>{data.viewCnt}</td>
                    <td>{formattedDate}</td>
                </tr>
            )
        }
        return result
    }

    handleSearchValChange = (e) => {
        this.setState({ keyword: e.target.value });
    };

    handleSearchTypeChange = (e) => {
        this.setState({ searchtype: e.target.value });
    };

    
    render() {
        return (
            <section class="sub_wrap" >
                <article class="s_cnt mp_pro_li ct1 mp_pro_li_admin">
                    <div class="li_top">
                        <h2 class="s_tit1">공 지 사 항</h2>
                        <div class="li_top_sch af">
                            <Link to={'/NboardRegister'} className="sch_bt2 wi_au">글쓰기</Link>
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
                    <br></br>
                    {this.renderPagination()}
                    <br></br>
                    <div className="searchingForm" >
                    <form onSubmit={this.callNboardListApi(this.state.currentPage)}>
                        <select value={this.state.searchtype} onChange={this.handleSearchTypeChange}>
                            <option value="">선택</option>
                            <option value="t">제목</option>
                            <option value="c">내용</option>
                            <option value="w">작성자</option>
                        </select>
                        <input
                            type="text"
                            placeholder="검색어를 입력해주세요."
                            value={this.state.keyword}
                            onChange={this.handleSearchValChange}
                        />
                        <button type="submit" className="sch_bt99 wi_au">검색</button>
                    </form>
                    </div>
                </article>
            </section>
        );
    }
}

export default NboardList;