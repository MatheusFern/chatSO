const socket = io();

//variaveis iniciais 

let username = '';
let userList = [];

//pegar dados do html 

let loginPage = document.querySelector('#loginPage');
let chatPage = document.querySelector('#chatPage');
let loginInput = document.querySelector('#loginNameInput');
let textInput = document.querySelector('#chatTextInput');

//visualizacao da tela

loginPage.style.display = 'flex';
chatPage.style.display = 'none';

//FUCOES 
//renderiza a lista de usuarios no chat
function renderUserList() {
  let ul = document.querySelector('.userList');
  ul.innerHTML = '';

  userList.forEach(i => {
      ul.innerHTML += '<li>'+i+'</li>';
  });
}

//adicionar mensagem

function addMessage(type, user, msg) {
  let ul = document.querySelector('.chatlist');

  switch (type) {
    case 'status':
      ul.innerHTML += '<li class="m-status">'+msg+'</li>';
      break;
    case 'msg':
      if (username == user) {
        ul.innerHTML += '<li class="m-txt"><span class="me">'+user+'</span> '+msg+'</li>';
      } else {
        ul.innerHTML += '<li class="m-txt"><span>'+user+'</span> '+msg+'</li>';
      }
      break;
  }
  ul.scrollTop = ul.scrollHeight;
}

//inputs 
//"LOGIN"
loginInput.addEventListener('keyup', (e) => {
  if(e.keyCode === 13) {
      let name = loginInput.value.trim();
      if(name != '') {
          username = name;
          document.title = 'Chat ('+username+')';
          socket.emit('join-request', username);
      }
  }
});
//"MENSAGENS"
textInput.addEventListener('keyup', (e) => {
    if(e.keyCode === 13) {
        let txt = textInput.value.trim();
        textInput.value = '';

        if(txt != '') {
            addMessage('msg', username, txt);
            socket.emit('send-msg', txt);
        }
    }
});

//sockets
socket.on('user-ok', (list) => {
  loginPage.style.display = 'none';
  chatPage.style.display = 'flex';
  textInput.focus();

  addMessage('status', null, 'Conectado!');

  userList = list;
  renderUserList();
});

socket.on('list-update', (data) => {
  if (data.joined) {
    addMessage('status', null, data.joined + ' entrou no chat!');
  }
  if (data.left) {
    addMessage('status', null, data.left + ' saiu do chat!');
  }
  userList = data.list;
  renderUserlist();
});

socket.on('show-msg', (data) => {
  addMessage('msg', data.username, data.message);
});