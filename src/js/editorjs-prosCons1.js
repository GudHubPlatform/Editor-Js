export default class ProsCons {
    constructor({ data, block }) {
        this.data = data;
        this.blockAPI = block;

        this.productPage = document.createElement('div');
        
        this.positiveNotes = document.createElement('div');
        this.posListItemElement = document.createElement('div');
        this.posPositionNoteShow = document.createElement('div');
        
        
        this.posContentNoteShow = document.createElement('div');
        
        this.negativeNotes = document.createElement('div');
        this.negListItemElement = document.createElement('div');
        this.negPositionNoteShow = document.createElement('div');
        this.negContentNoteShow = document.createElement('div');
        this.removeButtonNeg = document.createElement('div');
    }
    static get toolbox() {
        return {
            title: 'Pros Cons',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15px" height="15px" viewBox="0 0 12 12" version="1.1"><g id="surface1"><path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 10.453125 0.00390625 L 1.644531 0 C 0.738281 0 0 0.738281 0 1.644531 L 0 12 L 9.097656 12 L 9.097656 4.167969 L 9.496094 3.902344 L 10.257812 4.28125 L 11.03125 3.894531 L 12 4.378906 L 12 1.644531 C 12 0.769531 11.3125 0.0546875 10.453125 0.00390625 Z M 8.710938 1.644531 L 8.710938 11.613281 L 0.386719 11.613281 L 0.386719 1.644531 C 0.386719 0.953125 0.953125 0.386719 1.644531 0.386719 L 9.296875 0.386719 C 8.9375 0.6875 8.710938 1.140625 8.710938 1.644531 Z M 11.613281 3.75 L 11.03125 3.460938 L 10.257812 3.847656 L 9.46875 3.453125 L 9.097656 3.703125 L 9.097656 1.644531 C 9.097656 0.953125 9.660156 0.386719 10.355469 0.386719 C 11.046875 0.386719 11.613281 0.953125 11.613281 1.644531 Z M 11.613281 3.75 "/><path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 5.75 4.203125 L 6.582031 3.371094 L 7.410156 4.203125 L 7.683594 3.925781 L 6.855469 3.097656 L 7.683594 2.265625 L 7.410156 1.992188 L 6.582031 2.824219 L 5.75 1.992188 L 5.476562 2.265625 L 6.308594 3.097656 L 5.476562 3.925781 Z M 5.75 4.203125 "/><path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 3.628906 2.453125 L 3.339844 2.195312 L 1.957031 3.75 L 1.710938 3.375 L 1.386719 3.589844 L 1.914062 4.378906 Z M 3.628906 2.453125 "/><path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 0.96875 4.839844 L 4.066406 4.839844 L 4.066406 5.226562 L 0.96875 5.226562 Z M 0.96875 4.839844 "/><path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 0.96875 5.804688 L 4.066406 5.804688 L 4.066406 6.195312 L 0.96875 6.195312 Z M 0.96875 5.804688 "/><path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 0.96875 6.773438 L 4.066406 6.773438 L 4.066406 7.160156 L 0.96875 7.160156 Z M 0.96875 6.773438 "/><path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 0.96875 7.742188 L 4.066406 7.742188 L 4.066406 8.128906 L 0.96875 8.128906 Z M 0.96875 7.742188 "/><path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 0.96875 8.710938 L 4.066406 8.710938 L 4.066406 9.097656 L 0.96875 9.097656 Z M 0.96875 8.710938 "/><path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 0.96875 9.675781 L 2.515625 9.675781 L 2.515625 10.066406 L 0.96875 10.066406 Z M 0.96875 9.675781 "/><path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 5.03125 4.839844 L 8.128906 4.839844 L 8.128906 5.226562 L 5.03125 5.226562 Z M 5.03125 4.839844 "/><path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 5.03125 5.804688 L 8.128906 5.804688 L 8.128906 6.195312 L 5.03125 6.195312 Z M 5.03125 5.804688 "/><path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 5.03125 6.773438 L 8.128906 6.773438 L 8.128906 7.160156 L 5.03125 7.160156 Z M 5.03125 6.773438 "/><path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 5.03125 7.742188 L 7.355469 7.742188 L 7.355469 8.128906 L 5.03125 8.128906 Z M 5.03125 7.742188 "/></g></svg>'
        };
    }
    render() {
        const uniqueClass = this.classNameGenerator();
        /* Create parts of main block and set attributes  */
        
        this.productPage.classList.add('productPage');

        let inputProductName = document.createElement('div');
        inputProductName.classList.add('inputProductName');
        inputProductName.setAttribute('contenteditable', true);
        inputProductName.innerText = 'Add a product name';
        
        let inputAuthorMeta = document.createElement('div');
        inputAuthorMeta.classList.add('inputAuthorMeta');
        inputAuthorMeta.setAttribute('contenteditable', true);
        inputAuthorMeta.innerText = 'Add a author name';

        let review = document.createElement('div');
        review.classList.add('review');

        
        
        this.positiveNotes.classList.add('positiveNotes');

        
        this.posListItemElement.classList.add('posListItemElement');        
        this.posListItemElement.classList.add('pros');        

        
        this.posPositionNoteShow.classList.add('posPositionNoteShow');
        this.posPositionNoteShow.setAttribute('contenteditable', true);
        this.posPositionNoteShow.innerText = '+';
        
        let addButtonPos = document.createElement('div');
        addButtonPos.classList.add('addButtonPos');
        addButtonPos.innerText = '+';
        
        let addButtonNeg = document.createElement('div');
        addButtonNeg.classList.add('addButtonNeg');
        addButtonNeg.innerText = '+';
        let removeButtonPos = document.createElement('div');
        removeButtonPos.classList.add('removeButtonPos');
        removeButtonPos.innerText = 'x';

        
        
        this.posContentNoteShow.classList.add('posContentNoteShow');
        this.posContentNoteShow.setAttribute('contenteditable', true);
        this.posContentNoteShow.innerText = 'Add a pros';
        
        
        this.negativeNotes.classList.add('negativeNotes');
        
        this.negListItemElement.classList.add('negListItemElement');
        this.negListItemElement.classList.add('cons');
        
        this.negPositionNoteShow.classList.add('negPositionNoteShow');
        this.negPositionNoteShow.setAttribute('contenteditable', true);
        this.negPositionNoteShow.innerText = '-';
        
        this.negContentNoteShow.classList.add('negContentNoteShow');
        this.negContentNoteShow.setAttribute('contenteditable', true);
        this.negContentNoteShow.innerText = 'Add a cons';
        let removeButtonNeg = document.createElement('div');
        removeButtonNeg.classList.add('removeButtonNeg');
        removeButtonNeg.innerText = 'x';
        

        this.productPage.appendChild(inputProductName);
        this.productPage.appendChild(inputAuthorMeta);
        
        this.productPage.appendChild(review);


        review.appendChild(this.positiveNotes);
        this.positiveNotes.appendChild(this.posListItemElement);
        this.positiveNotes.appendChild(addButtonPos);
        this.posListItemElement.appendChild(removeButtonPos);
        this.posListItemElement.appendChild(this.posPositionNoteShow);
        this.posListItemElement.appendChild(this.posContentNoteShow);
        
        console.log('asd')
        review.appendChild(this.negativeNotes);
        this.negativeNotes.appendChild(this.negListItemElement);
        this.negativeNotes.appendChild(addButtonNeg);
        this.negListItemElement.appendChild(this.negPositionNoteShow);
        this.negListItemElement.appendChild(removeButtonNeg);
        this.negListItemElement.appendChild(this.negContentNoteShow);
        
        
        button.addEventListener('click', (e) => {
            console.log(e)
            let clicked = e.target.parentElement.className.includes('positiveNotes') ? true : false
            console.log('clicked', clicked)
            let notes = clicked ? this.positiveNotes : this.negativeNotes;
            console.log('notes', notes)
            let actualPosition = notes.childElementCount;
            console.log('actualPosition', actualPosition)
            this.addItem(clicked, actualPosition, notes)
        })
        ;
        
        let removeButtons = [removeButtonPos, removeButtonNeg]
        removeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                console.log(e)
                let clicked = e.target.parentElement
                this.removeItem(clicked)
            })
        });
        
        return this.productPage;
    }

    /* This method collect all the blocks together and return it */
    removeItem(clicked){
        clicked.remove();
    }
    addItem(positive, position, notes){
        if (positive){
            let posListItemElement = document.createElement('div');
            posListItemElement.classList.add('posListItemElement');        
            posListItemElement.classList.add('pros');
            

            let posPositionNoteShow = document.createElement('div');
            posPositionNoteShow.classList.add('posPositionNoteShow');
            posPositionNoteShow.setAttribute('contenteditable', true);
            posPositionNoteShow.innerText = '-';

            
            let removeButtonPos = document.createElement('div');
            removeButtonPos.classList.add('removeButtonPos');
            removeButtonPos.innerText = 'x';
            
            
            let posContentNoteShow = document.createElement('div');
            posContentNoteShow.classList.add('posContentNoteShow');
            posContentNoteShow.setAttribute('contenteditable', true);
            posContentNoteShow.innerText = 'Add a pros';

            notes.appendChild(posListItemElement);
            posListItemElement.appendChild(removeButtonPos);
            posListItemElement.appendChild(posPositionNoteShow);
            posListItemElement.appendChild(posContentNoteShow);
        }else{
            let negListItemElement = document.createElement('div');
            negListItemElement.classList.add('negListItemElement');        
            negListItemElement.classList.add('cons');
            

            let negPositionNoteShow = document.createElement('div');
            negPositionNoteShow.classList.add('negPositionNoteShow');
            negPositionNoteShow.setAttribute('contenteditable', true);
            negPositionNoteShow.innerText = '+';

            
            let removeButtonNeg = document.createElement('div');
            removeButtonNeg.classList.add('removeButtonNeg');
            removeButtonNeg.innerText = 'x';
            
            
            let negContentNoteShow = document.createElement('div');
            negContentNoteShow.classList.add('negContentNoteShow');
            negContentNoteShow.setAttribute('contenteditable', true);
            negContentNoteShow.innerText = 'Add a cons';

            notes.appendChild(negListItemElement);
            negListItemElement.appendChild(removeButtonNeg);
            negListItemElement.appendChild(negPositionNoteShow);
            negListItemElement.appendChild(negContentNoteShow);

        }

        return this.productPage
    }

    classNameGenerator(){
        return Math.random().toString(36).slice(2);
    }

    save(blockContent) {
        /* Save our data like as arrays */
       
       
        
        return {
       
        }
    }
}