import { current } from '@reduxjs/toolkit'
import {useDispatch, useSelector} from 'react-redux'
import { useRef, useState, useEffect } from 'react'
import {getStorage, uploadBytesResumable, ref, getDownloadURL} from 'firebase/storage'
import {app} from '../firebase'
import {updateUserStart, updateUserSuccess, updateUserFailure, deleteUserError, deleteUserStart, deleteUserSuccess, signoutUserStart, signoutUserError, signoutUserSuccess} from '../redux/user/userSlice'

const Profile = () => {

  const fileRef = useRef(null);

  const {currentUser, loading, error} = useSelector((state) => state.user)
  
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadErr, setFileUploadErr] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if(file){
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_change', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePerc(Math.round(progress));
    },
    (error) => {
      setFileUploadErr(true);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setFormData({...formData, avatar: downloadURL});
      });
    });
  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

     console.log(currentUser._id);

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json();

      //console.log(data);

      if(data.success === false){
        dispatch(updateUserFailure(data.message))
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE"
      });

      const data = await res.json();
      console.log(data)
      if(data.success === false){
        dispatch(deleteUserError(data.message))
        return
      }

      dispatch(deleteUserSuccess(data));

    } catch (error) {
      dispatch(deleteUserError(error.message))
    }
  }

  const handleUserLogout = async () => {
    try {
      dispatch(signoutUserStart());

      const res = await fetch('/api/auth/signout')
      const data = await res.json()

      if(data.success === false){
        dispatch(signoutUserError(data.message));
        return
      }

      dispatch(signoutUserSuccess(data))

    } catch (error) {
      ispatch(signoutUserError(error.message));
    }
  }
  
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile </h1>

      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*' />
        <img src={formData.avatar || currentUser.avatar} alt={current.name} className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' onClick={() => fileRef.current.click()} />

        {fileUploadErr ? (
            <span className='text-red-700'>File Upload Error</span>
          ) :
          filePerc > 0 &&  filePerc < 100 ? (
          <span className='text-center text-slate-700'>{`Uploading ${filePerc} %`}</span>
          ) : filePerc === 100 && !fileUploadErr ? (<span className='text-center text-green-700'>Image Successfully Uploaded {filePerc}%</span>) : ('') 
        }

        

        <input type="text" placeholder='Username' className='border p-3 rounded-lg' id="username" defaultValue={currentUser.user} onChange={handleChange} />
        <input type="email" placeholder='Email' className='border p-3 rounded-lg' id="email" defaultValue={currentUser.email} onChange={handleChange} />
        <input type="password" placeholder='Password' className='border p-3 rounded-lg' id="password" onChange={handleChange} />
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-85' disabled={loading}>{loading ? 'Loading ...' : 'Update'}</button>

        <p className='text-red-700'>{error ? error : ''}</p>
        <p className='text-green-700'>{setUpdateSuccess ? 'User Updated Successfully' : ''}</p>
      </form>

      <div className="flex justify-between mt-5">
        <span className='text-red-700 cursor-pointer' onClick={handleDeleteUser}>Delete Account</span>
        <span className='text-red-700 cursor-pointer' onClick={handleUserLogout}>Sign Out</span>
      </div>
    </div>
  )
}

export default Profile
