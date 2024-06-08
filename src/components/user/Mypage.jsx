import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Button, InputGroup, Form } from 'react-bootstrap'
import { app } from '../../firebaseInit';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'
import ModalAddress from './ModalAdd';
import ModalPhoto from './ModalPhoto';

const Mypage = () => {
    const [loading, setLoading] = useState(false);
    const db = getFirestore(app);
    const uid = sessionStorage.getItem('uid');
    const [form, setForm] = useState({
        email:sessionStorage.getItem('email'),
        name:'홍길동',
        phone:'010-0000-0000',
        address1:'경기도 시흥 장현장곡로 10 유승한내들',
        address2:'1605동 301호'
    });

    const {name, phone, address1, address2} = form;

    const onChangeForm = (e) => {
        setForm({...form, [e.target.name]:e.target.value});

    }

    const onSubmit = async (e) => {
        e.preventDefault();
        if(name===''){
            alert('이름을 입력하세요.')
            return;
        }

        if(!window.confirm('변경된 내용을 저장하실래요?')) return;
        console.log(form)
        setLoading(true);
        await setDoc(doc(db, `users/${uid}`), form);
        setLoading(false);
    }

    const callAPI = async () => {
        setLoading(true)
        const res = await getDoc(doc(db, `users/${uid}`));
        if(res.data()){
            setForm(res.data());
        }
        setLoading(false)
    }

    useEffect(()=>{
        callAPI();
    }, [])

    if(loading) return <h1 className='text-center my-5'>로딩중...</h1>
    return (
        <Row className='justify-content-center my-5'>
            <Col xs={12} md={10} lg={8}>
                <Card>
                    <Card.Header>
                        <h3 className='text-center'>마이페이지</h3>
                    </Card.Header>
                    <Card.Body>
                        <div>
                            <ModalPhoto setLoading={setLoading} form={form} setForm={setForm}/>
                        </div>
                        <form onSubmit={onSubmit}>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text>이름</InputGroup.Text>
                                <Form.Control name='name' value={name} onChange={onChangeForm}/>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text>전화</InputGroup.Text>
                                <Form.Control name='phone' value={phone} onChange={onChangeForm}/>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text>주소</InputGroup.Text>
                                <Form.Control name='address1' value={address1} onChange={onChangeForm}/>
                                <ModalAddress form={form} setForm={setForm}/>
                            </InputGroup>
                            <Form.Control name='address2' value={address2} onChange={onChangeForm} placeholder='상세주소'/>
                            <div className='text-center mt-3' >
                                <Button className='ms-2 px-5' type='submit'>저장</Button>
                                <Button variant='secondary' className='ms-2 px-5'>취소</Button>
                            </div>
                        </form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default Mypage