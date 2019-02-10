const Clarifai = require('clarifai')

const app = new Clarifai.App({
  apiKey: '61feadaf01f14a0b9f76fc02eaf5bf7d'
});


let foundFaces = ''

const handleImageUrl = (req, res) =>  {
    const { input } = req.body

    app.models.predict('a403429f2ddf4b49b307e318f00e528b', input)
        .then(response => {
            foundFaces = response.outputs[0].data.regions.length
            res.json(response.outputs[0].data.regions)
        })
        .catch(err => res.status(400).json('Unable to fetch Clarifai Api'))
}


const handleImage = (db) => (req, res) => {
    const { id } = req.body
    db('users')
        .where('id', '=', id)
        .increment('entries', foundFaces)
        .returning('entries')
        .then(entries => {
            res.json(entries[0])
        })
        .catch(err => res.status(400).json('Error Occurred'))
}


module.exports = {
    handleImage: handleImage,
    handleImageUrl: handleImageUrl
}