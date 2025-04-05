import React from 'react'
import { FaGithub } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className='border-t'>
        <div className='container mx-auto p-4 text-center flex flex-col lg:flex-row lg:justify-between gap-2'>
            <p>© All Rights Reserved 2024.</p>

            <div className='flex items-center gap-4 justify-center text-2xl'>
                <a href='https://github.com/Sarthak-1404' className='hover:text-blue-800'>
                    <FaGithub/>
                </a>
                <a href='#' className='hover:text-blue-800'>
                    <FaInstagram/>
                </a>
                <a href='https://www.linkedin.com/in/sarthak-londhe-92b023285/' className='hover:text-blue-800'>
                    <FaLinkedin/>
                </a>
            </div>
        </div>
    </footer>
  )
}

export default Footer
