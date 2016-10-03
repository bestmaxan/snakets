window.onload = function () {
    var el = document.getElementById('content');
    var s = new Program(el);
    s.init();
};
var DrawElement;
(function (DrawElement) {
    DrawElement[DrawElement["head"] = 0] = "head";
    DrawElement[DrawElement["body"] = 1] = "body";
    DrawElement[DrawElement["tail"] = 2] = "tail";
    DrawElement[DrawElement["fruit"] = 3] = "fruit";
})(DrawElement || (DrawElement = {}));
var Program = (function () {
    function Program(element) {
        this.element = element;
        this.element.innerHTML = "";
        for (var i = 0; i < 400; i++) {
            this.div = document.createElement('div');
            this.div.className = "cell";
            //this.div.innerHTML = i.toString();
            this.element.appendChild(this.div);
        }
    }
    Program.prototype.init = function () {
        var p1 = new Point(this.element);
        p1.x = 4;
        p1.y = 7;
        p1.sym = DrawElement.fruit;
        p1.Draw();
    };
    return Program;
}());
var Point = (function () {
    function Point(element) {
        this.element = element;
    }
    Point.prototype.Draw = function () {
        var cls = "";
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
        this.element.getElementsByClassName("cell")[this.convertCoordinates(this.x, this.y)].className += cls;
    };
    Point.prototype.convertCoordinates = function (x, y) {
        return 20 * (x - 1) + (y - 1);
    };
    return Point;
}());
//# sourceMappingURL=app.js.map