import React, { useEffect, useState } from 'react';
import Axios from '../utils/Axios';
import { Link, useParams } from 'react-router-dom';
import AxiosToastError from '../utils/AxiosToastError';
import Loading from '../components/Loading';
import NewsCard from '../components/NewsCard';

const NewsListPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const params = useParams();
  const [activeCategory, setActiveCategory] = useState(params?.category || 'all');

  const fetchNewsData = async () => {
    try {
      setLoading(true);
      const response = await Axios.get(`/news?category=${activeCategory}`);
      const { data } = response;

      if (data.success) {
        setArticles(data.articles);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await Axios.get('/news/categories');
      const { data } = response;

      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchNewsData();
  }, [activeCategory]);

  return (
    <section className='container mx-auto grid grid-cols-[250px,1fr]'>
      {/** Sidebar with categories **/}
      <div className='bg-white shadow-md p-4'>
        <h3 className='font-semibold'>Categories</h3>
        <ul>
          {categories.map((cat) => (
            <li key={cat}>
              <Link
                to={`/news/${cat}`}
                className={`block p-2 ${activeCategory === cat ? 'bg-green-100' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/** News Articles **/}
      <div className='p-4'>
        <h2 className='text-2xl font-bold mb-4'>Latest News - {activeCategory}</h2>
        {loading ? <Loading /> : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {articles.map((article, index) => (
              <NewsCard key={article.id + index} data={article} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsListPage;
