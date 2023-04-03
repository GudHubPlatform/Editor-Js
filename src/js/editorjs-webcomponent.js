import editorjs from '@editorjs/editorjs';
import DragDrop from 'editorjs-drag-drop';
import Header from '@editorjs/header';
// import Table from '@editorjs/table';
import List from '@editorjs/list';
// import NestedList from '@editorjs/nested-list';
import Checklist from '@editorjs/checklist';
import Embed from '@editorjs/embed';
import CodeMirror from 'editorjs-codemirror';
import Faq from './editorjs-faq.js';
import Blockquote from './editorjs-blockquote.js';
import HowTo from './editorjs-howto.js';
import CustomImage from './editorjs-image.js';
import EditorJsColumns from '@calumk/editorjs-columns';
import HTMLViewer from './editorjs-htmlViewer.js';
// import MultiLevelList from './editorjs-list.js';
import Hyperlink from './editorjs-inlineToolLink.js';
import SetTextColor from './editorjs-inlineToolColor.js';
import ProsCons from './editorjs-prosCons.js';
import Table from './editorjs-table.js';
import 'codemirror/theme/dracula.css';

/********************* EDITOR JS WEB COMPONENT CREATING *********************/

class EditorJS extends HTMLElement {
  constructor() {
    super();
    this.editor;
    this.appId;
    this.active = true;
    this.itemId;
    this.fieldId;
    this.fieldValue;
    this.previousBlocksCount = 0;
    this.uploadedImages = [];
    this.countEd = 0;
    this.imageProperties;
  }

  /********************* GET ATTRIBUTES *********************/
  // Getting attributes from component's data attributes

  getAttributes() {
    this.appId = this.getAttribute('app-id');
    this.itemId = this.getAttribute('item-id');
    this.fieldId = this.getAttribute('field-id');
    this.fieldValue = this.getAttribute('field-value');
    this.fieldModel = this.getAttribute('field-model');
    this.imageProperties = this.getAttribute('image-properties');
  }

  /********************* OBSERVED ATTRIBUTES *********************/
  // Adding listeners to component's data attributes

  static get observedAttributes() {
    return ['app-id'];
  }
  static get enableLineBreaks() {
    return true
  }
  /********************* ATTRIBUTE CHANGED CALLBACK*********************/
  // We init editor only after attributes change
  // We are doing it, instead of connedctedCallback to get right data
  // Usgin connectedCallback we are always receiving not ready data like this - {{appId}}

  attributeChangedCallback(name, oldValue, newValue) {
    let count_of_editors = document.querySelectorAll('editor-js');
    this.countEd = count_of_editors;
    
    let uniq = Date.now().toString(32);

    if (name == 'app-id' && newValue.indexOf('{{') == -1) {
      this.innerHTML = /*html*/`
      <div id="editorjs${uniq}" class="editorjs"></div>
      <div class="editorjs__saving">
        <span>Saving...</span>
      </div>
      `;

      setTimeout(() => {
        this.getAttributes();
        this.init(uniq);
        this.initPipeService();
      }, 0);
    }
  }
  /********************* INIT *********************/
  // Checks if document exists for this field, if yes - download it and render in editor.js
  // Then adding listeners for editor saving

