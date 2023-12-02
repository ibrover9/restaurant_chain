const Category = require('../models/Category')
const Position = require('../models/Position')
const errorHandler = require('../utils/errorHandler')

module.exports.getAll = async function(request, response){
   try {
        const categories = await Category.find({user: request.user.id})
        response.status(200).json(categories)
   } catch (error){
    errorHandler(response,error)
   }
}

module.exports.getById = async function(request, response){
    try {
        const category = await Category.findById(req.params.id)
        response.status(200).json(category)
    } catch (error){
     errorHandler(response,error)
    }
}

module.exports.remove = async function(request, response){
    try {
        await Category.remove({_id: request.params.id})
        await Position.remove({category: request.params.id})
        response.status(200).json({
            message: 'Категория удалена'
        })
    } catch (error){
     errorHandler(response,error)
    }
}

module.exports.create = async function(request, response){
    const category = new Category({
        name: request.body.name,
        user: request.user.id,
        imageSrc: request.file ? request.file.path : ''
    })
    try {
        await category.save()
        response.status(201).json(category)
    } catch (error){
     errorHandler(response,error)
    }
}

module.exports.update = async function(request, response){
    const updated = {
        name: request.body.name
    }
    if (request.file){
        updated.imageSrc = request.file.path
    }
    try {
        const category = await Category.findOneAndUpdate(
            {_id: request.params.id},
            {$set: updated},
            {new: true}
        )
        response.status(200).json(category)
    } catch (error){
     errorHandler(response,error)
    }
}