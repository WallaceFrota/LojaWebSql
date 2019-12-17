// DESENVOLVIDO POR: Wallace Frota
// GitHub: https://github.com/wallacefrota
// Instagram: @frotadev
// Site: http://frotadev.com

// abre o banco cursos, com bd com 2000 registros
var db = window.openDatabase("Database", "1.0", "Cursos", 2000);
db.transaction(createDB, errorDB, successDB);

// fica verificando se o dispositivo já está pronto
document.addEventListener("deviceready", onDeviceReady, false);

// cria tabela na bd
function onDeviceReady() {
    db.transaction(createDB, errorDB, successDB);
}

// trata erro de criação do bd
function errorDB(err) {
    console.log(err);
}

// executa se criou corretamente
function successDB() {}

// cria das tabelas se a mesma não existir
function createDB(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS Cursos (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, nome VARCHAR(50), desc VARCHAR(50), qtd NUM(120), preco NUM(120))');
    tx.executeSql('CREATE TABLE IF NOT EXISTS Compras(id INTEGER PRIMARY KEY, nome VARCHAR(50), valor NUM(15), vagas NUM(15))');
}