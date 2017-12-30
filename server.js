const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');

//Create Connection - Remote1
const db = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12207175',
    password: 'g5aN9Qj4Zu',
    database: 'sql12207175'
});

/*const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'sql12207175'
});*/

//Create Connection - Remote2
//const db = mysql.createConnection({
//	host : 'db4free.net',
//	user : 'km1117',
//	password : 'mobicart',
//	database : 'km_db_mysql_1117'
//});

//Create Connection - Local1
//const db = mysql.createConnection({
//	host : '127.0.0.1',
//	user : 'root',
//	password : 'admin',
//	database : 'km_db_1117'
//});

//DB Connect
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Mysql connected ..');
});

const app = express();

const port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.render('index');
});

app.post('/', function(req, res) {
    res.render('index');
});

app.listen(port, function() {
    console.log('app running')
});


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// get all brand
app.get('/skm/brandSearch/', function(req, res) {
    let sql = "SELECT * FROM brand";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// get all model
app.post('/skm/modelSearch/', function(req, res) {
    let sql = "SELECT * FROM model  WHERE bid = '" + req.body.id + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// get all product
app.post('/skm/productSearch/', function(req, res) {
    let sql = "SELECT * FROM stock  WHERE item_id = '" + req.body.id + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// get all productDetails
app.post('/skm/productDetails/', function(req, res) {
    let sql = "SELECT * FROM stock  WHERE sid = '" + req.body.id + "' AND product_flag = 'Y'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// get all productTaxDetails
app.post('/skm/productTaxDetails/', function(req, res) {
    let sql = "SELECT * FROM tax_group  WHERE group_id = '" + req.body.grpid + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// insert new billNo
app.post('/skm/billNo/', function(req, res) {
    let sql = "INSERT INTO bill (created_date) VALUES ('" + req.body.createdDate + "')";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// get product details
app.get('/skm/productDetails/:productName', function(req, res) {
    let sql = "SELECT * FROM km_product_list WHERE product_model = '" + req.params.productName + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// get customer details
app.get('/skm/customerDetails/:customerPhone', function(req, res) {
    let sql = "SELECT * FROM km_customer_details WHERE phone = '" + req.params.customerPhone + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// get last customer id
app.get('/skm/getCustomerId/', function(req, res) {
    let sql = "SELECT km_cust_id FROM km_customer_details  ORDER BY km_cust_id desc LIMIT 1";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// Add new customer id
app.post('/skm/addNewCustomer/', function(req, res) {
    let sql = "INSERT INTO km_customer_details (km_cust_id, name, phone, email, address, city, state, pincode, created_date, alt_phone) VALUES ('" + req.body.id + "', '" + req.body.name + "', '" + req.body.phone + "', '" + req.body.email + "', '" + req.body.address + "', '" + req.body.city + "', '" + req.body.state + "', '" + req.body.pincode + "','" + req.body.created + "','" + req.body.altphone + "')";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        console.log("rows affected in km_customer_details : " + result.affectedRows);
        res.send(result);
    });
});

// Edit new customer id
app.post('/skm/addEditCustomer/', function(req, res) {
    let sql = "UPDATE km_customer_details SET km_cust_id = '" + req.body.id + "', name = '" + req.body.name + "', phone = '" + req.body.phone + "', email =  '" + req.body.email + "', address =  '" + req.body.address + "', city = '" + req.body.city + "', state = '" + req.body.state + "', pincode = '" + req.body.pincode + "', created_date = '" + req.body.created + "', alt_phone = '" + req.body.altphone + "' WHERE km_cust_id = '" + req.body.id + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        console.log("rows affected in km_customer_details : " + result.affectedRows);
        res.send(result);
    });
});

// get all model mobiles
app.get('/skm/brands/', function(req, res) {
    let sql = "select m.item_id, m.model,b.brand from model m inner join brand b on m.bid = b.bid";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// get tax
app.get('/skm/taxGroup/', function(req, res) {
    let sql = "select * from tax_group";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// get tax
app.get('/skm/tax/:gid/', function(req, res) {
    let sql = "select t.tax_name,t.percentage from store_tax st inner join tax t on st.tax_id = t.tax_id and st.group_id = " + req.params.gid;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.post('/skm/productInsert/', function(req, res) {
    let sql = "INSERT INTO purchase (item_id,imei_number,details,price,tax_group,bar_code,in_time) VALUES (" + req.body.item_id + ",'" + req.body.imei_number + "','" + req.body.details + "'," + req.body.price + "," + req.body.tax_group + ",'" + req.body.bar_code + "','" + req.body.in_time + "')";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.post('/skm/stockInsert/', function(req, res) {
    let sql = "INSERT INTO stock (sku_no, item_id,imei_number,details,price,tax_group,bar_code,in_time) VALUES (" + req.body.sku_no + "," + req.body.item_id + ",'" + req.body.imei_number + "','" + req.body.details + "'," + req.body.price + "," + req.body.tax_group + ",'" + req.body.bar_code + "','" + req.body.in_time + "')";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// get all mobile brand
app.get('/skm/brand/', function(req, res) {
    let sql = "select * from brand";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/skm/taxgroup/', function(req, res) {
    let sql = "select * from tax_group";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/skm/tax/', function(req, res) {
    let sql = "select * from tax";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.post('/skm/taxgroupInsert/', function(req, res) {
    let sql = "INSERT INTO tax_group (group_name) VALUES ('" + req.body.group_name + "')";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);

    });
});

app.post('/skm/taxInsert/', function(req, res) {
    let sql = "INSERT INTO tax (tax_name,percentage) VALUES ('" + req.body.tax_name + "'," + req.body.percentage + ")";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);

    });
});

app.post('/skm/taxdetailsInsert/', function(req, res) {
    let sql = "INSERT INTO store_tax (group_id, tax_id) VALUES (" + req.body.group_id + "," + req.body.tax_id + ")";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);

    });
});

app.post('/skm/brandInsert/', function(req, res) {
    let sql = "INSERT INTO brand (brand) VALUES ('" + req.body.brand + "')";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);

    });
});

app.post('/skm/modelInsert/', function(req, res) {
    let sql = "INSERT INTO model (bid, model) VALUES (" + req.body.bid + ",'" + req.body.model + "')";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.post('/skm/productUpdate/', function(req, res) {
    let sql = "UPDATE purchase SET imei_number = '" + req.body.imei_number + "' ,details ='" + req.body.details + "', price=" + req.body.price + " WHERE sku_no = " + req.body.sku_no;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        let sqll = "UPDATE stock SET imei_number = '" + req.body.imei_number + "' ,details ='" + req.body.details + "', price=" + req.body.price + " WHERE sku_no = " + req.body.sku_no;
        let query = db.query(sqll, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    });
});


// login
app.post('/skm/login/', function(req, res) {
    let sql = "select u.uid,ur.rid from users u inner join users_roles ur on u.uid = ur.uid and u.username = '" + req.body.name + "' and u.password = '" + req.body.pass + "'";

    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });

});