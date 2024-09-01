import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from 'next-auth';

export async function POST(request: Request) {
   await dbConnect()

   const session = await getServerSession(authOptions)
   const user: User = session?.user as User

   if(!session || !session.user) {
      return Response.json(
         {
            success: false,
            message: "Not Authenticated"
         },
         {
            status: 401
         }
      )
   }

   const userId = user?._id
   const { acceptMessages } = await request.json()

   try {
      const updatedUser = await UserModel.findByIdAndUpdate(userId, {
         isAcceptingMessage: acceptMessages
      }, {new: true})

      if(!updatedUser){
         return Response.json(
            {
               success: false,
               message: "Failed to update status to accept messages"
            },
            {
               status: 401
            }
         )
      }

      return Response.json(
         {
            success: true,
            message: "Message Acceptance status updated successfully",
            updatedUser
         },
         {
            status: 401
         }
      )

   } catch (error) {
      console.error("Failed to update status to accept messages")
      return Response.json(
         {
            success: false,
            message: "Failed to update status to accept messages"
         },
         {
            status: 500
         }
      )
   }

   return Response.json({status: 200})
}

export async function GET(request: Request) {
   await dbConnect()

   const session = await getServerSession(authOptions)
   const user: User = session?.user as User

   if(!session || !session.user) {
      return Response.json(
         {
            success: false,
            message: "Not Authenticated"
         },
         {
            status: 401
         }
      )
   }

   const userId = user?._id
   try {
      const foundUser = await UserModel.findById(userId)
      if(!foundUser){
         return Response.json(
            {
               success: false,
               message: "User Not found"
            },
            {
               status: 404
            }
         )
      }
   
      return Response.json(
         {
            success: false,
            isAcceptingMessage: foundUser.isAcceptingMessage
         },
         {
            status: 200
         }
      )
   } catch (error) {
      console.error("Error to get status to accept messages")
      return Response.json(
         {
            success: false,
            message: "Error to get status to accept messages"
         },
         {
            status: 500
         }
      )
   }
}