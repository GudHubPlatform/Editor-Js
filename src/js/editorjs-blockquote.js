export default class Blockquote {
    constructor({ data }) {
        this.data = data;
    }
    static get toolbox() {
        return {
            title: 'Blockquote',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 16 16" fill="#000000" class="bi bi-blockquote-left"> <path d="M2.5 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1h-11zm5 3a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1h-6zm0 3a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1h-6zm-5 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1h-11zm.79-5.373c.112-.078.26-.17.444-.275L3.524 6c-.122.074-.272.17-.452.287-.18.117-.35.26-.51.428a2.425 2.425 0 0 0-.398.562c-.11.207-.164.438-.164.692 0 .36.072.65.217.873.144.219.385.328.72.328.215 0 .383-.07.504-.211a.697.697 0 0 0 .188-.463c0-.23-.07-.404-.211-.521-.137-.121-.326-.182-.568-.182h-.282c.024-.203.065-.37.123-.498a1.38 1.38 0 0 1 .252-.37 1.94 1.94 0 0 1 .346-.298zm2.167 0c.113-.078.262-.17.445-.275L5.692 6c-.122.074-.272.17-.452.287-.18.117-.35.26-.51.428a2.425 2.425 0 0 0-.398.562c-.11.207-.164.438-.164.692 0 .36.072.65.217.873.144.219.385.328.72.328.215 0 .383-.07.504-.211a.697.697 0 0 0 .188-.463c0-.23-.07-.404-.211-.521-.137-.121-.326-.182-.568-.182h-.282a1.75 1.75 0 0 1 .118-.492c.058-.13.144-.254.257-.375a1.94 1.94 0 0 1 .346-.3z"/> </svg>'
        };
    }
    render() {

        let blockquoteBlock = document.createElement('div');
        blockquoteBlock.classList.add('blockquote_block');

        let newQuote = document.createElement('div');
        newQuote.classList.add('blockquote_element');
        newQuote.setAttribute('contenteditable', 'true');
        
        let newAuthor = document.createElement('div');
        newAuthor.classList.add('blockquote_author');
        newAuthor.setAttribute('contenteditable', 'true');

        if(this.data.saved_quote){

            let get_quote = this.data.saved_quote;
            let get_author = this.data.saved_author;
            
            newQuote.textContent = get_quote;
            newAuthor.textContent = get_author;

        }else{
            newQuote.textContent = 'Lorem ipsum dolor';
            newAuthor.textContent = "Cicero's";
          
        }
        newQuote.setAttribute('placeholder', "Lorem ipsum dolor");
        newQuote.style.color = '#707684';
        newQuote.style.fontWeight = '400';

        newAuthor.setAttribute('placeholder', "Cicero's");
        newAuthor.style.color = '#707684';
        newAuthor.style.fontWeight = '400';

        blockquoteBlock.appendChild(newQuote);
        blockquoteBlock.appendChild(newAuthor);

        this.focus(newQuote);
        this.focus(newAuthor);

        return blockquoteBlock;
    }

    focus(field) {
        field.addEventListener('focus', () => {
            if (field.innerText === "Lorem ipsum dolor" || field.innerText === "Cicero's") {
                field.innerText = '';
                field.style.color = 'rgba(0,0,0,0.87)';
                field.style.fontWeight = '300';
            }
        })
        field.addEventListener('focusout', () => {
            if (field.innerText === "") {
                field.innerText = field.getAttribute('placeholder');
                field.style.color = '#707684';
                field.style.fontWeight = '400';
            } else {
                field.innerText = field.innerText;
                field.style.color = 'rgba(0,0,0,0.87)';
                field.style.fontWeight = '300';
            }
        })
    }
    save(blockContent) {
        let blockquote = blockContent.querySelector('.blockquote_element').innerText
        let author = blockContent.querySelector('.blockquote_author').innerText
        
        return {
            saved_quote: blockquote,
            saved_author: author
        }
    }
}