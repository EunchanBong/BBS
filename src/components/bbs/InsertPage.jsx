import React, { useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { app } from '../../firebaseInit'
import { getFirestore, addDoc, collection } from 'firebase/firestore'
import moment from 'moment'
import '../Paging.css'

const InsertPage = () => {
    const db = getFirestore(app);

    const [form, setForm] = useState({
        title:'',
        contents:''
    });

    const {title, contents} = form;

    const onChangeForm = (e) => {
        setForm({...form, [e.target.name]:e.target.value});
    };

    const onInsert = async() => {
        if(title==="" || contents===""){
            alert("제목 및 내용을 입력해주세요.");
            return;
        }
        if(!window.confirm("등록하시겠습니까?")){
            return;
        }
        //게시글 등록 프로세스
        const data = {
            email: sessionStorage.getItem("email"),
            title,
            contents,
            date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        };
        // console.log(data);
        await addDoc(collection(db, 'posts'), data);
        window.location.href = '/bbs'
      
    };

    return (
        <Row className='my-5 justify-content-center'>
            <Col>
                <h1>글쓰기</h1>
                <div className='mt-5'>
                    <Form.Control name='title' value={title} onChange={onChangeForm} placeholder='제목을 입력하세요.' className='mb-2'/>
                    <Form.Control name='contents' value={contents} onChange={onChangeForm} as="textarea" rows={10} placeholder='내용을 입력하세요.'/>
                    <div className='mt-3 text-center'>
                        <Button onClick={onInsert} className='px-5 me-2'>등록</Button>
                        <Button variant='secondary' className='px-5'>취소</Button>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

export default InsertPage