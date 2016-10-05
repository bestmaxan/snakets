window.onload = () => {
    var el = document.getElementById('content');
    var s = new Sn.Program(el);
    s.init();

    
};

namespace Sn {
    let element: HTMLElement;

    enum DrawElement {
        head,
        body,
        wall,
        fruit
    }

    enum Direction {
        Left,
        Right,
        Up,
        Down
    }

    export class Program {
        constructor(_element: HTMLElement) {
            element = _element;
            element.innerHTML = "";
            for (let i = 0; i < 400; i++) {
                let div = document.createElement('div');
                div.className = "cell";
                element.appendChild(div);
            }
        }

        init() {
            var p1 = new Point(4, 5, DrawElement.body);
            var sn = new Snake(p1, 4, Direction.Right);
            sn.Draw();

            var foodCr = new FoodCreator(20, 20);
            var food = foodCr.Create();
            food.Draw();

            document.onkeydown = function (e) {
                sn.HandleKey(e.keyCode);
            }

            var goSnake = setInterval(function () {
                if (sn.IsHitTail() || sn.IsHitWall()) {
                    clearInterval(goSnake);
                    food.Clear();
                    sn.Clear();
                    let sm1 = new VLine(4, 11, 8);
                    let sm2 = new VLine(4, 11, 13);
                    let sm3 = new HLine(7, 14, 15);
                    let sm4 = new Figure();
                    sm4.pList.push(new Point(6, 16, DrawElement.wall));
                    sm4.pList.push(new Point(5, 17, DrawElement.wall));
                    sm4.pList.push(new Point(15, 16, DrawElement.wall));
                    sm4.pList.push(new Point(16, 17, DrawElement.wall));
                    sm1.Draw();
                    sm2.Draw();
                    sm3.Draw();
                    sm4.Draw();
                } else {
                    if (sn.Eat(food)) {
                        food = foodCr.Create();
                        food.Draw();
                    }
                    sn.Move();
                }
            }, 150);
        }
    }

    class Point {
        x: number;
        y: number;
        private _sym: DrawElement;
        cls: string;

        constructor(_x: Point);
        constructor(_x: number, _y: number, _sym: DrawElement);
                
        constructor(_x: number | Point, _y?: number, _sym?: DrawElement) {
            if (typeof _x === "object") {
                this.x = _x.x;
                this.y = _x.y;
                this.sym = _x._sym;
            } else {
                this.x = _x;
                this.y = _y;
                this.sym = _sym;
            }
        }

        get sym() {
            return this._sym;
        }
        set sym(sym: DrawElement) {
            this._sym = sym;
            this.cls = this.getCssClass(sym);
        }

        Move(offset: number, dirctn: Direction) {
            if (dirctn == Direction.Right) {
                this.x = this.x + offset;
            } else if (dirctn == Direction.Left) {
                this.x = this.x - offset;
            } else if (dirctn == Direction.Up) {
                this.y = this.y - offset;
            } else if (dirctn == Direction.Down) {
                this.y = this.y + offset;
            }
        }

        IsHit(p: Point): boolean {
            return (this.x == p.x && this.y == p.y);
        }

        private getCssClass(sym: DrawElement):string {
            let cls: string = "";
            switch (sym) {
                case DrawElement.head:
                    cls = " sHd";
                    break;
                case DrawElement.body:
                    cls = " sBd";
                    break;
                case DrawElement.wall:
                    cls = " wall";
                    break;
                case DrawElement.fruit:
                    cls = " frt";
                    break;
            }
            return cls;
        }

        Draw() {
            element.getElementsByClassName("cell")[this.convertCoordinates(this.x, this.y)].className += this.cls;
        }

        Clear();
        Clear(clss: string);
        Clear(clss?: string)
        {
            element.getElementsByClassName("cell")[this.convertCoordinates(this.x, this.y)].className =
                element.getElementsByClassName("cell")[this.convertCoordinates(this.x, this.y)].className.replace(clss||this.cls,"");
        }

        private convertCoordinates(x: number, y: number): number {
            return 20 * (y - 1) + (x - 1);
        }
    }

    class Figure {
        pList: Array<Point>;

        constructor() {
            this.pList = new Array<Point>();
        }

        Draw() {
            for (var ind in this.pList) {
                this.pList[ind].Draw();
            }
        }
    }

    class Snake extends Figure {
        direction: Direction;

        constructor(tail: Point, len: number, dirctn: Direction) {
            super();
            this.direction = dirctn;
            for (let i = 0; i < len; i++) {
                var p = new Point(tail);
                p.Move(i, this.direction);
                this.pList.push(p);
            }
        }

        Move() {
            let tail = this.pList[0];
            this.pList.splice(0, 1);
            let head = this.GetNextPoint();
            this.pList.push(head);

            tail.Clear();
            head.Draw();
        }

        GetNextPoint(): Point {
            let head = this.pList[this.pList.length-1];
            let nPoint = new Point(head);
            nPoint.Move(1, this.direction);
            return nPoint;
        }

        HandleKey(key: number) {
            if (key == 37 && this.direction != Direction.Right) {
                this.direction = Direction.Left;
            } else if (key == 38 && this.direction != Direction.Down) {
                this.direction = Direction.Up;
            } else if (key == 39 && this.direction != Direction.Left) {
                this.direction = Direction.Right;
            } else if (key == 40 && this.direction != Direction.Up) {
                this.direction = Direction.Down;
            }
        }

        Eat(food: Point): boolean {
            let head = this.GetNextPoint();
            if (head.IsHit(food)) {                
                food.sym = head.sym;
                food.Clear(" frt");
                food.Draw();
                this.pList.push(food);
                return true;
            }
            return false;
        }

        IsHitTail(): boolean {
            let head = this.pList[this.pList.length - 1];
            for (let i = 0; i < this.pList.length - 2; i++) {
                if (head.IsHit(this.pList[i]))
                    return true;
            }
            return false;
        }

        IsHitWall(): boolean {
            let head = this.pList[this.pList.length - 1];
            if (head.x > 19 || head.y > 19 || head.x < 2 || head.y < 2)
                return true;
            return false;
        }

        Clear() {
            for (var ind in this.pList) {
                this.pList[ind].Clear();
            }
        }
    }

    class HLine extends Figure {
        constructor(xLeft: number, xRight: number, y: number) {
            super();
            for (var x = xLeft; x <= xRight; x++) {
                this.pList.push(new Point(x, y, DrawElement.wall));
            }
            
        }
    }

    class VLine extends Figure {
        constructor(yTop: number, yBottom: number, x: number) {
            super();
            for (var y = yTop; y <= yBottom; y++) {
                this.pList.push(new Point(x, y, DrawElement.wall));
            }
        }        
    }

    class FoodCreator {
        mapWidth: number;
        mapHeight: number;

        constructor(mapWidth: number, mapHeight: number) {
            this.mapWidth = mapWidth;
            this.mapHeight = mapHeight;
        }

        Create(): Point {
            let x = Math.floor(Math.random() * this.mapWidth);
            let y = Math.floor(Math.random() * this.mapHeight);
            return new Point(x, y, DrawElement.fruit);
        }
    }
}
