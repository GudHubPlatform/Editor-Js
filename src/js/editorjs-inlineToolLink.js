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
        this.button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15px" height="15px" viewBox="0 0 12 12" version="1.1"><g id="surface1"><path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 6.054688 7.695312 L 4.113281 9.636719 C 3.625 10.105469 2.851562 10.105469 2.363281 9.636719 C 2.132812 9.402344 2 9.089844 2 8.761719 C 2 8.429688 2.132812 8.117188 2.363281 7.886719 L 4.304688 5.945312 C 4.5 5.75 4.5 5.429688 4.304688 5.234375 C 4.109375 5.039062 3.792969 5.039062 3.59375 5.234375 L 1.65625 7.179688 C 0.84375 8.0625 0.871094 9.429688 1.71875 10.28125 C 2.570312 11.128906 3.9375 11.15625 4.820312 10.34375 L 6.765625 8.40625 C 6.960938 8.207031 6.960938 7.890625 6.765625 7.695312 C 6.570312 7.5 6.25 7.5 6.054688 7.695312 Z M 10.34375 1.65625 C 9.46875 0.785156 8.054688 0.785156 7.179688 1.65625 L 5.234375 3.59375 C 5.039062 3.792969 5.039062 4.109375 5.234375 4.304688 C 5.429688 4.5 5.75 4.5 5.945312 4.304688 L 7.886719 2.363281 C 8.375 1.894531 9.148438 1.894531 9.636719 2.363281 C 9.867188 2.597656 10 2.910156 10 3.238281 C 10 3.570312 9.867188 3.882812 9.636719 4.113281 L 7.695312 6.054688 C 7.601562 6.148438 7.546875 6.277344 7.546875 6.410156 C 7.546875 6.542969 7.601562 6.671875 7.695312 6.765625 C 7.789062 6.859375 7.917969 6.914062 8.050781 6.914062 C 8.183594 6.914062 8.3125 6.859375 8.40625 6.765625 L 10.34375 4.820312 C 11.214844 3.945312 11.214844 2.53125 10.34375 1.65625 Z M 4.414062 7.585938 C 4.507812 7.679688 4.636719 7.730469 4.769531 7.730469 C 4.902344 7.730469 5.03125 7.679688 5.125 7.585938 L 7.585938 5.125 C 7.78125 4.929688 7.78125 4.609375 7.585938 4.414062 C 7.390625 4.21875 7.070312 4.21875 6.875 4.414062 L 4.414062 6.875 C 4.320312 6.96875 4.265625 7.097656 4.265625 7.230469 C 4.265625 7.363281 4.320312 7.492188 4.414062 7.585938 Z M 4.414062 7.585938 "></path></g></svg>';
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
        let linkInput = this.linkWrapper.querySelector('.hrefInput');

        let allow = true;
        linkInput.addEventListener('focus', () => {
            linkInput.addEventListener('keydown', (e) => {
                if ( e.ctrlKey && e.key == 'v') {
                    if ( allow ) {
                        allow = false
                        navigator.clipboard
                        .readText()
                        .then(
                            (clipText) => {
                                console.log(e.target.selectionStart)
                                linkInput.value = linkInput.value.substr(0, e.target.selectionStart) + clipText + linkInput.value.substr(e.target.selectionStart);
                                setTimeout(() => {
                                    allow = true
                                }, 500);
                            }
                        );
                    }
                }
            })
        })
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