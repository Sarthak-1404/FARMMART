import React, { useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { MdDelete } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { IoClose } from 'react-icons/io5';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';

const EditNewsAdmin = ({ close, data: propsData, fetchNewsData }) => {
  const [data, setData] = useState({
    _id: propsData._id,
    title: propsData.title,
    content: propsData.content,
    image: propsData.image,
    tags: propsData.tags || [],
    author: propsData.author,
    publishedAt: propsData.publishedAt,
  });

  const [imageLoading, setImageLoading] = useState(false);
  const [ViewImageURL, setViewImageURL] = useState('');
  const [tagInput, setTagInput] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageLoading(true);
    const response = await uploadImage(file);
    const { data: ImageResponse } = response;
    const imageUrl = ImageResponse.data.url;
    setData((prev) => ({ ...prev, image: imageUrl }));
    setImageLoading(false);
  };

  const handleDeleteImage = () => {
    setData((prev) => ({ ...prev, image: '' }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !data.tags.includes(tagInput)) {
      setData((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (index) => {
    const updatedTags = [...data.tags];
    updatedTags.splice(index, 1);
    setData((prev) => ({ ...prev, tags: updatedTags }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.updateNewsDetails,
        data,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        successAlert(responseData.message);
        close?.();
        fetchNewsData();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className='fixed inset-0 bg-black bg-opacity-70 p-4 flex justify-center items-start overflow-y-auto'>
      <div className='bg-white w-full max-w-2xl p-4 rounded-lg my-4 relative'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='font-semibold'>Edit News Article</h2>
          <button onClick={close} className="hover:bg-gray-100 p-1 rounded-full">
            <IoClose size={20} />
          </button>
        </div>
        <form className='grid gap-4' onSubmit={handleSubmit}>
          <div className='grid gap-1'>
            <label htmlFor='title'>Title</label>
            <input
              id='title'
              type='text'
              name='title'
              value={data.title}
              onChange={handleChange}
              required
              className='p-2 border rounded'
            />
          </div>
          <div className='grid gap-1'>
            <label htmlFor='content'>Content</label>
            <textarea
              id='content'
              name='content'
              value={data.content}
              onChange={handleChange}
              rows='6'
              required
              className='p-2 border rounded'
            ></textarea>
          </div>
          <div className='grid gap-1'>
            <label>Image</label>
            <label htmlFor='newsImage' className='border p-4 flex justify-center items-center cursor-pointer'>
              {imageLoading ? <Loading /> : <FaCloudUploadAlt size={35} />}
              <input
                type='file'
                id='newsImage'
                className='hidden'
                accept='image/*'
                onChange={handleUploadImage}
              />
            </label>
            {data.image && (
              <div className='relative mt-2'>
                <img src={data.image} alt='News' className='w-32 h-32 object-cover' onClick={() => setViewImageURL(data.image)} />
                <button onClick={handleDeleteImage} className='absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full'><MdDelete /></button>
              </div>
            )}
          </div>

          <div className='grid gap-1'>
            <label>Tags</label>
            <div className='flex gap-2'>
              <input
                type='text'
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder='Add tag'
                className='p-2 border rounded'
              />
              <button type='button' onClick={handleAddTag} className='bg-blue-500 text-white p-2 rounded'>Add</button>
            </div>
            <div className='flex flex-wrap gap-2 mt-2'>
              {data.tags.map((tag, index) => (
                <div key={index} className='flex items-center bg-gray-200 p-1 rounded'>
                  <span>{tag}</span>
                  <button onClick={() => handleRemoveTag(index)} className='ml-2 text-red-500'><IoClose /></button>
                </div>
              ))}
            </div>
          </div>

          <button type='submit' className='bg-yellow-600 text-white py-2 rounded'>Update News</button>
        </form>
        {ViewImageURL && <ViewImage url={ViewImageURL} close={() => setViewImageURL('')} />}
      </div>
    </section>
  );
};

export default EditNewsAdmin;