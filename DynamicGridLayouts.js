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
        this.params.gridWidth = this.$.grid.offsetWidth
        this.params.layoutsWidth = (this.params.gridWidth - (this.params.gapX * (this.params.columnsNumber - 1))) / this.params.columnsNumber

        if(this.params.square) this.params.layoutsHeight = this.params.layoutsWidth
    }

    _initLayouts()
    {
        for(let i = 0; i < this.$.layouts.length; i++)
        {
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
            this.categories.toDisplay[i].style.transform = `translateY(${offset.y}px) scale(3)`

            // Calc offset X & Y
            offset.y+= (this.params.layoutsHeight * 3) + this.params.gapY
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
        
        if(window.innerWidth < 800) { this.params.columnsNumber = 2 } else { this.params.columnsNumber = 3 }
        // this.bool.categoryOpen ? false : this._craftGridLayouts()
        this.bool.categoryOpen ? this._craftCategoryLayouts() : this._craftGridLayouts()
    }

    _resetLayouts()
    {
        for(let i = 0; i < this.$.layouts.length; i++)
        {   
            // Active transition when category is open
            this.$.layouts[i].style.transition = 'transform .5s ease, opacity .5s ease'
            setTimeout(() => {
                this.$.layouts[i].style.transition = 'none'
            }, 800);
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
            setTimeout(() => {
                this.$.layouts[i].style.transition = 'none'
            }, 800);

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

        this.params.layoutsHeight = this.params.layoutsHeight * 3

        setTimeout(() => {
            
            for(let i = 0; i < this.categories.toDisplay.length; i++)
            {
                this.categories.toDisplay[i].style.transform = `translateX(${offset.x}px) translateY(${offset.y}px) scale(3)`
    
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
    columnsNumber: 3,
    layoutsHeight: 800,
    square: true,
    gapX: 20,
    gapY: 20,
}

new DynamicGridLayouts(params)