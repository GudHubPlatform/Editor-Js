import Prism from 'prismjs';

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
                        Step<span>${q + 1}</span>
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

    let headings = block.data.withHeadings;

    let dataTable = block.data.content;
    let tr = headings ? 1 : 0;
    if (tr === 1) {
        let headRow = '';
        for (let td = 0; td < dataTable[0].length; td++) {
            let tdElement = /*html*/`<th>${dataTable[0][td]}</th>`

            headRow += tdElement;
        }
        template = /*html*/`<tr class="head_row row">${headRow}</tr>`
        html_template += template;
    }
    for (tr; tr < dataTable.length; tr++) {
        let row = '';
        for (let td = 0; td < dataTable[tr].length; td++) {
            let tdElement = /*html*/`<td>${dataTable[tr][td]}</td>`

            row += tdElement;
        }
        template = /*html*/`<tr class="row">${row}</tr>`
        html_template += template;
    }
    return /*html*/`
    <table class="editorjs_parse_table">
        ${html_template}
    </table>`;
}

export const parseCustomImage = (block) => {
    let html_template = '';
    let image = /*html*/`
    <img src="${block.data.file.url}" alt="${block.data.caption}" title="${block.data.title}" data-url="${block.data.url}">
    `

    html_template += image;

    return html_template;
}



export const parseEditorJsColumns = (block) => {

    let columns = block.data.cols;
    let html_template = '';
    let mainColumnWrapper = '';
    /* We have object with a data of columns. So we need to iterate through the elements of this object */
    for (let column = 0; column < columns.length; column++) {
        let blocks = columns[column].blocks;
        let columnWrap = '';
        /* Now we have an object with data of a column. Now we need to iterate this elements */
        for ( let item = 0; item < blocks.length; item++ ) {
            let type = blocks[item].type;
            let template = '';
            /* Check a type of data and starting right parser */
            switch (type) {
                case 'paragraph':
                    template = /*html*/`
                    <p>${blocks[item].data.text}</p>
                    `
                    break;

                case 'header':
                    template = /*html*/`
                        <h${blocks[item].data.level}>${blocks[item].data.text}</h${blocks[item].data.level}>
                    `
                    break;

                case 'faq':
                    template = parseFaq(blocks[item])
                    break;

                case 'howTo':
                    template = parseHowTo(blocks[item])

                    break;
                case 'image':
                    template = parseCustomImage(blocks[item])

                    break;
                case 'table':
                    template = parseTable(blocks[item])
                    break;

                case 'checklist':
                    template = checklist(blocks[item])
                    break;

                case 'code':
                    template = parseCodeMirror(blocks[item])
                    break;

                case 'htmlViewer':
                    template = parseLiveCodeEditor(blocks[item])
                    break;

                default:
                    console.log('Unsupported data type')
            }
            columnWrap += template
        }

        let realWrapper = /*html*/`
            <div class="columnWrapper">${columnWrap}</div>
        `;

        mainColumnWrapper += realWrapper;
        /* Count the amount of columns and set right class. It`s need to set correcting styles */
        if (columns.length === 2) {
            html_template = /*html*/`
            <div class="mainColumnWrapper twoColumns">${mainColumnWrapper}</div>
            `
        } else if (columns.length === 3) {
            html_template = /*html*/`
            <div class="mainColumnWrapper threeColumns">${mainColumnWrapper}</div>
            `
        }
    }

    return html_template;
}

export const checklist = (block) => {
    let checkList = block.data.items;
    let template = '';
    checkList.forEach(item => {
        if (item.checked) {
            template += /*html*/`
            <div class="cdx-checklist__item cdx-checklist__item--checked">
                <span class="cdx-checklist__item-checkbox"></span>
                <div class="cdx-checklist__item-text" contenteditable="true">${item.text}</div>
            </div>
            `

        } else {
            template += /*html*/`
            <div class="cdx-checklist__item">
                <span class="cdx-checklist__item-checkbox"></span>
                <div class="cdx-checklist__item-text" contenteditable="true">${item.text}</div>
            </div>
            `
        }

    });
    return template;
}

