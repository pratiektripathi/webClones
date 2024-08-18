
import { SignInFour } from './SignIn'
import { Tophead } from './components/Header'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function Home(){
  const login= True;
  return (login)?(<SignIn/>):console.log("hello");
   
}

function SignIn(){
  return (
    <SignInFour />
  )
}

function TopHead(){
  return (
    <Tophead />
  )
}

function App() {
  return (
    <Router>
    
      <Tophead />
      <Routes>
        <Route path="/" element={<SignIn />} />
      </Routes>
      </Router>
  )
}

export default App
