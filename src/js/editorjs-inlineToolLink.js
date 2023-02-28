import css from "./../scss/Hyperlink.css";
class SelectionUtils {

    constructor() {
        this.selection = null;
        this.savedSelectionRange = null;
        this.isFakeBackgroundEnabled = false;
        this.commandBackground = 'backColor';
        this.commandRemoveFormat = 'removeFormat';
    }


    isElement(node) {
        return node && typeof node === 'object' && node.nodeType && node.nodeType === Node.ELEMENT_NODE;
    }

    isContentEditable(element) {
        return element.contentEditable === 'true';
    }

    isNativeInput(target) {
        const nativeInputs = [
            'INPUT',
            'TEXTAREA',
        ];
        return target && target.tagName ? nativeInputs.includes(target.tagName) : false;
    }

    canSetCaret(target) {
        let result = true;
        if (this.isNativeInput(target)) {
            switch (target.type) {
                case 'file':
                case 'checkbox':
                case 'radio':
                case 'hidden':
                case 'submit':
                case 'button':
                case 'image':
                case 'reset':
                    result = false;
                    break;
                default:
            }
        } else {
            result = this.isContentEditable(target);
        }

        return result;
    }

    CSS() {
        return {
            editorWrapper: 'codex-editor',
            editorZone: 'codex-editor__redactor',
        };
    }

    anchorNode() {
        const selection = window.getSelection();
        return selection ? selection.anchorNode : null;
    }

    anchorElement() {
        const selection = window.getSelection();

        if (!selection) {
            return null;
        }

        const anchorNode = selection.anchorNode;

        if (!anchorNode) {
            return null;
        }

        if (!this.isElement(anchorNode)) {
            return anchorNode.parentElement;
        } else {
            return anchorNode;
        }
    }

    anchorOffset() {
        const selection = window.getSelection();
        return selection ? selection.anchorOffset : null;
    }

    isCollapsed() {
        const selection = window.getSelection();
        return selection ? selection.isCollapsed : null;
    }

    isAtEditor() {
        const selection = SelectionUtils.get();
        let selectedNode = (selection.anchorNode || selection.focusNode);

        if (selectedNode && selectedNode.nodeType === Node.TEXT_NODE) {
            selectedNode = selectedNode.parentNode;
        }

        let editorZone = null;

        if (selectedNode) {
            editorZone = selectedNode.closest(`.${SelectionUtils.CSS.editorZone}`);
        }
        return editorZone && editorZone.nodeType === Node.ELEMENT_NODE;
    }

    isSelectionExists() {
        const selection = SelectionUtils.get();
        return !!selection.anchorNode;
    }

    static get range() {
        const selection = window.getSelection();
        return selection && selection.rangeCount ? selection.getRangeAt(0) : null;
    }

    static get rect() {
        let sel = document.selection, range;

        let rect = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        };

        if (sel && sel.type !== 'Control') {
            range = sel.createRange();
            rect.x = range.boundingLeft;
            rect.y = range.boundingTop;
            rect.width = range.boundingWidth;
            rect.height = range.boundingHeight;
            return rect;
        }

        if (!window.getSelection) {
            return rect;
        }

        sel = window.getSelection();

        if (sel.rangeCount === null || isNaN(sel.rangeCount)) {
            return rect;
        }

        if (sel.rangeCount === 0) {
            return rect;
        }

        range = sel.getRangeAt(0).cloneRange();

        if (range.getBoundingClientRect) {
            rect = range.getBoundingClientRect();
        }

        if (rect.x === 0 && rect.y === 0) {
            const span = document.createElement('span');

            if (span.getBoundingClientRect) {
                span.appendChild(document.createTextNode('\u200b'));
                range.insertNode(span);
                rect = span.getBoundingClientRect();
                const spanParent = span.parentNode;
                spanParent.removeChild(span);
                spanParent.normalize();
            }
        }

