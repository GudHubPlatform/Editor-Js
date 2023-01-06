import Image from '@editorjs/image';
export default class CustomImage extends Image  { 
    constructor(data, api) {
        super(data, api);
        this.savedData = data;
        this.saveCount = 0;
    }
    static get toolbox() {
        return {
            title: 'Image',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 350 350" enable-background="new 0 0 350 350"><path d="M5,350h340V0H5V350z M25,330v-62.212h300V330H25z M179.509,247.494H60.491L120,171.253L179.509,247.494z   M176.443,211.061l33.683-32.323l74.654,69.05h-79.67L176.443,211.061z M325,96.574c-6.384,2.269-13.085,3.426-20,3.426  c-33.084,0-60-26.916-60-60c0-6.911,1.156-13.612,3.422-20H325V96.574z M25,20h202.516C225.845,26.479,225,33.166,225,40  c0,44.112,35.888,80,80,80c6.837,0,13.523-0.846,20-2.518v130.306h-10.767l-104.359-96.526l-45.801,43.951L120,138.748  l-85.109,109.04H25V20z"/></svg>'
        };
    }

    rendered(){
        /* Create block for input title value */
        
        let block = document.createElement('div');
        block.setAttribute('contenteditable', true);
        block.setAttribute('placeholder', "Title");
        block.style.color = '#707684';
        block.style.fontWeight = '400';
        block.classList.add('image_title');
        
        let blockUrl = document.createElement('div');
        blockUrl.setAttribute('contenteditable', true);
        blockUrl.setAttribute('placeholder', "URL");
        blockUrl.style.color = '#707684';
        blockUrl.style.fontWeight = '400';
        blockUrl.classList.add('image_url');
        
        /* Check if we have in saved data element "title" if yes paste this value, if no paste placeholder "Title" */
        let imageItems = document.querySelectorAll('.image-tool');
        
        for (let item = 0; item < imageItems.length; item++){
            
            imageItems[item].classList.add('custom-image');
            if(!imageItems[item].querySelector('.image_title')){
                imageItems[item].appendChild(blockUrl)
                imageItems[item].appendChild(block)
            }
            let titleText = this.savedData.data.title ? this.savedData.data.title : "Title"
            let urlText = this.savedData.data.url ? this.savedData.data.url : "URL"
            block.innerText = titleText;
            blockUrl.innerText = urlText;
        }
        this.focus(block);
        this.focus(blockUrl);
    }

    focus(field) {
        field.addEventListener('focus', () => {
            if (field.innerText === "Title" || field.innerText === "URL") {
                field.innerText = '';
                field.style.color = 'rgba(0,0,0,0.87)';
                field.style.fontWeight = '300';
            }
        })
        field.addEventListener('focusout', () => {
            if (field.innerText === "") {
                field.innerText = field.getAttribute('placeholder');
                field.style.color = '#707684';
                field.style.fontWeight = '400';
            } else {
                field.innerText = field.innerText;
                field.style.color = 'rgba(0,0,0,0.87)';
                field.style.fontWeight = '300';
            }
        })
    }

    save() {
        const caption = this.ui.nodes.caption;
        
        this._data.caption = caption.innerHTML;
        
        let imageBlocks = document.querySelectorAll('.image-tool');
        
        let rightBlock;
        if (imageBlocks !== null){
            /* Editor js save this type of data separately from each other, so we need to save title to right block. This checking we do by file id for each element */
            for ( let item = 0; item < imageBlocks.length; item++ ) {
                const image = imageBlocks[item].querySelector('img');
                
                if (image !== null){
                    const src = image.getAttribute('src');
                    const imageId = src.substring(src.lastIndexOf('/') + 1, src.lastIndexOf('.'));
                    if(Number(imageId) === this._data.file.file_id) {
                        rightBlock = imageBlocks[item];
                    }
                }else{
                    rightBlock = document;
                }
            }
        }
        if(rightBlock.querySelector('.image_title')){
            const titleElement = rightBlock.querySelector('.image_title');
            this._data.title = titleElement.innerText;
        }
        if(rightBlock.querySelector('.image_url')){
            const urlElement = rightBlock.querySelector('.image_url');
            this._data.url = urlElement.innerText;
        }
        return this.data;
      }
}