class MagneticHover
{
    constructor(_layoutsSelector)
    {
        this.$ = 
        {
            layouts: document.querySelectorAll(_layoutsSelector),
            lines: [],
            brights: document.querySelectorAll('.layout__bright'),
            shadows: document.querySelectorAll('.layout__shadow'),
            cursor: document.querySelector('.cursor'),
            return: document.querySelector('.return'),
            titles: document.querySelectorAll('.layout h3'),
            grid: document.querySelector('.grid'),
        }

        this.bool =
        {
            isHover: false,
            layoutInit: false,
        }

        this.cursorPosition =
        {
            x: 0,
            y: 0
        }

        this.window = 
        {
            width: window.innerWidth,
            height: window.innerHeight,
        }

        this.offsetScrollTop = 
        {
            currentScrollY: 0,
            currentScrollY_2: 0,
        }

        this.offsetScrollBottom = 
        {
            currentScrollY: 0,
            currentScrollY_2: 0,
        }

        this.topWindowElements = 
        {
            layouts: [], // elements to undisplay on scroll 
            params: 
            {
                y: 0,
                height: 0,
            }
        }

        this.bottomWindowElements = 
        {
            layouts: [], // elements to display
            params: 
            {
                y: 0,
                height: 0,
            },
        }

        this.onWindowElements = []
        
        const params = 
        {
            columnsNumber: 4,
            layoutsHeight: 200,
            layoutsHeightRatio: 4/3,
            square: false,
            gapX: 60,
            gapY: 100,
            activeLayoutWidth: 60,
        }
        
        this.dynamicGrid = new DynamicGridLayouts(params)
        new ScrollBar()
        
        this._initParams()
        this._isOnWindow()
        this._initStyle()
        this._listeners()
    }

    _initParams()
    {
        this.window = 
        {
            width: window.innerWidth,
            height: window.innerHeight,
        }

        this.layoutsParams = this.dynamicGrid.getLayoutsParams()
        this.linesParams = this.dynamicGrid.getLinesParams()
        this.$.lines = this.dynamicGrid.getLines()
    }

    _initStyle()
    {
        for(let i = 0; i < this.$.layouts.length; i++)
        {
            this.$.layouts[i].style.opacity = '0'
            this.$.layouts[i].style.visibility = 'hidden'
        }
        
    }

    _displayLayouts()
    {

        this._staggerFrom(this.$.layouts, 50, 1)
    }
    
    _staggerFrom(_elements, _delay, _opacity)
    {
        let i = 0

        const revealLayouts = () => 
        {
            _elements[i].style.transition = 'opacity .5s ease'
            _elements[i].style.visibility = `visible`
            _elements[i].style.opacity = `${_opacity}`
            
            setTimeout(() => {
                if(i < _elements.length)
                {
                    revealLayouts()
                } 
                else
                {
                    this.bool.layoutInit = true
                }
            }, _delay);

            i++
        }
        // for(let i = 0; i < _elements.length; i++)
        // {
        //     // _elements[i].style.transition = 'opacity .5s ease'
        //     _elements[i].style.visibility = `visible`
        //     _elements[i].style.opacity = `${_opacity}`
        // }
        this.bool.layoutInit = true

        setTimeout(() => {
            revealLayouts()
        }, 50);
    }

    _listeners()
    {
        for(let i = 0; i < this.$.layouts.length; i++)
        {
            this.$.layouts[i].addEventListener('mouseenter', (event) => { if(this.bool.layoutInit) this._magnetic(event, i) })
            this.$.layouts[i].addEventListener('mousemove', (event) => { if(this.bool.layoutInit) this._magnetic(event, i) })
            this.$.layouts[i].addEventListener('mouseleave', (event) => { this._resetMagnetic(i) })
        }
        window.addEventListener('resize', () => { this._initParams() })
        window.addEventListener('mousemove', (event) => { this._initCursor(event) })
        window.addEventListener('scroll', () => 
        { 
            this._isOnWindow() 
            this._offsetScroll()
        })

        this.$.return.addEventListener('click', () => { this._initParams() })
    }

