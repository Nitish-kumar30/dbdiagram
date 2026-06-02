import React from 'react'
import { Input  } from '@heroui/react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name  , setName] = React.useState("");

  const [email , setEmail] = React.useState("");
  const [password , setPassword] = React.useState("");
  
  const [error , setError] = React.useState("");

  const register = async (event) => {
    event.preventDefault();
    setError("");

    try{
      const res = await api.post("/auth/register", { name, email, password });

      localStorage.setItem("token", res.data.token);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
    }catch(error){

      setError(error.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className='bg-slate-900  min-w-full  h-[100vh] '>
      <form onSubmit={register} className='bg-white w-1/3 mx-auto h-[100vh] flex flex-col gap-5  px-5'>
            

          <div>Create your account</div>

          <div>
            <div>Name :</div>
            <Input value={name} onChange={(event) => setName(event.target.value)} className="w-full" placeholder='enter your name' />
          </div>

           <div>
            <div>email :</div>
            <Input value={email} onChange={(event) => setEmail(event.target.value)} className="w-full" placeholder='enter your email' />
          </div>

          <div>
            <div>password :</div>
            <Input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="w-full bg-gray-300  " placeholder='enter your password' />
          </div>
          {error && <div className='text-red-500'>{error}</div>}

          <button className='bg-blue-400 w-full py-4px rounded-md'>
            Sign Up
          </button>

          <div className='flex '>
            Alreay have  an  account ?
            <Link to="/login">
                <p className='hover:underline'>Sign In</p>
            </Link>
            
          </div>






      </form>

      
      
    </div>
  )
}

export default RegisterPage
