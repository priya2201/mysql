const mysql=require('mysql2');
const express=require("express");
const bodyParser=require("body-parser");
var app=express();
app.use(bodyParser.json());
//mysql details
var mysqlConnection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'rootpassword',
    database:'learners',
    multipleStatements:true
});
mysqlConnection.connect((err) =>{
    if(!err){
        console.log('Connection Established Successfully');
    }
        else{
            console.log('Connection Failed!'+JSON.stringify(err,undefined,2));
        }
    });
    const port=process.env.port || 8080;
    app.listen(port,()=>console.log(`Listening on port ${port}..`));
    //Creating GET Router to fetch all the learner details from the MySQL Database
app.get('/learners' , (req, res) => {
    mysqlConnection.query('SELECT * FROM learnerdetails', (err, rows, fields) => {
    if (!err)
    res.send(rows);
    else
    console.log(err);
    })
    } );
    app.get('/learners/:id' , (req, res) => {
        mysqlConnection.query('SELECT * FROM learnerdetails WHERE learner_id = ?',[req.params.id], (err, rows, fields) => {
        if (!err)
        res.send(rows);
        else
        console.log(err);
        })
        } );
        app.post('/learners', (req, res) => {
            let learner = req.body;
            var sql = "SET @learner_id = ?;SET @learner_name = ?;SET @learner_email = ?;SET @course_id = ?; 
            CALL learnerAddOrEdit(@learner_id,@learner_name,@learner_email,@course_id);";
            mysqlConnection.query(sql, [learner.learner_id, learner.learner_name, learner.learner_email, learner.course_id], (err, rows, fields) => {
            if (!err)
            rows.forEach(element => {
            if(element.constructor == Array)
            res.send('New Learner ID : '+ element[0].learner_id);
            });
            else
            console.log(err);
            })
            });
            //Router to UPDATE a learner's detail
app.put('/learners', (req, res) => {
    let learner = req.body;
    var sql = "SET @learner_id = ?;SET @learner_name = ?;SET @learner_email = ?;SET @course_Id = ?; 
    CALL learnerAddOrEdit(@learner_id,@learner_name,@learner_email,@course_Id);";
    mysqlConnection.query(sql, [learner.learner_id, learner.learner_name, learner.learner_email, learner.course_Id], (err, rows, fields) => {
    if (!err)
    res.send('Learner Details Updated Successfully');
    else
    console.log(err);
    })
    });

            

    