    _magnetic(_event, _index)
    {
        const offset = 
        {
            x: _event.clientX - this.layoutsParams[_index].x,
            y: _event.clientY + (window.scrollY) - this.layoutsParams[_index].y,
        }

        const ratio = 
        {
            x: (offset.x / this.layoutsParams[_index].width) - 0.5,
            y: (offset.y / this.layoutsParams[_index].height) - 0.5,
        }

        this.bool.isHover = true

        this.$.layouts[_index].style.transform = `scale(1.05) rotateX(${ratio.y * 20}deg) rotateY(${-ratio.x * 20}deg)`
        this.$.brights[_index].style.transform = `translate(-50%, -50%) rotate(${ratio.x * 90}deg)`
        this.$.brights[_index].style.opacity = `.5`
        this.$.shadows[_index].style.opacity = `1`
        // this.$.titles[_index].style.opacity = `1`
        // this.$.titles[_index].style.transform = `translate(-50%, 150%) scale(1)`

        for(let i = 0; i < this.$.layouts.length; i++)
        {
            if(i != _index) this.$.layouts[i].style.opacity = '.5'
        }
    }

    _resetMagnetic(_index)
    {
        this.bool.isHover = false

        this.$.layouts[_index].style.transform = `scale(1) rotateX(${0}deg) rotateY(${0}deg)`
        this.$.brights[_index].style.transform = `translate(-50%, -50%) rotate(${0}deg)`
        this.$.brights[_index].style.opacity = `0`
        this.$.shadows[_index].style.opacity = `0`
        // this.$.titles[_index].style.opacity = `0`
        // this.$.titles[_index].style.transform = `translate(-50%, 100%) scale(.8)`

        for(let i = 0; i < this.$.layouts.length; i++)
        {
            if(i != _index) this.$.layouts[i].style.opacity = '1'
        }
    }

    _initCursor(_event)
    {
        this.cursorPosition =
        {
            x: _event.clientX,
            y: _event.clientY,
        }
        this.$.cursor.style.opacity = '1'

        if(!this.bool.isHover)
        {
            this.$.cursor.style.transform = `translate(calc(-50% + ${this.cursorPosition.x - this.window.width / 2}px), calc(-50% + ${this.cursorPosition.y - this.window.height / 2}px))`
        }
        else
        {
            this.$.cursor.style.transform = `translate(calc(-50% + ${this.cursorPosition.x - this.window.width / 2}px), calc(-50% + ${this.cursorPosition.y - this.window.height / 2}px)) scale(3)`
            this.$.cursor.style.opacity = '.5'
        }
    }

