export default class LinkTool {

    /* Init this component like inline tool */
    static get isInline() {
        return true;
    }
    /* Allow attributes for link (href, target and rel), bacause in default configure attribute rel is remove while saving */
    static get sanitize(){
        return {
            a: {
                href: true,
                target: true,
                rel: true
            }
        }
    }
    get state() {
        return this._state;
    }

    
    set state(state) {
        this._state = state;
    
        this.button.classList.toggle(this.api.styles.inlineToolButtonActive, state);
    }
    
    constructor({api}) {
        this.api = api;
        this.button = null;
        this._state = false;
        
        this.checkbox = document.createElement('input');
        this.noreferrer = document.createElement('input');
        this.noopener = document.createElement('input');
        this.nofollow = document.createElement('input');
        this.href = document.createElement('input');

        this.tag = 'A';
        this.class = 'cdx-link';
       
        this.listOfRel = [];
    }
    
    render() {
        this.button = document.createElement('button');
        this.button.type = 'button';
        this.button.innerHTML = '<svg width="20" height="18"><path d="M10.458 12.04l2.919 1.686-.781 1.417-.984-.03-.974 1.687H8.674l1.49-2.583-.508-.775.802-1.401zm.546-.952l3.624-6.327a1.597 1.597 0 0 1 2.182-.59 1.632 1.632 0 0 1 .615 2.201l-3.519 6.391-2.902-1.675zm-7.73 3.467h3.465a1.123 1.123 0 1 1 0 2.247H3.273a1.123 1.123 0 1 1 0-2.247z"/></svg>';
        this.button.classList.add(this.api.styles.inlineToolButton);

        return this.button;
    }
    
    surround(range) {
        if (this.state) {
            this.unwrap(range);
            return;
        }
    
        this.wrap(range);
    }
    
    /* Method for create link */
    wrap(range) {
        const selectedText = range.extractContents();
        const aLink = document.createElement(this.tag);
        aLink.classList.add(this.class);
        aLink.appendChild(selectedText);
        range.insertNode(aLink);
        
        this.api.selection.expandToTag(aLink);
    }
    
    /* Method for remove link */
    unwrap(range) {
        const aLink = this.api.selection.findParentTag(this.tag);
        const text = range.extractContents();
        
        aLink ? aLink.removeAttribute('target') : null;
        aLink ? aLink.removeAttribute('rel') : null;
        aLink ? aLink.removeAttribute('href') : null;
        
        aLink ? aLink.remove() : null;
        
        range.insertNode(text);
    }
    
    
    checkState() {
        const aLink = this.api.selection.findParentTag(this.tag);
        
        this.state = !!aLink;
      
        if (this.state) {
            this.showActions(aLink);
        } else {
            this.hideActions();
        }
    }
    
    renderActions() {
        /* Create inline tool elements */
        this.linkWrapper = document.createElement('input');
        this.linkWrapper = document.createElement('div');

        this.href.setAttribute('name','href');
        this.href.setAttribute('placeholder','Add a link');
        this.href.classList.add('hrefInput');
        
        this.blank = document.createElement('div');
        this.blank.innerText = "Target";

        this.targetCheckbox = document.createElement('div');
        this.targetCheckboxLabel = document.createElement('div');
        this.targetCheckboxLabel.innerText = 'blank';
        this.checkbox.setAttribute('type','checkbox');
        this.checkbox.setAttribute('name','blank');
        this.targetCheckbox.appendChild(this.targetCheckboxLabel);
        this.targetCheckbox.appendChild(this.checkbox);
        this.blank.appendChild(this.targetCheckbox);

        this.rel = document.createElement('div');
        this.rel.innerText = 'Rel';

        this.ref = document.createElement('div');
        this.ref.innerText = "noreferrer";
        this.noreferrer.setAttribute('type','checkbox');
        this.noreferrer.setAttribute('name','noreferrer');
        this.ref.appendChild(this.noreferrer);
        
        this.open = document.createElement('div');
        this.open.innerText = "noopener";
        this.noopener.setAttribute('type','checkbox');
        this.noopener.setAttribute('name','noopener');
        this.open.appendChild(this.noopener);
        
        this.fol = document.createElement('div');
        this.fol.innerText = "nofollow";
        this.nofollow.setAttribute('type','checkbox');
        this.nofollow.setAttribute('name','nofollow');
        this.fol.appendChild(this.nofollow);

        this.rel.appendChild(this.ref);
        this.rel.appendChild(this.open);
        this.rel.appendChild(this.fol);
        
        this.linkWrapper.appendChild(this.href);

        this.checkboxesWrapper = document.createElement('div');
        this.checkboxesWrapper.classList.add('checkboxesWrapper');
        this.checkboxesWrapper.appendChild(this.blank);
        this.checkboxesWrapper.appendChild(this.rel);
        
        this.linkWrapper.appendChild(this.checkboxesWrapper);
        
        this.linkWrapper.classList.add('linkWrapper');
        this.linkWrapper.hidden = true;
    
        return this.linkWrapper;
    }
    
