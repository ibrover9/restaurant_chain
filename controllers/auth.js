const bcrypt = require('bcryptjs')
//jsonWebToken
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler')



module.exports.login = async function(request, response){
   const candidate = await User.findOne({email: request.body.email})

   if (candidate) {
    // Проверка пароля, пользователь существует
    const passwordResult = bcrypt.compareSync(request.body.password, candidate.password)
    if (passwordResult){
        //Генерация токена, пароли совпали
        const token = jwt.sign({
            email: candidate.email,
            userId: candidate._id
        }, keys.jwt,{expiresIn: 60 * 60})
        response.status(200).json({
            token: `Bearer ${token}`
        })
    } else{
        response.status(401).json({
            message: 'Пароли не совпадают. Попробуйте снова.'
        })
    }

   } else  {
    //Пользователя нет, ошибка
    response.status(404).json({
        message: 'Пользователь с таким email не найден.'
    })
   }
}


module.exports.register = async function(request, response){
   const candidate = await User.findOne({email: request.body.email})

   if (candidate){
    //Пользователь существует, нужно отправить ошибку
    response.status(409).json({
        message: 'Такой email уже занят. Попробуйте другой'
    })
   } else {
        //  Нужно создать пользователя
        const salt = bcrypt.genSaltSync(10)
        const password = request.body.password
        const user = new User({
            email: request.body.email,
            password: bcrypt.hashSync(password, salt)
        })

        try{
            await user.save()
            response.status(201).json(user)
        } catch(error){
            errorHandler(response,error)
        }
   }
}