        return rect;
    }

    static get text() {
        return window.getSelection ? window.getSelection().toString() : '';
    }

    get() {
        return window.getSelection();
    }

    setCursor(element, offset = 0) {
        const range = document.createRange();
        const selection = window.getSelection();

        if (this.isNativeInput(element)) {
            if (!this.canSetCaret(element)) {
                return;
            }

            element.focus();
            element.selectionStart = element.selectionEnd = offset;

            return element.getBoundingClientRect();
        }

        range.setStart(element, offset);
        range.setEnd(element, offset);

        selection.removeAllRanges();
        selection.addRange(range);

        return range.getBoundingClientRect();
    }

    removeFakeBackground() {
        if (!this.isFakeBackgroundEnabled) {
            return;
        }
        this.isFakeBackgroundEnabled = false;
        document.execCommand(this.commandRemoveFormat);
    }

    setFakeBackground() {
        document.execCommand(this.commandBackground, false, '#a8d6ff');
        this.isFakeBackgroundEnabled = true;
    }

    save() {
        this.savedSelectionRange = SelectionUtils.range;
    }

    restore() {
        if (!this.savedSelectionRange) {
            return;
        }
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(this.savedSelectionRange);
    }

    clearSaved() {
        this.savedSelectionRange = null;
    }

    collapseToEnd() {
        const sel = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(sel.focusNode);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    findParentTag(tagName, className = null, searchDepth = 10) {
        const selection = window.getSelection();
        let parentTag = null;
        if (!selection || !selection.anchorNode || !selection.focusNode) {
            return null;
        }
        const boundNodes = [
            selection.anchorNode,
            selection.focusNode,
        ];

        boundNodes.forEach((parent) => {
            let searchDepthIterable = searchDepth;
            while (searchDepthIterable > 0 && parent.parentNode) {
                if (parent.tagName === tagName) {
                    parentTag = parent;
                    if (className && parent.classList && !parent.classList.contains(className)) {
                        parentTag = null;
                    }
                    if (parentTag) {
                        break;
                    }
                }
                parent = parent.parentNode;
                searchDepthIterable--;
            }
        });
        return parentTag;
    }

    expandToTag(element) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        const range = document.createRange();
        range.selectNodeContents(element);
        selection.addRange(range);
    }
}

export default class Hyperlink {

    constructor({ data, config, api, readOnly }) {
        this.toolbar = api.toolbar;
        this.inlineToolbar = api.inlineToolbar;
        this.tooltip = api.tooltip;
        this.i18n = api.i18n;
        this.config = config;
        this.selection = new SelectionUtils();

        this.commandLink = 'createLink';
        this.commandUnlink = 'unlink';

        this.CSS = {
            wrapper: 'ce-inline-tool-hyperlink-wrapper',
            wrapperShowed: 'ce-inline-tool-hyperlink-wrapper--showed',
            button: 'ce-inline-tool',
            buttonActive: 'ce-inline-tool--active',
            buttonModifier: 'ce-inline-tool--link',
            buttonUnlink: 'ce-inline-tool--unlink',
            input: 'ce-inline-tool-hyperlink--input',
            selectTarget: 'ce-inline-tool-hyperlink--select-target',
            selectRel: 'ce-inline-tool-hyperlink--select-rel',
            buttonSave: 'ce-inline-tool-hyperlink--button',
        };

        this.targetAttribute = this.config.availableTargets || [
            '_blank',   // Opens the linked document in a new window or tab
        ];

        this.relAttributes = this.config.availableRels || [
            'nofollow',     //Links to an unendorsed document, like a paid link. ("nofollow" is used by Google, to specify that the Google search spider should not follow that link)
            'noreferrer',   //Requires that the browser should not send an HTTP referer header if the user follows the hyperlink
            'noopener',     //Requires that any browsing context created by following the hyperlink must not have an opener browsing context
        ];

        this.nodes = {
            button: null,
            wrapper: null,
            input: null,
            selectTarget: null,
            selectTargetLabel: null,
            selectRel: null,
            buttonSave: null,
        };

        this.inputOpened = false;
    }

    render() {
        this.nodes.button = document.createElement('button');
        this.nodes.button.type = 'button';
        this.nodes.button.classList.add(this.CSS.button, this.CSS.buttonModifier);
        this.nodes.button.innerHTML = /* html */`
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" style="fill: none !important" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M7.69998 12.6L7.67896 12.62C6.53993 13.7048 6.52012 15.5155 7.63516 16.625V16.625C8.72293 17.7073 10.4799 17.7102 11.5712 16.6314L13.0263 15.193C14.0703 14.1609 14.2141 12.525 13.3662 11.3266L13.22 11.12"></path><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M16.22 11.12L16.3564 10.9805C17.2895 10.0265 17.3478 8.5207 16.4914 7.49733V7.49733C15.5691 6.39509 13.9269 6.25143 12.8271 7.17675L11.3901 8.38588C10.0935 9.47674 9.95706 11.4241 11.0888 12.6852L11.12 12.72"></path></svg>
        `;
        return this.nodes.button;
    }

