import Image from '@editorjs/image';
export default class CustomImage extends Image  { 
    constructor(data, api) {
        super(data, api);
        this.savedData = data;
        this.saveCount = 0;
    }
    static get toolbox() {
        return {
            title: 'CustomImage',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 3c5.514 0 10 3.592 10 8.007 0 4.917-5.145 7.961-9.91 7.961-1.937 0-3.383-.397-4.394-.644-1 .613-1.595 1.037-4.272 1.82.535-1.373.723-2.748.602-4.265-.838-1-2.025-2.4-2.025-4.872-.001-4.415 4.485-8.007 9.999-8.007zm0-2c-6.338 0-12 4.226-12 10.007 0 2.05.738 4.063 2.047 5.625.055 1.83-1.023 4.456-1.993 6.368 2.602-.47 6.301-1.508 7.978-2.536 1.418.345 2.775.503 4.059.503 7.084 0 11.91-4.837 11.91-9.961-.001-5.811-5.702-10.006-12.001-10.006zm1.024 13.975c0 .566-.458 1.025-1.024 1.025-.565 0-1.024-.459-1.024-1.025 0-.565.459-1.024 1.024-1.024.566 0 1.024.459 1.024 1.024zm1.141-8.192c-.498-.505-1.241-.783-2.09-.783-1.786 0-2.941 1.271-2.941 3.237h1.647c0-1.217.68-1.649 1.261-1.649.519 0 1.07.345 1.117 1.004.052.694-.319 1.046-.788 1.493-1.157 1.1-1.179 1.633-1.173 2.842h1.643c-.01-.544.025-.986.766-1.785.555-.598 1.245-1.342 1.259-2.477.008-.758-.233-1.409-.701-1.882z"/></svg>'
        };
    }
    rendered(){
        /* Create block for input title value */
        
        let block = document.createElement('div');
        block.setAttribute('contenteditable', true);
        block.classList.add('image_title');
        
        /* Check if we have in saved data element "title" if yes paste this value, if no paste placeholder "Title" */
        let imageItems = document.querySelectorAll('.image-tool');
        for (let item = 0; item < imageItems.length; item++){
            imageItems[item].classList.add('custom-image');
            imageItems[item].appendChild(block)
            let titleText = this.savedData.data.title ? this.savedData.data.title : "Title"
            block.innerText = titleText;
        }
    }

    save() {
        
        const caption = this.ui.nodes.caption;
        
        this._data.caption = caption.innerHTML;
        
        let imageBlocks = document.querySelectorAll('.image-tool');
        
        let rightBlock;
        
        /* Editor js save this type of data separately from each other, so we need to save title to right block. This checking we do by file id for each element */
        imageBlocks.forEach(block => {
            const image = block.querySelector('img');
            const src = image.getAttribute('src');
            const imageId = src.substring(src.lastIndexOf('/') + 1, src.lastIndexOf('.'));
            
            if(Number(imageId) === this._data.file.file_id) {
                rightBlock = block;
            }
        });

        const titleElement = rightBlock.querySelector('.image_title');

        this._data.title = titleElement.innerText;

        return this.data;
      }
}