//const asyncHandler = ()=>{}
// const asyncHandler = (func) => () => {}
// const asyncHandler = async (func) => () => {}

// There are two ways of doing it

//1.
const asyncHandler = (fn) => async(req,res,next) => {
    try{
        await fn(req,res,next)
    } catch (error){
        res.status (err.code || 500).json({
            success: false,
            message: err.message
        })
    }
}

/* 2. const asyncHandler = (fn) => {
    (req,res,next) => {
        Promise.resolve(fn(req,res,nxt)).catch(err) => next(err)
    }
} */

export {asyncHandler}
//or export default asyncHandler;