interface IGood {
    _id: string,
    name: string,
    price: number,
    image: string,
    count: number
}
interface IDeliveryData {
    mailIndex: number,
    addressee: string,
    address: string,
    phoneNumber: string,
}

export class AddOrderDto {
    _id?: string
    userEmail: string
    isOpen: boolean
    orderCost: number
    paymentType: string
    goods: IGood[]
    status: string
    isDelivery: boolean
    deliveryData?: IDeliveryData
    pickAddress?: string
    stock: number
}