    showActions(aLink) {
        /* Check if we have saved attribute href in our link. If yes - insert it into input in inline tool. If no - make input in inline tool is empty */
        aLink.getAttribute('href') ? this.href.value = aLink.getAttribute('href') : null;
        
        /* Check if we have saved attribute target in our link. If yes - make checkbox checked in inline tool. If no - make chackbox not checked in inline tool is empty */
        aLink.getAttribute('target') ? this.checkbox.setAttribute('checked','') : null;
        /* Check if we have saved attribute rel in our link */
        if(aLink.getAttribute('rel')){
            /* If this rel contain some value we make current checkbox checked */
            aLink.getAttribute('rel').includes('noreferrer') ? this.noreferrer.setAttribute('checked','') : null;
            aLink.getAttribute('rel').includes('noopener') ? this.noopener.setAttribute('checked','') : null;
            aLink.getAttribute('rel').includes('nofollow') ? this.nofollow.setAttribute('checked','') : null;
        }
        

        this.linkWrapper.onchange = (event) => {
            let attr = event.target.attributes.name.value;
            let href = event.target.classList.contains('hrefInput') ? event.target.value : aLink.getAttribute('href');

            let res = this.addAttributes(aLink, attr, href);
            return res
          
        };
        this.linkWrapper.hidden = false;
    }
    
    hideActions() {
        this.linkWrapper.onchange = null;
        this.linkWrapper.hidden = true;
    }
    addAttributes(aLink, attr, href){

        if (href){
            if (href.includes('http://') || href.includes('https://')){
            aLink.setAttribute('href', href);
            }else{
                aLink.setAttribute('href', `https://${href}`);
            }
        }
        
        switch(attr){
            case "blank":
                if(aLink.getAttribute('target') == '_blank'){
                    aLink.removeAttribute('target');
                }else{
                    aLink.setAttribute('target', '_blank')
                }
                break
            /* Make a right queue in array of rel values */
            case "noreferrer":
                this.listOfRel.find((listItem) => listItem === attr) ? this.listOfRel.splice(this.listOfRel.indexOf(attr), 1) : this.listOfRel.splice(0, 0, attr);
                break
            case "noopener":
                if(this.listOfRel.find((listItem) => listItem === attr)){
                    this.listOfRel.splice(this.listOfRel.indexOf(attr), 1)
                }else{
                    if(this.listOfRel.length == 1 && this.listOfRel[0] == 'nofollow') {
                        this.listOfRel.splice(0, 0, attr);
                    }else{
                        this.listOfRel.splice(1, 0, attr);
                    }
                }
                break
            case "nofollow":
                this.listOfRel.find((listItem) => listItem === attr) ? this.listOfRel.splice(this.listOfRel.indexOf(attr), 1) : this.listOfRel.splice(2, 0, attr);
                break
        }
        let relStr = '';
        this.listOfRel.forEach(item => {
            relStr += item + ' '
        });
        aLink.setAttribute('rel', relStr.slice(0, -1))

        if (aLink.getAttribute('rel') == ''){
            aLink.removeAttribute('rel')
        }
        return aLink
    }
}