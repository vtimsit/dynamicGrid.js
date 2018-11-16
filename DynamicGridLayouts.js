class DynamicGridLayouts
{
    constructor(_params) 
    {
        this.params = _params
        
        this.$ =
        {
            grid: document.querySelector('.grid'),
            layouts: document.querySelectorAll('.layout'),
            categories: document.querySelectorAll('.categories li'),
            return: document.querySelector('.return'),
            lines: [],
        }
        
        this.bool = 
        {
            categoryOpen: false,
        }
        
        this.categories = 
        {
            toDisplay: [],
            toUndisplay: [],
        }

        this.gap = 
        {
            x: this.params.gapX,
            y: this.params.gapY,
        }

        this.layoutsParams = []
        this.linesParams = []

        this._initParams()
        this._initLayouts()
        this._craftGridLayouts(true)
        this._listeners()     
    }

    _initParams()
    {
        if(window.innerWidth < 800) { this.params.columnsNumber = 2 } else { this.params.columnsNumber = 3 }
        if(window.innerWidth < 600) { this.params.gapY = 10 } else { this.params.gapY = this.gap.y }
        if(window.innerWidth < 600) { this.params.gapX = 10 } else { this.params.gapX = this.gap.x }

        this.params.gridWidth = this.$.grid.offsetWidth
        this.params.layoutsWidth = (this.params.gridWidth - (this.params.gapX * (this.params.columnsNumber - 1))) / this.params.columnsNumber
        this.params.scaleRatio = 1

        if(this.params.square) 
        {
            this.params.layoutsHeight = this.params.layoutsWidth
        }
        else
        {
            this.params.layoutsHeight = this.params.layoutsWidth * (1 / this.params.layoutsHeightRatio)
        }
    }

    _initLayouts()
    {
        for(let i = 0; i < this.$.layouts.length; i++)
        {
            this.$.layouts[i].style.transition = 'none'
            this.$.layouts[i].style.width = `${this.params.layoutsWidth}px`

            // Check if layout are squares
            this.params.square ? this.$.layouts[i].style.height = `${this.params.layoutsWidth}px` : this.$.layouts[i].style.height = `${this.params.layoutsHeight}px`
        }
    }

    _listeners()
    {
        window.addEventListener('resize', () => { this._updateParams(); this._initLayouts() })
        // window.addEventListener('click', () => { this._stackLayouts() })

        for(let i = 0; i < this.$.categories.length; i++)
        {
            this.$.categories[i].addEventListener('click', () => { this._openCategory(this.$.categories[i].dataset.category) })
        }

        this.$.return.addEventListener('click', () => { this._resetLayouts() })
    }

    _craftGridLayouts(_init = false)
    {
        console.log('craftGRID')

        let offset = { x: 0, y: 0 }
        
        this.layoutsParams = []
        this.linesParams = []
        
        if(_init)
        {
            this.$.grid.innerHTML = ''
            this.$.lines = []
        } 
        
        for(let i = 0; i < this.$.layouts.length; i++)
        {
            if(i % this.params.columnsNumber == 0 && _init) 
            {
                const line = document.createElement('div')

                line.style.transform = `translateY(${offset.y}px)`
                line.style.height = `${this.params.layoutsHeight}px`
                line.classList.add('line')

                this.$.lines.push(line)
                this.$.grid.appendChild(line)

                for(let j = i; j < i + this.params.columnsNumber; j++)
                {
                    if(this.$.layouts[j]) 
                    {
                        line.appendChild(this.$.layouts[j])

                        //Defined line index for every layout
                        this.$.layouts[j].dataset.line = i / this.params.columnsNumber
                    }
                }
            }

            this.$.layouts[i].style.opacity = `1`
            this.$.layouts[i].style.transform = `translateX(${offset.x}px) scale(1)`
            this.layoutsParams.push(
            { 
                x: offset.x + this.$.grid.offsetLeft, 
                y: offset.y /*+ this.$.grid.offsetTop*/,
                width: this.params.layoutsWidth,
                height: this.params.layoutsHeight,
            })

            if(i % this.params.columnsNumber == 0)
            {
                this.linesParams.push(
                {
                    y: offset.y/* + this.$.grid.offsetTop*/,
                    height: this.params.layoutsHeight,
                })
            }


            // Calc offset X & Y
            offset = this._setOffset(offset)
        }
        this.$.grid.style.height = `${offset.y - this.params.gapY}px`
    }

    _craftCategoryLayouts()
    {
        let offset = { x: 0, y: 0 }

        for(let i = 0; i < this.categories.toDisplay.length; i++)
        {
            this.categories.toDisplay[i].style.transform = `translateY(${offset.y}px) scale(${this.params.scaleRatio})`

            // Calc offset X & Y
            offset.y+= (this.params.layoutsHeight * this.params.scaleRatio) + this.params.gapY
        }
    }
        

    _setOffset(_offset)
    {
        _offset.x+= this.params.layoutsWidth + this.params.gapX

        if(_offset.x >= this.params.gridWidth - this.params.gapX)
        {
            _offset.x = 0
            _offset.y+= (this.params.layoutsHeight) + this.params.gapY
        }

        return _offset
    }

    _updateParams()
    {   
        this.params.gridWidth = this.$.grid.offsetWidth
        this.params.layoutsWidth = (this.params.gridWidth - (this.params.gapX * (this.params.columnsNumber - 1))) / this.params.columnsNumber
        if(this.params.square) 
        {
            this.params.layoutsHeight = this.params.layoutsWidth
        }
        else
        {
            this.params.layoutsHeight = this.params.layoutsWidth * (1 / this.params.layoutsHeightRatio)
        }
        
        // Calc width in % of one layout relative of grid
        const layoutWidthPercentage = this.params.layoutsWidth / this.params.gridWidth * 100
        this.params.scaleRatio = this.params.activeLayoutWidth / layoutWidthPercentage
        
        if(window.innerWidth <= 800) { this.params.columnsNumber = 2 } else { this.params.columnsNumber = 3 }
        if(window.innerWidth < 600) { this.params.gapX = 10 } else { this.params.gapX = this.gap.x }
        if(window.innerWidth < 600) { this.params.gapY = 10 } else { this.params.gapY = this.gap.y }

        this.bool.categoryOpen ? this._craftCategoryLayouts() : this._craftGridLayouts(true)
    }

    _resetLayouts()
    {
        for(let i = 0; i < this.$.layouts.length; i++)
        {   
            // Active transition when category is open
            this.$.layouts[i].style.transition = 'transform .5s ease, opacity .3s ease'
        }
        this._initParams()
        this._craftGridLayouts()

        this.bool.categoryOpen = false
    }

    _openCategory(_category)
    {
        this.categories.toDisplay = []
        this.categories.toUndisplay = []
        
        for(let i = 0; i < this.$.layouts.length; i++)
        {   
            // Active transition when category is open
            this.$.layouts[i].style.transition = 'transform .5s ease, opacity .3s ease'
            this.$.layouts[i].style.zIndex = '0'

            if(this.$.layouts[i].dataset.category == _category)
            {
                this.categories.toDisplay.push(this.$.layouts[i])
            } 
            else
            {
                this.categories.toUndisplay.push(this.$.layouts[i])
            }
        }

        this._displayCategory()
        this._undisplayCategory()
    }

    _displayCategory()
    {
        let offset =
        {
            x: 0,
            y: 0,
        }

        // Calc width in % of one layout relative of grid
        const layoutWidthPercentage = this.params.layoutsWidth / this.params.gridWidth * 100

        this.params.scaleRatio = this.params.activeLayoutWidth / layoutWidthPercentage

        this.params.layoutsHeight = this.params.layoutsHeight * this.params.scaleRatio

        // setTimeout(() => {
            
            for(let i = 0; i < this.categories.toDisplay.length; i++)
            {
                const lineIndex = this.categories.toDisplay[i].dataset.line

                this.categories.toDisplay[i].style.zIndex = `10`
                this.categories.toDisplay[i].style.transform = `translateX(${offset.x}px) translateY(${offset.y - this.linesParams[lineIndex].y}px) scale(${this.params.scaleRatio})`
    
                offset.y+= this.params.layoutsHeight + this.params.gapY

                this.bool.categoryOpen = true
            }
        // }, 300);
    }

    _undisplayCategory()
    {
        for(let i = 0; i < this.categories.toUndisplay.length; i++)
        {
            this.categories.toUndisplay[i].style.opacity = `0`
        }
    }

    _stackLayouts()
    {
        let rotate = 0
        for(let i = 0; i < 9; i++)
        {
            rotate = Math.random() * (5 - (-5)) + (-5)

            this.$.layouts[i].style.transformOrigin = `center`
            this.$.layouts[i].style.transition = `transform .5s ease`
            this.$.layouts[i].style.transform = `translate(0px, 0px) rotate(${rotate}deg)`
        }
        for(let i = 9; i < this.$.layouts.length; i++)
        {
            this.$.layouts[i].style.opacity = '0'
        }
    }

    getLayoutsParams()
    {
        return this.layoutsParams
    }

    getLinesParams()
    {
        return this.linesParams
    }

    getLines()
    {
        return this.$.lines
    }
}

