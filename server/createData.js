//create users 
const { faker } = require('@faker-js/faker')
const { DateTime } = require('luxon')
const fs = require('fs')
const { formatWithOptions } = require('util')

function randomIDS(size, minVal, maxVal) {
    let arr = new Set()
    while (arr.size < size) {
        num = faker.datatype.number({ min: minVal, max: maxVal })
        arr.add(num)
    }
    return Array.from(arr)
}

function getElement(arr, index) {
    val = index % arr.length
    return arr[val]
}

let users = []
let tasks = []
let dateRange = []
let sessions = []
let people_sessions = []
let people_tasks = []

let pids = randomIDS(20, 1000, 2000)
for (let i = 0; i < 20; i++) {
    firstname = faker.name.firstName()
    lastname = faker.name.lastName()
    pid = pids[i]
    user = {
        pid: pid,
        firstName: firstname,
        lastName: lastname,
        username: firstname + String(pid),
        password: lastname + String(pid),
    }
    users.push(user)
}

date = DateTime.now()
for (let i = 0; i < 200; i++) {
    temp = date.plus({ hours: i })
    //console.log(temp.toLocaleString(DateTime.DATETIME_MED))
    dateRange.push(temp)
}

let tids = randomIDS(50, 2000, 3000)
for (let i = 0; i < 50; i++) {
    task = {
        tid: tids[i],
        task_name: faker.company.bs(),
        task_note: faker.lorem.lines(),
        task_owner: users[faker.datatype.number({ min: 0, max: 19 })].pid,
        task_completed: dateRange[faker.datatype.number({min:0,max:199})]
    }
    tasks.push(task)
}




let start = 0
let sids = randomIDS(50, 3000, 4000)
for (let i = 0; i < 50; i++) {
    increment = faker.datatype.number({ min: 1, max: 3 })
    start = 0
    session = {
        session_name: faker.company.bsBuzz(),
        sid: sids[i],
        start_time: dateRange[start],
        end_time: dateRange[start + increment],
        session_notes: faker.lorem.lines(),
        session_owner: users[faker.datatype.number({ min: 0, max: 19 })].pid
    }
    sessions.push(session)
    start += increment
}


start = 0
for (let i = 0; i < 50; i++) {
    end = faker.datatype.number({ max: 5 })
    for (let j = start; j < end + start; j++) {
        u = getElement(users, j)
        if (u.pid != sessions[i].session_owner) {
            entry = {
                pid: u.pid,
                sid: sessions[i].sid,
            }
            people_sessions.push(entry)
        }
    }
}



start = 0
for (let i = 0; i < 50; i++) {
    end = faker.datatype.number({ max: 5 })
    for (let j = start; j < end + start; j++) {
        u = getElement(users, j)
        if (u.pid != tasks[i].task_owner) {
            entry = {
                pid: u.pid,
                tid: tasks[i].tid,
            }
            people_tasks.push(entry)
        }
    }
}

let exportObject = {
    tasks: tasks,
    persons: users,
    sessions: sessions,
    people_tasks: people_tasks,
    people_sessions: people_sessions
}

fs.writeFile("data.json", JSON.stringify(exportObject), (err, result) => {
    if (err) console.log('error', err)
})





module.exports = {
    tasks: tasks,
    persons: users,
    sessions: sessions,
    people_tasks: people_tasks,
    people_sessions: people_sessions
}

