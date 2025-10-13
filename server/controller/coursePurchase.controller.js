import Razorpay from "razorpay"
import {Course} from "../models/course.model.js" 
import {CoursePurchase} from "../models/coursePurchase.model.js"
const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY,
      key_secret: process.env.RAZORPAY_SECRET_KEY
})


export const createCheckoutSession = async (req,res) => {
      try {
            const userId = req.id
            const {courseId} = req.body
            const course = await Course.findById(courseId)
            if(!course) {
                  return res.status(404).json({
                        message:"course not found!"
                  })
            }

            //Create a new purchase record
            const newPurchase = new CoursePurchase({
                  courseId,
                  userId,
                  amount:course.coursePrice,
                  status:"pending"
            }) 
            // create a razorpay checkout session
      } catch (error) {
            console.log(error);
      }
}

export const getCourseDetailWithPurchaseStatus = async (req,res) => {
      try {
            const {courseId} = req.params
            const userId = req.id

            const course = await Course.findById(courseId).populate({path:"creator"}).populate({path:"lectures"})

            const purchased = await CoursePurchase.findOne({userId,courseId})

            if(!course) {
                  return res.status(404).json({
                        message:"Course not found"
                  })
            }
            return res.status(200).json({
                  course,
                  purchased: !!purchased, // true if purchased , false otherwise
            })
      } catch (error) {
            console.log(error);
            
      }
}

export const getAllPurchasedCourse = async (_,res) => {
      try {
            const purchasedCourse = await CoursePurchase.find({status:"completed"}).populate("courseId")
            if(!purchasedCourse) {
                  return res.status(404).json({
                        purchasedCourse:[]
                  })
            }
            return res.status(200).json({
                  purchasedCourse,
            })
      } catch (error) {
            console.log(error);
            
      }
}