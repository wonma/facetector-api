const handleProfile = (db) => (req, res) => {

    const id = req.params.id
    db('users')
      .where({id: id})
      .then(user => {    // 응답으로 돌아온 녀석은 array형태로 돌아옴을 잊지 말기!!!!
          if(user.length) {
              res.json(user[0])
          } else {
              res.status(400).json('No user')
          }
      })
      .catch(err => {
          res.status(400).json('Error Occurred')
      })

}

module.exports = {
  handleProfile: handleProfile
}