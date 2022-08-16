export default class SetTextColor {
    
    /* Init this component like inline tool */
    static get isInline() {
      return true;
    }
    /* Allow attribute style for span, bacause in default configure attribute style is remove while saving */
    static get sanitize(){
        return {
            span: {
                style: true,
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
  
    constructor({api}) {
      this.api = api;
      this.button = null;
      this._state = false;
  
      this.tag = 'SPAN';
      this.class = 'cdx-marker';
    }
  
    render() {
      this.button = document.createElement('button');
      this.button.type = 'button';
      this.button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15px" height="15px" viewBox="0 0 12 12" version="1.1"><g id="surface1"><path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity: 1;" d="M 0 10 L 12 10 L 12 12 L 0 12 Z M 0 10 "/><path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 2.75 8.5 L 3.875 8.5 L 4.433594 7 L 7.558594 7 L 8.121094 8.5 L 9.246094 8.5 L 6.5 1.5 L 5.5 1.5 Z M 7.191406 6 L 4.808594 6 L 6 2.835938 Z M 7.191406 6 "/></g></svg>';
      this.button.classList.add(this.api.styles.inlineToolButton);
  
      return this.button;
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
    
      if (this.state) {
        this.showActions(currentText);
      } else {
        this.hideActions();
      }
    }
  
    renderActions() {
        /* Create inline tool elements */
      this.colorPicker = document.createElement('input');
      this.colorPicker.type = 'color';
      this.colorPicker.value = '#f5f1cc';
      this.colorPicker.hidden = true;
  
      return this.colorPicker;
    }
  
    showActions(currentText) {
    /* Create inline tool elements */
      const {color} = currentText.style;
      this.colorPicker.value = color ? this.convertToHex(color) : '#f5f1cc';
  
      this.colorPicker.onchange = () => {
        currentText.style.color = this.colorPicker.value;
      };
      this.colorPicker.hidden = false;
    }
  
    hideActions() {
      this.colorPicker.onchange = null;
      this.colorPicker.hidden = true;
    }
  
    convertToHex(color) {
      const rgb = color.match(/(\d+)/g);
  
      let hexr = parseInt(rgb[0]).toString(16);
      let hexg = parseInt(rgb[1]).toString(16);
      let hexb = parseInt(rgb[2]).toString(16);
  
      hexr = hexr.length === 1 ? '0' + hexr : hexr;
      hexg = hexg.length === 1 ? '0' + hexg : hexg;
      hexb = hexb.length === 1 ? '0' + hexb : hexb;
  
      return '#' + hexr + hexg + hexb;
    }
  }