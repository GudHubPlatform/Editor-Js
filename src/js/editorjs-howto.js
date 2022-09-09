export default class HowTo {
    constructor({ data }) {
        this.data = data;
    }
    static get toolbox() {
        return {
            title: 'How To',
            icon: '<svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m22 17.75c0-.414-.336-.75-.75-.75h-14.5c-.414 0-.75.336-.75.75s.336.75.75.75h14.5c.414 0 .75-.336.75-.75zm-18.953-1.494c-.621 0-.578.751-.06.751.108.003.371-.076.52.079.218.228.07.693-.293.693-.258 0-.349-.202-.456-.488-.123-.355-.758-.26-.758.203 0 .34.416 1.006 1.21 1.006.187 0 .358-.03.514-.09.474-.181.765-.619.765-1.054 0-.29-.129-.58-.418-.794.671-.726.046-1.562-.815-1.562-.75 0-1.162.49-1.162.864 0 .306.254.404.376.404.395 0 .329-.283.494-.482.104-.13.501-.124.501.174 0 .358-.518.306-.418.296zm18.953-2.506c0-.414-.336-.75-.75-.75h-14.5c-.414 0-.75.336-.75.75s.336.75.75.75h14.5c.414 0 .75-.336.75-.75zm-18.785-1.032c.214-.21.511-.426.8-.686.805-.713.535-2.002-.77-2.002-.813 0-1.24.596-1.24 1.028 0 .478.513.548.708.308.176-.212.152-.595.519-.595.346 0 .517.373.097.792-.065.065-1.065.825-1.258 1.246-.043.096-.071.19-.071.283 0 .159.127.438.494.438h1.597c.344 0 .434-.256.434-.404 0-.314-.284-.408-.497-.408zm18.785-2.968c0-.414-.336-.75-.75-.75h-14.5c-.414 0-.75.336-.75.75s.336.75.75.75h14.5c.414 0 .75-.336.75-.75zm-19.04-1.738c0 .226.113.497.439.497.015 0 .443.032.443-.58v-2.45c0-.335-.206-.479-.401-.479-.224 0-.272.108-.414.306-.183.254-.369.387-.631.511-.23.108-.396.181-.396.428 0 .208.173.388.378.388.18 0 .434-.169.582-.271zm19.04-2.262c0-.414-.336-.75-.75-.75h-14.5c-.414 0-.75.336-.75.75s.336.75.75.75h14.5c.414 0 .75-.336.75-.75z" fill-rule="nonzero"/></svg>'
        };
    }
    render() {
        /* Create parts of main block and set attributes  */
        let howTo = document.createElement('div');
        howTo.classList.add('howTo');
        
        let title = document.createElement('h2');
        title.setAttribute('contenteditable','true');
        
        let subtitle = document.createElement('p');
        subtitle.setAttribute('contenteditable','true');
        subtitle.classList.add('subtitle');
        
        
        howTo.appendChild(title);
        howTo.appendChild(subtitle);
        
        
        let copyButtonWrapper = document.createElement('div');
        copyButtonWrapper.classList.add('copyButtonWrapper');
        let copyButton = document.createElement('div');
        copyButton.classList.add('copyButton');
        copyButtonWrapper.appendChild(copyButton)
        howTo.prepend(copyButtonWrapper);

       

     
        /* Set action for copyButton. This action will add one more item */

        copyButton.addEventListener('click', () => {
            
            let stepTopHeading = document.createElement('h3');
            stepTopHeading.setAttribute('contenteditable','true');
            stepTopHeading.innerText = 'Heading';
            
            let stepBottomText = document.createElement('span');
            stepBottomText.setAttribute('contenteditable','true');
            stepBottomText.innerHTML = 'Content';
            
            let q = 'new'
            this.addItem(howTo, stepTopHeading, stepBottomText, q)
        })
        let titleText = this.data.mainTitle ? this.data.mainTitle : 'Title';
        let subTitleText = this.data.mainSubtitle ? this.data.mainSubtitle : 'Subtitle';
        title.innerText = titleText;
        subtitle.innerText = subTitleText;

        /* If we have saved data we paste values to right places, if we don`t have a saved date we paste placeholders */

        if(this.data.heading_list){

            let get_heading = this.data.heading_list;
            let get_content = this.data.content_list;
            
            for(let q = 0; q < get_heading.length; q++){
                let stepTopHeading = document.createElement('h3');
                stepTopHeading.setAttribute('contenteditable','true');
                let input_heading_data = this.data && get_heading[q] ? get_heading[q] : 'Heading';
                stepTopHeading.innerHTML = input_heading_data;
                
                let stepBottomText = document.createElement('span');
                stepBottomText.setAttribute('contenteditable','true');
                
                let input_content_data = this.data && get_content[q] ? get_content[q] : 'Content';
                stepBottomText.innerHTML = input_content_data;
                
                
                /* Call method with an arguments. This method will collect all the blocks together */
                this.addItem(howTo, stepTopHeading, stepBottomText, q);
            };
        }else{
            let stepTopHeading = document.createElement('h3');
            stepTopHeading.setAttribute('contenteditable','true');
            stepTopHeading.innerHTML = 'Heading';
            
            let stepBottomText = document.createElement('span');
            stepBottomText.setAttribute('contenteditable','true');
            stepBottomText.innerHTML = 'Content';
            
            let q = 0;
            /* Call method with an arguments. This method will collect all the blocks together */
            this.addItem(howTo, stepTopHeading, stepBottomText, q);
            
        }
        
        return howTo;
    }
/* This method collect all the blocks together and return it */
    addItem(howTo, stepTopHeading, stepBottomText, q){
        
        let step = document.createElement('div');
        step.classList.add('step');
        step.classList.add('open');
        
        let stepTop = document.createElement('div');
        stepTop.classList.add('top');
        
        let stepTopIcon = document.createElement('div');
        
        let stepTopCount = document.createElement('span');
        stepTopCount.innerText = 'Step';
        stepTopCount.classList.add('step_count')
        let stepTopCountNumber = document.createElement('span');

        /* Generating right number of step */
        if (typeof q == 'number'){
            stepTopCountNumber.innerText = q+1;
        }else{
            stepTopCountNumber.innerText = document.querySelectorAll('.step').length + 1;
        }

        let stepBottom = document.createElement('div');
        stepBottom.classList.add('step_bottom');
        
        stepTop.appendChild(stepTopIcon);
        
        stepTopCount.appendChild(stepTopCountNumber);
        
        step.appendChild(stepTop);
        step.appendChild(stepBottom);
        
        stepTop.appendChild(stepTopCount);
        stepTop.appendChild(stepTopHeading);
        
        stepBottom.appendChild(stepBottomText);

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
        step.appendChild(removeButtonWrapper);

        
        howTo.appendChild(step);
        return howTo
    }

    save(blockContent) {
        /* Save our data like as arrays */
        let mainTitle = blockContent.querySelector('h2').textContent;
        let mainSubtitle = blockContent.querySelector('.subtitle').textContent;
        
        let heading_list = [];
        let saved_heading = blockContent.querySelectorAll('h3');
        for (let i = 0; i < saved_heading.length; i++){
            heading_list.push(saved_heading[i].innerHTML)
        }
        let content_list = [];
        let saved_content = blockContent.querySelectorAll('.step_bottom span');
        
        for (let i = 0; i < saved_content.length; i++){
            content_list.push(saved_content[i].innerHTML)
        }
        
      
        return {
            mainTitle,
            mainSubtitle,
            heading_list,
            content_list
        }
    }
}