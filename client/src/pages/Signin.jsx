import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'

const SignIn = () => {

  const [formData, setFormdata] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormdata({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
  
      const data = await res.json();
  
      //console.log(data)

      if(data.success === false){
        setError(data.message);
        setIsLoading(false);
        return
      }

      setIsLoading(false);
      setError('');

      navigate('/')

    } catch (error) {
      setIsLoading(false);
      setError(error.message)
    }
  }

  // console.log(formData)

  return (
    <div className='mx-auto p-3 max-w-lg'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>

      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type="email" placeholder='Email' className='border p-3 rounded-lg' id="email" onChange={handleChange} />
        <input type="password" placeholder='Password' className='border p-3 rounded-lg' id="password" onChange={handleChange} />
      
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:80' onChange={handleChange}  disabled={isLoading}>{isLoading ? 'Loading...' : 'Sign Up'}</button>
      </form>

      <div className="flex gap-2 mt-5">
        <p>Dont have an account?</p>
        <Link to="/sign-up"><span className='text-blue-700'>Sign in</span></Link>
      </div>

      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

export default SignIn
