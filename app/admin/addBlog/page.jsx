'use client'
import { assets } from '@/Assets/assets'
import axios from 'axios'
import Image from 'next/image'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const Page = () => {

    const [image,setImage] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [data,setData] = useState({
        title:"",
        description:"",
        category:"Startup",
        author:"Kris",
        authorImg:"/author_img.png"
    })

    const onChangeHandler = (event) =>{
        const name = event.target.name;
        const value = event.target.value;
        setData(data=>({...data,[name]:value}));
        console.log(data);
    }

    const onImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowed = ["image/jpeg","image/png","image/webp"];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowed.includes(file.type)) {
            toast.error("Only JPG, PNG, or WEBP images are allowed.");
            return;
        }
        if (file.size > maxSize) {
            toast.error("Image must be 5MB or smaller.");
            return;
        }

        setImage(file);
    }

    const onSubmitHandler = async (e) =>{
        e.preventDefault();
        if (!image) {
            toast.error("Please select an image.");
            return;
        }

        const formData = new FormData();
        formData.append('title',data.title);
        formData.append('description',data.description);
        formData.append('category',data.category);
        formData.append('author',data.author);
        formData.append('authorImg',data.authorImg);
        formData.append('image',image);
        try {
            setIsSubmitting(true);
            setUploadProgress(0);
            const response = await axios.post('/api/blog',formData,{
                onUploadProgress:(progressEvent)=>{
                    if (progressEvent.total) {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percent);
                    }
                }
            });
            if (response.data.success) {
                toast.success(response.data.msg);
                setImage(false);
                setUploadProgress(null);
                setData({
                  title:"",
                  description:"",
                  category:"Startup",
                  author:"Kris",
                  authorImg:"/author_img.png"
                });
            }
            else{
                toast.error(response.data.msg || "Error");
            }
        } catch (error) {
            console.error("Error creating blog:", error);
            toast.error(error.response?.data?.msg || "Error creating blog");
        } finally {
            setIsSubmitting(false);
        }
    }

  return (
    <>
      <form onSubmit={onSubmitHandler} className='pt-5 px-5 sm:pt-12 sm:pl-16'>
        <p className='text-xl'>Upload thumbnail</p>
        <label htmlFor="image">
            <Image className='mt-4' src={!image?assets.upload_area:URL.createObjectURL(image)} width={140} height={70} alt=''/>
        </label>
        <input onChange={onImageChange} type="file" id='image' hidden required />
        {uploadProgress !== null && (
            <p className='text-sm text-gray-600 mt-2'>Upload progress: {uploadProgress}%</p>
        )}
        <p className='text-xl mt-4'>Blog title</p>
        <input name='title' onChange={onChangeHandler} value={data.title} className='w-full sm:w-[500px] mt-4 px-4 py-3 border' type="text" placeholder='Type here' required />
        <p className='text-xl mt-4'>Blog Description</p>
        <textarea name='description' onChange={onChangeHandler} value={data.description} className='w-full sm:w-[500px] mt-4 px-4 py-3 border' type="text" placeholder='write content here' rows={6} required />
        <p className='text-xl mt-4'>Blog category</p>
        <select name="category" onChange={onChangeHandler} value={data.category} className='w-40 mt-4 px-4 py-3 border text-gray-500'>
            <option value="Startup">Startup</option>
            <option value="Technology">Technology</option>
            <option value="Lifestyle">Lifestyle</option>
        </select>
        <br />
        <button type="submit" disabled={isSubmitting} className='mt-8 w-40 h-12 bg-black text-white disabled:opacity-60'>
            {isSubmitting ? 'Uploading...' : 'ADD'}
        </button>
      </form>
    </>
  )
}

export default Page
