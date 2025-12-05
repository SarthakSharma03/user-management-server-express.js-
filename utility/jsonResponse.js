  export const  jsonResponse=(res,data,statusCode=200)=>{

      res.setHeader("Content-Type", "application/json");
      res.statusCode = statusCode;
       
      return res.end(JSON.stringify(data));
 }
