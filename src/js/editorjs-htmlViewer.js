import * as Ace from "ace-builds";
import "ace-builds/webpack-resolver.js";
import monokai from "ace-builds/src-min-noconflict/theme-monokai.js";
import "ace-builds/src-noconflict/mode-html.js";


export default class HTMLViewer {
    constructor({ data }) {
        this.data = data;
        this.editorAce = '';
    }
    static get toolbox() {
        return {
            title: 'Live Code Editor',
            icon: '<svg t="1579056838304" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1481" width="32" height="32"><path d="M458.1197853 689.75976308l-156.42642974-156.42642975 156.42642974-156.42642975-47.50728606-47.50728607L206.67878342 533.33333333l203.93371582 203.93371583 47.50728606-47.50728609z m107.7604294-1e-8l156.42642974-156.42642974-156.42642974-156.42642975 47.50728606-47.50728607L817.32121658 533.33333333 613.38750076 737.26704916 565.8802147 689.75976308z" p-id="1482"></path></svg>'
        };
    }
    render() {
        /* Create a wrapper for code editor */
        let editorWrap = document.createElement('div');
        editorWrap.classList.add('editorWrap');

        let editor = document.createElement('div');
        editor.id = 'aceEditor';
        editor.setAttribute('contenteditable', 'true');

        editorWrap.appendChild(editor);
        /* Init a code editor and configure it */
        this.editorAce = Ace.edit(editor);
        this.editorAce.setOptions({useWorker: false })

        this.editorAce.setTheme(monokai);
        this.editorAce.session.setMode("ace/mode/html");

        /* Check if we have a saved data. If have input in our code editor. setValue() it`s a method from ace-code-editor */
        if(this.data.template){
            this.editorAce.session.setValue(this.data.template)
        }
        
        
        return editorWrap;
    }
    
    save(blockContent) {
       /* Save data. getValue() it`s a method from ace-code-editor */
        let template = this.editorAce.session.getValue();
        return {
            template
        }
    }
}