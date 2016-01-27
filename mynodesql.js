var mysql = require('mysql')

// 创建连接池
// var client = createPool({
//     database: "aa"
// })

function createPool(para) {
    return mysql.createPool({

        'user': para.user || 'root',
        'password': para.password || 'root',
        'database': para.database,
        'host': para.host || 'localhost',
        'port': para.port || 3306
    });
}

// createTable(client,newTable)
// // 创建表 
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
    if (para.unique) {
        sqlSent += " " + "UNIQUE (" + para.unique.join(",") + ")"
    }
    if (para.foreign && para.refer) {
        sqlSent += ' FOREIGN KEY (' + para.foreign + ") REFERENCES " + para.refer
    }
    if (para.check) {
        sqlSent += 'CHECK (' + para.check + ")"
    }
    sqlSent += ")"
    console.log(sqlSent)
    pool.getConnection(
        function(err, connection) {
            connection.query(
                sqlSent
            );
            connection.release()
        }
    );
}


// 直接执行语句
function doSql(pool, sqlSent, callback) {
    if (sqlSent) {
        pool.getConnection(
            function(err, connection) {
                if (err) {
                    throw err;
                }
                connection.query(
                    sqlSent,
                    function(err, results) {
                        if (callback && callback instanceof Function) {
                            callback(results)
                        }
                    }
                );

                connection.release()
            }
        )
    };
}



function TableUse(pool, tableName) {
    if (pool && tableName) {
        this.pool = pool;
        this.tableName = tableName;
    } else {
        console.log('parameter false')
        return false
    }
}

TableUse.prototype = {
    alterTable: alterTable,
    insertData: insertData,
    updateData: updateData,
    showCol: showCol,
    delData: delData,
    getData: getData,
    getDataByID:getDataByID
}

function alterTable(para, callback) {

    var sqlSent = 'ALTER TABLE ' + this.tableName + " ";
    sqlSent += para.manner + " ";
    if (para.manner !== 'add') {
        sqlSent += "COLUMN "
    }
    sqlSent += para.col + " ";
    if (para.manner == "change") {
        sqlSent += para.col + " "
    }
    if (para.manner !== "drop") {
        sqlSent += para.dataType
    }
    console.log(sqlSent)
    this.pool.getConnection(
        function(err, connection) {
            connection.query(sqlSent, function(err, results) {
                if (err) {
                    throw err;
                }
                if (callback && callback instanceof Function) {
                    callback(results);
                }
            });
            connection.release()
        }
    );
}


function insertData(para, callback) {

    var sqlSent = 'INSERT INTO ' + this.tableName + ' ('
    var value = [];
    var keyName = []
    for (var key in para) {
        keyName.push(key)
        if ((typeof para[key]) === 'string') {
            value.push("'" + para[key] + "'")
        } else {
            value.push(para[key])
        }

    }
    keyName = keyName.join(', ');
    value = value.join(', ')
    sqlSent = sqlSent + keyName + ') ' + 'VALUES (' + value + ')'
    console.log(sqlSent)
    this.pool.getConnection(
        function(err, connection) {
            connection.query(
                sqlSent,
                function(err, results) {
                    console.log(err)
                    if (callback && callback instanceof Function) {
                        callback(results);
                    }
                }
            );
            connection.release()

        }
    );

}

function updateData(para, callback) {


    var sqlSent = 'UPDATE ' + this.tableName + ' SET ';
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
    this.pool.getConnection(
        function(err, connection) {
            connection.query(
                sqlSent,
                function(err, results) {
                    console.log(err)
                    if (callback && callback instanceof Function) {
                        callback(results);
                    }
                }
            )
            connection.release()
        })
}


function showCol() {
    var that = this
    this.pool.getConnection(
        function(err, connection) {
            connection.query(
                'SHOW COLUMNS FROM ' + that.tableName,
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

function delData(condition, callback) {

    var sqlSent = 'DELETE FROM ' + this.tableName
    if (condition) {
        sqlSent += ' WHERE ' + condition
    }

    this.pool.getConnection(
        function(err, connection) {
            connection.query(
                sqlSent,
                function(err, results) {
                    if (err) {
                        console.log(err)
                        throw err
                    }
                    if (callback && callback instanceof Function) {
                        callback(results);
                    }
                    console.log(results)
                }
            )
            connection.release()
        })
}

function getData(para, callback) {
    // 直接输入where条件语句的情况
    if (typeof para === "string") {
        sqlSent = 'SELECT * FROM ' + this.tableName + ' WHERE ' + para

    } else {
        var col = para.col ? para.col.join(',') : '*'
        var sqlSent = 'SELECT ' + col + " FROM " + this.tableName
        if (para.condition) {
            sqlSent += ' WHERE ' + para.condition
        }
        if (para.order) {
            sqlSent += ' ORDER BY ' + para.order
        }
    }

    console.log(sqlSent)
    this.pool.getConnection(
        function(err, connection) {
            connection.query(sqlSent, function(err, results, fields) {
                if (err) {
                    throw err;
                };
                if (callback && callback instanceof Function) {
                    callback(results);
                }
                connection.release()
            })

        }
    );
}


function getDataByID(para, callback) {
    sqlSent = 'SELECT * FROM ' + this.tableName + ' WHERE id=' + para
    console.log(sqlSent)
    this.pool.getConnection(
        function(err, connection) {
            connection.query(sqlSent, function(err, results, fields) {
                if (err) {
                    throw err;
                };
                if (callback && callback instanceof Function) {
                    callback(results);
                }
                connection.release()
            })

        }
    );
}



module.exports = {
    doSql: doSql,
    createPool: createPool,
    createTable: createTable,
    TableUse: TableUse
}
