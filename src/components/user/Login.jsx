import React, { useState } from 'react'
import { Row, Col, Form, InputGroup, Card, Button } from 'react-bootstrap'
import {app} from '../../firebaseInit'
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const navi = useNavigate();
    const [loading, setLoading] = useState(false);
    const auth = getAuth(app);
    const [form, setForm] = useState({
            email : 'blue@test.com',
            pass : '12341234'
    });
    const { email, pass } = form;
    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:e.target.value
        })
    }
    const onSubmit = (e) => {
        e.preventDefault();
        if(email === "" || pass === "") {
            alert("이메일과 비밀번호를 입력하세요!");
        } else {
            //로그인 체크
            setLoading(true);
            signInWithEmailAndPassword(auth, email, pass)
            .then(success=>{
                alert('로그인 성공!');
                setLoading(false);
                sessionStorage.setItem('email', email);
                sessionStorage.setItem('uid', success.user.uid);
                if(sessionStorage.getItem('target')){
                    navi(sessionStorage.getItem('target'));
                }else{
                    navi("/");
                }
            })
            .catch(error=>{
                alert('에러 : ' + error.message);
                setLoading(false);
            })
            
        }
    }

    if(loading) return  <h3 className="my-5 text-center">로딩중입니다 ...</h3>
    return (
        <Row className='my-5 justify-content-center'>
            <Col md={6} lg={4}>
                <Card>
                    <Card.Header>
                        <h3 className='text-center'>로그인</h3>
                    </Card.Header>
                    <Card.Body>
                        <form onSubmit={onSubmit}>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text style={{ width: 100 }} className='justify-content-center' 
                                >이메일</InputGroup.Text>
                                <Form.Control name="email" placeholder='이메일을 입력해주세요.' 
                                value={email} onChange={onChange}></Form.Control>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text style={{ width: 100 }} className='justify-content-center'>비밀번호</InputGroup.Text>
                                <Form.Control name="pass" type="password"  placeholder='비밀번호를 입력해주세요.' 
                                value={pass} onChange={onChange}></Form.Control>
                            </InputGroup>
                            <div>
                                <Button className='my-2 w-100 btn-secondary' type='submit'>로그인</Button>
                            </div>
                            <div>
                                <a href='/join'>회원가입</a>
                            </div>
                        </form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default Login
