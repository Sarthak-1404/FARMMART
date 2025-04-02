import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa6';
import Divider from '../components/Divider';

const NewsDisplayPage = () => {
  const params = useParams();
  const newsId = params?.news?.split('-')?.slice(-1)[0];
  const [data, setData] = useState({
    title: '',
    images: [],
    content: '',
    publishedAt: '',
    author: '',
    source: ''
  });
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const imageContainer = useRef();

  const fetchNewsDetails = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getNewsDetails,
        data: { newsId }
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsDetails();
  }, [params]);

  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 100;
  };

  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 100;
  };

  return (
    <section className='container mx-auto p-4 grid lg:grid-cols-2'>
      {/* Image Section */}
      <div>
        <div className='bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded'>
          <img
            src={data.images[currentImage]}
            alt={data.title}
            className='w-full h-full object-scale-down'
          />
        </div>
        <div className='flex items-center justify-center gap-3 my-2'>
          {data.images.map((_, index) => (
            <div
              key={index}
              className={`bg-slate-200 w-3 h-3 rounded-full ${index === currentImage ? 'bg-slate-400' : ''}`}
            ></div>
          ))}
        </div>
        <div className='grid relative'>
          <div ref={imageContainer} className='flex gap-4 overflow-x-auto scrollbar-none'>
            {data.images.map((img, index) => (
              <div key={index} className='w-20 h-20 cursor-pointer'>
                <img
                  src={img}
                  alt={`Preview ${index}`}
                  onClick={() => setCurrentImage(index)}
                  className='w-full h-full object-scale-down'
                />
              </div>
            ))}
          </div>
          <div className='w-full hidden lg:flex justify-between absolute items-center'>
            <button onClick={handleScrollLeft} className='bg-white p-1 rounded-full shadow-lg'>
              <FaAngleLeft />
            </button>
            <button onClick={handleScrollRight} className='bg-white p-1 rounded-full shadow-lg'>
              <FaAngleRight />
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className='p-4'>
        <h2 className='text-2xl font-bold'>{data.title}</h2>
        <p className='text-sm text-gray-500'>By {data.author || 'Unknown'} | {new Date(data.publishedAt).toLocaleDateString()}</p>
        <p className='text-sm text-gray-400'>Source: {data.source}</p>
        <Divider />
        <p className='text-base'>{data.content}</p>
      </div>
    </section>
  );
};

export default NewsDisplayPage;