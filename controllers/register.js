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
    if(!regex.test(password)) {
        return res.status(400).json('wrongpassword')
    }

    db.transaction(trx => {
        trx.insert({
            email: email,
            hash: hash
            }, 'email')     // error 1 - no single quotation
            .into('login')
            .then(loginEmail => {
               return trx.insert({  // error 2 - no 'return' (있어야할 이유 잘 모르겠음)
                    name: name,
                    email: loginEmail[0],
                    joined: new Date()
                }, '*')
                .into('users')
                .then(user => {
                    console.log(user[0])
                    res.json(user[0])
                })
            })
            .then(trx.commit)
            .catch(trx.rollback)   // error 3 - no 'catch' but 'then'
    })
    .catch(err => {
        res.status(400).json('existing')
    })
}

module.exports = {
    handleRegister: handleRegister
}