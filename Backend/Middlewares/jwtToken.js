import jwt from "jsonwebtoken"

const generateToken = (id)=>{
    return jwt.sign({id},"adminToken",{expiresIn :"7d"})
}

export default generateToken