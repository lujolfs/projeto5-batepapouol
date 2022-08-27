//Perguntando e postando o nome.
const nome = {name: prompt("Insira o seu nome!")};

const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', nome)

//Funções verificando se o nome está disponível e possíveis erros.
requisicao.then(sucessoNome);
requisicao.catch(erroNome);

function sucessoNome(resposta) {
    console.log("Nome show");
    console.log(resposta.data)
}

function erroNome(erro) {
    console.log("Status code: " + erro.response.status);
    console.log("Mensagem de erro: " + erro.response.data);
    if (erro.response.status === 400) {
        alert("Nome inválido. Por favor, escolha outro.");
            //Não consegui pensar em uma forma de automatizar esse loop.
            //Vou precisar achar outro jeito caso consiga fazer a página de login.
        location.reload();
    }
} 

//Função para manter conexão

setInterval(statusConexao, 5000);
function statusConexao() {
    const conexao = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nome);
    console.log("Passaram 5 segundos.");
}


//Função para pegar os participantes do chat e possíveis erros.
const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
promessa.then(processarResposta);

function processarResposta(resposta) {
    console.log(resposta.data)
    console.log("Chegou familia")
}

