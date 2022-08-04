export default class Faq {
    constructor({ data }) {
        this.data = data;
    }
    static get toolbox() {
        return {
            title: 'Faq',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 3c5.514 0 10 3.592 10 8.007 0 4.917-5.145 7.961-9.91 7.961-1.937 0-3.383-.397-4.394-.644-1 .613-1.595 1.037-4.272 1.82.535-1.373.723-2.748.602-4.265-.838-1-2.025-2.4-2.025-4.872-.001-4.415 4.485-8.007 9.999-8.007zm0-2c-6.338 0-12 4.226-12 10.007 0 2.05.738 4.063 2.047 5.625.055 1.83-1.023 4.456-1.993 6.368 2.602-.47 6.301-1.508 7.978-2.536 1.418.345 2.775.503 4.059.503 7.084 0 11.91-4.837 11.91-9.961-.001-5.811-5.702-10.006-12.001-10.006zm1.024 13.975c0 .566-.458 1.025-1.024 1.025-.565 0-1.024-.459-1.024-1.025 0-.565.459-1.024 1.024-1.024.566 0 1.024.459 1.024 1.024zm1.141-8.192c-.498-.505-1.241-.783-2.09-.783-1.786 0-2.941 1.271-2.941 3.237h1.647c0-1.217.68-1.649 1.261-1.649.519 0 1.07.345 1.117 1.004.052.694-.319 1.046-.788 1.493-1.157 1.1-1.179 1.633-1.173 2.842h1.643c-.01-.544.025-.986.766-1.785.555-.598 1.245-1.342 1.259-2.477.008-.758-.233-1.409-.701-1.882z"/></svg>'
        };
    }
    render() {
        const uniqueClass = this.classNameGenerator();
        /* Create parts of main block and set attributes  */
        let faqPage = document.createElement('div');
        faqPage.classList.add('faq_page');
        faqPage.setAttribute("itemscope", "");
        faqPage.setAttribute("itemtype", "https://schema.org/FAQPage");

        let copyButtonWrapper = document.createElement('div');
        copyButtonWrapper.classList.add('copyButtonWrapper');
        let copyButton = document.createElement('div');
        copyButton.classList.add('copyButton');
        copyButtonWrapper.appendChild(copyButton)
        faqPage.prepend(copyButtonWrapper);
        
        /* If we have saved data we paste values to right places, if we don`t have a saved date we paste placeholders */
        if(this.data.saved_question){

            let get_question = this.data.saved_question;
            let get_answer = this.data.saved_answer;
            
            for(let q = 0; q < get_question.length; q++){
                let question = document.createElement('div');
                question.classList.add('faq_question');
                
                let answer = document.createElement('div');
                answer.classList.add('faq_answer');
                answer.setAttribute("itemscope", "");
                answer.setAttribute("itemprop", "acceptedAnswer");
                answer.setAttribute("itemtype", "https://schema.org/Answer");
                
                let input_question_data = this.data && get_question[q] ? get_question[q] : 'Question';
                question.innerHTML = /*html*/ `
                    <div class="question_flex_wrapper">
                        <h3 contenteditable = "true" placeholder="question" itemprop="name">${input_question_data}</h3>
                        <div class="arrow" onclick="openFaq(event)"></div>
                    </div>
                `;
    
                let input_answer_data = this.data && get_answer[q] ? get_answer[q] : 'Answer';
                answer.innerHTML = /*html*/ `<p contenteditable = "true" placeholder="answer" itemprop="text">${input_answer_data}</p>`;
    
                question.appendChild(answer)
                /* Call method with an arguments. This method will collect all the blocks together */
                this.addItem(uniqueClass, faqPage, question)
            };
        }else{
            let newQuestion = document.createElement('div');
            newQuestion.classList.add('faq_question');
            
            let newAnswer = document.createElement('div');
            newAnswer.classList.add('faq_answer');
            newAnswer.setAttribute("itemscope", "");
            newAnswer.setAttribute("itemprop", "acceptedAnswer");
            newAnswer.setAttribute("itemtype", "https://schema.org/Answer");
            
            let input_question_data = 'Question';
            newQuestion.innerHTML = /*html*/ `
            <div class="question_flex_wrapper">
            <h3 contenteditable = "true" placeholder="question" itemprop="name">${input_question_data}</h3>
            <div class="arrow" onclick="openFaq(event)"></div>
            </div>
            `;
            
            let input_answer_data = 'Answer';
            newAnswer.innerHTML = /*html*/ `<p contenteditable = "true" placeholder="answer" itemprop="text">${input_answer_data}</p>`;
            
            newQuestion.appendChild(newAnswer)
            /* Call method with an arguments. This method will collect all the blocks together */
            this.addItem(this.classNameGenerator(), faqPage, newQuestion)
        }


        
        /* Set action for copyButton. This action will add one more item */
        
        copyButton.addEventListener('click', () => {
            let newQuestion = document.createElement('div');
            newQuestion.classList.add('faq_question');
            
            let newAnswer = document.createElement('div');
            newAnswer.classList.add('faq_answer');
            newAnswer.setAttribute("itemscope", "");
            newAnswer.setAttribute("itemprop", "acceptedAnswer");
            newAnswer.setAttribute("itemtype", "https://schema.org/Answer");
            
            let input_question_data = 'Question';
            newQuestion.innerHTML = /*html*/ `
            <div class="question_flex_wrapper">
                <h3 contenteditable = "true" placeholder="question" itemprop="name">${input_question_data}</h3>
                <div class="arrow" onclick="openFaq(event)"></div>
            </div>
            `;
            
            let input_answer_data = 'Answer';
            newAnswer.innerHTML = /*html*/ `<p contenteditable = "true" placeholder="answer" itemprop="text">${input_answer_data}</p>`;
            
            newQuestion.appendChild(newAnswer)
            this.addItem(this.classNameGenerator(), faqPage, newQuestion)
        })

        let script = document.createElement('script');
        script.innerHTML =  /*javascript*/`
            function openFaq(event) {
                event.target.parentElement.parentElement.parentElement.classList.toggle('open');
            }
        `;
                
        faqPage.appendChild(script);
        document.body.appendChild(script);
        
        return faqPage;
    }
    /* This method collect all the blocks together and return it */
    addItem(uniqueClass, faqPage, question){
        let faq_wrapper = document.createElement('div');
        faq_wrapper.classList.add('faq_wrapper');
        faq_wrapper.classList.add('open');
        faq_wrapper.classList.add(`faq_unique-${uniqueClass}`);
        
        faq_wrapper.setAttribute("itemscope", "");
        faq_wrapper.setAttribute("itemprop", "mainEntity");
        faq_wrapper.setAttribute("itemtype", "https://schema.org/Question");

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
        faq_wrapper.appendChild(removeButtonWrapper);

        faq_wrapper.appendChild(question);
        faqPage.appendChild(faq_wrapper);
        
        return faqPage
    }

    classNameGenerator(){
        return Math.random().toString(36).slice(2);
    }

    save(blockContent) {
        /* Save our data like as arrays */
        let script = /*html*/
            `
                <script>
                    let faqOpen = document.querySelectorAll(".faq_wrapper");
                    for(let i = 0; i <script faqOpen.length; i++){
                        faqOpen[i].addEventListener("click", togg);
                        function togg(){
                            this.classList.toggle('open');
                        }
                    }
                </script>
            `;
        let questions_list = [];
        let saved_question = blockContent.querySelectorAll('h3');
        for (let i = 0; i < saved_question.length; i++){
            questions_list.push(saved_question[i].innerHTML)
        }

        let answers_list = [];
        let saved_answer = blockContent.querySelectorAll('p');
        for (let i = 0; i < saved_answer.length; i++){
            answers_list.push(saved_answer[i].innerHTML)
        }
        
        return {
            saved_question: questions_list,
            saved_answer: answers_list,
            script
        }
    }
}