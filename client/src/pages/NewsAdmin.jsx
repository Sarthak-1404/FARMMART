import React, { useEffect, useState } from 'react';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import Loading from '../components/Loading';
import NewsCardAdmin from '../components/NewsCardAdmin';
import { IoSearchOutline } from 'react-icons/io5';

const NewsAdmin = () => {
  const [newsData, setNewsData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [search, setSearch] = useState('');

  const fetchNewsData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getNews,
        data: {
          page: page,
          limit: 12,
          search: search,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setTotalPageCount(responseData.totalNoPage);
        setNewsData(responseData.data);
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
    if (page < totalPageCount) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleOnChange = (e) => {
    const { value } = e.target;
    setSearch(value);
    setPage(1);
  };

  useEffect(() => {
    const delayFetch = setTimeout(() => {
      fetchNewsData();
    }, 300);

    return () => clearTimeout(delayFetch);
  }, [search]);

  return (
    <section className=''>
      <div className='p-2 bg-white shadow-md flex items-center justify-between gap-4'>
        <h2 className='font-semibold'>News Management</h2>
        <div className='h-full min-w-24 max-w-56 w-full ml-auto bg-blue-50 px-4 flex items-center gap-3 py-2 rounded border focus-within:border-blue-800'>
          <IoSearchOutline size={25} />
          <input
            type='text'
            placeholder='Search news articles...'
            className='h-full w-full outline-none bg-transparent'
            value={search}
            onChange={handleOnChange}
          />
        </div>
      </div>

      {loading && <Loading />} 

      <div className='p-4 bg-blue-50'>
        <div className='min-h-[55vh]'>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'>
            {newsData.map((news, index) => (
              <div key={index} className="w-full">
                <NewsCardAdmin data={news} fetchNewsData={fetchNewsData} />
              </div>
            ))}
          </div>
        </div>

        <div className='flex justify-between my-4'>
          <button onClick={handlePrevious} className='border border-blue-800 px-4 py-1 hover:bg-blue-800'>Previous</button>
          <button className='w-full bg-slate-100'>{page}/{totalPageCount}</button>
          <button onClick={handleNext} className='border border-blue-800 px-4 py-1 hover:bg-blue-800'>Next</button>
        </div>
      </div>
    </section>
  );
};

export default NewsAdmin;
