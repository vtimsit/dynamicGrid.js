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
        let scrollRatio = (window.scrollY * this.params.listScrollEnding) / this.params.documentScrollEnding
        let tabScrollRatio = (window.scrollY * this.params.tabScrollEnding) / this.params.documentScrollEnding

        
        // const scrollWordToAnotherWord = (this.params.listHeight - this.params.initialOffset) / (this.params.itemLength - this.params.visibleWords)
        const scrollWordToAnotherWord = this.params.documentScrollEnding / (this.params.itemLength - 1)

        //wordOffset: distance which current word has to travel
        const wordOffset = scrollWordToAnotherWord * 6
        // const wordOffset = 147
        const wordHitboxOffset = 59
        let currentScale = 0
        
        this.$.tab.style.transform = `translateY(${Math.round(scrollRatio)}px)`
        this.$.list.style.transform = `translateY(${this.params.initialOffset + Math.round(-tabScrollRatio)}px)`

        // console.log((this.params.listHeight + this.params.initialOffset) / (this.params.itemLength - 1.25))
        console.log('list height: ' + this.params.listHeight)
        console.log('item length: ' + this.params.itemLength)
        console.log('sroll word to another: ' + scrollWordToAnotherWord)
        // console.log((this.params.listHeight + this.params.initialOffset) / (this.params.itemLength - 2))
        console.log(window.scrollY)

        if(window.scrollY / (wordOffset / 2) <= 1)
        {
            // console.log(currentScale)
            currentScale = window.scrollY / (wordOffset / 2)
        }
        else if(2 - window.scrollY / (wordOffset / 2) >= 0)
        {
            currentScale = 2 - window.scrollY / (wordOffset / 2)
        }

        this.$.items[3].style.transform = `scale(${1 + (1 * currentScale)})`
        this.$.items[3].style.opacity = `${currentScale}`
    }
}
