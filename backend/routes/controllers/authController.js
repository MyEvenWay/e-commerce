const { User } = require("../../models/userModel")
const bcrypt = require("bcrypt")
const { ObjectId } = require("mongodb")

// GET - /user
const auth_payload_get = async (req, res) => {
  try {

    let users = await User.find()
    if( users ){
      return res.status(200).json({
        message:"Users catched up!",
        data:users
      })
    }
    // catch error if resp did not catch
    return res.status( 404 ).json({
      message:"Resp did not come!"
    })

  } catch (err) {
    if (err) return res.status(500).json({
      message:"Some error while get the list of Users!",
      data:err
    })
  }
}


// DELETE - /user/delete/:id
const auth_delete_delete = async (req, res) => {
  try {
    let { id } = req.params
    // checking if user exists
    let existUser = await User.findById( id )
    if( existUser ){
      // delete user
      let deletedUser = await User.findByIdAndDelete( id )
      if ( deletedUser ){
        return res.status(200).json({
          message:"User deleted!",
          data:{
            deletedUsername:deletedUser.username,
            deletedId:deletedUser._id
          }
        })
      }
      // when send req to del but resp not come
      return res.status(409).json({
        message:"Req sent to delete User but not get Res"
      })
    }
    // throw error if user not found
    return res.status(404).json({
      message:"User not found to delete!"
    })
  } catch (err) {
    // throw error if something happened with SERVER while deleting product
    if (err) return res.status(500).json({
      message:"Internal Server error while deleting!",
      data:err
    })
  }
}

// PATCH - /user/delete/:id
const auth_edit_patch = async (req, res) => {
  try {
    const { id } = req.params
    // Check if User exist
    const existUser = await User.findById( id )
    if( existUser ){
      // Hash password
      let shouldSend = req.body
      // check if password exists to change
      
      if ( shouldSend.password ){
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash( shouldSend.password, salt )
        shouldSend.password = hashedPassword
      }

      // Update the user
      const updatedUser = await User.updateOne(
        { _id: new ObjectId( id.toString() ) },
        { $set:{ ...shouldSend } },
        { upsert: true }
      )
      // Check after updating
      if( updatedUser ){
        return res.status( 200 ).json({
          message:"User updated!",
          data:{
            updatedUsername: updatedUser.username,
            id:updatedUser._id
          }
        })
      }
      // If User data sent but not get request!
      return res.status( 500 ).json({
        message:"User data sent but not updated! Try again!"
      })
    }
    // If User is not found in MongoDB
    return res.status( 500 ).json({
      message:"User not found in the List!"
    })
  } catch (err) {
    if( err ){
      console.log( err )
      return res.status(500).json({
        message:"Internal Error on Server!",
        data:err
      })
    }
  }
}

// POST - /user/signup
const auth_signup_post = valResult => async (req, res) => {
  const ERRORS = valResult(req)
  if( !ERRORS.isEmpty() ){
    return res.status( 400 ).json({
      message:"Validation errors",
      data:ERRORS
    })
  }

  try {
    let { username, email, password } = req.body
    // check if user exists or not in DB
    let existUser = await User.findOne({ username, email })
    if( existUser ){
      return res.status( 409 ).json({
        message:"User already signed up!",
        data: new Error("These email and password already signed up!")
      })
    }
    // sign up new User
    let savedUser = await User.create({ username, email, password })
    // if user saved response about it
    if( savedUser ){
      return res.status( 201 ).json({
        message:"User signed up!",
        data:savedUser._id
      })
    }
    // catching error data sent but not get res from DB
    return res.status( 500 ).json({
      message:"User not signed up!",
      data: {
        errors:[
          {
            msg:"User not signed up because of Server's Internal errors!",
          }
        ]
      }
    })
  } catch (err) {
    // catching SERVER error
    if( err ) return res.status( 500 ).json({
      message:"Server Internal Error while signed up!",
      data:err
    })
  }
}

// POST - /user/login
const auth_login_post = valResult => async (req, res) => {
  //checking validation results
  const ERRORS = valResult(req)
  if( !ERRORS.isEmpty() ){
    return res.status(400).json({
      message:"Errors while validation",
      data:ERRORS
    })
  }

  try {
    const { username, password } = req.body
    // check if user exist or not
    let existUser = await User.findOne({ username })
    if( existUser ){
      let match = await bcrypt.compare( password, existUser.password )
      if( match ){
        return res.status( 200 ).json({
          message:"User login!",
          data:existUser._id
        })
      } else {
        return res.status( 401 ).json({
          message:"Password is wrong!",
          data: {
            errors:[
              {
                msg:"This password is not matched!",
              }
            ]
          }
        })
      }
    }

    return res.status( 404 ).json({
      message:"Username not found!",
      data: {
        errors:[
          {
            msg:"This username not found!",
          }
        ]
      }
    })

  } catch( err ) {
    if( err ) return res.status(500).json({
      message:"SERVER POINT ERROR WHILE LOGIN",
      data:err
    })
  }

}

module.exports = {
  auth_login_post,
  auth_signup_post,
  auth_edit_patch,
  auth_delete_delete,
  auth_payload_get
}