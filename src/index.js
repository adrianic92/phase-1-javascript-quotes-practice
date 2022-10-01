const quoteList = document.querySelector("#quote-list")
const form = document.querySelector("form")

form.addEventListener("submit", e => {
    e.preventDefault()

    fetch("http://localhost:3000/quotes", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            quote: e.target.quote.value,
            author: e.target.author.value
        })
    })
    .then(resp => resp.json())
    .then(quote => {
        console.log(quote)
        renderQuote(quote)
    })
})


function renderQuote(quote) {
    const li = document.createElement("li")
    li.className = "quote-card"
    
    let likesCount;
    if (quote.likes) {
        likesCount = quote.likes.length
    } 
    else {
        likesCount = 0
    }
    
    li.innerHTML = 
    `<blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${likesCount}</span></button>
        <button class='btn-danger'>Delete</button>
    </blockquote>`
    
    const liker = li.querySelector(".btn-success");
    const deleter = li.querySelector(".btn-danger");

    liker.addEventListener("click", () => {
        fetch("http://localhost:3000/likes", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                quoteId: quote.id
            })
        })
        .then(resp => resp.json())
        .then(() => {
            const span = li.querySelector("span")
            span.textContent = parseInt(span.textContent) + 1
        })
    })

    deleter.addEventListener("click", () => {
        li.remove();
        fetch(`http://localhost:3000/quotes/${quote.id}`, {
            method: "DELETE"
        })
    })

    quoteList.append(li)
}

function renderQuotes(quotes) {
    quotes.forEach(quote => renderQuote(quote))
}

fetch(`http://localhost:3000/quotes?_embed=likes`)
    .then(resp => resp.json())
    .then(data => renderQuotes(data))