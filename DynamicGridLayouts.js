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
        this._craftLayouts()
        this._listeners()
    }

    _initParams()
    {
        this.params.gridWidth = this.$.grid.offsetWidth
        this.params.layoutsWidth = (this.params.gridWidth - (this.params.gapX * (this.params.columnsNumber - 1))) / this.params.columnsNumber

        if(this.params.square) this.params.layoutsHeight = this.params.layoutsWidth
    }

    _listeners()
    {
        window.addEventListener('resize', () => { this._updateGrids() })

        for(let i = 0; i < this.$.categories.length; i++)
        {
            this.$.categories[i].addEventListener('click', () => { this._openCategory(this.$.categories[i].dataset.category) })
        }

        this.$.return.addEventListener('click', () => { this._resetLayouts() })
    }

    _craftLayouts()
    {
        let offset =
        {
            x: 0,
            y: 0,
        }

        for(let i = 0; i < this.$.layouts.length; i++)
        {
            this.$.layouts[i].style.opacity = `1`
            this.$.layouts[i].style.left = `${offset.x}px`
            this.$.layouts[i].style.top = `${offset.y}px`
            this.$.layouts[i].style.transform = `scale(1)`
            this.$.layouts[i].style.width = `${this.params.layoutsWidth}px`

            // Check if layout are squares
            this.params.square ? this.$.layouts[i].style.height = `${this.params.layoutsWidth}px` : this.$.layouts[i].style.height = `${this.params.layoutsHeight}px`

            offset.x+= this.params.layoutsWidth + this.params.gapX

            if(offset.x >= this.params.gridWidth - this.params.gapX)
            {
                offset.x = 0
                offset.y+= this.params.layoutsHeight + this.params.gapY
            }
        }
    }

    _updateGrids()
    {   
        this.params.gridWidth = this.$.grid.offsetWidth
        this.params.layoutsWidth = (this.params.gridWidth - (this.params.gapX * (this.params.columnsNumber - 1))) / this.params.columnsNumber
        if(this.params.square) this.params.layoutsHeight = this.params.layoutsWidth
        
        // if(window.innerWidth < 800) { this.params.columnsNumber = 2 } else { this.params.columnsNumber = 3 }
        this.bool.categoryOpen ? false : this._craftLayouts()
    }

    _resetLayouts()
    {
        this._updateGrids()
        this._craftLayouts()

        this.bool.categoryOpen = false
    }

    _openCategory(_category)
    {
        let toDisplayCategory = []
        let toUndisplayCategory = []

        for(let i = 0; i < this.$.layouts.length; i++)
        {
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
                _categoryItems[i].style.left = `${offset.x}px`
                _categoryItems[i].style.top = `${offset.y}px`
                _categoryItems[i].style.transform = `scale(3)`
    
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