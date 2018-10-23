class Scroll
{
    constructor()
    {
        this.$ = 
        {
            return: document.querySelector('.categories > li'),
            navigation: document.querySelector('.navigation'),
            grid: document.querySelector('.grid'),
            test: document.querySelector('.return'),
            categories: document.querySelectorAll('.categories__category'),
            img: document.querySelectorAll('.layout img'),
        }

        this.ratio = 0

        this._listeners()
    }

    _listeners()
    {
        window.addEventListener('scroll', (event) => { this._setScroll(event) })

    }

    _setScroll(_event)
    {
        if(window.scrollY <= 60 && window.scrollY >= 0)
        {
            this.ratio = 1 / (window.scrollY)

            // if(this.ratio == Infinity) this.ratio = 1
            
            // for(let i = 0; i < this.$.categories.length; i++)
            // {
            //     this.$.categories[i].style.opacity = `${this.ratio}`
            // }

            // this.$.return.style.transform = `translateX(${-window.scrollY * 2}px)`
            // this.$.grid.style.transform = `translateY(${window.scrollY}px)`
        }
        else if( window.scrollY >= 60)
        {
            // for(let i = 0; i < this.$.categories.length; i++)
            // {
            //     this.$.categories[i].style.opacity = `0`
            // }
        }
        // this.$.navigation.style.transform = `translateY(${window.scrollY}px)`


        // console.log(window.scrollY)
        // console.log(this.$.navigation)
    }
}

new Scroll()