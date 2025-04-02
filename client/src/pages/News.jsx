import React, { useEffect, useState } from 'react';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import Loading from '../components/Loading';
import { Link } from 'react-router-dom';
import { valideURLConvert } from '../utils/valideURLConvert';

const News = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNewsData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getNews,
        data: {
          page: page,
          limit: 12,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setNewsData(responseData.data);
        setTotalPages(responseData.totalNoPage);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsData();
  }, [page]);

  const handleNext = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <section className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-6'>Latest News</h1>
      
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {newsData.map((news, index) => (
          <Link 
            key={index} 
            to={`/news/${valideURLConvert(news.title)}-${news._id}`}
            className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'
          >
            <div className='aspect-video overflow-hidden'>
              <img 
                src={news.image[0]} 
                alt={news.title}
                className='w-full h-full object-cover'
              />
            </div>
            <div className='p-4'>
              <h2 className='font-semibold text-lg mb-2 line-clamp-2'>{news.title}</h2>
              <p className='text-gray-600 text-sm mb-2'>{news.author}</p>
              <p className='text-gray-500 text-sm'>
                {new Date(news.publishDate).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className='flex justify-center gap-4 mt-8'>
          <button 
            onClick={handlePrevious}
            disabled={page === 1}
            className='px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-300'
          >
            Previous
          </button>
          <span className='px-4 py-2'>
            Page {page} of {totalPages}
          </span>
          <button 
            onClick={handleNext}
            disabled={page === totalPages}
            className='px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-300'
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default News;
