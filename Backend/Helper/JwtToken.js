import jwt from "jsonwebtoken"

const generateToken = (id,token)=>{
    return jwt.sign({id},token,{expiresIn :"7d"})
}

export default generateToken;