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

        this._initParams()
        this._initLayouts()
        this._craftGridLayouts()
        this._listeners()
    }

    _initParams()
    {
        if(window.innerWidth < 800) { this.params.columnsNumber = 2 } else { this.params.columnsNumber = 4 }
        if(window.innerWidth < 600) { this.params.gapY = 10 } else { this.params.gapY = 20 }
        if(window.innerWidth < 600) { this.params.gapX = 10 } else { this.params.gapX = 20 }

        this.params.gridWidth = this.$.grid.offsetWidth
        this.params.layoutsWidth = (this.params.gridWidth - (this.params.gapX * (this.params.columnsNumber - 1))) / this.params.columnsNumber
        this.params.scaleRatio = 1

        if(this.params.square) this.params.layoutsHeight = this.params.layoutsWidth
        
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

        for(let i = 0; i < this.$.categories.length; i++)
        {
            this.$.categories[i].addEventListener('click', () => { this._openCategory(this.$.categories[i].dataset.category) })
        }

        this.$.return.addEventListener('click', () => { this._resetLayouts() })
    }

    _craftGridLayouts()
    {
        let offset = { x: 0, y: 0 }

        for(let i = 0; i < this.$.layouts.length; i++)
        {
            this.$.layouts[i].style.opacity = `1`
            this.$.layouts[i].style.transform = `translateX(${offset.x}px) translateY(${offset.y}px) scale(1)`

            // Calc offset X & Y
            offset = this._setOffset(offset)
        }
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
        if(this.params.square) this.params.layoutsHeight = this.params.layoutsWidth
        
        // Calc width in % of one layout relative of grid
        const layoutWidthPercentage = this.params.layoutsWidth / this.params.gridWidth * 100
        this.params.scaleRatio = this.params.activeLayoutWidth / layoutWidthPercentage
        
        if(window.innerWidth <= 800) { this.params.columnsNumber = 2 } else { this.params.columnsNumber = 4 }
        if(window.innerWidth < 600) { this.params.gapX = 10 } else { this.params.gapX = 20 }
        if(window.innerWidth < 600) { this.params.gapY = 10 } else { this.params.gapY = 20 }

        this.bool.categoryOpen ? this._craftCategoryLayouts() : this._craftGridLayouts()
    }

    _resetLayouts()
    {
        for(let i = 0; i < this.$.layouts.length; i++)
        {   
            // Active transition when category is open
            this.$.layouts[i].style.transition = 'transform .5s ease, opacity .5s ease'
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
            this.$.layouts[i].style.transition = 'transform .5s ease, opacity .5s ease'
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

        console.log(this.params.scaleRatio)

        this.params.layoutsHeight = this.params.layoutsHeight * this.params.scaleRatio

        setTimeout(() => {
            
            for(let i = 0; i < this.categories.toDisplay.length; i++)
            {
                this.categories.toDisplay[i].style.zIndex = `10`
                this.categories.toDisplay[i].style.transform = `translateX(${offset.x}px) translateY(${offset.y}px) scale(${this.params.scaleRatio})`
    
                offset.y+= this.params.layoutsHeight + this.params.gapY

                this.bool.categoryOpen = true
            }
        }, 300);
    }

    _undisplayCategory()
    {
        for(let i = 0; i < this.categories.toUndisplay.length; i++)
        {
            this.categories.toUndisplay[i].style.opacity = `0`
        }
    }

}

const params = 
{
    columnsNumber: 4,
    layoutsHeight: 200,
    square: true,
    gapX: 20,
    gapY: 60,
    activeLayoutWidth: 50,
}

new DynamicGridLayouts(params)