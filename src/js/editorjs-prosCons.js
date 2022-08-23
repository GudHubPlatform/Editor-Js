export default class ProsCons {
    constructor({ data }) {
        this.data = data;
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
        let productPage = document.createElement('div');
        productPage.classList.add('productPage');

        let copyButtonWrapperPros = document.createElement('div');
        copyButtonWrapperPros.classList.add('copyButtonWrapperPros');
        let copyButtonPros = document.createElement('div');
        copyButtonPros.classList.add('copyButtonPros');
        copyButtonWrapperPros.appendChild(copyButtonPros)
        
        let copyButtonWrapperCons = document.createElement('div');
        copyButtonWrapperCons.classList.add('copyButtonWrapperCons');
        let copyButtonCons = document.createElement('div');
        copyButtonCons.classList.add('copyButtonCons');
        copyButtonWrapperCons.appendChild(copyButtonCons)
        
        
        let product = document.createElement('div');
        product.classList.add('product');
        product.setAttribute('contenteditable', true);
        product.innerText = "Product";

        let author = document.createElement('div');
        author.classList.add('author');
        author.setAttribute('contenteditable', true);
        author.innerText = "Author";
        productPage.appendChild(product);
        productPage.appendChild(author);
        let reviews = document.createElement('div');
        reviews.classList.add('reviews')
        
        /* If we have saved data we paste values to right places, if we don`t have a saved date we paste placeholders */
        if(this.data){
            console.log(this.data)
            let getAuthor = this.data.author;
            let getProduct = this.data.product;
            let getConses = this.data.cons_list;
            let getProses = this.data.pros_list;

            product.innerText = getProduct;
            author.innerText = getAuthor;

            getConses.forEach(cons => {
                
            });
        }else{
            let newPros = document.createElement('div');
            newPros.classList.add('pros');
            
            let newCons = document.createElement('div');
            newCons.classList.add('cons');
            
            let input_pros_data = 'Pros';
            let prosFlex = document.createElement('div');
            prosFlex.classList.add('pros_flex_wrapper');
            newPros.appendChild(prosFlex);
            prosFlex.innerHTML = /*html*/ `
            <div contenteditable = "true">+</div>
            <div contenteditable = "true" class="pros_value">${input_pros_data}</div>
            `;
            
            let consFlex = document.createElement('div');
            consFlex.classList.add('cons_flex_wrapper');
            newCons.appendChild(consFlex);
            let input_cons_data = 'Cons';
            consFlex.innerHTML = /*html*/ `
               <div contenteditable = "true">+</div>
               <div contenteditable = "true" class="cons_value">${input_cons_data}</div>
            `;
            
            reviews.appendChild(newPros)
            reviews.appendChild(newCons)
            
            newPros.appendChild(copyButtonWrapperPros);
            newCons.appendChild(copyButtonWrapperCons);
            let removeButtonWrapper = document.createElement('div');
        removeButtonWrapper.classList.add('removeButtonWrapper');
        let removeButton = document.createElement('div');
        removeButton.classList.add('removeButton');
        
        /* Add action for removeButton. This action will be remove current item */

        removeButton.addEventListener('click', (el) => {
            el.target.parentElement.parentElement.remove();
            let allSteps = document.querySelectorAll('.step');
            for (let step = 0; step < allSteps.length; step++){
                allSteps[step].querySelector('.step_count span').innerText = step + 1;
            }
        })
        removeButtonWrapper.appendChild(removeButton);
        prosFlex.appendChild(removeButtonWrapper);
            let removeButtonWrapperCons = document.createElement('div');
            removeButtonWrapperCons.classList.add('removeButtonWrapper');
        let removeButtonCons = document.createElement('div');
        removeButtonCons.classList.add('removeButton');
        
        /* Add action for removeButton. This action will be remove current item */

        removeButtonCons.addEventListener('click', (el) => {
            el.target.parentElement.parentElement.remove();
            let allSteps = document.querySelectorAll('.step');
            for (let step = 0; step < allSteps.length; step++){
                allSteps[step].querySelector('.step_count span').innerText = step + 1;
            }
        })
        removeButtonWrapperCons.appendChild(removeButtonCons);
        prosFlex.appendChild(removeButtonWrapperCons);
        consFlex.appendChild(removeButtonWrapperCons);
            /* Call method with an arguments. This method will collect all the blocks together */
            this.addItem(this.classNameGenerator(), productPage, reviews, newPros, newCons)
        }


        
        /* Set action for copyButton. This action will add one more item */
        
        copyButtonPros.addEventListener('click', () => {
            let copyPros = document.createElement('div');
            copyPros.classList.add('pros_flex_wrapper');
            
            
            let input_pros_data = 'Pros';
            copyPros.innerHTML = /*html*/ `
                <div contenteditable = "true">+</div>
                <div contenteditable = "true" class="pros_value">${input_pros_data}</div>
            `;
            this.addItemPros(this.classNameGenerator(), productPage, copyPros, newPros)
        })
        copyButtonCons.addEventListener('click', () => {
            let copyCons = document.createElement('div');
            copyCons.classList.add('cons_flex_wrapper');
            
            
            let input_cons_data = 'cons';
            copyCons.innerHTML = /*html*/ `
                <div contenteditable = "true">+</div>
                <div contenteditable = "true" class="cons_value">${input_cons_data}</div>
            `;
            this.addItemCons(this.classNameGenerator(), productPage, copyCons, newCons)
        })
        
        return productPage;
    }
    /* This method collect all the blocks together and return it */
    addItemPros(uniqueClass, productPage, copyPros, newPros){    
    
        let removeButtonWrapper = document.createElement('div');
        removeButtonWrapper.classList.add('removeButtonWrapper');
        let removeButton = document.createElement('div');
        removeButton.classList.add('removeButton');
        
        /* Add action for removeButton. This action will be remove current item */
    
        removeButton.addEventListener('click', (el) => {
            el.target.parentElement.parentElement.remove();
            let allSteps = document.querySelectorAll('.step');
            for (let step = 0; step < allSteps.length; step++){
                allSteps[step].querySelector('.step_count span').innerText = step + 1;
            }
        })
        console.log(copyPros)
        removeButtonWrapper.appendChild(removeButton)
        copyPros.appendChild(removeButtonWrapper)
        newPros.appendChild(copyPros)

    }

    addItemCons(uniqueClass, productPage, copyCons, newCons){    
    
        let removeButtonWrapper = document.createElement('div');
        removeButtonWrapper.classList.add('removeButtonWrapper');
        let removeButton = document.createElement('div');
        removeButton.classList.add('removeButton');
        
        /* Add action for removeButton. This action will be remove current item */
    
        removeButton.addEventListener('click', (el) => {
            el.target.parentElement.parentElement.remove();
            let allSteps = document.querySelectorAll('.step');
            for (let step = 0; step < allSteps.length; step++){
                allSteps[step].querySelector('.step_count span').innerText = step + 1;
            }
        })
        console.log(copyCons)
        removeButtonWrapper.appendChild(removeButton)
        copyCons.appendChild(removeButtonWrapper)
        newCons.appendChild(copyCons)

    }
    addItem(uniqueClass, productPage, reviews, newPros, newCons){
        let proscons_wrapper = document.createElement('div');
        proscons_wrapper.classList.add('proscons_wrapper');
        proscons_wrapper.classList.add(`proscons_unique-${uniqueClass}`);
        
        proscons_wrapper.appendChild(reviews);
        productPage.appendChild(proscons_wrapper);
        
        return productPage
    }

    classNameGenerator(){
        return Math.random().toString(36).slice(2);
    }

    save(blockContent) {
        /* Save our data like as arrays */
        console.log(blockContent)
        let product = blockContent.querySelector('.product').innerText
        let author = blockContent.querySelector('.author').innerText
        
        let pros_list = [];
        let saved_proses = blockContent.querySelectorAll('.pros_value');

        for (let i = 0; i < saved_proses.length; i++){
            pros_list.push(saved_proses[i].innerText)
        }

        let cons_list = [];
        let saved_conses = blockContent.querySelectorAll('.cons_value');

        for (let i = 0; i < saved_conses.length; i++){
            cons_list.push(saved_conses[i].innerText)
        }

        
        return {
            product,
            author,
            pros_list,
            cons_list
        }
    }
}