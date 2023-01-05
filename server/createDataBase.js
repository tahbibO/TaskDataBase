const sqlite3 = require('sqlite3').verbose()
const { query } = require('express')
const sqlite = require('sqlite')
const data = require('./data.json')
//const sqlite3 = require('sqlite3').verbose()
async function createDB(){
    let db = await sqlite.open({filename:'tasksDB.db',driver:sqlite3.Database, mode:sqlite3.OPEN_READWRITE})

    await db.exec('drop table if exists persons')
    await db.exec('drop table if exists tasks')
    await db.exec('drop table if exists sessions')
    await db.exec('drop table if exists participates_in_sessions')
    await db.exec('drop table if exists task_done_during_sessions')
    await db.exec('drop table if exists participates_in_tasks')

    let createPersons = "CREATE TABLE persons (pid integer primary key, username text not null, password text not null, first_name text not null, last_name text not null)"
    await db.run(createPersons)

    let createTasks =  'create table tasks(tid int primary key, task_name text not null,task_notes text,task_owner int,task_completed text,foreign key (task_owner) references persons(pid));' 
    await db.run(createTasks)

    //TEXT as ISO8601 strings
    let createSessions = 'create table sessions (sid int primary key,session_name ,session_notes text,start_date text,end_date text,session_owner int,foreign key (session_owner) references persons(pid));'
    await db.run(createSessions)

    let createPidSid = 'create table participates_in_sessions(participant_pid int not null references persons(pid), in_sid int not null references sessions(sid), primary key (participant_pid,in_sid));'
    await db.run(createPidSid)

    let createTidSid = 'create table participates_in_tasks(done_tid int not null references tasks(tid),participant_pid int not null references sessions(pid), primary key (done_tid,participant_pid));'
    await db.run(createTidSid)

    await db.close()

    insertInToDB()

}


async function insertInToDB(){
    let db = await sqlite.open({filename:'tasksDB.db',driver:sqlite3.Database, mode:sqlite3.OPEN_READWRITE})
    //people
    let sqlQuery = "INSERT INTO persons (pid,username,password,first_name,last_name)"+
    "VALUES (?,?,?,?,?)"
    
    for (person of data.persons){
        let pid = person.pid
        let username = person.username
        let password = person.password
        let firstName = person.firstName
        let lastName = person.lastName
        let temp = [pid,username,password,firstName,lastName]   
        await db.run(sqlQuery,temp)
    }

    

    //tasks
    sqlQuery = "INSERT INTO tasks (tid,task_name,task_notes,task_owner, task_completed)"+
    "VALUES (?,?,?,?,?)"

    for (task of data.tasks){
        let tid = task.tid
        let taskName = task.task_name
        let taskNotes = task.task_note
        let taskOwner = task.task_owner
        let task_completed = task.task_completed
        let temp = [tid,taskName,taskNotes,taskOwner,task_completed]
        await db.run(sqlQuery,temp)

    }

    //sessions 
    sqlQuery = "INSERT INTO sessions (sid,session_name,session_notes,start_date,end_date,session_owner)"+
    "VALUES (?,?,?,?,?,?)"
    for (session of data.sessions){
        let temp = [session.sid,
            session.session_name,
            session.session_notes,
            session.start_time,
            session.end_time,
            session.session_owner] 
        await db.run(sqlQuery,temp)
    }
    sqlQuery = "INSERT INTO participates_in_tasks(done_tid,participant_pid)"+
    "VALUES (?,?)"
    for (entry of data.people_tasks){
        let temp = [
            entry.tid,
            entry.pid
        ]
        db.run(sqlQuery,temp)
    }

    sqlQuery = "INSERT INTO participates_in_sessions(participant_pid,in_sid)"+
    "VALUES (?,?)"
    for (entry of data.people_sessions){
        let temp = [
            entry.pid,
            entry.sid
        ]
        db.run(sqlQuery,temp)
    }

    await db.close()
    
}




createDB()
// output the INSERT statement
