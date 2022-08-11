export const parseFaq = (block) => {
    let html_template = '';

    let questions = block.data.saved_question;
    let answers = block.data.saved_answer;

    for (let q = 0; q < questions.length; q++) {

        let template = /*html*/`
        <div class="faq_wrapper" itemscope="" itemprop="mainEntity" itemtype="https://schema.org/Question">
            <div class="faq_question">
                <div class="question_flex_wrapper">
                    <h3 placeholder="question" itemprop="name">${questions[q]}</h3>
                    <div class="arrow" onclick="openFaq(event)"></div>
                </div>
                <div class="faq_answer" itemscope="" itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                    <p placeholder="answer" itemprop="text">${answers[q]}</p>
                </div>
            </div>
        </div>
        `
        html_template += template;
    };

    let script = document.createElement('script');

    script.innerHTML =  /*javascript*/`

        function openFaq(event) {
            event.target.parentElement.parentElement.parentElement.classList.toggle('open');
        }
    `;

    document.body.appendChild(script);

    return /*html*/`
    <div class="faq_page" itemscope="" itemtype="https://schema.org/FAQPage">
        ${html_template}
    </div>`;
}


export const parseHowTo = (block) => {
    let html_template = '';

    let mainTitle = block.data.mainTitle;
    let mainSubtitle = block.data.mainSubtitle;
    let content_list = block.data.content_list;
    let heading_list = block.data.heading_list;

    for (let q = 0; q < heading_list.length; q++) {

        let template = /*html*/`
            
            <div itemscope="" itemprop="step" class="step open" itemtype="https://schema.org/HowToStep">
                <div class="top">
                    <span class="step_count">
                        Step<span>${q+1}</span>
                    </span>
                    <h3 itemprop="name">${heading_list[q]}</h3>
                </div>
                <div itemscope="" itemprop="itemListElement" class="step_bottom" itemtype="https://schema.org/HowToDirection">
                    <span itemprop="text">${content_list[q]}</span>
                </div>
            </div>
        `
        html_template += template;
    };


    return /*html*/`
    <div itemscope="" itemtype="https://schema.org/HowTo" class="howTo">
        <h2 itemprop="name">${mainTitle}</h2>
        <p itemprop="name" class="subtitle">${mainSubtitle}</p>
        ${html_template}
    </div>`;
} 

export const parseTable = (block) => {

    let html_template = '';
    let template = '';
    
    let dataTable = block.data.content;
    
    dataTable.forEach(tr => {
        let row = '';
        tr.forEach(td => {
            let tdElement = /*html*/`<td>${td}</td>`
            
            row += tdElement;
        })
        template = /*html*/`<tr class="row">${row}</tr>`
        html_template += template;
    });
    return /*html*/`
    <table class="editorjs_parse_table">
        ${html_template}
    </table>`;
} 

export const parseCustomImage = (block) => {
    
    let html_template = '';
    
    let image = /*html*/`
    <img src=${block.data.file.url} alt=${block.data.caption} title=${block.data.title}>
    `
    
    html_template += image;
    
    return html_template;
} 

export const parseHTMLViewer = (block) => {
    let newCode = block.data.template.replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&nbsp;', '');
    return newCode;
} 

export const parseEditorJsColumns = (block) => {
    
    let columns = block.data.cols;
    let html_template = '';
    let mainColumnWrapper = '';
    /* We have object with a data of columns. So we need to iterate through the elements of this object */
    columns.forEach(column => {

        let blocks = column.blocks;
        let columnWrap = '';
        /* Now we have an object with data of a column. Now we need to iterate this elements */
        blocks.forEach(block => {
            let type = block.type;
            let template = '';
            /* Check a type of data and starting right parser */
            switch(type){
                case 'paragraph':
                    template = /*html*/`
                    <p>${block.data.text}</p>
                    `
                    break;
                    
                case 'header':
                    template = /*html*/`
                        <h${block.data.level}>${block.data.text}</h${block.data.level}>
                    `
                    break;

                case 'faq':
                    template = parseFaq(block)
                    break;
                    
                case 'howTo':
                    template = parseHowTo(block)
                
                    break;
                case 'customImage':
                    template = parseCustomImage(block)
                    
                    break;
                case 'table':
                    template = parseTable(block)
                    break;

                case 'checklist':
                    let checkList = block.data.items;

                    checkList.forEach(item => {
                        if(item.checked){
                            template += /*html*/`
                            <div class="cdx-checklist__item cdx-checklist__item--checked">
                                <span class="cdx-checklist__item-checkbox"></span>
                                <div class="cdx-checklist__item-text" contenteditable="true">${item.text}</div>
                            </div>
                            `                        
                            
                        }else{
                            template += /*html*/`
                            <div class="cdx-checklist__item">
                                <span class="cdx-checklist__item-checkbox"></span>
                                <div class="cdx-checklist__item-text" contenteditable="true">${item.text}</div>
                            </div>
                            `                        
                        }
                        
                    });
                    break;
                
                default:
                    console.log('Unsupported data type')
            }
            columnWrap += template
        });

        let realWrapper = /*html*/`
        <div class="columnWrapper">${columnWrap}</div>
        `;
        
        mainColumnWrapper += realWrapper;
        /* Count the amount of columns and set right class. It`s need to set correcting styles */
        if(columns.length === 2){
            html_template = /*html*/`
            <div class="mainColumnWrapper twoColumns">${mainColumnWrapper}</div>
            `
        }else if(columns.length === 3){
            html_template = /*html*/`
            <div class="mainColumnWrapper threeColumns">${mainColumnWrapper}</div>
            `
        }
        
    });
    
    return html_template;
} 