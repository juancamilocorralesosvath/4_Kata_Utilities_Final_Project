import axios from 'axios';
import style from './styles/style.scss'
/* // You can specify which plugins you need
import { Tooltip, Toast, Popover } from 'bootstrap'; */
// esto lo vamos a usar mas adelante
/* const AMOUNT = 10;
const category = document.getElementById("1");
const difficulty = document.getElementById("2");
const type = document.getElementById("3");
const btn = document.getElementById("awesome-btn"); */
// bueno, ya hicimos que una peticion funcionara
// aqui hacemos una peticion como un usuario la haria: con categoria,, 
// dificultad y tipo de respuesta 

const categoriesContainer = document.getElementById('categories');
const answersContainer = document.getElementById('answersContainer');
const multipleAnswers = document.getElementById('multiple');
const booleanAnswers = document.getElementById('boolean');
const difficultyContainer = document.getElementById('difficulty');
let globalArrayOfAnswers = [];


// esta funcion la ocuparemos una vez que terminemos de 'recolectar' todos los parametros...
/* const generateTrivia = () => {
    axios.get(`https://opentdb.com/api.php?amount=${AMOUNT}&category=${Number(category.value)}&difficulty=${difficulty.value}&type=${type.value}`)
    .then((resp)=> {
        console.log(resp);
    })
} */
// pido o hago un 'GET' a la API, pidiendole que me traiga todas las categorias.
// de esta manera se las muestro al usuario para que seleccione la que quiera
const requestTriviaCategories = () => {
    axios.get('https://opentdb.com/api_category.php')
        .then((response) => {
            let categories = response.data.trivia_categories;
            Promise.all(categories)
                .then(categories => {
                    generateCategoryCards(categories);
                })
        })
        .catch((error => console.log(error)))
}
// ahora que verifique que si puedo llamar a esta funcion dentro del .then de axios de 
//'requestTriviaCategories()', lo que quiero hacer es crear o generar los botones 
// donde va a aparecer cada posible categoria.
// categories es un arreglo 
const generateCategoryCards = (categories) => {
    categories.forEach(category => {
        let card = document.createElement('div');
        // clasess: 'col-xs-1 col-sm-11 col-md-5 col-lg-4'
        //           d-grid gap-2 d-md-block
        card.className = 'card  d-grid gap-2 d-md-block';
        let cardBody = document.createElement('div');
        cardBody.className = 'card-body';
        let cardTitle = document.createElement('h5');
        cardTitle.className = 'card-title';
        cardTitle.innerText = category.name;
        let cardId = document.createElement('span');
        cardId.className = 'badge bg-secondary';
        cardId.innerText = category.id;
        let btn = document.createElement('button');
        btn.className = 'btn btn-primary';
        btn.appendChild(cardId);
        btn.appendChild(cardTitle);
        cardBody.appendChild(btn);
        card.appendChild(cardBody);
        categoriesContainer.appendChild(card);
    });
}
// listo, la verdad ni siquiera yo entendi muy bien como funciono esto XD, porque no le estoy pasando ningun parametro 
// cuando llamo esta funcion... pero bueh
const handleClickCategories = (props) => {
    // aqui lo quue hago es traerme el id de cada categoria
    // pero, aun estoy pensando en como manejar la respuesta del usuario... 
    // podria ser mediante un arreglo global...
    let textId = props.path[1].childNodes[0].innerText;
    let numberId = Number(textId.slice(0, 2));
    globalArrayOfAnswers.push(numberId);
    categoriesContainer.style.display = 'none';
    answersContainer.style.display = 'inline';
}
const handleClickMultipleAnswers = () => {
    globalArrayOfAnswers.push(multipleAnswers.id);
    selectDifficulty();

}
const handleClickBooleanAnswers = () => {
    globalArrayOfAnswers.push(booleanAnswers.id);
    selectDifficulty();
}
// listo, en este paso culminamos por asi decir la primer parte, ya recolectamos la respuesta del usuario, 
// ahora nos falta la segunda parte, que es el juego como tal, la trivia: mostrar la pregunta, las respuestas, que el usuario eliga, etc...
const selectDifficulty = () => { 
    answersContainer.style.display = 'none';
    difficultyContainer.style.display = 'inline';
    difficultyContainer.onclick = (event)=>{ 
        globalArrayOfAnswers.push(event.target.id);
        console.log(globalArrayOfAnswers);
    }


}
requestTriviaCategories();
categoriesContainer.addEventListener('click', handleClickCategories);
multipleAnswers.addEventListener('click', handleClickMultipleAnswers);
booleanAnswers.addEventListener('click', handleClickBooleanAnswers);