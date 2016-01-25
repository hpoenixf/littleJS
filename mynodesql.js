var mysql = require('mysql')

var client = createPool({
    database: "aa"
})




// createTable(client,newTable)

function createPool(para) {
    var a = mysql.createPool({

        'user': para.user || 'root',
        'password': para.password || 'root',
        'database': para.database,
        'host': para.host || 'localhost',
        'port': para.port || 3306
    });

    return a
}

// // 创建表 exampe：
// // para = {
//     'tableName':'student',
//     'col':{
//         'id': 'TINYINT' ,
//         'age' :'TINYINT',
//         'sex': 'TINYINT',
//         'height':'SMALLINT',
//         'weight':'SMallINT',
//         'name': 'CHAR' 
//     },
//     'primary':'id',
//     'unique':['name']
// }
function createTable(pool, para) {
    console.log(para)
    var sqlSent = 'CREATE TABLE ' + para.tableName + "(";
    if (para.col) {
        for (var key in para.col) {
            sqlSent += " " + key + " " + para.col[key] + ", "
        }
    } else {
        console.log("没有参数，创建失败")
        return
    }
    if (para.primary) {
        sqlSent += ' PRIMARY KEY (' + para.primary + ")"
    }
    if(para.unique) {
        sqlSent+= " " + "UNIQUE ("+para.unique.join(",")+")"
    }
    if(para.foreign&&para.refer) {
        sqlSent += ' FOREIGN KEY (' + para.foreign + ") REFERENCES " + para.refer
    }
    if(para.check) {
        sqlSent+='CHECK ('+para.check+")"
    }
    sqlSent += ")"
    console.log(sqlSent)
    pool.getConnection(
        function(err, connection) {
            connection.query(
                sqlSent
            );
        }
    );
}

// 直接执行语句
function doSql(pool, sqlSent) {
    if (sqlSent) {
        pool.getConnection(
            function(err, connection) {
                if (err) {
                    throw err;
                }
                connection.query(
                    sqlSent
                );
            }
        )
    };
}


function createDB(pool, DBName) {
    if(!DBName){
    console.log('has not databaseName')
    return
}
    pool.getConnection(
        function(err, connection) {
            connection.query('CREATE DATABASE ' + DBName, function(err) {
                if (err && err.number != Client.ERROR_DB_CREATE_EXISTS) {
                    throw err;
                }
            });
        }
    );
}



function useDB(pool, DBName) {

if(!DBName){
    console.log('has not databaseName')
    return
}


    pool.getConnection(
        function(err, connection) {
            connection.query('USE ' + DBName, function(err, results) {
                
            });
        }
    );
}


// useDB(client, 'aa')


// insertData(client, {
//     "tableName": "student",
//     "col": {
//         "id":16,
//         "age":10,
//         "sex": 1,
//         "height": 170,
//         'name': 'dad',
//         'weight': 140
//     }
// })
function insertData(pool, para) {


if(!para.tableName){
    console.log('has not tableName')
    return
}


    var sqlSent = 'INSERT INTO ' + para.tableName + ' ('
    var value = [];
    var keyName = []
    for (var key in para.col) {
        keyName.push(key)
        if ((typeof para.col[key]) === 'string') {
            value.push("'" + para.col[key] + "'")
        } else {
            value.push(para.col[key])
        }

    }
    keyName = keyName.join(', ');
    value = value.join(', ')
    sqlSent = sqlSent + keyName + ') ' + 'VALUES (' + value + ')'
    console.log(sqlSent)
    pool.getConnection(
        function(err, connection) {
            connection.query(
                sqlSent,
                function(err) {
                    console.log(err)
                }
            );
        }
    );

}


// updateData(client,{tableName:'student',col:{
//     name:'fasasdfdf',
//     weight:123

// },
// condition:'id=13'})

function updateData(pool, para) {

if(!para.tableName){
    console.log('has not tableName')
    return
}


    var sqlSent = 'UPDATE ' + para.tableName + ' SET ';
    var keyValue = [];

    for (var key in para.col) {

        if ((typeof para.col[key]) === 'string') {
            keyValue.push(key + ' = "' + para.col[key] + '"')
        } else {
            keyValue.push(key + ' = ' + para.col[key])
        }

    }
    keyValue = keyValue.join(', ');
    sqlSent = sqlSent + keyValue
    if (para.condition) {
        sqlSent += ' WHERE ' + para.condition
    }
    console.log(sqlSent)
    pool.getConnection(
        function(err, connection) {
            connection.query(
                sqlSent,
                function(err) {
                    console.log(err)
                }
            )
        })
}

function showCol(pool, tableName) {

if(!tableName){
    console.log('has not tableName')
    return
}


    pool.getConnection(
        function(err, connection) {
            connection.query(
                'SHOW COLUMNS FROM ' + tableName,
                function(err, results) {
                    if (err) {
                        throw err
                    }
                    console.log(results)
                    connection.release();
                    return results

                })
        })
}

// showCol(client,'student')
// 
// 

// delData(client,{
//     tableName:'student',
//     condition:'id = 11'
// })

function delData(pool, para) {

if(!para.tableName){
    console.log('has not tableName')
    return
}


    var sqlSent = 'DELETE FROM ' + para.tableName
    if (para.condition) {
        sqlSent += ' WHERE ' + para.condition
    }

    pool.getConnection(
        function(err, connection) {
            connection.query(
                sqlSent,
                function(err, results) {
                    if (err) {
                        console.log(err)
                        throw err
                    }
                    console.log(results)
                }
            )
        })
}




// var b =getData(client,{tableName:"student",col:["id"],order:'height',condition:" age in (10,13)"},function(results){
//    console.log(results)
//    return results
// })


// para {
// tableName:"student"
// col:["id","age"]
// condition:"id>5"
// order:'age'
// }
function getData(pool, para, callback) {

if(!para.tableName){
    console.log('has not tableName')
    return
}


    var col = para.col?para.col.join(','):'*'
    var sqlSent = 'SELECT ' + col + " FROM " + para.tableName
    if (para.condition) {
        sqlSent += ' WHERE ' + para.condition
    }
    if (para.order) {
        sqlSent += ' ORDER BY ' + para.order
    }

    pool.getConnection(
        function(err, connection) {
            connection.query(sqlSent, function(err, results, fields) {
                if (err) {
                    throw err;
                };
                if (callback && callback instanceof Function) {
                    callback(results);
                }
            })
        }
    );
}







module.exports = {
    createPool: createPool,
    createTable: createTable,
    doSql: doSql,
    createDB: createDB,
    useDB: useDB,
    insertData: insertData,
    updateData: updateData,
    delData: delData,
    getData: getData,
    showCol: showCol
}
