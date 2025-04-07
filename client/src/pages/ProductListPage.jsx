import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { Link, useParams } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from '../components/Loading'
import CardProduct from '../components/CardProduct'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'

const ProductListPage = () => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPage, setTotalPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const params = useParams()
  const AllSubCategory = useSelector(state => state.product.allSubCategory)
  const [DisplaySubCatory, setDisplaySubCategory] = useState([])
  const [productsBySubcategory, setProductsBySubcategory] = useState({})
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null)

  console.log("URL params:", params);

  // Extract category information
  const category = params?.category?.split("-")
  const categoryName = category?.slice(0, category?.length - 1)?.join(" ")
  const categoryId = category?.slice(-1)[0]

  // Extract subcategory information (if available)
  const hasSubCategory = !!params.subCategory;
  const subCategory = params?.subCategory?.split("-")
  const subCategoryName = subCategory?.slice(0, subCategory?.length - 1)?.join(" ")
  const subCategoryId = hasSubCategory ? params.subCategory.split("-").slice(-1)[0] : null;


  const fetchProductdata = async () => {
    try {
      setLoading(true)
      console.log("Fetching products with params:", {
        categoryId,
        subCategoryId,
        hasSubCategory,
        page,
        limit: 8
      });
      
      // Use different API endpoint based on whether subcategory is specified
      let apiConfig = hasSubCategory ? 
        SummaryApi.getProductByCategoryAndSubCategory : 
        SummaryApi.getProductByCategory;
      
      // Set up data for API call
      let requestData = {
        page: page,
        limit: 8,
      };
      
      // Add the correct parameters based on what we're fetching
      if (hasSubCategory) {
        // Make sure we're sending the correct IDs
        requestData.categoryId = categoryId;
        requestData.subCategoryId = subCategoryId;
        
        console.log("Requesting subcategory products with:", {
          categoryId: requestData.categoryId,
          subCategoryId: requestData.subCategoryId
        });
      } else {
        // Server expects 'id' parameter for getProductByCategory API
        requestData.id = categoryId;
      }
      
      console.log("Making API request with config:", {
        url: apiConfig.url,
        method: apiConfig.method
      }, "and data:", requestData);
      
      const response = await Axios({
        ...apiConfig,
        data: requestData
      })

      const { data: responseData } = response
      console.log("Product API response:", responseData);

      if (responseData.success) {
        console.log(`Got ${responseData.data?.length || 0} products from API response`);
        
        if (responseData.page == 1) {
          setData(responseData.data || [])
        } else {
          setData(prevData => [...prevData, ...(responseData.data || [])])
        }
        setTotalPage(Math.ceil((responseData.totalCount || 0) / 8))
        setTotalCount(responseData.totalCount || 0)
      } else {
        console.error("API returned success:false:", responseData);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  // Function to fetch products for a specific subcategory
  const fetchProductsForSubcategory = async (subCatId, subCatName) => {
    try {
      console.log(`Fetching products for subcategory: ${subCatName} (${subCatId})`);
      
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId: categoryId,
          subCategoryId: subCatId,
          page: 1,
          limit: 4 // Limit to fewer products per subcategory
        }
      });

      const { data: responseData } = response;
      console.log(`Products for subcategory ${subCatName}:`, responseData);

      if (responseData.success) {
        setProductsBySubcategory(prev => ({
          ...prev,
          [subCatId]: responseData.data
        }));
      }
    } catch (error) {
      console.error(`Error fetching products for subcategory ${subCatId}:`, error);
    }
  };

  // Fetch all subcategories and their products when category changes
  useEffect(() => {
    const fetchSubcategoriesAndProducts = async () => {
      // First get all subcategories for this category
      const sub = AllSubCategory.filter(s => {
        const filterData = s.category.some(el => {
          return el._id == categoryId
        })
        return filterData ? filterData : null
      });
      
      setDisplaySubCategory(sub);
      
      // Then fetch products for each subcategory
      setProductsBySubcategory({});
      
      // Reset page when category changes
      setPage(1);
      setData([]);
      
      // Also fetch all products for the category if looking at category view
      if (!hasSubCategory) {
        fetchProductdata();
      }
      
      // For each subcategory, fetch some products
      for (const subcategory of sub) {
        await fetchProductsForSubcategory(subcategory._id, subcategory.name);
      }
    };
    
    fetchSubcategoriesAndProducts();
  }, [params.category, AllSubCategory]);

  // Fetch more products when subcategory is selected
  useEffect(() => {
    if (hasSubCategory) {
      setSelectedSubcategoryId(subCategoryId);
      // Reset page when subcategory changes
      setPage(1);
      setData([]);
      
      // Debug the subcategory request
      console.log("Subcategory selected:", {
        subCategoryId,
        subCategoryName,
        categoryId,
        categoryName
      });
      
      // Explicitly fetch products for this subcategory
      fetchProductdata();
    }
  }, [params.subCategory, categoryId, subCategoryId]);
  
  // Log when parameters change to debug navigation issues
  useEffect(() => {
    console.log("Route params changed:", {
      category: params.category,
      subcategory: params.subCategory,
      parsedCategoryId: categoryId,
      parsedSubcategoryId: subCategoryId
    });
  }, [params, categoryId, subCategoryId]);

  // This effect runs when page changes to load more products
  useEffect(() => {
    if (page > 1) {
      fetchProductdata();
    }
  }, [page]);

  return (
    <section className='relative'>
      <div className='container mx-auto px-4'>
        <div className="mb-6 py-4 bg-white shadow-md rounded-md">
          <h1 className="text-2xl font-bold px-4">
            {categoryName}
            {hasSubCategory && (
              <span className="text-green-600 ml-2">
                &raquo; {subCategoryName}
              </span>
            )}
          </h1>
        </div>
        
        {/* Display loading state if no subcategories are loaded yet */}
        {DisplaySubCatory.length === 0 && (
          <div className="flex justify-center items-center h-40">
            <Loading />
          </div>
        )}
        
        {/* Display each subcategory with its products */}
        {DisplaySubCatory.map((subcategory) => {
          const subcategoryProducts = productsBySubcategory[subcategory._id] || [];
          const isActive = subcategory._id === subCategoryId;
          
          // Create a safer link that uses the current category ID
          const link = `/${valideURLConvert(categoryName)}-${categoryId}/${valideURLConvert(subcategory.name)}-${subcategory._id}`;
          
          return (
            <div key={subcategory._id} className={`mb-10 ${isActive ? 'bg-green-50 p-4 rounded-lg' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm mr-3">
                    <img
                      src={subcategory.image}
                      alt={subcategory.name}
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <h2 className="text-xl font-semibold">{subcategory.name}</h2>
                </div>
                
                {/* Only show See All button if not currently viewing this subcategory */}
                {!isActive && (
                  <Link 
                    to={link} 
                    className="flex items-center px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 transition-colors duration-200 rounded-full"
                  >
                    <span>See All</span>
                    {subcategoryProducts.length > 0 && (
                      <span className="ml-2 bg-green-600 text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center">
                        {subcategoryProducts.length}+
                      </span>
                    )}
                  </Link>
                )}
              </div>
              
              {/* If this is the selected subcategory, show all products */}
              {isActive && loading && data.length === 0 && (
                <div className="flex justify-center items-center h-40">
                  <Loading />
                </div>
              )}
              
              {/* Show no products message only for active subcategory */}
              {isActive && !loading && data.length === 0 && (
                <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                  No products available in this subcategory.
                </div>
              )}
              
              {/* Products grid - show either preview or full products */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {isActive 
                  ? data.map((product, index) => (
                      <CardProduct
                        data={product}
                        key={product._id + "activeSubCategory" + index}
                      />
                    ))
                  : subcategoryProducts.map((product, index) => (
                      <CardProduct
                        data={product}
                        key={product._id + subcategory._id + index}
                      />
                    ))
                }
              </div>
              
              {/* Only show pagination for active subcategory */}
              {isActive && loading && data.length > 0 && (
                <div className="flex justify-center items-center h-20 mt-4">
                  <Loading />
                </div>
              )}
              
              {/* Load more button for active subcategory */}
              {isActive && !loading && data.length > 0 && data.length < totalCount && (
                <div className="flex justify-center my-6">
                  <button 
                    onClick={() => setPage(prevPage => prevPage + 1)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Load More Products
                  </button>
                </div>
              )}
            </div>
          );
        })}
        
        {/* Show all products only if not viewing a specific subcategory */}
        {!hasSubCategory && data.length > 0 && (
          <div className="mt-12 mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">All {categoryName} Products</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.map((product, index) => (
                <CardProduct
                  data={product}
                  key={product._id + "allCategoryProducts" + index}
                />
              ))}
            </div>
            
            {loading && (
              <div className="flex justify-center items-center h-20 mt-4">
                <Loading />
              </div>
            )}
            
            {!loading && data.length < totalCount && (
              <div className="flex justify-center my-6">
                <button 
                  onClick={() => setPage(prevPage => prevPage + 1)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Load More Products
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductListPage
