import { current } from '@reduxjs/toolkit'
import {useSelector} from 'react-redux'
import { useRef, useState, useEffect } from 'react'
import {getStorage, uploadBytesResumable, ref, getDownloadURL} from 'firebase/storage'
import {app} from '../firebase'

const Profile = () => {

  const fileRef = useRef(null);

  const {currentUser} = useSelector((state) => state.user)
  
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadErr, setFileUploadErr] = useState(false);
  const [formData, setFormData] = useState({});
  //console.log(filePerc)
  // console.log(file)
  console.log(formData)

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
    }

  );
  }
  
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile </h1>

      <form className='flex flex-col gap-4'>
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*' />
        <img src={formData.avatar || currentUser.avatar} alt={current.name} className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' onClick={() => fileRef.current.click()} />

        {fileUploadErr ? (
            <span className='text-red-700'>File Upload Error</span>
          ) :
          filePerc > 0 &&  filePerc < 100 ? (
          <span className='text-center text-slate-700'>{`Uploading ${filePerc} %`}</span>
          ) : filePerc === 100 && !fileUploadErr ? (<span className='text-center text-green-700'>Image Successfully Uploaded {filePerc}%</span>) : ('') 
        }

        

        <input type="text" placeholder='Username' className='border p-3 rounded-lg' id="username" />
        <input type="email" placeholder='Email' className='border p-3 rounded-lg' id="email" />
        <input type="password" placeholder='Email' className='border p-3 rounded-lg' id="password" />
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-85'>Update</button>
      </form>

      <div className="flex justify-between mt-5">
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}

export default Profile
