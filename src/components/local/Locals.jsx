import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Table, Row, Col, InputGroup, Form, Button } from 'react-bootstrap'
import { app } from '../../firebaseInit';
import { getDatabase, ref, set, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';


const Locals = () => {
    const navi = useNavigate();
    const db = getDatabase(app);
    const uid=sessionStorage.getItem('uid');

    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('인하대학교');
    const [page, setPage] = useState(1);
    const [locals, setLocals] = useState([]);

    const callAPI = async () => {
        setLoading(true);
        const url=`https://dapi.kakao.com/v2/local/search/keyword.json?query=${query}&size=10&page=${page}`;
        const config = {
            headers :{"Authorization":"KakaoAK 9a53a4e814c1a01fc67a897a5aaae978"}
        }
        const res = await axios.get(url, config);
        setLocals(res.data.documents);
        console.log(res.data.documents);
        setLoading(false);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if(query===""){
            alert('검색어를 입력하세요.');
        }else{
            callAPI();
        }
    }

    const onClickFavorite = async (local) => {
        if(!uid){
            sessionStorage.setItem('target', '/locals');
            navi('/login');
            return;
        }
        if(window.confirm("즐겨찾기에 추가하실래요?")){
            console.log(local);
            setLoading(true);
            await get(ref(db, `favorite/${uid}/${local.id}`)).then(async snapshot=>{
                if(snapshot.exists()){
                    alert("이미 즐겨찾기에 등록되었습니다.");
                }else{
                    await set(ref(db, `favorite/${uid}/${local.id}`), local);
                    alert("즐겨찾기에 등록되었습니다.");
                }
            });
            setLoading(false);
        }
    }

    useEffect(()=>{
        callAPI();
    },[]);


    if(loading) return <h1 className='my-5'>로딩중입니다......</h1>

    return (
        <div>
            <h1 className='my-5'>지역검색</h1>
            <Row className="mb-2">
                <Col xs={8} md={6} lg={4}>
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Form.Control 
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder='검색어' 
                                value={query}
                            />
                            <Button type="submit" className="btn btn-warning">검색</Button>
                        </InputGroup>
                    </form>
                </Col>
            </Row>

            <Table striped bordered hover>
                <thead>
                    <tr className='text-center'>
                        <td>ID</td>
                        <td>장소명</td>
                        <td>주소</td>
                        <td>전화</td>
                        <td>즐겨찾기</td>
                    </tr>
                </thead>
                <tbody>
                    {locals.map(local =>
                        <tr key={local.id}>
                            <td>{local.id}</td>
                            <td>{local.place_name}</td>
                            <td>{local.address_name}</td>
                            <td>{local.phone}</td>
                            <td><Button onClick={() => onClickFavorite(local)}>즐겨찾기추가</Button></td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
}

export default Locals