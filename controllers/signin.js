const handleSignin = (db, bcrypt) => (req, res) => {
    const { email, password } = req.body
    console.log(email, password)
    if(!email || !password){
        return res.status(400).json('blank')
    }
    db('login').where('email', '=', email) // req에서 얻은 정보이고 해당 유저를 찾는 방식
        .select('*')
        .then(user => {
            const isValid = bcrypt.compareSync(password, user[0].hash);

            // if password is valid, follow below
            if(isValid){
                db.select('*').from('users')
                .where('email', '=', email)
                .then(user => res.json(user[0]))
                .catch(err => res.status(400).json('wronginfo')) // 
            } else {
            // if password is invalid, follow below
                res.status(400).json('wronginfo')
            }
        })
        .catch(err => res.status(400).json('wronginfo')) // 이메일이 존재하지 않을 경우
}

module.exports = {
    handleSignin: handleSignin
}