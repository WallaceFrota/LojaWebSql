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

// buscando valores da bd
function cursos_view() {
    db.transaction(cursos_view_db, errorDB, successDB);
}

// monta a matriz com os registros da tabela cursos
function cursos_view_db(tx) {
    tx.executeSql('SELECT * FROM Cursos', [], cursos_view_data, errorDB);
}

// mostra os registros da tabela cursos
function cursos_view_data(tx, results) {
    $("#cursos_listagem").empty();

    var len = results.rows.length;

    for(var i = 0; i < len; i++) {
        if (len === "" || len === 0) {
            $("#alert").append(
                "<div class='alert alert-warning' role='alert'>" +
                     "NENHUM CURSO DISPONÍVEL NO MOMENTO!" +
                 "</div>"
            );
        } else {
            // lista os cursos na div cursos_listagem
            $("#cursos_listagem").append(
            "<div class='col-sm-6 col-md-4 mb-3 no-padding'>" +
            "<div class='card'>" +
            "<div class='card-body'>" +
            "<h4 class='card-title'>" + results.rows.item(i).nome + "</h4>" +
            "<p class='card-text'>" + results.rows.item(i).desc + "</p>" +
            "<p class='card-text'>" + "Vagas Disponíveis: " + results.rows.item(i).qtd + "</p>" +
            "<p class='card-text font-weight-bold'>" + "Valor R$ " + results.rows.item(i).preco + ",00" + "</p>" +
            "<input type='button' class='btn btn-primary form-control' data-toggle='modal' data-target='#tela_carrinho' value='Comprar' onclick='curso_abrir_carrinho(" + results.rows.item(i).id + ")'></input>" +
            "</div>" +
            "</div>" +
            "</div>"
            );
        }
    }
}
// função abrir carrinho recebendo o parametro id do curso
function curso_abrir_carrinho(curso_id) {
    $("#tela_home").hide();
    $("#tela_inserir").hide();
    $("#tela_carrinho").show();

    $("#curso_id_update").val(curso_id); // id repassado na função

    curso_exibecart(); // chamando função de exibir carrinho

}
// função executada quando clicada em efetuar compra
function curso_exibecart() {
    db.transaction(curso_exibe_db, errorDB, successDB);
}
// função atualiza dados do estoque após compra
function curso_exibe_db(tx) {

    var curso_id_novo = $("#curso_id_update").val(); // pegando o valor do id

    // executa ações no bd
    tx.executeSql(
        'SELECT * FROM Cursos WHERE id = ?', [curso_id_novo],
            function(tx, results){
                var nomeCartt = document.getElementById("nomeCart");
                var descCartt = document.getElementById("descCart");
                var qtdCartt = document.getElementById("qtdCart");
                var valorCartt = document.getElementById("valorCart");
    
                for(var i = 0; i < results.rows.length; i++) {
                    var row = results.rows.item(i);
                    var qtdEstoque = row.qtd;
                    var precoTot = row.preco;
                    var nomeCurso = row.nome;
                    nomeCartt.innerHTML += "<span class='font-weight-light'>" + row.nome + "</span>";
                    descCartt.innerHTML += "<span class='font-weight-light'>" + row.desc + "</span>";
                    qtdCartt.innerHTML += "<span class='font-weight-light'>" + row.qtd + "</span>";
                    valorCartt.innerHTML += "<span class='font-weight-light'>" + row.preco + ",00" + "</span>";
                    $("#curso_qtd_update").val(qtdEstoque);
                    $("#curso_preco").val(precoTot);
                    $("#curso_nome").val(nomeCurso);
                }
            }
    );
}
// função executada ao efetuar compra
function curso_compra() {
    db.transaction(curso_update_db, errorDB, successDB);
}
// função que realiza ação de update de estoque
function curso_update_db(tx) {
    var curso_id_novo = $("#curso_id_update").val(); // pegando o valor do id
    var curso_qtd_novo = $("#curso_qtd_update").val();
    var nome = $("#curso_nome").val();
    var curso_preco = $("#curso_preco").val();
    var escQtd= $("#qtdEsc").val();
    
    var decEstoque = curso_qtd_novo - escQtd;
    var tot = curso_preco * escQtd;

    // update do estoque na bd
    tx.executeSql('INSERT INTO Compras (nome, valor, vagas) VALUES ("' + nome + '", ' + tot + ', ' + escQtd + ')');
    tx.executeSql('UPDATE Cursos SET qtd = "' + decEstoque + '" WHERE id = "' + curso_id_novo + '" ');

    // exibe alerta de sucesso na compra
    $("#alert").append(
        "<div class='alert alert-success bg-success' role='alert'>" +
            "<h5 class='text-white'>" + "COMPRA REALIZADA COM SUCESSO!" + "</h5>" +
         "</div>"
    );

    // telas exibição
    // recarrega pagina após quase 1seg
    setTimeout(function(){
        location.reload(1);
    }, 1000);
    $("#tela_inserir").hide();
    $("#tela_carrinho").hide();
}
// chama o modal que exibe compras feitas
function cursos_abrir_tela_compras(){
    cursos_comprados_view();
}
// chama a função que exibe cursos comprados do bd
function cursos_comprados_view() {
    db.transaction(cursos_comprados_view_db, errorDB, successDB);
}
  
//Monta a matriz com os registros da tabela Compras
function cursos_comprados_view_db(tx) {
    tx.executeSql('SELECT * FROM Compras', [], cursos_comprados_view_data, errorDB);
}
  
//Mostra os cada curso comprado
function cursos_comprados_view_data(tx, results) {
    $("#compras_feitas_listagem").empty();
    var len = results.rows.length;
  
    for (var i = 0; i < len; i++) {
      $("#compras_feitas_listagem").append(
        "<tr class='curso_item_lista'>" +
        "<td>" + results.rows.item(i).id + "</td>" +
        "<td><h6>" + results.rows.item(i).nome + "</h6></td>" +
        "<td class='pl-3'><h6>" + results.rows.item(i).vagas + "</h6></td>" +
        "<td><h6>" + results.rows.item(i).valor + ",00" + "</h6></td>" +
        "<td><input type='button' class = 'btn btn-sm btn-danger' value ='x' onclick='excluir_curso(" + results.rows.item(i).id + ")'></td>" +
        "</tr>");
    }
}
// exclui o curso de acordo com o id
function excluir_curso(excluir){
    $("#curso_id_delete").val(excluir);
    db.transaction(excluir_cursosDB, errorDB, successDB);
}
  
function excluir_cursosDB(tx){
    var id_excluir = $("#curso_id_delete").val();
    tx.executeSql('DELETE FROM Compras WHERE id = ' + id_excluir);
    alert("Curso removido do histórico de compras!");

    // atualiza a tela modal com historico de cursos comprados
    cursos_comprados_view();
}
// função exibe subtotal no carrinho
function subTotalCompra() {
    var total = document.getElementById("subtot");

    var escQtdSub = $(".escQtdSub").val();
    var curso_preco_compra = $("#curso_preco").val();

    var subTotal = curso_preco_compra * escQtdSub; // subtotal

    console.log(subTotal)

    total.innerHTML = "<span class='font-weight-normal'>" + subTotal + ",00"  + "</span>"; // mostrando subtotal
}
// função fecha modal e recarrega página
function modalClose() {
    location.reload(true);
}