import editorjs from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Image from '@editorjs/image';
import Table from '@editorjs/table';

class EditorJS extends HTMLElement {
  constructor() {
    super();
    this.editor;
    this.appId;
    this.itemId;
    this.fieldId;
    this.fieldValue;
  }

  getAttributes() {
    this.appId = this.getAttribute('app-id');
    this.itemId = this.getAttribute('item-id');
    this.fieldId = this.getAttribute('field-id');
    this.fieldValue = this.getAttribute('field-value');
  }

  connectedCallback() {
    this.innerHTML = '<div id="editorjs" class="editorjs"></div>';

    setTimeout(() => {
      this.getAttributes();
      this.init();
    }, 0);
  }

  async init() {
    const self = this;

    let savedData = await this.load();

    this.editor = new editorjs({
      holder: 'editorjs',
      data: savedData,
      tools: {
        header: {
          class: Header,
          config: {
            placeholder: 'Enter a header',
            levels: [1,2,3,4,5]
          }
        },
        table: {
          class: Table
        },
        image: {
          class: Image,
          config: {
            uploader: {
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
                  })
                  resolve({ success: 1, file: uploaded });
                });
              }
            }
          }
        }
      }
    });

    this.addEventListener('keydown', async (e) => {
      if(e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        let data = await this.editor.save();
        this.save(data);
      }
    }, false);
  }

  async load() {

    let file = await gudhub.getDocument({
      app_id: this.appId,
      item_id: this.itemId,
      element_id: this.fieldId
    });
    
    if(file) {
      return JSON.parse(file.data);
    } else {
      return '';
    }
  }

  async save(data) {
    await gudhub.createDocument({
      app_id: this.appId,
      item_id: this.itemId,
      element_id: this.fieldId,
      data: JSON.stringify(data)
    });
  }

}

if(!window.customElements.get('editor-js')) {
    window.customElements.define('editor-js', EditorJS);
}