    _isOnWindow()
    {
        this._resetLayouts()

        this.onWindowElements = []
        this.topWindowElements.layouts = [] // elements to undisplay on scroll 
        this.bottomWindowElements.layouts = [] // elements to display

        for(let i = 0; i < this.$.lines.length; i++)
        {
            // // Check bottom elements
            // if(this.layoutsParams[i].y <= window.innerHeight + window.scrollY 
            //     && this.layoutsParams[i].y >= window.scrollY + window.innerHeight - this.layoutsParams[i].height)
            // {
            //     this.bottomWindowElements.layouts.push(this.$.layouts[i])
            //     this.bottomWindowElements.params.y = this.layoutsParams[i].y
            //     this.bottomWindowElements.params.height = this.layoutsParams[i].height
            // }
            // // Check on window elements
            // else if(this.layoutsParams[i].y <= window.innerHeight + window.scrollY 
            //     && this.layoutsParams[i].y >= window.scrollY )
            // {
            //     this. onWindowElements.push(this.$.layouts[i])
            // }
            // // Check top elements
            if(window.scrollY > this.linesParams[i].y + this.$.grid.offsetTop 
                && this.linesParams[i].y >= (window.scrollY - this.$.grid.offsetTop) - this.linesParams[i].height)
            {
                this.topWindowElements.layouts.push(this.$.lines[i])
                this.topWindowElements.params.y = this.linesParams[i].y
                this.topWindowElements.params.height = this.linesParams[i].height
            }
        }
        // for(let i = 0; i < this.$.layouts.length; i++)
        // {
        //     // Check bottom elements
        //     if(this.layoutsParams[i].y <= window.innerHeight + window.scrollY 
        //         && this.layoutsParams[i].y >= window.scrollY + window.innerHeight - this.layoutsParams[i].height)
        //     {
        //         this.bottomWindowElements.layouts.push(this.$.layouts[i])
        //         this.bottomWindowElements.params.y = this.layoutsParams[i].y
        //         this.bottomWindowElements.params.height = this.layoutsParams[i].height
        //     }
        //     // Check on window elements
        //     else if(this.layoutsParams[i].y <= window.innerHeight + window.scrollY 
        //         && this.layoutsParams[i].y >= window.scrollY )
        //     {
        //         this. onWindowElements.push(this.$.layouts[i])
        //     }
        //     // Check top elements
        //     else if(window.scrollY > this.layoutsParams[i].y 
        //         && this.layoutsParams[i].y >= window.scrollY - this.layoutsParams[i].height)
        //     {
        //         this.topWindowElements.layouts.push(this.$.layouts[i])
        //         this.topWindowElements.params.y = this.layoutsParams[i].y
        //         this.topWindowElements.params.height = this.layoutsParams[i].height
        //     }
        // }
    }

    _resetLayouts()
    {
        for(let i = 0; i < this.topWindowElements.layouts.length; i++)
        {
            this.topWindowElements.layouts[i].style.transform = `translateY(${this.topWindowElements.params.y}px)`
            this.topWindowElements.layouts[i].style.opacity = `1`
        }
    }

    _offsetScroll()
    {
        // Update layouts top scroll values
        if(this.topWindowElements.layouts.length > 0) 
        {
            this.offsetScrollTop.currentScrollY = 1 - (((window.scrollY - this.$.grid.offsetTop) - this.topWindowElements.params.y) / (this.topWindowElements.params.height / .2))
            this.offsetScrollTop.currentScrollY_2 = (((window.scrollY - this.$.grid.offsetTop) - this.topWindowElements.params.y) / (this.topWindowElements.params.height / 100))
        }
        else
        {
            this.offsetScrollTop.currentScrollY = 1
            this.offsetScrollTop.currentScrollY_2 = 0
        }

        // Update layouts bottom scroll values
        if(this.bottomWindowElements.layouts.length > 0) 
        {
            this.offsetScrollBottom.currentScrollY = (window.innerHeight + window.scrollY - this.bottomWindowElements.params.y) / (this.bottomWindowElements.params.height / 100)
            // console.log(this.bottomWindowElements.params.height)
        }
        else
        {
            this.offsetScrollBottom.currentScrollY = 1
            // this.offsetScrollBottom.currentScrollY_2 = 0
        }

        for(let i = 0; i < this.topWindowElements.layouts.length; i++)
        {
            // console.log(this.topWindowElements.params.y)
            // this.topWindowElements.layouts[i].style.transform = `scale(${this.offsetScrollTop.currentScrollY})`
            this.topWindowElements.layouts[i].style.transform = `translateY(${(this.topWindowElements.params.y - this.offsetScrollTop.currentScrollY_2)}px) scale(${this.offsetScrollTop.currentScrollY}) rotateX(${this.offsetScrollTop.currentScrollY_2 * .2}deg)`
        }

        // for(let i = 0; i < this.bottomWindowElements.layouts.length; i++)
        // {
        //     this.bottomWindowElements.layouts[i].style.transform = `translateY(${-this.offsetScrollBottom.currentScrollY}px`
        // }
    }
}
