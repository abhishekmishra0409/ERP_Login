import {v2 as cloudinary} from "cloudinary"
const cloudinaryConfig = () =>{
   try{ cloudinary.config({ 
        cloud_name: 'dgadm82x8', 
        api_key: '112128793913282', 
        api_secret: '6t8V1sMM-ey7ibGOCVFUw7kEigw'
      });
      console.log("Connected with cloudinary");
    }catch(error){
        console.log("Error in connection with cloudinary");
    }
}

export default cloudinaryConfig;