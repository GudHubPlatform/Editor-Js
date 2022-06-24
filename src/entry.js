import grapesjs from "grapesjs";
import './../node_modules/grapesjs/dist/css/grapes.min.css';
import './scss/style.scss';

export default class GrapesHTMLEditorData {
    getTemplate() {
        var fieldTemplate = {
          constructor: 'file',
          name: 'Grapes Class',
          icon: 'code_editor',
          type: 'grapes_class',
          model: {
            'field_id': 0,
            'field_name': 'Grapes Class',
            'field_value': '',
            'data_id': 0,
            'data_type': 'grapes_class',
            'file_name': '',
            data_model: {
              images_field_id: '',
              interpretation: [{
                src: 'form',
                id: 'default',
                settings: {
                  editable: 1,
                  show_field_name: 1,
                  show_field: 1
                }
              }]
            }
          }
        };
  
        return fieldTemplate;
      }
  
      /*------------------------------- ACTION INTERPRETATION --------------------------------------*/
  
      getInterpretation(value, fieldValue, appId) {
  
        return [{
          id: 'default',
          name: 'Default',
          content: ()=>
            '<grapes-html-editor gh-model="field_model.field_value" app-id="{{appId}}" item-id="{{itemId}}" field-model="field_model" mode="{{field_model.data_model.code_mode}}"></grapes-html-editor>'
        },{
                  id: 'web',
                  name: 'Web',
                  content: async () => {
                      let file = await gudhub.downloadFileFromString(appId, fieldValue);
                      return file.data;
                  }
              },{
          id:'value',
          name: 'Value',
          content: () => value
        }];
      }
  
      /*------------------------------- WINDOW HTML TEMPLATE --------------------------------------*/
      getWindowHTML(scope) {
          return new Promise(resolve => {
              resolve();
          })
      }
  
      /*------------------------------- ACTION SCOPE --------------------------------------*/
      getActionScope(scope) {}
  
      /*--------------------------  ACTION SETTINGS --------------------------------*/
      getSettings(scope) {
        var settingTemplate = [{
          title: 'Options',
          type: 'general_setting',
          icon: 'menu',
          columns_list: [
            [{
              type: 'ghElement',
              property: 'data_model.images_field_id',
              data_model: function (fieldModel) {
                return {
                  data_model: {
                    app_id: fieldModel.app_id
                  },
                  field_name: 'Field for images',
                  name_space: 'field_for_images',
                  data_type: 'field'
                };
              }
            }]]
        }];
  
        return settingTemplate;
      }
  
      /*----------------------------- RUN ACTION -------------------------*/
      runAction(scope){
        return '';
      }
}

class GrapesHTMLEditor extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = '<div class="grapes-container"></div>';
        const container = this.querySelector('.grapes-container');

        const editor = grapesjs.init({
            container
        });
    }
}

if(!window.customElements.get('grapes-html-editor')) {
    window.customElements.define('grapes-html-editor', GrapesHTMLEditor);
}