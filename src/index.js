import axios from 'axios';
import style from './styles/style.scss'
 // esto lo vamos a usar mas adelante
/* const AMOUNT = 10;
const category = document.getElementById("1");
const difficulty = document.getElementById("2");
const type = document.getElementById("3");
const btn = document.getElementById("awesome-btn"); */
 // bueno, ya hicimos que una peticion funcionara
 // aqui hacemos una peticion como un usuario la haria: con categoria,, 
 // dificultad y tipo de respuesta 
const generateTrivia = () => {
    axios.get(`https://opentdb.com/api.php?amount=${AMOUNT}&category=${Number(category.value)}&difficulty=${difficulty.value}&type=${type.value}`)
    .then((resp)=> {
        console.log(resp);
    })
}

const requestTriviaCategories = () => {
    axios.get('https://opentdb.com/api_category.php')
    .then( (response) => {
        let categories = response.data.trivia_categories; 
        console.log(categories, "down here should appear a 'yei!'");
        generateCategoryCards(categories);
    }
    )
    .catch((error => console.log(error)))
}
// ahora que verifique que si puedo llamar a esta funcion dentro del .then de axios de 
//'requestTriviaCategories()', lo que quiero hacer es crear o generar los botones 
// donde va a aparecer cada posible categoria.
// categories es un arreglo 
const generateCategoryCards = (categories) => {
    let container = document.getElementById('row');

        categories.forEach(category => {
            let card = document.createElement('div');
            card.className = 'card  col-xs-1 col-sm-11 col-md-5 col-lg-4';
            let cardBody = document.createElement('div');
            cardBody.className = 'card-body';
            let cardTitle = document.createElement('h5');
            cardTitle.className = 'card-title';
            cardTitle.innerText = category.name;
            let cardId = document.createElement('span');
            cardId.className = 'badge bg-secondary';
            cardId.innerText = category.id;
            cardBody.appendChild(cardId);
            cardBody.appendChild(cardTitle);
            card.appendChild(cardBody);
            container.appendChild(card);
        });
}

requestTriviaCategories();