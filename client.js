
const form = document.querySelector('form');
const loadingGif = document.querySelector('.loading');
const mewsEl = document.querySelector('.mews');

console.log(window.location.href);
const API_URL = window.location.href + "mews";
console.log(API_URL);

listAllMews();

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');
    const mew = {
        name,
        content
    };
    form.style.display = "none";
    loadingGif.style.display = "block";

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(mew),
        headers: {
            'Content-Type': 'application/json'
        }
    })  .then(response => response.json())
        .then(res => {
            form.reset();
            setTimeout(() => {
            form.style.display = "block";
            loadingGif.style.display = "none";
            }, 30000);
            listAllMews();
        });
});



function listAllMews() {
    mewsEl.innerHTML = '';
    console.log('before fetch');
    fetch(API_URL)
        .then(response => response.json())
        .then(mews => {
            console.log(mews);
            mews.reverse();
            mews.forEach(mew => {
                const div = document.createElement('div');
                div.setAttribute('class', 'mew');

                const header = document.createElement('h3');
                header.textContent = mew.name;

                const content = document.createElement('p');
                content.textContent = mew.content;


                div.appendChild(header);
                div.appendChild(content);
                
                mewsEl.appendChild(div);
            });
        });
}





