
import {Routes, Route} from 'react-router-dom';


import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import Navbar from './components/Navbar';
import RegisterPage from './Pages/RegisterPage';
import SamplePage from './Pages/SamplePage';



function App() {


  return (


    <Routes>

      <Route 
      path="/" 
      element=
      {<>
        <Navbar></Navbar>
        <HomePage />
      </>
    } 
      />



      <Route path="/login" 
      element={
      <>
      <Navbar></Navbar>
      <LoginPage />

      </>
      } 
      />
      <Route path="/register" 
      element={
      <>
      <Navbar></Navbar>
      <RegisterPage />

      </>
      } 
      />
      <Route path="/test" 
      element={
      <>
      <Navbar></Navbar>
        <SamplePage></SamplePage>

      </>
      } 
      />


   

    </Routes>
  );
}

export default App;
