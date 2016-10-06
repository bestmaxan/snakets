var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
window.onload = function () {
    var el = document.getElementById('content');
    var s = new Sn.Program(el);
    s.init();
};
var Sn;
(function (Sn) {
    var element;
    var DrawElement;
    (function (DrawElement) {
        DrawElement[DrawElement["head"] = 0] = "head";
        DrawElement[DrawElement["body"] = 1] = "body";
        DrawElement[DrawElement["wall"] = 2] = "wall";
        DrawElement[DrawElement["fruit"] = 3] = "fruit";
    })(DrawElement || (DrawElement = {}));
    var Direction;
    (function (Direction) {
        Direction[Direction["Left"] = 0] = "Left";
        Direction[Direction["Right"] = 1] = "Right";
        Direction[Direction["Up"] = 2] = "Up";
        Direction[Direction["Down"] = 3] = "Down";
    })(Direction || (Direction = {}));
    var Program = (function () {
        function Program(_element) {
            element = _element;
            element.innerHTML = "";
            for (var i = 0; i < 400; i++) {
                var div = document.createElement('div');
                div.className = "cell";
                element.appendChild(div);
            }
        }
        Program.prototype.init = function () {
            var p1 = new Point(4, 5, DrawElement.body);
            var sn = new Snake(p1, 4, Direction.Right);
            sn.Draw();
            var foodCr = new FoodCreator(20, 20);
            var food = foodCr.Create();
            food.Draw();
            document.onkeydown = function (e) {
                sn.HandleKey(e.keyCode);
            };
            var goSnake = setInterval(function () {
                if (sn.Eat(food)) {
                    food = foodCr.Create();
                    food.Draw();
                }
                try {
                    sn.Move();
                }
                catch (e) {
                    clearInterval(goSnake);
                    food.Clear();
                    sn.Clear();
                    var sm1 = new VLine(4, 11, 8);
                    var sm2 = new VLine(4, 11, 13);
                    var sm3 = new HLine(7, 14, 15);
                    var sm4 = new Figure();
                    sm4.pList.push(new Point(6, 16, DrawElement.wall));
                    sm4.pList.push(new Point(5, 17, DrawElement.wall));
                    sm4.pList.push(new Point(15, 16, DrawElement.wall));
                    sm4.pList.push(new Point(16, 17, DrawElement.wall));
                    sm1.Draw();
                    sm2.Draw();
                    sm3.Draw();
                    sm4.Draw();
                }
            }, 200);
        };
        return Program;
    }());
    Sn.Program = Program;
    var Point = (function () {
        function Point(_x, _y, _sym) {
            this.addClass = function (cellInd, cls) {
                var el = element.getElementsByClassName("cell")[cellInd];
                if (el != undefined) {
                    el.className += cls;
                }
            };
            this.removeClass = function (cellInd, cls) {
                var el = element.getElementsByClassName("cell")[cellInd];
                if (el != undefined) {
                    el.className = el.className.replace(cls, "");
                }
            };
            if (typeof _x === "object") {
                this.x = _x.x;
                this.y = _x.y;
                this.sym = _x._sym;
            }
            else {
                this.x = _x;
                this.y = _y;
                this.sym = _sym;
            }
        }
        Object.defineProperty(Point.prototype, "sym", {
            get: function () {
                return this._sym;
            },
            set: function (sym) {
                this._sym = sym;
                this.cls = this.getCssClass(sym);
            },
            enumerable: true,
            configurable: true
        });
        Point.prototype.Move = function (offset, dirctn) {
            if (dirctn == Direction.Right) {
                this.x = this.x + offset;
            }
            else if (dirctn == Direction.Left) {
                this.x = this.x - offset;
            }
            else if (dirctn == Direction.Up) {
                this.y = this.y - offset;
            }
            else if (dirctn == Direction.Down) {
                this.y = this.y + offset;
            }
        };
        Point.prototype.IsHit = function (p) {
            return (this.x == p.x && this.y == p.y);
        };
        Point.prototype.getCssClass = function (sym) {
            var cls = "";
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
        };
        Point.prototype.Draw = function () {
            this.addClass(this.convertCoordinates(this.x, this.y), this.cls);
        };
        Point.prototype.Clear = function (clss) {
            this.removeClass(this.convertCoordinates(this.x, this.y), clss || this.cls);
        };
        Point.prototype.convertCoordinates = function (x, y) {
            return 20 * (y - 1) + (x - 1);
        };
        return Point;
    }());
    var Figure = (function () {
        function Figure() {
            this.pList = new Array();
        }
        Figure.prototype.Draw = function () {
            for (var ind in this.pList) {
                this.pList[ind].Draw();
            }
        };
        return Figure;
    }());
    var Snake = (function (_super) {
        __extends(Snake, _super);
        function Snake(tail, len, dirctn) {
            _super.call(this);
            this.direction = dirctn;
            for (var i = 0; i < len; i++) {
                var p = new Point(tail);
                p.Move(i, this.direction);
                this.pList.push(p);
            }
        }
        Snake.prototype.Move = function () {
            var tail = this.pList[0];
            var head = this.GetNextPoint();
            if (this.IsHitTail(head) || this.IsHitWall(head)) {
                throw "crash";
            }
            this.pList.splice(0, 1);
            this.pList.push(head);
            tail.Clear();
            head.Draw();
        };
        Snake.prototype.GetNextPoint = function () {
            var head = this.pList[this.pList.length - 1];
            var nPoint = new Point(head);
            nPoint.Move(1, this.direction);
            return nPoint;
        };
        Snake.prototype.HandleKey = function (key) {
            if (key == 37 && this.direction != Direction.Right) {
                this.direction = Direction.Left;
            }
            else if (key == 38 && this.direction != Direction.Down) {
                this.direction = Direction.Up;
            }
            else if (key == 39 && this.direction != Direction.Left) {
                this.direction = Direction.Right;
            }
            else if (key == 40 && this.direction != Direction.Up) {
                this.direction = Direction.Down;
            }
        };
        Snake.prototype.Eat = function (food) {
            var head = this.GetNextPoint();
            if (head.IsHit(food)) {
                food.sym = head.sym;
                food.Clear(" frt");
                food.Draw();
                this.pList.push(food);
                return true;
            }
            return false;
        };
        Snake.prototype.IsHitTail = function (head) {
            for (var i = 0; i < this.pList.length - 2; i++) {
                if (head.IsHit(this.pList[i]))
                    return true;
            }
            return false;
        };
        Snake.prototype.IsHitWall = function (head) {
            if (head.x > 20 || head.y > 20 || head.x < 1 || head.y < 1)
                return true;
            return false;
        };
        Snake.prototype.Clear = function () {
            for (var ind in this.pList) {
                this.pList[ind].Clear();
            }
        };
        return Snake;
    }(Figure));
    var HLine = (function (_super) {
        __extends(HLine, _super);
        function HLine(xLeft, xRight, y) {
            _super.call(this);
            for (var x = xLeft; x <= xRight; x++) {
                this.pList.push(new Point(x, y, DrawElement.wall));
            }
        }
        return HLine;
    }(Figure));
    var VLine = (function (_super) {
        __extends(VLine, _super);
        function VLine(yTop, yBottom, x) {
            _super.call(this);
            for (var y = yTop; y <= yBottom; y++) {
                this.pList.push(new Point(x, y, DrawElement.wall));
            }
        }
        return VLine;
    }(Figure));
    var FoodCreator = (function () {
        function FoodCreator(mapWidth, mapHeight) {
            this.mapWidth = mapWidth;
            this.mapHeight = mapHeight;
        }
        FoodCreator.prototype.Create = function () {
            var x = Math.floor(Math.random() * this.mapWidth);
            var y = Math.floor(Math.random() * this.mapHeight);
            return new Point(x, y, DrawElement.fruit);
        };
        return FoodCreator;
    }());
})(Sn || (Sn = {}));
//# sourceMappingURL=app.js.map