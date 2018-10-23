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
        }

        this.bool =
        {
            isHover: false
        }

        this.cursorPosition =
        {
            x: 0,
            y: 0,
        }

        
        const params = 
        {
            columnsNumber: 4,
            layoutsHeight: 200,
            layoutsHeightRatio: 16/9,
            square: false,
            gapX: 60,
            gapY: 100,
            activeLayoutWidth: 50,
        }
        
        this.dynamicGrid = new DynamicGridLayouts(params)
        
        this._initParams()
        this._listeners()
    }

    _initParams()
    {
        let offset = 
        {
            x: 0,
            y: 0,
        }

        this.layoutsParams = this.dynamicGrid.getParams()

        for(let i = 0; i < this.$.layouts.length; i++)
        {
            offset.x = this.$.layouts[i].offsetTop
        }
    }

    _listeners()
    {
        for(let i = 0; i < this.$.layouts.length; i++)
        {
            this.$.layouts[i].addEventListener('mousemove', (event) => { this._magnetic(event, i) })
            this.$.layouts[i].addEventListener('mouseleave', (event) => { this._resetMagnetic(i) })
        }
        window.addEventListener('resize', () => { this._initParams() })
        window.addEventListener('mousemove', (event) => { this._initCursor(event) })
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
    }

    _resetMagnetic(_index)
    {
        this.bool.isHover = false

        this.$.layouts[_index].style.transform = `scale(1) rotateX(${0}deg) rotateY(${0}deg)`
        this.$.brights[_index].style.transform = `translate(-50%, -50%) rotate(${0}deg)`
        this.$.brights[_index].style.opacity = `0`
        this.$.shadows[_index].style.opacity = `0`
    }

    _initCursor(_event)
    {
        this.cursorPosition =
        {
            x: _event.clientX,
            y: _event.clientY,
        }
        this.$.cursor.style.opacity = '1'

        console.log('mousemove window')
        if(!this.bool.isHover)
        {
            this.$.cursor.style.transform = `translate(calc(-50% + ${this.cursorPosition.x}px), calc(-50% + ${this.cursorPosition.y}px))`
        }
        else
        {
            this.$.cursor.style.transform = `translate(calc(-50% + ${this.cursorPosition.x}px), calc(-50% + ${this.cursorPosition.y}px)) scale(3)`
            this.$.cursor.style.opacity = '.5'
        }
    }
}

new MagneticHover('.layout__project')