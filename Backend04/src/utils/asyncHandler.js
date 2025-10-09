// //Wrapper with Async Await

// let asyncHandler  = (fun)=> async (req, res, next)=>{
//     try {
//         await fun (req,res,next)
//     } catch (error) {
//      res.status(error.code || 500).json({
//         success:false,
//         message:error.message
//      })
//     }
// }

//Wrapper with Promises

let asyncHandler = (fun) => (req, res, next) => {
  Promise.resolve(fun(req, res, next)).catch((err) => next(err));
};

export { asyncHandler };
