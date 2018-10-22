class DynamicGridLayouts
{
    constructor(_params) 
    {
        this.$ =
        {
            grid: document.querySelector('.grid'),
            layouts: document.querySelectorAll('.layout'),
            categories: document.querySelectorAll('.categories li'),
            return: document.querySelector('.return'),
        }
        
        this.categories = []
        this.params = _params
        this.active = false

        this._craftLayouts()
        this._listeners()

    }

    _listeners()
    {
        window.addEventListener('resize', () => { this._updateGrids() })

        for(let i = 0; i < this.$.categories.length; i++)
        {
            this.$.categories[i].addEventListener('click', () => { this._openCategory(this.$.categories[i].dataset.category) })
        }

        this.$.return.addEventListener('click', () => { this._updateGrids() })
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

            this.params.layoutsHeight = 200

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
        if(window.innerWidth < this.params.layoutsWidth * 3 + (2 * this.params.gapX))
        {
            this.params.gridWidth-= (this.params.layoutsWidth - this.params.gapX)

            this._craftLayouts()
        }
        else
        {
            this.params.gridWidth = this.params.layoutsWidth * 3 + (2 * 20)

            this._craftLayouts()
        }
    }

    // _updateGridsColumn()
    // {
    //     let offset =
    //     {
    //         x: 0,
    //         y: 0,
    //     }

    //     const random = []

    //     for (var i = 0; i < this.$.layouts.length; i++) 
    //     {
    //         random.push(i)
    //     }

    //     for (var i = random.length - 1; i > 0; i--) {
    //         const j = Math.floor(Math.random() * (i + 1));
    //         const temp = random[i];
    //         random[i] = random[j];
    //         random[j] = temp;
    //     }

    //     for(let i = 0; i < random.length; i++)
    //     {
    //         this.$.layouts[random[i]].style.left = `${0}px`
    //         this.$.layouts[random[i]].style.top = `${offset.y}px`
    //         this.$.layouts[random[i]].style.transform = `scale(3)`
    //         // this.$.layouts[random[i]].style.width = `${600}px`
    //         // this.$.layouts[random[i]].style.height = `${400}px`

    //         // this.params.layoutsHeight = 400
    //         this.params.layoutsHeight = 600

    //         offset.y+= this.params.layoutsHeight + this.params.gapY
    //     }
    // }
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

        setTimeout(() => {
            
            for(let i = 0; i < _categoryItems.length; i++)
            {
                _categoryItems[i].style.left = `${offset.x}px`
                _categoryItems[i].style.top = `${offset.y}px`
                _categoryItems[i].style.transform = `scale(3)`
    
                this.params.layoutsHeight = 600
    
                offset.y+= this.params.layoutsHeight + this.params.gapY
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
    gridWidth: 940,
    layoutsWidth: 300,
    layoutsHeight: 200,
    gapX: 20,
    gapY: 20,
}

new DynamicGridLayouts(params)