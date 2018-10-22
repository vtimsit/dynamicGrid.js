class DynamicGridLayouts
{
    constructor(_params) 
    {
        this.categories = []
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
            this._setOffset(offset)
        }
    }

    _craftCategoryLayouts()
    {
        let offset = { x: 0, y: 0 }

        for(let i = 0; i < this.$.layouts.length; i++)
        {
            // Calc offset X & Y
            this._setOffset(offset, 3)

            this.$.layouts[i].style.transform = `translateY(${offset.y}px) scale(3)`
        }
    }
        

    _setOffset(_offset, _scaleRatio = 1)
    {
        _offset.x+= this.params.layoutsWidth + this.params.gapX

        if(_offset.x >= this.params.gridWidth - this.params.gapX)
        {
            _offset.x = 0
            _offset.y+= (this.params.layoutsHeight * _scaleRatio) + this.params.gapY
        }
    }

    _updateParams()
    {   
        // Disable transition when resize event
        for(let i = 0; i < this.$.layouts.length; i++)
        {
            this.$.layouts[i].style.transition = 'none'
        }

        this.params.gridWidth = this.$.grid.offsetWidth
        this.params.layoutsWidth = (this.params.gridWidth - (this.params.gapX * (this.params.columnsNumber - 1))) / this.params.columnsNumber
        if(this.params.square) this.params.layoutsHeight = this.params.layoutsWidth
        
        // if(window.innerWidth < 800) { this.params.columnsNumber = 2 } else { this.params.columnsNumber = 3 }
        // this.bool.categoryOpen ? false : this._craftGridLayouts()
        this.bool.categoryOpen ? this._craftCategoryLayouts() : this._craftGridLayouts()
    }

    _resetLayouts()
    {
        this._initParams()
        this._craftGridLayouts()

        this.bool.categoryOpen = false
    }

    _openCategory(_category)
    {
        let toDisplayCategory = []
        let toUndisplayCategory = []

        for(let i = 0; i < this.$.layouts.length; i++)
        {
            // Active transition when category is open
            this.$.layouts[i].style.transition = 'transform .5s ease, opacity .5s ease'
            
            if(this.$.layouts[i].dataset.category == _category)
            {
                toDisplayCategory.push(this.$.layouts[i])
            } 
            else
            {
                toUndisplayCategory.push(this.$.layouts[i])
            }
        }

        this._displayCategory(toDisplayCategory)
        this._undisplayCategory(toUndisplayCategory)
    }

    _displayCategory(_categoryItems)
    {
        let offset =
        {
            x: 0,
            y: 0,
        }

        this.params.layoutsHeight = this.params.layoutsHeight * 3

        setTimeout(() => {
            
            for(let i = 0; i < _categoryItems.length; i++)
            {
                _categoryItems[i].style.transform = `translateX(${offset.x}px) translateY(${offset.y}px) scale(3)`
    
                offset.y+= this.params.layoutsHeight + this.params.gapY

                this.bool.categoryOpen = true
            }
        }, 300);
    }

    _undisplayCategory(_categoryItems)
    {
        for(let i = 0; i < _categoryItems.length; i++)
        {
            _categoryItems[i].style.opacity = `0`
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