import NestedList from '@editorjs/nested-list';
export default class List extends NestedList  { 
    constructor(data, api) {
        super(data, api);
        this.savedData = data;
        this.saveCount = 0;
        this.lists;
        
    }
    static get toolbox() {
        return {
            title: 'Nested List',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><line x1="9" x2="19" y1="7" y2="7" stroke="currentColor" stroke-linecap="round" stroke-width="2"></line><line x1="9" x2="19" y1="12" y2="12" stroke="currentColor" stroke-linecap="round" stroke-width="2"></line><line x1="9" x2="19" y1="17" y2="17" stroke="currentColor" stroke-linecap="round" stroke-width="2"></line><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5.00001 17H4.99002"></path><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5.00001 12H4.99002"></path><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5.00001 7H4.99002"></path></svg>'
        };
    }

    rendered () {
        let allEditorBlocks = document.querySelectorAll('.ce-block');
        if (allEditorBlocks) {
            for (let block = 0; block < allEditorBlocks.length; block++) {
                let self = allEditorBlocks[block];
                if (self.querySelector('.cdx-nested-list')) {
                    const uniqClass = this.generateUniqClass();
                    self.querySelector('.cdx-nested-list').classList.add('main-nested-list');
                    if (self.querySelector('.cdx-nested-list')) {
                        self.querySelector('.cdx-nested-list').classList.add(`u-${uniqClass}`);
                        self.querySelector('.cdx-nested-list').setAttribute('data-uniq-id', `u${uniqClass}`);
                    }
                    if (this.data.html) {
                        let keys = Object.keys(this.data.html);
                        if (this.data.html[keys[block]]) {
                            self.querySelector(`.cdx-nested-list`).innerHTML = this.data.html[keys[block]].replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&#47;', '/');
                            let menus = self.querySelector('.cdx-nested-list').querySelectorAll('.editMenu');
                            for (let menu = 0; menu < menus.length; menu++) {
                                menus[menu].remove();
                            }
                            let borders = self.querySelectorAll('.border');
                            for (let border = 0; border < borders.length; border++) {
                                borders[border].classList.remove('border');
                            }
                        }
                    }
                    this.createWrapper(`.u-${uniqClass}`);
                    this.addContext()
                }
            }
        }
        
        this.listener()
    }
    generateUniqClass() {
        return Math.random().toString(36).slice(2);
    }
    createWrapper(wrapperClass) {
        let wrapperElement = document.querySelector(`${wrapperClass}`);
        if (wrapperElement) {
            this.lists = wrapperElement.querySelectorAll('ul, ol');
            this.addContext();

            let editMenu = document.createElement('div');
            editMenu.setAttribute('data-id', wrapperClass.replace('.',''));
            editMenu.classList.add('editMenu');
            editMenu.innerHTML = /* html */ `
                <div class="config">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="800px" height="800px" viewBox="0 0 1024 1024"><path d="M953.34 438.431H820.715c-13.219 0-24.771-8.566-28.833-21.056a287.154 287.154 0 00-15.044-37.243c-5.623-11.608-3.402-25.507 5.785-34.725l93.467-93.457c3.603-3.606 3.603-9.45.007-13.049l-91.012-91.002c-3.593-3.596-9.428-3.596-13.028.006l-93.137 93.137c-9.235 9.235-23.241 11.437-34.893 5.702a286.77 286.77 0 00-37.487-15.314c-12.449-4.069-20.97-15.623-20.97-28.808V70.661a9.221 9.221 0 00-9.22-9.22H447.652a9.221 9.221 0 00-9.22 9.22v134.936c0 12.884-8.139 24.247-20.169 28.539-12.09 4.337-23.758 9.406-34.928 15.18-11.721 6.057-26.027 3.952-35.417-5.438l-95.973-95.973a9.21 9.21 0 00-13.035.001L147.906 238.9a9.218 9.218 0 000 13.044l99.221 99.221c9.067 9.037 11.39 22.701 6.062 34.233a287.871 287.871 0 00-12.483 31.962c-4.053 12.493-15.632 21.071-28.861 21.071H70.662a9.221 9.221 0 00-9.22 9.22v128.688a9.221 9.221 0 009.22 9.22h144.803c12.851 0 24.184 8.096 28.533 20.086a285.852 285.852 0 0012.302 28.863c5.703 11.647 3.502 25.653-5.737 34.892L147.9 772.063c-3.597 3.594-3.597 9.424.005 13.027l91.012 91.002c3.594 3.597 9.424 3.597 13.028-.006l103.008-103.008c9.215-9.185 23.175-11.413 34.781-5.745a287.088 287.088 0 0028.572 12.04c12.01 4.345 20.127 15.679 20.127 28.55V953.34a9.221 9.221 0 009.22 9.22h128.698a9.221 9.221 0 009.22-9.22V810.907c0-13.197 8.531-24.752 20.982-28.832a290.388 290.388 0 0031.081-12.211c11.534-5.328 25.182-3.01 34.226 6.034l100.205 100.195c3.593 3.596 9.428 3.596 13.028-.007l90.998-90.988c3.602-3.605 3.602-9.444.006-13.04l-96.949-96.949c-9.367-9.398-11.469-23.689-5.42-35.393 5.628-10.907 10.588-22.283 14.869-34.1 4.355-11.977 15.674-20.056 28.509-20.056h136.235a9.221 9.221 0 009.22-9.22V447.652a9.221 9.221 0 00-9.22-9.22zm0-40.96c27.713 0 50.18 22.467 50.18 50.18v128.688c0 27.713-22.467 50.18-50.18 50.18H824.502a329.929 329.929 0 01-10.926 25.092l91.482 91.482c19.589 19.589 19.589 51.354-.001 70.961l-90.998 90.988c-19.592 19.609-51.381 19.609-70.966.007l-95.004-94.994a331.648 331.648 0 01-21.562 8.483V953.34c0 27.713-22.467 50.18-50.18 50.18H447.649c-27.713 0-50.18-22.467-50.18-50.18V815.322a327.445 327.445 0 01-18.881-7.956l-97.683 97.683c-19.601 19.601-51.375 19.601-70.959.001l-91.006-90.996c-19.601-19.601-19.601-51.375 0-70.96l97.335-97.335a326.356 326.356 0 01-8.191-19.24H70.659c-27.713 0-50.18-22.467-50.18-50.18V447.651c0-27.713 22.467-50.18 50.18-50.18h133.523a328.832 328.832 0 018.805-22.517l-94.047-94.047c-19.6-19.6-19.6-51.37.001-70.971l90.998-90.988c19.591-19.608 51.365-19.608 70.966-.006l90.524 90.524a328.546 328.546 0 0126.041-11.3V70.661c0-27.713 22.467-50.18 50.18-50.18h128.698c27.713 0 50.18 22.467 50.18 50.18v124.312a327.958 327.958 0 0128.775 11.758l87.784-87.784c19.592-19.609 51.381-19.609 70.965-.007l91.012 91.002c19.582 19.599 19.582 51.359-.007 70.965l-88.152 88.143a327.948 327.948 0 0111.487 28.421h124.947zM655.36 506.88c0 82.007-66.473 148.48-148.48 148.48S358.4 588.887 358.4 506.88c0-82.007 66.473-148.48 148.48-148.48s148.48 66.473 148.48 148.48zm-40.96 0c0-59.386-48.134-107.52-107.52-107.52s-107.52 48.134-107.52 107.52c0 59.386 48.134 107.52 107.52 107.52S614.4 566.266 614.4 506.88z"/></svg>
                </div>
                <div class="close"></div>
            `;
            wrapperElement.append(editMenu);
            let config = editMenu.querySelector('.config');
            let close = editMenu.querySelector('.close');
            close.addEventListener('click', (e) => {
                wrapperElement.classList.contains('active-main-list') ? wrapperElement.classList.remove('active-main-list') : '';
                let wrapperList = e.target.closest('.cdx-nested-list');
                let currentInnerLists = wrapperList.querySelectorAll('ul, ol');
                for (let list = 0; list < currentInnerLists.length; list++) {
                    currentInnerLists[list].classList.contains('border') ? currentInnerLists[list].classList.remove('border') : '';
                }
            });
            config.addEventListener('click', (e) => {
                let wrapperList = e.target.closest('.cdx-nested-list');
                wrapperList.classList.add('active-main-list');
                let currentInnerLists = wrapperList.querySelectorAll('ul, ol');
                for (let list = 0; list < currentInnerLists.length; list++) {
                    currentInnerLists[list].classList.add('border');
                }
            })
        }
    }

