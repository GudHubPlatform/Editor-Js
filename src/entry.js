import './js/editorjs-webcomponent.js';
import edjsHTML from 'editorjs-html';
import {parseFaq} from  './js/parserExtenders.js';
import {parseHowTo} from  './js/parserExtenders.js';
import {parseCustomImage} from  './js/parserExtenders.js';
import {parseEditorJsColumns} from  './js/parserExtenders.js';
import {parseTable} from  './js/parserExtenders.js';
import {parseHTMLViewer} from  './js/parserExtenders.js';

import './scss/style.scss';


/******************** DATA TYPE EXPORT ********************/

export default class EditorjsData {
  getTemplate() {
    var fieldTemplate = {
      constructor: 'document',
      name: 'EditorJS',
      icon: 'code_editor',
      type: 'editorjs',
      model: {
        'field_id': 0,
        'field_name': 'EditorJS',
        'field_value': '',
        'data_id': 0,
        'data_type': 'editorjs',
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
          }, {
            src: 'table',
            id: 'icon',
            settings: {
              editable: 0,
              show_field_name: 0,
              show_field: 1
            }
          }]
        }
      }
    };

    return fieldTemplate;
  }

  /*------------------------------- ACTION INTERPRETATION --------------------------------------*/

  getInterpretation(value, appId, itemId, field_model) {

    return [{
      id: 'default',
      name: 'Default',
      content: () =>
        '<editor-js app-id="{{appId}}" item-id="{{itemId}}" field-id="{{field_model.field_id}}" field-value="{{field_model.field_value}}"></editor-js>'
    }, {
      id: 'html',
      name: 'Html',
      content: async () => {
        let document = await gudhub.getDocument({
          app_id: appId,
          item_id: itemId,
          element_id: field_model.field_id
        });
        const edjsParser = edjsHTML({
          faq: parseFaq, 
          howTo: parseHowTo,
          customImage: parseCustomImage,
          editorJsColumns: parseEditorJsColumns,
          table: parseTable,
          htmlViewer: parseHTMLViewer,
        });

        let html = edjsParser.parse(JSON.parse(document.data));
        /* Variable html return array. This reduce remove commas, by transforming array to the string.  */
        return html.reduce((prev, current) => {
          return prev + current
        }, '');
      }
    }, {
      id: 'value',
      name: 'Value',
      content: async () => {
        let document = await gudhub.getDocument({
          app_id: appId,
          item_id: itemId,
          element_id: field_model.field_id
        });
        return document.data;
      }
    }, {
      id: 'icon',
      name: 'Icon',
      content: () =>
        '<span gh-icon="code_editor 0fb5ff 45px none"></span>'
    },];
  }

  /*------------------------------- WINDOW HTML TEMPLATE --------------------------------------*/
  getWindowHTML(scope) {
    return new Promise(resolve => {
      resolve();
    })
  }

  /*------------------------------- ACTION SCOPE --------------------------------------*/
  getActionScope(scope) { }

  /*--------------------------  ACTION SETTINGS --------------------------------*/
  getSettings(scope) {
    var settingTemplate = [{
      title: 'Options',
      type: 'general_setting',
      icon: 'menu',
      columns_list: [
        []]
    }];

    return settingTemplate;
  }

  /*----------------------------- RUN ACTION -------------------------*/
  runAction(scope) {
    return '';
  }
}