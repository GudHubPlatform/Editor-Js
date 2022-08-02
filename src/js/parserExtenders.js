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
    console.log(block)
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