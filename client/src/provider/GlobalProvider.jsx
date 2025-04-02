import { createContext,useContext, useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemCart } from "../store/cartProduct";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import { handleAddAddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";

export const GlobalContext = createContext(null)

export const useGlobalContext = ()=> useContext(GlobalContext)

const GlobalProvider = ({children}) => {
     const dispatch = useDispatch()
     const [totalPrice,setTotalPrice] = useState(0)
     const [notDiscountTotalPrice,setNotDiscountTotalPrice] = useState(0)
    const [totalQty,setTotalQty] = useState(0)
    const cartItem = useSelector(state => state.cartItem.cart)
    const user = useSelector(state => state?.user)

    const fetchCartItem = async()=>{
        try {
          const response = await Axios({
            ...SummaryApi.getCartItem
          })
          const { data : responseData } = response
    
          if(responseData.success){
            console.log('Cart items fetched:', responseData.data)
            dispatch(handleAddItemCart(responseData.data))
          }
    
        } catch (error) {
          console.log('Error fetching cart:', error)
        }
    }

    const updateCartItem = async(id,qty)=>{
      try {
          const response = await Axios({
            ...SummaryApi.updateCartItemQty,
            data : {
              _id : id,
              qty : qty
            }
          })
          const { data : responseData } = response

          if(responseData.success){
              // toast.success(responseData.message)
              fetchCartItem()
              return responseData
          }
      } catch (error) {
        AxiosToastError(error)
        return error
      }
    }
    const deleteCartItem = async(cartId)=>{
      try {
          const response = await Axios({
            ...SummaryApi.deleteCartItem,
            data : {
              _id : cartId
            }
          })
          const { data : responseData} = response

          if(responseData.success){
            toast.success(responseData.message)
            fetchCartItem()
          }
      } catch (error) {
         AxiosToastError(error)
      }
    }

    useEffect(()=>{
      console.log('Cart items changed:', cartItem)
      
      // Filter out invalid cart items
      const validCartItems = cartItem.filter(item => 
        item?.productId?._id && 
        item?.productId?.name && 
        item?.productId?.price
      )

      const qty = validCartItems.reduce((preve,curr)=>{
          return preve + (curr?.quantity || 0)
      },0)
      setTotalQty(qty)
      
      const tPrice = validCartItems.reduce((preve,curr)=>{
          if (!curr?.productId?.price) return preve;
          const priceAfterDiscount = pricewithDiscount(curr.productId.price, curr.productId.discount)
          return preve + (priceAfterDiscount * (curr.quantity || 0))
      },0)
      setTotalPrice(tPrice)

      const notDiscountPrice = validCartItems.reduce((preve,curr)=>{
          if (!curr?.productId?.price) return preve;
          return preve + (curr.productId.price * (curr.quantity || 0))
      },0)
      setNotDiscountTotalPrice(notDiscountPrice)

      // If there are invalid items, update the cart state
      if (validCartItems.length !== cartItem.length) {
        dispatch(handleAddItemCart(validCartItems))
      }
    },[cartItem])

    const handleLogoutOut = ()=>{
        localStorage.clear()
        dispatch(handleAddItemCart([]))
    }

    const fetchAddress = async()=>{
      try {
        const response = await Axios({
          ...SummaryApi.getAddress
        })
        const { data : responseData } = response

        if(responseData.success){
          dispatch(handleAddAddress(responseData.data))
        }
      } catch (error) {
          // AxiosToastError(error)
      }
    }
    const fetchOrder = async()=>{
      try {
        const response = await Axios({
          ...SummaryApi.getOrderItems,
        })
        const { data : responseData } = response

        if(responseData.success){
            dispatch(setOrder(responseData.data))
        }
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(()=>{
      fetchCartItem()
      fetchAddress()
      fetchOrder()
    },[user])
    
    return(
        <GlobalContext.Provider value={{
            fetchCartItem,
            updateCartItem,
            deleteCartItem,
            fetchAddress,
            totalPrice,
            totalQty,
            notDiscountTotalPrice,
            fetchOrder
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider