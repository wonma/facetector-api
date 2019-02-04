const handleSignin = (db, bcrypt) => (req, res) => {
    const { email, password } = req.body
    console.log(email, password)
    if(!email || !password){
        return res.status(400).json('No blank fields')
    }
    db('login').where('email', '=', email)
        .select('*')
        .then(user => {
            const isValid = bcrypt.compareSync(password, user[0].hash);
            if(isValid){
                db.select('*').from('users')
                .where('email', '=', email)
                .then(user => res.json(user[0]))
                .catch(err => res.status(400).json('Unable to sign in'))
            } else {
                res.status(400).json('Unable to sign in')
            }
        })
        .catch(err => res.status(400).json('Unable to sign in'))
}

module.exports = {
    handleSignin: handleSignin
}