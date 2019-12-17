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
// prepara para incluir registros na tabela cursos
function cursos_insert() {
    db.transaction(cursos_insert_db, errorDB, successDB);
}

// incluir registros na tabela cursos
function cursos_insert_db(tx) {
    var nome = $("#curso_name").val();
    var desc = $("#curso_desc").val();
    var qtd = $("#curso_qtd").val();
    var preco = $("#curso_price").val();

    tx.executeSql('INSERT INTO Cursos (nome, desc, qtd, preco) VALUES ("' + nome + '", "' + desc + '", "' + qtd + '", "' + preco + '")');

    alert("CURSO CADASTRADO COM SUCESSO!")

    // telas exibição
    location.reload(true); // recarrega
    $("#tela_inserir").hide();
    $("#tela_carrinho").hide();
}