    renderActions() {
        this.nodes.wrapper = document.createElement('div');
        this.nodes.wrapper.classList.add(this.CSS.wrapper);

        // Input
        this.nodes.input = document.createElement('input');
        this.nodes.input.placeholder = 'https://...';
        this.nodes.input.classList.add(this.CSS.input);

        let i;

        this.nodes.wrapper.appendChild(this.nodes.input);

        let checkboxWrapper = document.createElement('div');
        checkboxWrapper.classList.add('checkbox_wrapper');

        // Target
        this.nodes.selectTarget = document.createElement('input');
        this.nodes.selectTarget.setAttribute('type', 'checkbox')
        this.nodes.selectTarget.classList.add(this.CSS.selectTarget);

        this.nodes.selectTarget.setAttribute('name', 'target')
        this.nodes.selectTarget.setAttribute('id', 'target')
        this.nodes.selectTarget.checked = false;
        
        this.nodes.selectTargetLabel = document.createElement('label');
        this.nodes.selectTargetLabel.setAttribute('for', 'target');
        this.nodes.selectTargetLabel.innerHTML = '_blank';
        
        let targetWrapper = document.createElement('div');
        targetWrapper.classList.add('targetWrapper');
        targetWrapper.appendChild(this.nodes.selectTarget);
        targetWrapper.appendChild(this.nodes.selectTargetLabel);
        
        checkboxWrapper.append(targetWrapper);

        this.nodes.wrapper.appendChild(checkboxWrapper);
        
        let relWrapper = document.createElement('div');
        relWrapper.classList.add('relWrapper');
        checkboxWrapper.append(relWrapper);
        // Rel
        let valuesRel = this.relAttributes;
        let self = this;
        this.creatingCheckbox(self, 'selectRel', valuesRel, relWrapper);

        // Button
        this.nodes.buttonSave = document.createElement('button');
        this.nodes.buttonSave.type = 'button';
        this.nodes.buttonSave.classList.add(this.CSS.buttonSave);
        this.nodes.buttonSave.innerHTML = this.i18n.t('Save');
        this.nodes.buttonSave.addEventListener('click', (event) => {
            this.savePressed(event);
        });


        this.nodes.wrapper.appendChild(this.nodes.buttonSave);

        return this.nodes.wrapper;
    }

    creatingCheckbox (self, select, values, relWrapper) {
        for (let value = 0; value < values.length; value++) {

            self.nodes[`${select}${values[value]}`] = document.createElement('input');
            self.nodes[`${select}${values[value]}`].setAttribute('type', 'checkbox');
            self.nodes[`${select}${values[value]}`].classList.add(self.CSS[`${select}`]);
            
            self.nodes[`${select}${values[value]}`].setAttribute('name', `${select}${values[value]}`)
            self.nodes[`${select}${values[value]}`].setAttribute('id', `${select}${values[value]}`)
            self.nodes[`${select}${values[value]}`].classList.add(values[value])
            self.nodes[`${select}${values[value]}`].checked = false;
            
            self.nodes[`${select}${values[value]}Label`] = document.createElement('label');
            
            self.nodes[`${select}${values[value]}Label`].setAttribute('for', `${select}${values[value]}`);
            self.nodes[`${select}${values[value]}Label`].innerHTML = values[value];

            let boxWrapper = document.createElement('div');
            boxWrapper.classList.add('boxWrapper');
            boxWrapper.append(self.nodes[`${select}${values[value]}`])
            boxWrapper.append(self.nodes[`${select}${values[value]}Label`])
            relWrapper.appendChild(boxWrapper);
        }
        // self.nodes.wrapper.appendChild(relWrapper);
    }

    surround(range) {
        if (range) {
            if (!this.inputOpened) {
                this.selection.setFakeBackground();
                this.selection.save();
            } else {
                this.selection.restore();
                this.selection.removeFakeBackground();
            }
            const parentAnchor = this.selection.findParentTag('A');
            if (parentAnchor) {
                this.selection.expandToTag(parentAnchor);
                this.unlink();
                this.closeActions();
                this.checkState();
                this.toolbar.close();
                return;
            }
        }
        this.toggleActions();
    }

    get shortcut() {
        return this.config.shortcut || 'CMD+L';
    }

    get title() {
        return 'Hyperlink';
    }

    static get isInline() {
        return true;
    }

    static get sanitize() {
        return {
            a: {
                href: true,
                target: true,
                rel: true,
            },
        };
    }

    checkState(selection=null) {
        const anchorTag = this.selection.findParentTag('A');
        if (anchorTag) {
            this.nodes.button.classList.add(this.CSS.buttonUnlink);
            this.nodes.button.classList.add(this.CSS.buttonActive);
            this.openActions();
            const hrefAttr = anchorTag.getAttribute('href');
            if (anchorTag.hasAttribute('target')) {
                anchorTag.getAttribute('target') == '' ? this.nodes.selectTarget.checked = false : this.nodes.selectTarget.checked = true;
            }
            const relAttr = anchorTag.getAttribute('rel');
            this.nodes.input.value = !!hrefAttr ? hrefAttr : '';
            
            if (anchorTag.hasAttribute('rel')) {
                let linkRel = anchorTag.getAttribute('rel');
                linkRel.includes('nofollow') ? this.nodes.selectRelnofollow.checked = true : this.nodes.selectRelnofollow.checked = false;
                linkRel.includes('noopener') ? this.nodes.selectRelnoopener.checked = true : this.nodes.selectRelnoopener.checked = false;
                linkRel.includes('noreferrer') ? this.nodes.selectRelnoreferrer.checked = true : this.nodes.selectRelnoreferrer.checked = false;
            }
            this.selection.save();
        } else {
            this.nodes.button.classList.remove(this.CSS.buttonUnlink);
            this.nodes.button.classList.remove(this.CSS.buttonActive);
        }
        return !!anchorTag;
    }

