const correctPassword = "senha123"; // Defina a senha aqui
let editingIndex = null;
let newsArray = []; // Array para armazenar as notícias

const firebaseConfig = {
    apiKey: "AIzaSyBJHNh7w8Abhl7P6svp7xihJAxEYhyOMHg",
    authDomain: "piu-news1.firebaseapp.com",
    databaseURL: "https://piu-news1-default-rtdb.firebaseio.com",
    projectId: "piu-news1",
    storageBucket: "piu-news1.appspot.com",
    messagingSenderId: "66773963231",
    appId: "1:66773963231:web:dad9a4f732a6b5abb8f46a"
};

const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

function showAddForm() {
    const password = prompt("Digite a senha para adicionar uma notícia:");
    if (password === correctPassword) {
        editingIndex = null; // Resetar índice de edição
        clearForm();
        document.getElementById("newsForm").style.display = "block";
    } else {
        alert("Senha incorreta!");
    }
}

function showEditForm(index) {
    const password = prompt("Digite a senha para editar a notícia:");
    if (password === correctPassword) {
        editingIndex = index;
        const newsItem = newsArray[index];

        document.getElementById("newsTitle").value = newsItem.title;
        document.getElementById("newsLink").value = newsItem.link;
        document.getElementById("newsDate").value = newsItem.date;

        document.getElementById("newsForm").style.display = "block";
        document.querySelector(".delete").style.display = "block"; // Mostrar botão de deletar
    } else {
        alert("Senha incorreta!");
    }
}

function hideForm() {
    document.getElementById("newsForm").style.display = "none";
    clearForm();
}

function clearForm() {
    document.getElementById("newsTitle").value = '';
    document.getElementById("newsLink").value = '';
    document.getElementById("newsDate").value = '';
    if (editingIndex !== null) {
        document.querySelector(".delete").style.display = "none"; // Esconder botão de deletar
    }
    editingIndex = null;
}

function formatDate(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (value.length > 5) {
        value = value.slice(0, 5) + '/' + value.slice(5, 9);
    }
    input.value = value;
}

function addNews() {
    const newsTitle = document.getElementById("newsTitle").value;
    let newsLink = document.getElementById("newsLink").value;
    const newsDate = document.getElementById("newsDate").value;

    if (!newsLink.startsWith('http://') && !newsLink.startsWith('https://')) {
        newsLink = 'http://' + newsLink; // Adicionar http:// se necessário
    }

    const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;
    if (!datePattern.test(newsDate)) {
        alert("Data inválida! Use o formato dd/mm/aaaa.");
        return;
    }

    if (newsTitle && newsLink && newsDate) {
        const newsItem = {
            title: newsTitle,
            link: newsLink,
            date: newsDate,
            timestamp: new Date(newsDate.split('/').reverse().join('-')).getTime()
        };

        if (editingIndex === null) {
            newsArray.push(newsItem); // Adiciona nova notícia
            saveNewsToFirebase(newsItem);
        } else {
            newsArray[editingIndex] = newsItem; // Edita notícia existente
            updateNewsInFirebase(editingIndex, newsItem);
        }

        newsArray.sort((a, b) => b.timestamp - a.timestamp);
        renderNewsList();
        hideForm();
    } else {
        alert("Por favor, preencha todos os campos.");
    }
}

function saveNewsToFirebase(newsItem) {
    const newKey = database.ref('noticias/').push().key;
    database.ref('noticias/' + newKey).set(newsItem);
}

function updateNewsInFirebase(index, newsItem) {
    const key = Object.keys(newsArray)[index]; // Obtém a chave da notícia a ser editada
    database.ref('noticias/' + key).update(newsItem);
}

function renderNewsList() {
    const newsList = document.getElementById("newsList");
    newsList.innerHTML = '';

    newsArray.forEach((newsItem, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>${newsItem.title}</strong> <br>
            <a href="${newsItem.link}" target="_blank">${newsItem.link}</a> <br>
            <em>${newsItem.date}</em>
            <button class="editBtn" onclick="showEditForm(${index})">Editar</button>
            <button class="deleteBtn" onclick="deleteNews(${index})">Deletar</button>
        `;
        newsList.appendChild(listItem);
    });
}

function deleteNews(index) {
    const key = Object.keys(newsArray)[index]; // Obtém a chave da notícia a ser deletada
    database.ref('noticias/' + key).remove();
    newsArray.splice(index, 1);
    renderNewsList();
    hideForm();
}

function filterNews() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const newsList = document.getElementById("newsList");
    const newsItems = newsList.getElementsByTagName("li");

    for (let i = 0; i < newsItems.length; i++) {
        const title = newsItems[i].querySelector("strong").textContent.toLowerCase();
        const date = newsItems[i].querySelector("em").textContent.toLowerCase();
        if (title.includes(searchTerm) || date.includes(searchTerm)) {
            newsItems[i].style.display = ""; // Mostrar item
        } else {
            newsItems[i].style.display = "none"; // Esconder item
        }
    }
}

// Função para carregar notícias do Firebase ao iniciar
function loadNewsFromFirebase() {
    database.ref('noticias/').on('value', (snapshot) => {
        newsArray = []; // Limpa o array antes de carregar as notícias
        snapshot.forEach((childSnapshot) => {
            const newsItem = childSnapshot.val();
            newsArray.push(newsItem);
        });
        renderNewsList();
    });
}

// Carregar notícias ao iniciar
loadNewsFromFirebase();