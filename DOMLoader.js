class DOMLoader
{   
	constructor(loaderClass, loaderUndisplayClass) 
	{
        window.addEventListener('DOMContentLoaded', () => 
        { 
            this.loader = document.querySelector('.loader');
            this.loaderUndisplay = loaderUndisplayClass
            this.images = document.querySelectorAll('img')
            this.cursor = document.querySelector('.cursor')
            // this.videos = document.querySelectorAll('video')
            this.sources = []

            if(this.images.length > 0)
            {
                for(let i = 0; i < this.images.length; i++)
                {
                    if(this.images[i].getAttribute('src') != '') this.sources.push(this.images[i])
                }
            }

            this.bool= 
            {
                isEnding: false,
            }

            this.count =
            {
                loaded: 0,
            }
            
            this.int =
            {
                ratio: Math.floor(this.count.loaded / this.sources.length * 100)
            }

            this.mouse = 
            {
                x: undefined,
                y: undefined,
            }

            this.window = 
            {
                width: window.innerWidth,
                height: window.innerHeight,
            }

            this.src = null

            this.load()
            this._listeners()
        })

        // if(this.videos.length > 0)
        // {
        //     for(let i = 0; i < this.images.length; i++)
        //     {
        //         this.sources.push(this.images[i])
        //     }
        // }


        // window.addEventListener('DOMContentLoaded', () => { console.log('LOADED') })
    }

    _listeners()
    {
        window.addEventListener('mousemove', (event) => { this._updateCursor(event) })
        window.addEventListener('resize', () => { this._updateParams() })
    }

    _updateParams()
    {
        this.window = 
        {
            width: window.innerWidth,
            height: window.innerHeight,
        }
    }

    _updateCursor(_event)
    {
        this.mouse.x = _event.clientX
        this.mouse.y = _event.clientY
    }

	load()
	{      
        for(let i = 0; i < this.sources.length; i++)
		{
			const $newImg = document.createElement('img')

			$newImg.addEventListener('load', () => 
			{
                this.count.loaded++

                this.int.ratio = Math.floor(this.count.loaded / this.sources.length * 100)

                if(!this.bool.isEnding) this.count.loaded == this.sources.length ? this.init() : false
                
                this.sources[i].style.opacity = '1'
			})
			$newImg.src = this.sources[i].src
        }
        
        setTimeout(() => {
            if(this.count.loaded < this.sources.length) this.init()
        }, 3000);
    }

    _checkCursorInit()
    {
        
        if(this.mouse.x != undefined && this.mouse.y != undefined)
        {
            this._initCursor()
        }
        else
        {
            this._unDisplayCursor()
        }
    }

    _initCursor()
    {
        this.cursor.style.transform = `translate(calc(-50% + ${this.mouse.x - this.window.width / 2}px), calc(-50% + ${this.mouse.y - this.window.height / 2}px))`

        // setTimeout(() => {
        //     this.cursor.style.transition = `none`
        // }, 500);
        this.easeX = 0
        this.easeY = 0

        // this._ease()
    }

    _ease()
    {
        const x = (this.mouse.x - this.window.width / 2)
        const y = (this.mouse.y - this.window.height / 2)
        const ratio = Math.abs((Math.abs(y) * 20 / Math.abs(x)))

        // if(this.easeX < (this.mouse.x - this.window.width / 2) 
        // && (this.mouse.x - this.window.width / 2) > 0) this.easeX+=5
        
        // if(this.easeX > (this.mouse.x - this.window.width / 2) 
        // && (this.mouse.x - this.window.width / 2) < 0) this.easeX-=5

        if(this.easeX < x) this.easeX+=20
        if(this.easeX > x) this.easeX-=20

        if(this.easeY < y) this.easeY+=ratio
        if(this.easeY > y) this.easeY-=ratio


        // if(this.easeY < (this.mouse.y - this.window.height / 2)) this.easeY++

        // console.log('x ' +this.easeX)
        // console.log('X end ' + (this.mouse.x - this.window.width / 2))
        // console.log('y ' + this.easeY)
        // console.log('Y end ' + (this.mouse.y - this.window.height / 2))

        this.cursor.style.transform = `translate(calc(-50% + ${this.easeX}px), calc(-50% + ${this.easeY}px))`

        requestAnimationFrame(() => { this._ease() })
        // if(this.easeY < -(this.mouse.y - this.window.height / 2))
        // {
        //     requestAnimationFrame(() => { this._ease() })
        // }
    }

    _unDisplayCursor()
    {
        this.cursor.style.transform = 'scale(8)'
        this.cursor.style.opacity = '0'

        // setTimeout(() => {
        //     this.cursor.style.transition = `none`
        // }, 3000);
    }

	init()
	{
        this.bool.isEnding = true
        
        this._checkCursorInit()
		// for(let i = 0; i < this.elements.length; i++) {
		//     console.log(this.elements[i])
		//     const element = document.querySelector('.' + this.elements[i])
		//     element.classList.add(this.states[i])
        // }
        const magnet = new MagneticHover('.layout__project')
        
        // setTimeout(() => {
            
        // }, 0);
        magnet._displayLayouts()
        

        // this.loader.classList.add(this.loaderUndisplay)
        // this.loader.style.display = 'none'

		// new Rooter()
	}
}

new DOMLoader()