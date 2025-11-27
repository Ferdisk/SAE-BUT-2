let mysql = require('mysql');
let conn = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "sae2025",
        database: "sae_db"
});

const mail_input = document.getElementById("user-email");
const password_input = document.getElementById("user-password");

function subscribeClicked(){
    const mail_value = mail_input.value;
    const password_value = password_input.value;
    const first_part_mail = mail_value.split('@')[0];
    const prenom = first_part_mail.split('.')[0];
    const nom = first_part_mail.split('.')[1];
}

conn.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        let sql = "INSERT INTO utilisateurs (prenom,nom,email,role) VALUES (" + prenom + "," + nom + "," + mail_value + ",'Etudiant')";
        conn.query(sql, function(err, result) {
                if (err) throw err;
                console.log("Result: " + result);
        });
});