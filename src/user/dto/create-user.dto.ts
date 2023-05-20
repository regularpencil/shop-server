export class CreateUserDto {
    name: string
    email: string
    password: string
    phoneNumber: string
    isActivated: boolean
    activationLink: string
    favorites: number[] = []
    history: any = []
    orders: any = []
    role: string
}