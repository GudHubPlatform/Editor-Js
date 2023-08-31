export default class SetTextCode {

    static get isInline() {
        return true;
    }
    static get isReadOnlySupported() {
        return true;
    }

    static get sanitize() {
        return {
            code: {
                style: true,
                class: "code_in_text"
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

    constructor({ api, readOnly }) {
        this.api = api;
        this.button = null;
        this._state = false;
        this.readOnly = readOnly;
        this.tag = 'CODE';
        this.class = 'code_in_text';
    }

    render() {
        if (!this.readOnly) {
            this.button = document.createElement('button');
            this.button.type = 'button';
            this.button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.7374 6.78869C14.1303 6.91968 14.3427 7.34442 14.2117 7.73737L11.2117 16.7374C11.0807 17.1303 10.656 17.3427 10.263 17.2117C9.87008 17.0807 9.65771 16.656 9.78869 16.263L12.7887 7.26303C12.9197 6.87008 13.3444 6.65771 13.7374 6.78869Z" fill="#000000"/><path fill-rule="evenodd" clip-rule="evenodd" d="M16.0119 7.93057C16.3264 7.661 16.7999 7.69743 17.0695 8.01192L20.0695 11.5119C20.3102 11.7928 20.3102 12.2072 20.0695 12.4881L17.0695 15.9881C16.7999 16.3026 16.3264 16.339 16.0119 16.0695C15.6974 15.7999 15.661 15.3264 15.9306 15.0119L18.5122 12L15.9306 8.98811C15.661 8.67361 15.6974 8.20014 16.0119 7.93057Z" fill="#000000"/><path fill-rule="evenodd" clip-rule="evenodd" d="M7.98809 7.93057C8.30259 8.20014 8.33901 8.67361 8.06944 8.98811L5.48781 12L8.06944 15.0119C8.33901 15.3264 8.30259 15.7999 7.98809 16.0695C7.6736 16.339 7.20012 16.3026 6.93056 15.9881L3.93056 12.4881C3.68981 12.2072 3.68981 11.7928 3.93056 11.5119L6.93056 8.01192C7.20012 7.69743 7.6736 7.661 7.98809 7.93057Z" fill="#000000"/></svg>';
            this.button.classList.add(this.api.styles.inlineToolButton);

            return this.button;
        }
    }

    surround(range) {
        if (this.state) {
            this.unwrap(range);
            return;
        }

        this.wrap(range);
    }
    /* Method for create span */
    wrap(range) {
        const selectedText = range.extractContents();
        const currentText = document.createElement(this.tag);

        currentText.classList.add(this.class);
        currentText.appendChild(selectedText);
        range.insertNode(currentText);

        this.api.selection.expandToTag(currentText);
    }
    /* Method for remove span */
    unwrap(range) {
        const currentText = this.api.selection.findParentTag(this.tag, this.class);
        const text = range.extractContents();

        currentText.remove();

        range.insertNode(text);
    }


    checkState() {
        const currentText = this.api.selection.findParentTag(this.tag);

        this.state = !!currentText;

    }
}