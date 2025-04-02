import React, { useEffect, useState } from 'react'
import { IoSearch } from "react-icons/io5";
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { FaArrowLeft } from "react-icons/fa";
import useMobile from '../hooks/useMobile';

const Search = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isSearchPage,setIsSearchPage] = useState(false)
    const [isMobile] = useMobile()
    const [searchParams] = useSearchParams()
    const searchText = searchParams.get('q') || ''

    useEffect(()=>{
        const isSearch = location.pathname === "/search"
        setIsSearchPage(isSearch)
    },[location])

    const redirectToSearchPage = ()=>{
        navigate("/search")
    }

    const handleOnChange = (e)=>{
        const value = e.target.value
        const url = `/search?q=${value}`
        navigate(url)
    }

    return (
        <div className='w-full min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-lg border overflow-hidden flex items-center text-neutral-500 bg-slate-50 group focus-within:border-blue-800 '>
            <div>
                {
                    (isMobile && isSearchPage ) ? (
                        <Link to={"/"} className='flex justify-center items-center h-full p-2 m-1 group-focus-within:text-blue-800 bg-white rounded-full shadow-md'>
                            <FaArrowLeft size={20}/>
                        </Link>
                    ) :(
                        <button className='flex justify-center items-center h-full p-3 group-focus-within:text-blue-800'>
                            <IoSearch size={22}/>
                        </button>
                    )
                }
            </div>
            <div className='w-full h-full'>
                {!isSearchPage ? (
                    //not in search page
                    <div onClick={redirectToSearchPage} className='w-full h-full flex items-center'>
                        <TypeAnimation
                            sequence={[
                                'Search "Milk"',
                                1000,
                                'Search "Carrot"',
                                1000,
                                'Search "Sugarcane"',
                                1000,
                                'Search "Panner"',
                                1000,
                                'Search "Cocanut"',
                                1000,
                                'Search "Curd"',
                                1000,
                                'Search "Rice"',
                                1000,
                                'Search "Egg"',
                                1000,
                                'Search "Chilly"',
                            ]}
                            wrapper="span"
                            speed={50}
                            repeat={Infinity}
                        />
                    </div>
                ) : (
                    //when in search page
                    <div className='w-full h-full'>
                        <input
                            type='text'
                            placeholder='Search for atta dal and more.'
                            autoFocus
                            value={searchText}
                            className='bg-transparent w-full h-full outline-none'
                            onChange={handleOnChange}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Search
