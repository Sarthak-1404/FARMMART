export const pricewithDiscount = (price, dis = 0)=>{
    if (!dis) return Number(price);
    const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100)
    const actualPrice = Number(price) - Number(discountAmout)
    return actualPrice
}