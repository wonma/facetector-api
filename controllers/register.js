const handleRegisterDel = (db, bcrypt) => (req, res) => {
    // Delete if there is register 'guest'
    const { name, email } = req.body

    db('users')
      .where({name: name})
      .del()
      .then(result => {
            db('login')
                .where({email: email})
                .del()
                .then(result2 => {
                    res.json(result) // '0' 이라는 숫자를 보내게 됨
                })
      })


}

const handleRegister = (db, bcrypt) => (req, res) =>  {

    const { name, email, password } = req.body
    
    const hash = bcrypt.hashSync(password, 10)
    const regex = /^.{4,}$/
    // Password must contain at least one letter, at least one number, 
    // and be longer than six charaters.
    if(!name || !email || !password){
        return res.status(400).json('blank')
    }
    if(!regex.test(password)) {
        return res.status(400).json('wrongpassword')
    }


    db.transaction(trx => {
        trx.insert({
            email: email,
            hash: hash
            }, 'email')     // 'email, password' into table 'login'
            .into('login')
            .then(loginEmail => {
               return trx.insert({  // error 2 - no 'return' (있어야할 이유 잘 모르겠음)
                    name: name,
                    email: loginEmail[0],
                    joined: new Date()
                }, '*')         //'email, name, joined' into table 'user'
                .into('users')
                .then(user => {
                    res.json(user[0])
                })
            })
            .then(trx.commit)
            .catch(trx.rollback)  
    })
    .catch(err => {
        res.status(400).json('existing')
    })
}

module.exports = {
    handleRegister: handleRegister,
    handleRegisterDel: handleRegisterDel
}