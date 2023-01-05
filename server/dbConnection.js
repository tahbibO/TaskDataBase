const sqlite3 = require("sqlite3").verbose()
const { response } = require("express")
let sqlite = require('sqlite')


let db = new  sqlite3.Database('tasksDB.db')

exports.getPersons = function(req,res){
    if (req.query.name){
        let personQuery = 'select pid,first_name,last_name from persons where (persons.first_name || " " || persons.last_name) LIKE "%' + req.query.name + '%"'
        db.all(personQuery,function(err,rows){
            if (err) throw err
            res.render('persons.pug',{persons:rows})
        }) 
    }else{
        db.all('select * from persons',function(err,rows){
            if (err) throw err
            res.render('persons.pug',{persons:rows})
        })
    }


}

exports.getPerson = function(req,res){


    let pid = req.params.pid
    let personQuery = 'select pid,first_name,last_name from persons where persons.pid = ' + pid
    let createdTasksQuery = 'select * from tasks where tasks.task_owner ==' + pid 
    let createdSessionsQuery = ' select * from sessions where sessions.session_owner =' + pid
    let participatedSessionsQuery = 'select sid,session_name,start_date,end_date,session_owner from sessions join participates_in_sessions on (sessions.sid == participates_in_sessions.in_sid) where participates_in_sessions.participant_pid =' + pid
    let participatedTasksQuery = 'select tid,task_name,task_notes,task_completed,task_owner from participates_in_tasks join tasks on (tasks.tid == participates_in_tasks.done_tid) where participates_in_tasks.participant_pid =' + pid
    db.get(personQuery, function(err1,person){
        if (err1) throw err1
        db.all(createdTasksQuery,function(err2,createdTasks){
            if (err2) throw err2
            db.all(createdSessionsQuery,function(err3,createdSessions){
                if (err3) throw err3
                db.all(participatedTasksQuery,function(err4,participatedTasks){
                    if (err4) throw err4
                    db.all(participatedSessionsQuery,function(err5,participatedSessions){
                        if (err5) throw err5
                        let data = {
                            person:person,
                            createdTasks:createdTasks,
                            createdSessions:createdSessions,
                            participatedSessions:participatedSessions,
                            participatedTasks:participatedTasks
                        }
                        res.render('person.pug',{data:data})
                    })
                })
            })        
        })
    })
}



exports.getTasks = function(req,res){
    if (req.query.name){
        let taskQuery = 'select tid,task_name from tasks where tasks.task_name LIKE "%' + req.query.name + '%"'
        db.all(taskQuery,function(err,rows){
            if (err) throw err
            res.render('tasks.pug',{tasks:rows})

        }) 
    }else{
        db.all('select tid,task_name from tasks',function(err,rows){
            if (err) throw err
            res.render('tasks.pug',{tasks:rows})
        })
    }

}

exports.getTask = function(req,res){
    let taskQuery = 'select * from tasks where tid = ' + req.params.tid
    let tid = req.params.tid
    
    db.get(taskQuery, function(err,task){
        if (err) throw err
        let pid = task.task_owner
        let personQuery = 'select * from persons where pid = ' + pid
        db.get(personQuery,function(err2,person){
            if (err2) throw err2
            let participantsQuery = 'select pid,first_name,last_name from participates_in_tasks join persons on (persons.pid == participates_in_tasks.participant_pid) where participates_in_tasks.done_tid =' + tid
            db.all(participantsQuery,function(err3,people){
                if (err3) throw err3
                let data = {
                    task: task,
                    owner: person,
                    participants: people
                }
                res.render('task.pug',{data:data})
            })
        })
    })
}

exports.getSessions = function(req,res){
    if (req.query.name){
        let sessionQuery = 'select sid,session_name from sessions where sessions.session_name LIKE "%' + req.query.name + '%"'
        db.all(sessionQuery,function(err,rows){
            if (err) throw err
            res.render('sessions.pug',{sessions:rows})
        }) 
    }else
    db.all('select * from sessions',function(err,rows){
        if (err) throw err
        res.render('sessions.pug',{sessions:rows})
        
    })
}

exports.getSession = function(req,res){
    let query = 'select * from sessions where sid = ' + req.params.sid
    let sid = req.params.sid
    db.get(query, function(err1,session){
        if (err1) throw err1
        let pid = session.session_owner
        let personQuery = 'select * from persons where pid = ' + pid
        db.get(personQuery,function(err2,person){
            if (err2) throw err2
            let participantsQuery = 'select pid,first_name,last_name from participates_in_sessions join persons on (persons.pid == participates_in_sessions.participant_pid) where participates_in_sessions.in_sid = 3038;' + sid
            db.all(participantsQuery,function(err3,participants){
                if (err3) throw err3
                let data = {
                    session: session,
                    owner: person,
                    participants: participants
                }
                res.render('session',{data:data})
            })
        })
    })
}





