import NestedList from '@editorjs/nested-list';
export default class List extends NestedList  { 
    constructor(data, api) {
        super(data, api);
        this.savedData = data;
        this.saveCount = 0;
    }
    static get toolbox() {
        return {
            title: 'Multi-level List',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 350 350" enable-background="new 0 0 350 350"><path d="M5,350h340V0H5V350z M25,330v-62.212h300V330H25z M179.509,247.494H60.491L120,171.253L179.509,247.494z   M176.443,211.061l33.683-32.323l74.654,69.05h-79.67L176.443,211.061z M325,96.574c-6.384,2.269-13.085,3.426-20,3.426  c-33.084,0-60-26.916-60-60c0-6.911,1.156-13.612,3.422-20H325V96.574z M25,20h202.516C225.845,26.479,225,33.166,225,40  c0,44.112,35.888,80,80,80c6.837,0,13.523-0.846,20-2.518v130.306h-10.767l-104.359-96.526l-45.801,43.951L120,138.748  l-85.109,109.04H25V20z"/></svg>'
        };
    }

    async rendered () {
        console.log(this)
        let allEditorBlocks = document.querySelectorAll('.ce-block');
        console.log(allEditorBlocks)
        let wrapperClass = `.${this.nodes.wrapper.className.replaceAll(' ', '.')}`;
        for (let block = 0; block < allEditorBlocks.length; block++) {
            console.log(allEditorBlocks[block])
            let self = allEditorBlocks[block];
            console.log(self)
            console.log(self.querySelector('.cdx-nested-list'))
            if (self.querySelector('.cdx-nested-list')) {
                self.querySelector('.cdx-nested-list').classList.add('main-nested-list');
                let wrapperElement = self.querySelector(`${wrapperClass}`);
                let innerLists = wrapperElement.querySelectorAll('ul, ol');
                
                for (let list = 0; list < innerLists.length; list++) {
                    let contextMenu = document.createElement('div');
                    contextMenu.classList.add('context_wrapper');
                    contextMenu.innerHTML = /* html */`
                        <div class="ul">UL</div>
                        <div class="ol">OL</div>
                    `;
                    innerLists[list].append(contextMenu);
                    let listTypes = innerLists[list].querySelectorAll('.context_wrapper div');
                    for (let type = 0; type < listTypes.length; type++) {
                        listTypes[type].addEventListener('click', (e) => {
                            let newList = document.createElement(listTypes[type].className);
                            newList.setAttribute('class', `cdx-nested-list__item-children changed cdx-nested-list cdx-block cdx-nested-list--${listTypes[type].className == 'ol' ? 'ordered' : 'unordered'}`)
                            newList.innerHTML = contextMenu.parentElement.innerHTML;
                            innerLists[list].parentElement.append(newList);
                            innerLists[list].remove();
                        })
                    }
                }

                let editMenu = document.createElement('div');
                editMenu.classList.add('editMenu');
                editMenu.innerHTML = /* html */ `
                    <div class="config">Config</div>
                    <div class="close">Close</div>
                `;
                wrapperElement.append(editMenu);
                let config = editMenu.querySelector('.config');
                let close = editMenu.querySelector('.close');
                close.addEventListener('click', (e) => {
                    console.log('click on close')
                    for (let list = 0; list < innerLists.length; list++) {
                        innerLists[list].classList.contains('border') ? innerLists[list].classList.remove('border') : '';
                        innerLists[list].classList.contains('hover') ? innerLists[list].classList.remove('hover') : '';
                    }
                })
                config.addEventListener('click', (e) => {
                    console.log('click on config')
                    let currentList;
                    for (let list = 0; list < innerLists.length; list++) {
                        innerLists[list].classList.add('border');
                
                        innerLists[list].addEventListener('click', (ev) => {
                            console.log('click on list')
                            currentList = innerLists[list];
                            currentList.classList.contains('hover') ? currentList.classList.remove('hover') : currentList.classList.add('hover');
                            for (let removeClass = 0; removeClass < innerLists.length; removeClass++) {
                                if (removeClass != list) {
                                    innerLists[removeClass].classList.contains('hover') ? innerLists[removeClass].classList.remove('hover') : ''
                                }
                            }
                        })
                    }
                })
            }
        }
    }

    // save(blockContent) {
    //     console.log(blockContent)
    //     console.log(this)
    //     this.nodes.wrapper = blockContent
    //     console.log('2',this)
    //     return {
    //         items: this.nodes.wrapper
    //     }
    // }
    // async save(blockContent) {
    //     console.log(this)
    //     const caption = this.nodes.wrapper;
        
    //     this._data = caption.innerHTML;
    //     let data = this._data
    //     return this.data;
    //   }
    //   getItemContent(item) {
    //     const contentNode = item.querySelector(`.${this.CSS.itemContent}`);
    
    //     if (Dom.isEmpty(contentNode)) {
    //       return '';
    //     }
    
    //     return contentNode.innerHTML;
    //   }
    save () {
        console.log(this)
        const caption = this.nodes.wrapper;
        
        this._data = caption.innerHTML;
        let data = this._data
        return this.data;
    }
}