    listener () {
        
        this.nodes.wrapper.addEventListener('keydown', (event) => {
            switch (event.key) {
            case 'Tab':
                this.save();
                this.addContext();
                break;
            }
        }, false);
    }

    addContext() {
        let wrapperElement = this.nodes.wrapper;
        this.lists = wrapperElement.querySelectorAll('ul, ol');
        for (let list = 0; list < this.lists.length; list++) {
            let contextMenu = document.createElement('div');
            contextMenu.classList.add('context_wrapper');
            contextMenu.innerHTML = /* html */`
                <div class="ul">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="800px" height="800px" viewBox="0 0 256 256" id="Flat"><path d="M84,64a4.0002,4.0002,0,0,1,4-4H216a4,4,0,0,1,0,8H88A4.0002,4.0002,0,0,1,84,64Zm132,60H88.00586a4,4,0,1,0,0,8H216a4,4,0,0,0,0-8Zm0,64H88.00586a4,4,0,1,0,0,8H216a4,4,0,0,0,0-8ZM44,120a8,8,0,1,0,8,8A8.00009,8.00009,0,0,0,44,120Zm0-64a8,8,0,1,0,8,8A8.00009,8.00009,0,0,0,44,56Zm0,128a8,8,0,1,0,8,8A8.00009,8.00009,0,0,0,44,184Z"/></svg>
                </div>
                <div class="ol">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="800px" height="800px" viewBox="0 0 24 24"><path d="M3.604 3.089A.75.75 0 014 3.75V8.5h.75a.75.75 0 010 1.5h-3a.75.75 0 110-1.5h.75V5.151l-.334.223a.75.75 0 01-.832-1.248l1.5-1a.75.75 0 01.77-.037zM8.75 5.5a.75.75 0 000 1.5h11.5a.75.75 0 000-1.5H8.75zm0 6a.75.75 0 000 1.5h11.5a.75.75 0 000-1.5H8.75zm0 6a.75.75 0 000 1.5h11.5a.75.75 0 000-1.5H8.75zM5.5 15.75c0-.704-.271-1.286-.72-1.686a2.302 2.302 0 00-1.53-.564c-.535 0-1.094.178-1.53.565-.449.399-.72.982-.72 1.685a.75.75 0 001.5 0c0-.296.104-.464.217-.564A.805.805 0 013.25 15c.215 0 .406.072.533.185.113.101.217.268.217.565 0 .332-.069.48-.21.657-.092.113-.216.24-.403.419l-.147.14c-.152.144-.33.313-.52.504l-1.5 1.5a.75.75 0 00-.22.53v.25c0 .414.336.75.75.75H5A.75.75 0 005 19H3.31l.47-.47c.176-.176.333-.324.48-.465l.165-.156a5.98 5.98 0 00.536-.566c.358-.447.539-.925.539-1.593z"/></svg>
                </div>
            `;
            if (!this.lists[list].querySelector('.context_wrapper')) {
                this.lists[list].append(contextMenu);
            }
            let listTypes = document.querySelectorAll('.context_wrapper');
            for (let type = 0; type < listTypes.length; type++) {
                listTypes[type].addEventListener('click', (e) => {
                    let target;
                    if (e.target.className == 'ol' || e.target.className == 'ul') {
                        target = e.target.className;
                    } else {
                        target = e.target.closest('.ol, .ul').className;
                    }
                    let newList = document.createElement(target);
                    newList.setAttribute('class', `cdx-nested-list__item-children changed cdx-nested-list cdx-block cdx-nested-list--${target == 'ol' ? 'ordered' : 'unordered'}`)
                    let currentList = listTypes[type].closest('ol, ul');
                    let wrapper = currentList.parentElement;
                    newList.innerHTML = currentList.innerHTML;
                    if (wrapper) {
                        wrapper.append(newList);
                    }
                    currentList.remove();
                    this.addContext();
                })
            }
        }
    }

    save () {
        if (this.nodes.wrapper.closest('editor-js')) {
            let editor = this.nodes.wrapper.closest('editor-js');
            let caption = editor.querySelectorAll('.cdx-nested-list') ;
            if (!this.data.count || this.data.count == 'end') {
                this.data.count = 0
                this.data.html = {}
            }
            let onlyMainLists= []
            for (let list = 0; list < caption.length; list++) {
                if (caption[list].hasAttribute('data-uniq-id')) {
                    onlyMainLists.push(caption[list])
                }
            }
            if (onlyMainLists.length > 0) {
                for (let mainList = 0; mainList < onlyMainLists.length; mainList++) {
                    let uniqId = onlyMainLists[mainList].getAttribute('data-uniq-id');
                    this.data.count = onlyMainLists.length;
                    this.data.html[`u${uniqId}`] = onlyMainLists[mainList].innerHTML.replaceAll('<', '&lt;').replaceAll('>','&gt;').replaceAll('/', '&#47;');
                    this.data.wrapperTag = onlyMainLists[mainList].tagName.toLowerCase();
                    if (mainList == this.data.count - 1) {
                        this.data.count = 'end';
                    }
                }
            }
        }
        return this.data;
    }
}