  async init(id) {
    const self = this;

    let savedData = null;
    
    if(this.appId && this.itemId && this.fieldId) {
      savedData = await this.load();
    }
    const allTools = {
      linkTool: {
        class: Hyperlink,
      },
      list: {
        class: List,
        inlineToolbar: true
      },
      setTextColor: {
        class: SetTextColor,
      },
      header: {
        class: Header,
        inlineToolbar: true,
        config: {
          placeholder: 'Enter a header',
          levels: [1, 2, 3, 4, 5],
          
        }
      },
      faq: {
        class: Faq,
        inlineToolbar: true,
        config: {
          placeholder: 'Enter a question'
        }
      },
      blockquote: {
        class: Blockquote,
        inlineToolbar: true,
      },
      prosCons: {
        class: ProsCons,
        inlineToolbar: true,
        config: {
          placeholder: 'Enter a question'
        }
      },
      htmlViewer: {
        class: HTMLViewer,
      },
      howTo: {
        class: HowTo,
        inlineToolbar: true
      },
      
      image: {
        class: CustomImage,
        config: {
          captionPlaceholder: 'Alt',
          imageProperties: self.imageProperties,
          uploader: {

            /* CUSTOM IMAGE LOADER */
            
            uploadByFile(file) {
              return new Promise(async (resolve) => {
                const toBase64 = file => new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = () => resolve(reader.result);
                  reader.onerror = error => reject(error);
                });
                let fileBase64 = await toBase64(file);
                let uploaded = await gudhub.uploadFileFromString({
                  source: fileBase64.substring(fileBase64.indexOf(',') + 1, fileBase64.length),
                  format: 'base64',
                  file_name: file.name,
                  extension: fileBase64.substring(fileBase64.indexOf('/') + 1, fileBase64.indexOf(';')),
                  app_id: self.appId,
                  item_id: self.itemId,
                  field_id: self.fieldId
                });
                self.uploadedImages.push(uploaded.file_id);
                resolve({ success: 1, file: uploaded });
              });
            }
          }
        }
      },
      table: {
        class: Table,
        inlineToolbar: true,
        data: {
          "withHeadings": true
        }
      },
      checklist: {
        class: Checklist,
        inlineToolbar: true,
      },
      embed: {
        class: Embed
      },
      code: {
        class: CodeMirror,
        config: {
          codeMirrorConfig: {
              line: true,
              theme: 'dracula'
          }
        }
      }
    }

    this.editor = new editorjs({
      onReady: () => {
        new DragDrop(this.editor);
      },
      holder: `editorjs${id}`,
      logLevel: 'ERROR',
      autofocus: false,
      data: savedData,
      readOnly: false,
      autofocus: true,
      inlineToolbar: ['bold', 'italic', 'linkTool', 'setTextColor'],
      tools: {
        ...allTools,
        editorJsColumns: {
          class: EditorJsColumns,
          config:{
            tools : allTools
          }
        },
      }
    });
    this.addEventListener('mouseover', (e) => {
      if (window.innerWidth > 650) {
        let blocks = document.querySelectorAll('.ce-block');
        let blockTune = document.querySelector('.ce-toolbar__actions');
        for (let block = 0; block < blocks.length; block++) {
          if (e.target.classList.contains('cdx-block') && !e.target.querySelector('.image-tool')){
            blockTune.style.bottom = `-${e.target.offsetHeight - 10}px`;
            blockTune.style.top = 'auto';
          }
        }
      }
    })
    this.addEventListener('paste', function(e) {
      e.preventDefault();
      let formattingText = e.target.innerText.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
      e.target.innerHTML = formattingText;
    });
    // Adding listeners on Ctrl + S and on Enter to save the editor content

    this.addEventListener('keydown', async (e) => {
      if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        this.save();
      }
      if(e.key === 'Enter') {
        this.save();
      }
    }, false);

    // Adding listeners to save editor content on click outside

    this.addListeners();
  }

  /********************* LOAD *********************/
  // Just loading document based on address (appId, itemId, fieldId)

  async load() {
    let file = await gudhub.getDocument({
      app_id: this.appId,
      item_id: this.itemId,
      element_id: this.fieldId
    });

    if (file) {
      // Saving blocks count
      this.previousBlocksCount = JSON.parse(file.data).blocks.length;
      // Saving count of image blocks
      
      this.uploadedImages = JSON.parse(file.data).blocks.map(block => block.type === 'image' ? block.data.file.file_id : false).filter(block => block !== false);
      return JSON.parse(file.data);
    } else {
      return '';
    }
  }

  /********************* SAVE *********************/

  async save() {
    const dataModel = JSON.parse(this.fieldModel);
    if (dataModel.settings.editable) {
      this.toggleSavingPopup();
      
      await this.checkIfImageDeleted();
      
      let data = await this.editor.save();
      let document = await gudhub.createDocument({
        app_id: this.appId,
        item_id: this.itemId,
        element_id: this.fieldId,
        data: JSON.stringify(data)
      });
      
      if(!this.fieldValue) {
        await gudhub.setFieldValue(this.appId, this.itemId, this.fieldId, document._id);
        this.fieldValue = document._id;
      }
      
      this.toggleSavingPopup(); 
    }
  }

  /********************* INIT PIPE SERVICE *********************/
  // On pipe service emit we download new data and render it in editor.js

  initPipeService() {
    gudhub.on('gh_document_insert_one', { app_id: this.appId, item_id: this.itemId, element_id: this.fieldId }, async () => {
        if (!this.active) {
          setTimeout(async() => {
            this.toggleSavingPopup();
    
          let file = await gudhub.getDocument({
            app_id: this.appId,
            item_id: this.itemId,
            element_id: this.fieldId
          });
    
          this.editor.render(JSON.parse(file.data));
    
          this.toggleSavingPopup();
          }, 0);
        }
      })
  }

  /********************* ADD LISTENERS *********************/
  // Need to save editor when click outside editor.js

  addListeners() {
    this.addEventListener('click', () => {
      window.addEventListener('click', listener, false);
    });

    let listener = (e) => {
      let path = e.composedPath();
      if(!path.find(item => item == this)) {
        window.removeEventListener('click', listener, false);
        this.active = false;
        this.save();
      } else {
        this.active = true;
      }
    }
    
    this.addEventListener('click', (e) => {
        if (e.target.hasAttribute('href') || e.target.closest('a')) {
          if (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) {
            window.open(e.target.getAttribute('href') || e.target.closest('a').getAttribute('href'), '_blank').focus();
          }
        }
    })
  }

  /********************* CHECK IF IMAGE DELETED *********************/
  // Need to check if image block was deleted from edtior, and then send request to server to delete image file, than was deleted fro editor

  checkIfImageDeleted() {
    return new Promise(async (resolve) => {
      const self = this;
      let data = await this.editor.save();
      let currentUploadedImages = data.blocks.map(block => block.type === 'image' ? block.data.file.file_id : false).filter(block => block !== false);
      
      let deletedImages = this.uploadedImages.filter(id => !currentUploadedImages.includes(id));

      let promises = [];

      deletedImages.forEach(image => {
        promises.push(new Promise(async (resolve) => {
          let isFileExist = await gudhub.getFile(self.appId, image);
          if( isFileExist ){
            await gudhub.deleteFile(self.appId, image);
          }
          resolve(true);
        }));
      });

      if (promises.length > 0) {
        Promise.all(promises).then(() => {
          resolve(true);
        });
      } else {
        resolve(true);
      }
    });
  }

  /********************* TOGGLE SAVING POPUP *********************/

  toggleSavingPopup() {
    let popup = this.querySelector('.editorjs__saving');
    if(popup.classList.contains('saving')) {
      popup.classList.remove('saving');
    } else {
      popup.classList.add('saving');
    }
  }

}

if (!window.customElements.get('editor-js')) {
  window.customElements.define('editor-js', EditorJS);
} 