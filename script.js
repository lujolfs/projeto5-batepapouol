// Perguntando e postando o nome.
const nick = prompt("Insira o seu nome!");
const nome = {name: nick};
const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', nome)

// Funções verificando se o nome está disponível e possíveis erros.
requisicao.then(sucessoNome);
requisicao.catch(erroNome);

function sucessoNome(resposta) {
    console.log(resposta.data)
}

function erroNome(erro) {
    console.log("Status code: " + erro.response.status);
    console.log("Mensagem de erro: " + erro.response.data);
    if (erro.response.status === 400) {
        alert("Nome inválido. Por favor, escolha outro.");
            // Não consegui pensar em uma forma de automatizar esse loop.
            // Vou precisar achar outro jeito caso consiga fazer a página de login.
        location.reload();
    }
} 

// Função para manter conexão
setInterval(statusConexao, 5000);
function statusConexao() {
    const conexao = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nome);
}

// Função para pegar os participantes do chat e possíveis erros.
const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
promessa.then(processarResposta);

function processarResposta(resposta) {
    console.log(resposta.data)
}

// Função para receber as mensagens.
let mensagens = []; // Cria array vazio para poder preenchê-lo com informações da API.
atualizaPfvr();
setInterval(atualizaPfvr, 3000);

function atualizaPfvr() {
    let reqMsg = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    reqMsg.then(mensagensChegaram);
}

function mensagensChegaram(msgs) {
    console.log(msgs.data)
    mensagens = msgs.data;
    renderizarMsgs();
}

// Função para renderizar as mensagens.
function renderizarMsgs() {
    const chat = document.querySelector('.conversa');
    chat.innerHTML = '';

    for(let i = 0; i < mensagens.length; i++) {
        if (mensagens[i].type === "message" && mensagens[i].to === "Todos") {
            chat.innerHTML = chat.innerHTML + `<div class="mensagem-normal bubble"><div class="hora"><h6>${mensagens[i].time}</h6></div>
            <p><span class="nome">${mensagens[i].from}</span> para <span class="nome">${mensagens[i].to}</span>: <span class="cont-men">${mensagens[i].text}</span></p></div>`
        } else if (mensagens[i].type === "status") {
            chat.innerHTML = chat.innerHTML + `<div class="status-entrada bubble"><div class="hora"><h6>${mensagens[i].time}</h6></div>
            <p><span class="nome">${mensagens[i].from}</span> ${mensagens[i].text}</p></div>`
        } else if (mensagens[i].type === "private_message" && mensagens[i].to === nick) {
            chat.innerHTML = chat.innerHTML + `<div class="mensagem-privada bubble"><div class="hora"><h6>${mensagens[i].time}</h6></div>
            <p><span class="nome">${mensagens[i].from}</span> para <span class="nome">${mensagens[i].to}</span>: <span class="cont-men">${mensagens[i].text}</span></p></div>`
        } else if (mensagens[i].type === "private_message" && mensagens[i].to != nick) {
            chat.innerHTML = chat.innerHTML
        }
        
        chat.lastElementChild.scrollIntoView();
    }
}

// Função para enviar as mensagens.
function capturaInput() {
    var texto = document.getElementById('Mensagem').value;
    const msgEnviada = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', {from: nick, to:"Todos", text:texto, type:"message"});
    msgEnviada.catch(erroMensagem)
    function erroMensagem(erro) {
        console.log("Mensagem de erro: " + erro.response.data);
        alert("O usuário não está mais na sala.");
        location.reload();
    }
    document.getElementById('Mensagem').value = "";
    atualizaPfvr();
}

// Função para evniar as mensagens usando enter.
const enter = document.getElementById('Mensagem');
enter.addEventListener("keypress", function onEvent(event) {
    if (event.key === "Enter") {
        capturaInput();
    }
})