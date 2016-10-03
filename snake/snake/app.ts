window.onload = () => {
    var el = document.getElementById('content');
    var s = new Program(el);
    s.init();
};

enum DrawElement {
    head,
    body,
    tail,
    fruit
}

class Program {
    element: HTMLElement; 
    div: HTMLElement; 

    constructor(element: HTMLElement) {
        this.element = element;
        this.element.innerHTML = "";
        for (var i = 0; i < 400; i++) {
            this.div = document.createElement('div');
            this.div.className = "cell";
            //this.div.innerHTML = i.toString();
            this.element.appendChild(this.div);
        }
    }

    init() {
        var p1 = new Point(this.element);
        p1.x = 4;
        p1.y = 7;
        p1.sym = DrawElement.fruit;
        p1.Draw();
    }
}

class Point {
    x: number;
    y: number;
    sym: DrawElement;
    element: HTMLElement; 

    constructor(element: HTMLElement) {
        this.element = element;
    }

    public Draw() {
        let cls: string = "";
        switch (this.sym) {
            case DrawElement.head:
                cls = " sHd";
                break;
            case DrawElement.body:
                cls = " sBd";
                break;
            case DrawElement.tail:
                cls = " sBd";
                break;
            case DrawElement.fruit:
                cls = " frt";
                break;

        }
        this. element.getElementsByClassName("cell")[this.convertCoordinates(this.x, this.y)].className += cls;
    }

    private convertCoordinates(x: number, y: number): number {
        return 20 * (x - 1) + (y - 1);
    }
}