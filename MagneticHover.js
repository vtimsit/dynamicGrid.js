class MagneticHover
{
    constructor(_layoutsSelector)
    {
        this.$ = 
        {
            layouts: document.querySelectorAll(_layoutsSelector),
            brights: document.querySelectorAll('.layout__bright'),
            shadows: document.querySelectorAll('.layout__shadow'),
            cursor: document.querySelector('.cursor'),
            return: document.querySelector('.return'),
            titles: document.querySelectorAll('.layout h3'),
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

        this.onWindowElements = []
        this.topWindowElements = [] // elements to undisplay on scroll 
        this.bottomWindowElements = [] // elements to display

        
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

        this.layoutsParams = this.dynamicGrid.getParams()
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
        window.addEventListener('scroll', () => { this._isOnWindow() })

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
            console.log(this.$.layouts[i])
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
        this.onWindowElements = []
        this.topWindowElements = [] // elements to undisplay on scroll 
        this.bottomWindowElements = [] // elements to display

        for(let i = 0; i < this.$.layouts.length; i++)
        {
            // Check top elements
            if(this.layoutsParams[i].y <= window.innerHeight + window.scrollY 
                && this.layoutsParams[i].y >= window.scrollY + window.innerHeight - this.layoutsParams[i].height)
            {
                this.bottomWindowElements.push(this.$.layouts[i])
            }
            // Check on window elements
            else if(this.layoutsParams[i].y <= window.innerHeight + window.scrollY 
                && this.layoutsParams[i].y >= window.scrollY )
            {
                this. onWindowElements.push(this.$.layouts[i])
            }
            // Check bottom elements
            else if(window.scrollY > this.layoutsParams[i].y 
                && this.layoutsParams[i].y >= window.scrollY - this.layoutsParams[i].height)
            {
                this.topWindowElements.push(this.$.layouts[i])
            }
        }
    }
}
