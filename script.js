const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const bcrypt = require('bcrypt')

app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
    res.json(database.users)
})

app.listen(3000, () => {
    console.log('I love you')
})

// Database라고 임시 가정하기
const database = {
    users: [
        {
            id: '123',
            name: 'woshmi',
            email: 'woshmi@gmail.com',
            password: 'cookies',
            entries: 0,
            date: new Date()
        },
        {
            id: '456',
            name: 'shugoi',
            email: 'shugoi@gmail.com',
            password: 'lemons',
            entries: 0,
            date: new Date()
        }
    ]
}

// signin 세팅하기
// 미미풀이: POST는 프론트에서 입력한 정보(request)를 '서버'가 두 손에 쥐고 데이터베이스 성에 들어가서
//         해당 정보가 매칭되는지 확인 한 후, 맞으면 (계획된 바에 따라) '응답'을 내 놓는 것
//         GET으로도 프론트에서 입력한 정보를 쥐고 옮길 수 있으나, 다 노출된 상태로 쥐고 감.
app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
        res.json('Success')
    } else {
        res.status(400).json('Fail')
    }
})

// register 세팅하기
app.post('/register', (req, res) => {
    const {name, email, password} = req.body
    database.users.push({
        id: '789',
        name: name,
        email: email,
        password: password,
        entries: 0,
        date: new Date()    
    })
    res.json(database.users[database.users.length - 1])
})

// profile 세팅하기  
// 미미풀이: 해당 사용자의 정보를 가진 (그에 따라 customized된) 메인 화면을 보여주기 위하여
//         /profile/123 과 같이 각 유저에게 랜덤으로 특정하게 부여된 번호를 endpoint로함.
//         읽어들이는 것 뿐이므로, GET request를 쓰되, res는 해당 유저의 정보로 함.

app.get('/profile/:id', (req, res) => {
    let isUserMatched = false
    database.users.forEach(user => {
        if(user.id === req.params.id) {
            isUserMatched = true
            res.json(user.name)
        }
    })
    if(isUserMatched === false) {
        res.json('No such user found')
    }
})

// image 세팅하기
// 미미풀이: 이는 FIND버튼을 눌렀을 경우 동시 발송되는 것으로, PUT request를 통해 
//         현재 접속된 유저의 아이디를 request에 실어 보내고, id가 동일 할 경우
//         해당 유저의 entries 숫자를 increment하도록 하는 function접근 API임

app.put('/image', (req, res) => {
    let isUserMatched = false
    database.users.forEach(user => {
        if (user.id === req.body.id) {
            isUserMatched = true
            user.entries++
            res.json(user.entries)
        }
    })
    if (isUserMatched === false) {
        res.json('No such user found')
    }
})

// Storing user password