    clear() {
        this.closeActions();
    }

    toggleActions() {
        if (!this.inputOpened) {
            this.openActions(true);
        } else {
            this.closeActions(false);
        }
    }

    openActions(needFocus = false) {
        this.nodes.wrapper.classList.add(this.CSS.wrapperShowed);
        if (needFocus) {
            this.nodes.input.focus();
        }
        this.inputOpened = true;

        let allow = true;
        
        this.nodes.input.addEventListener('keydown', (e) => {
            if ( (navigator.userAgentData.platform == "macOS" ? e.metaKey : e.ctrlKey) && e.code == 'KeyV') {
                if ( allow ) {
                    allow = false
                    navigator.clipboard
                    .readText()
                    .then(
                        cliptext => {
                            this.nodes.input.value = this.nodes.input.value.substr(0, e.target.selectionStart) + cliptext + this.nodes.input.value.substr(e.target.selectionStart);
                            setTimeout(() => {
                                allow = true
                            }, 500);
                        },
                        err => console.log(err)
                    );  
                }
            }
        })
    }

    closeActions(clearSavedSelection = true) {
        if (this.selection.isFakeBackgroundEnabled) {
            const currentSelection = new SelectionUtils();
            currentSelection.save();
            this.selection.restore();
            this.selection.removeFakeBackground();
            currentSelection.restore();
        }
        this.nodes.wrapper.classList.remove(this.CSS.wrapperShowed);
        this.nodes.input.value = '';
        this.nodes.selectTarget.value = '';
        this.nodes.selectRelnofollow.checked = false;
        this.nodes.selectRelnoopener.checked = false;
        this.nodes.selectRelnoreferrer.checked = false;

        if (clearSavedSelection) {
            this.selection.clearSaved();
        }
        this.inputOpened = false;
    }

    savePressed(event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        let value = this.nodes.input.value || '';
        let target = this.nodes.selectTarget.checked ? '_blank' : '';
        let rel = [this.nodes.selectRelnofollow.checked ? 'nofollow' : '', this.nodes.selectRelnoopener.checked ? 'noopener' : '', this.nodes.selectRelnoreferrer.checked ? 'noreferrer' : ''];
        if (!value.trim()) {
            this.selection.restore();
            this.unlink();
            event.preventDefault();
            this.closeActions();
        }

        if (!!this.config.validate && !!this.config.validate === true && !this.validateURL(value)) {
            this.tooltip.show(this.nodes.input, 'The URL is not valid.', {
                placement: 'top',
            });
            setTimeout(() => {
                this.tooltip.hide();
            }, 1000);
            return;
        }

        value = this.prepareLink(value);

        this.selection.restore();
        this.selection.removeFakeBackground();

        this.insertLink(value, target, rel);

        this.selection.collapseToEnd();
        this.inlineToolbar.close();
    }

    validateURL(str) {
        const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str);
    }

    prepareLink(link) {
        link = link.trim();
        link = this.addProtocol(link);
        return link;
    }

    addProtocol(link) {
        if (/^(\w+):(\/\/)?/.test(link)) {
            return link;
        }

        const isInternal = /^\/[^/\s]?/.test(link),
            isAnchor = link.substring(0, 1) === '#',
            isProtocolRelative = /^\/\/[^/\s]/.test(link);

        if (!isInternal && !isAnchor && !isProtocolRelative) {
            link = 'http://' + link;
        }

        return link;
    }

    insertLink(link, target='', rel='') {
        let anchorTag = this.selection.findParentTag('A');
        if (anchorTag) {
            this.selection.expandToTag(anchorTag);
            anchorTag.setAttribute('href', link)
        }else{
            document.execCommand(this.commandLink, false, link);
            anchorTag = this.selection.findParentTag('A');
        }
        if(anchorTag) {
            if(!!target) {
                anchorTag['target'] = target;
            }else{
                anchorTag.removeAttribute('target');
            }
            if(!!rel) {
                anchorTag['rel'] = rel;
                anchorTag['rel'] = anchorTag['rel'].replaceAll(',', ' ');
            }else{
                anchorTag.removeAttribute('rel');
            }
        }
    }

    unlink() {
        document.execCommand(this.commandUnlink);
    }

    addOption(element, text, value=null) {
        let option = document.createElement('option');
        option.text = text;
        option.value = value;
        element.add(option);
    }
}
