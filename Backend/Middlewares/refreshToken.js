import jwt from "jsonwebtoken"

const generateRefreshToken = (id,token)=>{
    return jwt.sign({id},token,{expiresIn :"7d"})
}

export default generateRefreshToken;