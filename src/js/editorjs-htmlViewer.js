import hljs from 'highlight.js';
import CodeMirror from 'editorjs-codemirror';
export default class HTMLViewer extends CodeMirror  {
    constructor( data, readOnly, api) {
        super(data, readOnly, api);
        this.savedData = data;
        this.api = this.savedData.api;
        // this.readOnly = this.savedData.config.codeMirrorConfig.readOnly;
    }
    static get toolbox() {
        return {
            title: 'Live Code Editor',
            icon: '<svg t="1579056838304" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1481" width="32" height="32"><path d="M458.1197853 689.75976308l-156.42642974-156.42642975 156.42642974-156.42642975-47.50728606-47.50728607L206.67878342 533.33333333l203.93371582 203.93371583 47.50728606-47.50728609z m107.7604294-1e-8l156.42642974-156.42642974-156.42642974-156.42642975 47.50728606-47.50728607L817.32121658 533.33333333 613.38750076 737.26704916 565.8802147 689.75976308z" p-id="1482"></path></svg>'
        };
    }
    static get isReadOnlySupported() {
        return true;
    }


    // render() {
    //     /* Create a wrapper for code editor */
    //     let editorWrap = document.createElement('div');
    //     editorWrap.classList.add('editorWrap');
    //     let pre = document.createElement('pre');
    //     editorWrap.append(pre)
    //     let code = document.createElement('code');
    //     pre.append(code)
        

    //     let editor = document.createElement('div');
    //     editor.id = 'html-editor';
    //     if (this.data.template) {
    //         editor.innerHTML = `${this.data.template}`
    //         editor.innerHTML = hljs.highlightAuto(editor.innerText).value
    //         // editor.querySelector('code').innerHTML = editor.querySelector('code').innerHTML.replaceAll("&gt;", ">").replaceAll("&lt;", "<")
    //         // editor.innerHTML = editor.innerText.replaceAll("&gt;", "<span class='hljs-tag'> > </span>").replaceAll("&lt;", "<span class='hljs-tag'> <span </span>")
    //     }
    //     if (!this.readOnly) {
    //         editor.setAttribute('contenteditable', 'true');
    //     } else {
    //         editor.setAttribute('contenteditable', 'false');
    //     }

    //     editor.addEventListener('paste', (event) => {
    //         let paste = (event.clipboardData || window.clipboardData).getData('text');
    //         console.log(paste)
    //         paste = hljs.highlightAuto(paste).value;
         
    //         const selection = window.getSelection();
    //         if (!selection.rangeCount) return false;
    //         selection.deleteFromDocument();
    //         selection.getRangeAt(0).insertNode(document.createTextNode(paste));
        
    //         event.preventDefault();
    //     });
    //     editor.addEventListener('keydown', (e) => {
    //         if (e.key === "Enter" && e.shiftKey) {
    //             let position = 0;
    //             const isSupported = typeof window.getSelection !== "undefined";
    //             if (isSupported) {
    //                 const selection = window.getSelection();
    //                 // Check if there is a selection (i.e. cursor in place)
    //                 if (selection.rangeCount !== 0) {
    //                 // Store the original range
    //                 const range = window.getSelection().getRangeAt(0);
    //                 // Clone the range
    //                 const preCaretRange = range.cloneRange();
    //                 // Select all textual contents from the contenteditable element
    //                 preCaretRange.selectNodeContents(editor);
    //                 // And set the range end to the original clicked position
    //                 preCaretRange.setEnd(range.endContainer, range.endOffset);
    //                 // Return the text length from contenteditable start to the range end
    //                 position = preCaretRange.toString().length;
    //                 }
    //             }

    //             function insert(str, index, value) {
    //                 return str.substr(0, index) + value + str.substr(index);
    //             }
    //             editor.innerHTML = insert(editor.innerHTML, position, '&nbsp;&nbsp;')
    //         }
    //     })

    //     code.appendChild(editor);
    //     /* Init a code editor and configure it */
        

    //     return editorWrap;
    // }
    
    // save(blockContent) {
    //    /* Save data. getValue() it`s a method from ace-code-editor */
    //    console.log(blockContent.querySelector('#html-editor').innerHTML)
    //     let template = blockContent.querySelector('#html-editor').innerHTML
    //     return {
    //         template
    //     }
    // }
}