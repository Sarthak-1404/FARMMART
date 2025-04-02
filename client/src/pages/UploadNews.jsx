import React, { useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { MdDelete } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import AddFieldComponent from '../components/AddFieldComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';

const UploadNews = () => {
  const [data, setData] = useState({
    title: '',
    content: '',
    image: [],
    category: [],
    tags: [],
    additional_fields: {},
  });

  const [imageLoading, setImageLoading] = useState(false);
  const [viewImageURL, setViewImageURL] = useState('');
  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageLoading(true);
    try {
      const response = await uploadImage(file);
      const imageUrl = response.data.data.url;
      setData((prev) => ({ ...prev, image: [...prev.image, imageUrl] }));
    } catch (error) {
      console.error(error);
    }
    setImageLoading(false);
  };

  const handleDeleteImage = (index) => {
    const updatedImages = [...data.image];
    updatedImages.splice(index, 1);
    setData((prev) => ({ ...prev, image: updatedImages }));
  };

  const handleAddField = () => {
    if (fieldName.trim()) {
      setData((prev) => ({
        ...prev,
        additional_fields: { ...prev.additional_fields, [fieldName]: '' },
      }));
      setFieldName('');
      setOpenAddField(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({ ...SummaryApi.createNews, data });
      if (response.data.success) {
        successAlert(response.data.message);
        setData({ title: '', content: '', image: [], category: [], tags: [], additional_fields: {} });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className='p-4 bg-white shadow-md'>
      <h2 className='font-semibold mb-4'>Upload News Article</h2>
      <form onSubmit={handleSubmit} className='grid gap-4'>
        <input type='text' name='title' value={data.title} onChange={handleChange} placeholder='Enter News Title' className='p-2 border rounded'/>
        <textarea name='content' value={data.content} onChange={handleChange} placeholder='Enter News Content' rows='5' className='p-2 border rounded'></textarea>
        
        <label className='block'>Upload Images</label>
        <label htmlFor='newsImage' className='cursor-pointer flex items-center justify-center p-4 border rounded bg-gray-100'>
          {imageLoading ? <Loading /> : <><FaCloudUploadAlt size={35} /><p>Upload Image</p></>}
          <input type='file' id='newsImage' className='hidden' accept='image/*' onChange={handleUploadImage} />
        </label>

        <div className='flex flex-wrap gap-4'>
          {data.image.map((img, index) => (
            <div key={index} className='relative w-20 h-20'>
              <img src={img} alt='News' className='w-full h-full object-cover' onClick={() => setViewImageURL(img)} />
              <button type='button' className='absolute top-0 right-0 p-1 bg-red-500 text-white' onClick={() => handleDeleteImage(index)}><MdDelete /></button>
            </div>
          ))}
        </div>

        {Object.keys(data.additional_fields).map((key, index) => (
          <div key={index} className='grid gap-1'>
            <label>{key}</label>
            <input type='text' value={data.additional_fields[key]} onChange={(e) => {
              setData((prev) => ({
                ...prev,
                additional_fields: { ...prev.additional_fields, [key]: e.target.value },
              }));
            }} className='p-2 border rounded'/>
          </div>
        ))}

        <button type='button' onClick={() => setOpenAddField(true)} className='p-2 bg-blue-500 text-white rounded'>Add Field</button>
        <button type='submit' className='p-2 bg-green-500 text-white rounded'>Submit</button>
      </form>

      {viewImageURL && <ViewImage url={viewImageURL} close={() => setViewImageURL('')} />}

      {openAddField && (
        <AddFieldComponent value={fieldName} onChange={(e) => setFieldName(e.target.value)} submit={handleAddField} close={() => setOpenAddField(false)} />
      )}
    </section>
  );
};

export default UploadNews;