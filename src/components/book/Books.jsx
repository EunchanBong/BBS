import React, { useEffect, useState } from 'react'
import axios from 'axios';
import {Row, Col, Card, CardBody, CardFooter, InputGroup, Form, Button } from 'react-bootstrap';
import { FaRegSquarePlus } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { app } from '../../firebaseInit';
import { getDatabase, ref, set, get } from 'firebase/database';

const Books = () => {
    const db = getDatabase(app);
    const navi = useNavigate();
    const uid = sessionStorage.getItem("uid");
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('자연');
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState([]);
    const callAPI = async () => {
        setLoading(true);
        const url=`https://dapi.kakao.com/v3/search/book?target=title&query=${query}&size=12&page=${page}`;
        const config = {
            headers :{"Authorization":"KakaoAK 9a53a4e814c1a01fc67a897a5aaae978"}
        }
        const res = await axios.get(url, config);
        setBooks(res.data.documents);
        console.log(res.data);
        setLoading(false);
    }

    useEffect(()=>{
        callAPI();
    },[page]);

    const onSubmit =(e)=> {
        e.preventDefault();
        setPage(1);
        callAPI();
    }

    const onClickCart = (book) => {
        if (uid) {
          //장바구니에 도서 넣기
          if (
            window.confirm(`[${book.title}]\n도서를 장바구니에 담으시겠습니까?`)
          ) {
            get(ref(db, `cart/${uid}/${book.isbn}`)).then((snapshot) => {
              if (snapshot.exists()) {
                alert("이미 장바구니에 존재합니다!");
              } else {
                set(ref(db, `cart/${uid}/${book.isbn}`), { ...book });
                alert("장바구니 담기 성공!");
              }
            });
          }
        } else {
          sessionStorage.setItem("target", "/books");
          navi("/login");
        }
      };

    if(loading) return <h1 className="my-5">로딩중입니다......</h1>
    return (
        <div>
            <h1 className='my-5'>도서검색</h1>
            <Row className="mb-2">
                <Col xs={8} md={6} lg={4} >
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Form.Control onChange={(e)=>setQuery(e.target.value)}
                            placeholder='검색어' value={query}/>
                            <Button type="submit" className="btn btn-warning">검색</Button>
                        </InputGroup>
                    </form>
                </Col>
            </Row>
            <Row>
                {books.map(book=>
                    <Col key={book.isbn} xs={6} md={3} lg={2} className='mb-2'>
                        <Card>
                            <Card.Body className="d-flex justify-content-center">
                                <img src ={book.thumbnail || 'http://via.placeholder.com/120x170'}></img>
                            </Card.Body>
                            <Card.Footer>
                                <div className='ellipsis'> {book.title} </div>
                                <FaRegSquarePlus onClick={()=>onClickCart(book)} style={{color:'block',fontSize:'20px',cursor:'pointer'}}/>
                            </Card.Footer>
                        </Card>
                    </Col>
                )}
            </Row>
            <div className="text-center my-3">
                <Button onClick={()=>setPage(page-1)} disabled={page===1} className="btn btn-warning">이전</Button>
                <span className="mx-3">{page}</span>
                <Button onClick={()=>setPage(page+1)} className="btn btn-warning">다음</Button>
            </div>
        </div>
    )
}

export default Books
