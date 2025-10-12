// //Wrapper with Async Await

// let asyncHandler  = (fun)=> async (req, res, next)=>{
//     try {
//         await fun (req,res,next)
//     } catch (error) {
//      res.status(error.code || 500).json({
//         success:false,""
//         message:error.message
//      })
//     }
// }

//Wrapper with Promises

let asyncHandler = (fun) => (req, res, next) => {
  Promise.resolve(fun(req, res, next)).catch((err) => next(err));
};

export { asyncHandler };



//this function will take a async function you know async
//always provide a promise that we are esolving here if it not resolve 
//it will initiate .catch 

// function handler (fuct){
//   return function (req,res,next){
//     Promise.resolve(fuct(req,res,next))
//     .catch(function(err){
//       next(err)
//     })
//   }
// }
// export { handler };