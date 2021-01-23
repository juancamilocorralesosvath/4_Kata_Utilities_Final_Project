import axios from 'axios';
const AMOUNT = 10;
const category = document.getElementById("1");
const difficulty = document.getElementById("2");
const type = document.getElementById("3");
const btn = document.getElementById("awesome-btn");
 // bueno, ya hicimos que una peticion funcionara
const myFunction = () => {
    axios.get(`https://opentdb.com/api.php?amount=${AMOUNT}&category=${Number(category.value)}&difficulty=${difficulty.value}&type=${type.value}`)
    .then((resp)=> {
        console.log(resp);
    })
}
btn.addEventListener('click', myFunction);
