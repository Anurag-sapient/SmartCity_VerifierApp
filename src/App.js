import './App.css';
import Document from './components/documents/Document';
import Users from './components/documents/Users';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import background from "./images/bck.jpg";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from './images/download.png';

function App() {
  const myStyle={
    backgroundImage: `url(${background})`,
    backgroundSize: 'cover',
  }
  return (
    <Router>
      <div>
          <div className="sidebar">
            <div className="logo_container">
              <img
                className="logo_img"
                alt="Org Logo"
                width={50}
                height={50}
                src="https://cdn-images-1.medium.com/max/1200/1*1NkKwu_B8cRc-vjE-Ovc9A.png"
              />
              <h3 className="text_style">Publicis Sapient</h3>
            </div>
          </div>
      </div>
      {/* style={{ backgroundImage: `url(${background})`,backgroundSize: 'cover' }} */}
      <div className="main" >
        {/* <div>
          <h1>Document Verification</h1>
          <br/>
        </div> */}

        <div >
          <Route exact path='/' component={Users} />
        </div>

        <div style={{ marginTop: 20 }}>
          <Route exact path='/document/:id' component={Document} />
        </div>
        
      </div>
    </Router>
    
  );
}

export default App;
