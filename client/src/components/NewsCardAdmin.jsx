import React, { useState } from 'react';
import EditNewsAdmin from './EditNewsAdmin';
import ConfirmBox from './CofirmBox';
import { IoClose } from 'react-icons/io5';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';

const NewsCardAdmin = ({ data, fetchNewsData }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleDeleteCancel = () => {
    setOpenDelete(false);
  };

  const handleDelete = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteNews,
        data: {
          _id: data._id,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        if (fetchNewsData) {
          fetchNewsData();
        }
        setOpenDelete(false);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div className='w-full p-4 bg-white rounded shadow-md'>
      <div className='aspect-video w-full overflow-hidden rounded-md'>
        <img src={data?.image} alt={data?.title} className='w-full h-full object-cover' />
      </div>
      <h3 className='font-semibold mt-2 line-clamp-2'>{data?.title}</h3>
      <p className='text-slate-500 text-sm'>{data?.author}</p>
      <div className='grid grid-cols-2 gap-3 py-2'>
        <button onClick={() => setEditOpen(true)} className='border px-1 py-1 text-sm border-blue-600 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded'>Edit</button>
        <button onClick={() => setOpenDelete(true)} className='border px-1 py-1 text-sm border-red-600 bg-red-100 text-red-600 hover:bg-red-200 rounded'>Delete</button>
      </div>

      {editOpen && (
        <div className="fixed inset-0 z-[90]">
          <EditNewsAdmin fetchNewsData={fetchNewsData} data={data} close={() => setEditOpen(false)} />
        </div>
      )} 

      {openDelete && (
        <div className="fixed inset-0 z-[100]">
          <section className='fixed inset-0 bg-neutral-600 bg-opacity-70 p-4 flex justify-center items-center'>
            <div className='bg-white p-4 w-full max-w-md rounded-md relative'>
              <div className='flex items-center justify-between gap-4'>
                <h3 className='font-semibold'>Confirm Delete</h3>
                <button onClick={() => setOpenDelete(false)}>
                  <IoClose size={25} />
                </button>
              </div>
              <p className='my-2'>Are you sure you want to permanently delete this news article?</p>
              <div className='flex justify-end gap-5 py-4'>
                <button onClick={handleDeleteCancel} className='border px-3 py-1 rounded bg-red-100 border-red-500 text-red-500 hover:bg-red-200'>Cancel</button>
                <button onClick={handleDelete} className='border px-3 py-1 rounded bg-green-100 border-green-500 text-green-500 hover:bg-green-200'>Delete</button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default NewsCardAdmin;