export const parseHTMLViewer = (block) => {
    // let newCode = block.data.template.replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&nbsp;', '');
    return block.data.template;
}
export const parseLiveCodeEditor = (block) => {
    
    let newCode = block.data.text.replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&nbsp;', ' ').replaceAll('&quot;', '"').replaceAll('&#39;', "'");
  
    return newCode.replaceAll('&amp;lt;', '&lt;').replaceAll('&amp;gt;', '&gt;').replaceAll('&nbsp;', ' ').replaceAll('&amp;quot;', '"');
}
export const parseMultiLevelList = (block) => {
    let data = block.data.items;
    let wrapperElement = block.data.style == 'ordered' ? 'ol' : 'ul';
    let newCode = document.createElement(wrapperElement);
    for(let li = 0; li < data.length; li++) {
        let liEl = document.createElement('li');
        liEl.innerHTML = data[li]
        newCode.append(liEl)
    }
    return newCode.outerHTML;
}
export const parseCodeMirror = (block) => {
    
    let codeDataType = block.data.name;
    let codeDataText = block.data.text;

    /* Formatting source data from entity number symbols to reserved by html symbols(&gt; it`s a great then and = '>') */
    let newC = codeDataText.replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&nbsp;', ' ').replaceAll('&quot;', '"');

    let div = document.createElement('div');
    div.innerText = newC

    let res = `\n${div.innerHTML.replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&nbsp;', ' ').replaceAll('&quot;', '"').replaceAll('<br>', '\n').replaceAll('&amp;#39;', "'")}\n`;
    /* Check language and do right parsing, highlighting */

    let highlighting = Prism.highlight(res, Prism.languages.html, 'html');

    let output = highlighting;
    /* Insert our output data in a wrapper. because we need to link style white-space:pre-wrap to this block */
    return `<div class="codemirror-wrapper ${codeDataType.toLowerCase()}">
                <pre>
                    <code>${output}</code>
                </pre>
            </div>`;
}

export const parseProsCons = (block) => {
    let template = '';
    let templateTop = /* html */`
        <div itemtype="https://schema.org/Product" itemscope>
            <meta itemprop="name" content="${block.data.product}" />
            ${block.data.showProduct ? `<div>${block.data.product}</div>` : ''}
            <div itemprop="review" itemtype="https://schema.org/Review" itemscope>
                <div itemprop="author" itemtype="https://schema.org/Person" itemscope>
                    <meta itemprop="name" content="${block.data.author}" />
                    ${block.data.showAuthor ? `<div>${block.data.author}</div>` : ''}
                </div>
                <div itemprop="positiveNotes" itemtype="https://schema.org/ItemList" itemscope>
                <div>Pros:</div>
    `;

    let templatePros = '';
    for (let pros = 0; pros < block.data.pros_list.length; pros++) {
        templatePros += /* html */`
            <div itemprop="itemListElement" itemtype="https://schema.org/ListItem" itemscope>
                <meta itemprop="position" content="${pros + 1}" />
                <span>${pros + 1}</span>
                <meta itemprop="name" content="${block.data.pros_list[pros]}" />
                <span>${block.data.pros_list[pros]}</span>
            </div>
        `;
    }


    let templateCons = '';
    for (let cons = 0; cons < block.data.cons_list.length; cons++) {
        templateCons += /* html */`
            <div itemprop="itemListElement" itemtype="https://schema.org/ListItem" itemscope>
                <meta itemprop="position" content="${cons + 1}" />
                <span>${cons + 1}</span>
                <meta itemprop="name" content="${block.data.cons_list[cons]}" />
                <span>${block.data.cons_list[cons]}</span>
            </div>
        `;
    }

    template += templateTop;
    template += templatePros;
    template += `</div> <div itemprop="negativeNotes" itemtype="https://schema.org/ItemList" itemscope> <div>Cons:</div`;
    template += templateCons;
    template += `</div></div></div>`;

    let newCode = template;
    return newCode;
} 


export const parseBlockquotes = (block) => {
    let template = '';
    template = /* html */`
        <div class="blockqoute_block">
            <blockquote itemprop="hasCitation" itemscope="" itemtype="http://schema.org/Citation">
                <p itemprop="citeText">${block.data.saved_quote}</p>
            </blockquote>
            <div itemprop="author">
                <div itemprop="name">${block.data.saved_author}</div>
            </div> 
        </div>
    `;
    return template;
} 