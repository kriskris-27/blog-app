import { assets } from '@/Assets/assets'
import Image from 'next/image'
import React from 'react'

const Footer = () => {
  return (
    <div className='flex justify-around flex-col gap-2 sm:gap-0 sm:flex-row bg-black py-5 items-center'>
      <Image src={assets.logo_light} alt='' width={120} />
      <p className='text-sm text-white'>All right reserved. Copyright @musewords</p>
        <div className='flex'>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
  <Image src={assets.insta_icon} alt="Instagram" width={40} />
</a>
        </div>
    </div>
  )
}

export default Footer
