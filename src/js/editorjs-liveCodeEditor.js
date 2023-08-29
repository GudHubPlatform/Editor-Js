import CodeMirror from 'editorjs-codemirror';
export default class LiveCodeEditor extends CodeMirror  { 
    constructor(data, readOnly, api) {
        super(data, readOnly, api);
        this.savedData = data;
        this.api = this.savedData.api;
        this.data = {
            language: data.language || 'Python',
            text: data.text || ''
        }
        console.log(this.data)
    }
    static get toolbox() {
        return {
            title: 'Live Code Editor Test',
            icon: '<svg t="1579056838304" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1481" width="32" height="32"><path d="M458.1197853 689.75976308l-156.42642974-156.42642975 156.42642974-156.42642975-47.50728606-47.50728607L206.67878342 533.33333333l203.93371582 203.93371583 47.50728606-47.50728609z m107.7604294-1e-8l156.42642974-156.42642974-156.42642974-156.42642975 47.50728606-47.50728607L817.32121658 533.33333333 613.38750076 737.26704916 565.8802147 689.75976308z" p-id="1482"></path></svg>'
        };
    }
    static get isReadOnlySupported() {
        return true;
    }
    
}