import axios from 'axios';
import style from './styles/style.scss'

const categoriesContainer = document.getElementById('categories');
const answersContainer = document.getElementById('answersContainer');
const multipleAnswers = document.getElementById('multiple');
const booleanAnswers = document.getElementById('boolean');
const difficultyContainer = document.getElementById('difficulty');
const divQuestionAnswers = document.getElementById('questions');
const lastSection = document.getElementById('lastOne');
const lastBtn = document.getElementById('lastBtn');
let globalArrayOfAnswers = [];
let globalArrayOfQuestions = [];
let globalScore = 0;

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
// ahora que verifiqué que si puedo llamar a esta funcion dentro del .then de axios de 
//'requestTriviaCategories()', lo que quiero hacer es crear o generar los botones 
// donde va a aparecer cada posible categoria.
// categories es un arreglo 
const generateCategoryCards = (categories) => {
    categories.forEach(category => {
        let cardContainer = document.createElement('div');
        cardContainer.className = 'col-sm'; 
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
        cardContainer.appendChild(card);
        categoriesContainer.appendChild(cardContainer);
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
    answersContainer.style.display = 'flex';
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
    difficultyContainer.style.display = 'flex';
    difficultyContainer.onclick = (event)=>{ 
        globalArrayOfAnswers.push(event.target.id);
        generateTrivia(globalArrayOfAnswers);
        difficultyContainer.style.display = 'none';
        divQuestionAnswers.style.display = 'flex';

    }
}
// ahora que ya recolectamos los parametros, generamos la trivia
const generateTrivia = (answers) => {
    const AMOUNT = 10;
    const category = answers[0];
    const type = answers[1];
    const difficulty = answers[2];

    axios.get(`https://opentdb.com/api.php?amount=${AMOUNT}&category=${category}&difficulty=${difficulty}&type=${type}`)
    .then((resp)=> {
        // bien, aqui ya obtenemos la respuesta de la API
        let questions = resp.data.results;
        Promise.all(questions)
        .then(questions => {
            console.log(questions);
            globalArrayOfQuestions = questions;
            showQuestion();
        })
    })
    .catch(err=> console.log(err));
}
// renderizo o muestro en pantalla las preguntas, pero deberia ser con un control
/* const renderQuestions = (questions) => {
    let questionsContainer = document.getElementById('questions');
    let counter = 0;
    // bueno, me renderiza las preguntas, pero no se aun como hacer la 
    //validacion de que al momento en que se seleccione la respuesta correcta, 
    //entonces ahí sí se avanze... hmm...
    questions.forEach(question => {
        if(counter === 0){
            let title = document.createElement('h1');
            title.innerText = question.question;
            let answersArray = question.incorrect_answers.slice();
            answersArray.push(question.correct_answer);
            let btns = [];
            answersArray.forEach(answer => { 
                let btn = document.createElement('button');
                btn.className = 'btn btn-primary';
                btn.innerText = answer;
                btns.push(btn);
            })
            questionsContainer.appendChild(title);
            btns.forEach(btn => { 
                questionsContainer.appendChild(btn);
            })
            //counter++;
        }
    })
} */
const showQuestion = (index = 0)=> { 
    difficultyContainer.style.display = 'none';
    let questions = globalArrayOfQuestions;
    let counter = index;
    const currentQuestion = questions[index];
    // bueno, no se por que pero me toco llamar al h1 por su id, porque cuando lo 
    // llamaba mediante la lista de elementos con nombre de clase, no me funcionaba...
    // pero bueh, aqui funciona.
    const title = document.getElementById('questionTitle');
    const elements = document.getElementsByClassName('questionAnswers');
    // bien, lo que hice aqui fue desordenar las respuestas para que la correcta no quedara siempre en el mismo lugar
    if(currentQuestion === undefined){ 
        divQuestionAnswers.style.display = 'none';
        lastSection.style.display = 'flex';
        const scoreTitle = document.getElementById('score');
        scoreTitle.innerText = globalScore;
    }
    const currentPossibleAnswers = currentQuestion.incorrect_answers.concat(currentQuestion.correct_answer);
    let copy = currentPossibleAnswers.slice();
    let answersShown = copy.sort();
    console.log('answers without the sort method:',currentPossibleAnswers);
    console.log('answers with sort', answersShown);
    title.innerText = decodeHTMLEntities(currentQuestion.question);
    for(let i=0; i < elements.length; i++){ 
        elements[i].innerText = decodeHTMLEntities(answersShown[i]);
      
    } 
        //excelente! ya se avanza a la proxima pregunta una vez que
        //se ha escogido la respuesta correcta.
        //ahora me falta:
        //1) manejar el efecto y estilo cuando se responde, en este momento
        //  pongo que si la respuesta fue erronea la ponga de color rojo
        // pero al avanzar a la siguiente, se mantiene ese color en la casilla correspondiente
        //2) hacer el manejo de cuando se terminen las preguntas, mostrarle al user el puntaje y 
        //   el boton para volver a jugar.
        divQuestionAnswers.onclick = (event) => {
            let chosenAnswer = event.target.innerText;
            const actuallyCorrectOne = decodeHTMLEntities(currentQuestion.correct_answer); 
            if(chosenAnswer === actuallyCorrectOne){
                counter++;
                globalScore += 100;
                showQuestion(counter);
            }else{
                event.target.innerText = 'nop!';
            }
        }
    
}
const playAgainYuju = (e) => {
    globalArrayOfAnswers = [];
    globalArrayOfQuestions = [];
    lastSection.style.display = 'none';
    categoriesContainer.style.display = 'flex';
}

// esto no lo hice yo eh, es de stackoverflow jijji
const decodeHTMLEntities = (text) => {
    let textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  }
requestTriviaCategories();
categoriesContainer.addEventListener('click', handleClickCategories);
multipleAnswers.addEventListener('click', handleClickMultipleAnswers);
booleanAnswers.addEventListener('click', handleClickBooleanAnswers);
lastBtn.addEventListener('click', playAgainYuju);
//divQuestionAnswers.addEventListener('click', handleQuestionsClick);
