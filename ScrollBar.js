class ScrollBar
{
    constructor()
    {
        this.$ = 
        {
            scrollbar: document.querySelector('.scrollbar'),
            list: document.querySelector('.scrollbar__list'),
            tab: document.querySelector('.scrollbar__tab'),
            items: [],
            about: document.querySelector('.about'),
        }

        this.parseWords = []    

        this.params = 
        {
            itemHeight: 0,
            visibleWords: 5,
        }

        const aboutText = this.$.about.innerText

        this._parseWords(aboutText)
        this._craftScrollBarDOM()
        this._initParams()
        this._initStyles()
        this._listeners()
    }

    _listeners()
    {
        window.addEventListener('scroll', () => { this._handleScroll() })
        window.addEventListener('resize', () => { this._initParams(); this._initStyles() })
    }

    _parseWords(_text)
    {
        let count = 0
        let currentString = ''

        for(let i = 0; i < _text.length; i++)
        {
            if(_text[i] != ' ' || count < 4)
            {
                currentString+= _text[i]
            }
            else
            {
                currentString+= _text[i]

                this.parseWords.push(currentString)

                count = 0
                currentString = ''
            }

            count++
        }
    }

    _initParams()
    {
        this.params.itemHeight = this.$.items[0].offsetHeight
        this.params.visibleItemsHeight = this.params.itemHeight * this.params.visibleWords
        this.params.scrollbarHeight = this.$.scrollbar.offsetHeight
        this.params.listScrollEnding = this.$.scrollbar.offsetHeight - this.params.visibleItemsHeight
        this.params.documentScrollEnding = document.body.offsetHeight - window.innerHeight
        this.params.listHeight = this.$.list.offsetHeight
        this.params.initialOffset = (this.params.visibleWords - (this.params.visibleWords % 2)) / 2 * this.params.itemHeight
        this.params.tabScrollEnding = this.params.listHeight + this.params.initialOffset - this.params.visibleItemsHeight + this.params.initialOffset
        this.params.itemLength = this.$.items.length
        this.params.wordScrollOffset = this.params.documentScrollEnding / (this.params.itemLength - 1)
        this.params.wordsHalfIn = Math.floor(this.params.visibleWords / 2)
        this.params.wordsHalfOut = Math.ceil(this.params.visibleWords / 2)
    }
    
    _initStyles()
    {
        this.$.tab.style.height = `${this.params.visibleItemsHeight}px`
        this.$.list.style.transform = `translateY(${this.params.initialOffset}px)`
    }

    _craftScrollBarDOM()
    {
        for(let i = 0; i < this.parseWords.length; i++)
        {
            const item = document.createElement('li')
            const meteric = document.createElement('div')

            item.innerText = this.parseWords[i]
            meteric.classList.add('meteric')

            this.$.list.appendChild(item)
            this.$.items.push(item)
            item.appendChild(meteric)
        }
    }

    _handleScroll()
    {
        //Scroll bar variables
        let scrollRatio = (window.scrollY * this.params.listScrollEnding) / this.params.documentScrollEnding
        let tabScrollRatio = (window.scrollY * this.params.tabScrollEnding) / this.params.documentScrollEnding

        //Words variables
        let wordRatio = window.scrollY / (this.params.wordScrollOffset * this.params.wordsHalfIn)
        let currentWordIndex = Math.floor(window.scrollY / this.params.wordScrollOffset)

        if(wordRatio >= 1)
        {
            wordRatio = (this.params.wordScrollOffset * this.params.wordsHalfIn) / window.scrollY
        }

        if(window.scrollY >= currentWordIndex * this.params.wordScrollOffset)
        {
            //Calculer le current scroll de chaque mot
        }

        // console.log
        // (
        //     '%c' + this.params.wordScrollOffset * this.params.wordsHalfIn, 
        //     'color: white; font-size: 20px; font-weight: bold'
        // )
        // console.log
        // (
        //     '%c' + window.scrollY, 
        //     'color: orange; font-size: 20px; font-weight: bold'
        // )
        // console.log
        // (
        //     '%c' + currentWordIndex * this.params.wordScrollOffset, 
        //     'color: green; font-size: 20px; font-weight: bold'
        // )
                
        this.$.tab.style.transform = `translateY(${Math.round(scrollRatio)}px)`
        this.$.list.style.transform = `translateY(${this.params.initialOffset + Math.round(-tabScrollRatio)}px)`
        
    }
}
