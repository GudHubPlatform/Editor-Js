import editorjs from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Image from '@editorjs/image';
import Table from '@editorjs/table';
import List from '@editorjs/list';
import Checklist from '@editorjs/checklist';
import Embed from '@editorjs/embed';
import CodeMirror from 'editorjs-codemirror';

/********************* EDITOR JS WEB COMPONENT CREATING *********************/

class EditorJS extends HTMLElement {
  constructor() {
    super();
    this.editor;
    this.appId;
    this.itemId;
    this.fieldId;
    this.fieldValue;
    this.previousBlocksCount = 0;
    this.uploadedImages = [];
  }

  /********************* GET ATTRIBUTES *********************/
  // Getting attributes from component's data attributes

  getAttributes() {
    this.appId = this.getAttribute('app-id');
    this.itemId = this.getAttribute('item-id');
    this.fieldId = this.getAttribute('field-id');
    this.fieldValue = this.getAttribute('field-value');
  }

  /********************* OBSERVED ATTRIBUTES *********************/
  // Adding listeners to component's data attributes

  static get observedAttributes() {
    return ['app-id'];
  }

  /********************* ATTRIBUTE CHANGED CALLBACK*********************/
  // We init editor only after attributes change
  // We are doing it, instead of connedctedCallback to get right data
  // Usgin connectedCallback we are always receiving not ready data like this - {{appId}}

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == 'app-id' && newValue.indexOf('{{') == -1) {
      this.innerHTML = /*html*/`
      <div id="editorjs" class="editorjs"></div>
      <div class="editorjs__saving">
        <span>Saving...</span>
      </div>
      `;

      setTimeout(() => {
        this.getAttributes();
        this.init();
        this.initPipeService();
      }, 0);
    }
  }

  /********************* INIT *********************/
  // Checks if document exists for this field, if yes - download it and render in editor.js
  // Then adding listeners for editor saving

  async init() {
    const self = this;

    let savedData = null;

    if(this.appId && this.itemId && this.fieldId) {
      savedData = await this.load();
    }

    this.editor = new editorjs({
      holder: 'editorjs',
      data: savedData,
      tools: {
        header: {
          class: Header,
          config: {
            placeholder: 'Enter a header',
            levels: [1, 2, 3, 4, 5]
          }
        },
        table: {
          class: Table
        },
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered'
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
          class: CodeMirror
        },
        image: {
          class: Image,
          config: {
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
        }
      }
    });

    // Adding listeners on Ctrl + S and on Enter to save the editor content

    this.addEventListener('keydown', async (e) => {
      if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        this.save();
      }
      if(e.keyCode == 13) {
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

  /********************* INIT PIPE SERVICE *********************/
  // On pipe service emit we download new data and render it in editor.js

  initPipeService() {
    gudhub.on('gh_document_insert_one', { app_id: this.appId, item_id: this.itemId, element_id: this.fieldId }, async () => {
      this.toggleSavingPopup();

      let file = await gudhub.getDocument({
        app_id: this.appId,
        item_id: this.itemId,
        element_id: this.fieldId
      });

      this.editor.render(JSON.parse(file.data));

      this.toggleSavingPopup();
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
        this.save();
      }
    }
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
          await gudhub.deleteFile(self.appId, image);
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