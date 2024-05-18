
import './App.css';
import About from './components/About';
import Bottom from './components/Bottom';
import Top from './components/Top';
import { Container } from 'react-bootstrap';
import Menu from './components/Menu';

function App() {
  return (
    <Container>
        <Top/>
        <Menu/>
        <Bottom/>
    </Container>
  );
}

export default App;
