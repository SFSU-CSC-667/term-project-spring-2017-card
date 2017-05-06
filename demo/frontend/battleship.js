let thisBattleship;

class Battleship {

    constructor() {
        this.rows = 10;
        this.columns = 10;
        this.square_size = 40;

        this.player_gameboard = document.getElementById("player_board");
        this.opponent_gameboard = document.getElementById("opponent_board");
        // this.player_gameboard.addEventListener("drop", this.placeShip, false);
        // this.opponent_gameboard.addEventListener("click", this.fire, false);

        this.opponentBoard = this.initBoard(10);
        // this.opponentBoard = [
        //     [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        //     [1, 0, 0, 0, 0, 0, 1, 1, 1, 1],
        //     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        //     [1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        //     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        // ];

        this.playerBoard = this.initBoard(10);
        // this.playerBoard = [
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        // ];


        this.placedShips = {};

        thisBattleship = this;
    }

    initBoard(dim) {
        const matrix = [];
        for (let i = 0; i < dim; i++) {
            matrix.push(new Array(dim).fill(0));
        }
        return matrix;
    }

    get getBoard() {
        return this.placedShips;
    }

    //initialize boards
    drawBord(id = "p", left_offset = 10) {
        let i, j;
        for (i = 0; i < this.rows; i++) {
            for (j = 0; j < this.columns; j++) {
                const top_position = i * this.square_size;
                const left_position = j * this.square_size;

                const player_square = document.createElement("div");

                player_square.id = id + i + j;
                const thisObj = this;
                if (id == "p") {
                    this.player_gameboard.appendChild(player_square);
                    player_square.addEventListener("dragover", function (event) {
                        thisObj.allowDrop(event)
                    });
                    player_square.addEventListener("drop", function (event) {
                        thisObj.onDrop(event)
                    });
                }
                else {
                    this.opponent_gameboard.appendChild(player_square);
                    player_square.addEventListener("click", function (event) {
                        thisObj.fire(event)
                    });
                }

                player_square.style.top = top_position + "px";
                player_square.style.left = left_position + "px";
            }
        }
    };

    fire(event) {
        const square = event.target;
        let row = square.id.substring(1, 2);
        let column = square.id.substring(2, 3);
        console.log("(" + row + "," + column + ")");

        const fireEvent = {row:row, column:column};

        switch (this.opponentBoard[row][column]) {
            case 0: //miss
                square.style.backgroundImage = 'url("../assets/miss.png")';
                this.opponentBoard[row][column] = 2;
                fireEvent.hit = false;
                break;
            case 1: //hit
                square.style.backgroundImage = 'url("../assets/hit.png")';
                this.opponentBoard[row][column] = 3;
                fireEvent.hit = true;
                break;
            default:
                break;
        }

        if (thisBattleship.fireListener)
            thisBattleship.fireListener(fireEvent);

        event.stopPropagation();
    };

    displayOpponentFire(fireEvent){
        const row = fireEvent.row, column = fireEvent.column;
        const square = $('#p'+row+column);
        switch (this.playerBoard[row][column]) {
            case 0: //miss
                square.css("background-image", "url(../assets/miss.png)");
                this.playerBoard[row][column] = 2;
                // fireEvent.hit = false;
                break;
            case 1: //hit
                square.css("background-image", "url(../assets/hit.png)");
                this.playerBoard[row][column] = 3;
                // fireEvent.hit = true;
                break;
            default:
                break;
        }
    }

    addFireListener(listener){
        thisBattleship.fireListener = listener;
    }

    allowDrop(event) {
        event.preventDefault();
    };

    onDrop(event) {
        event.preventDefault();
        const ship = event.dataTransfer.getData("text");
        //const leftOffset = event.dataTransfer.getData("leftOffset");
        const leftOffset = 0;
        const previous_pos_id = document.getElementById(ship).parentNode.id;

        //const ship_height = parseInt(document.getElementById(ship).style.height) / this.square_size;
        const ship_height = $($('#' + ship)).height() / this.square_size;
        //this.ship_width = parseInt( document.getElementById(ship).style.width) / square_size;
        const ship_width = $($('#' + ship)).width() / this.square_size;

        const square = event.target;
        const row = parseInt(square.id.substring(1, 2));
        let column = parseInt(square.id.substring(2, 3)) - parseInt(leftOffset);

        console.log( {ship,leftOffset,previous_pos_id,ship_height,ship_width,square,row,column});

        if (column >= 0 && this.canPlace(row, ship_height, column, ship_width, false)) {
            if (previous_pos_id != "pieces")
                this.removeShip(previous_pos_id, ship_height, ship_width);
            this.placeShip(square.id, leftOffset, ship_height, ship_width);
            square.appendChild(document.getElementById(ship));
        } else {
            alert("Ship cannot be placed");
        }

        //console.log( document.getElementById( ship));
        this.redrawBoard();
    };

    placeShip(pos_id, leftOffset, shipHeight, shipWidth) {
        pos_id = pos_id.toString();
        const row = parseInt(pos_id.substring(1, 2));
        const column = parseInt(pos_id.substring(2, 3)) - leftOffset;

        let ship = [];

        let i;
        if (shipHeight > shipWidth) {
            for (i = 0; i < shipHeight; i++) {
                this.playerBoard[row + i][column] = 1;
                ship.push({row: row + i, column: column});
            }
        } else {
            for (i = 0; i < shipWidth; i++) {
                this.playerBoard[row][column + i] = 1;
                ship.push({row: row, column: column + i});
            }
        }

        this.placedShips[this.currentShipId] = ship
    };

    removeShip(previous_pos_id, ship_height, ship_width) {
        const row = parseInt(previous_pos_id.substring(1, 2));
        const column = parseInt(previous_pos_id.substring(2, 3));

        let i;
        if (ship_height > ship_width) {
            for (i = 0; i < ship_height; i++)
                this.playerBoard[row + i][column] = 0;
        } else {
            for (i = 0; i < ship_width; i++)
                this.playerBoard[row][column + i] = 0;
        }
    };

    redrawBoard() {
        let i, j;
        for (i = 0; i < this.rows; i++) {
            for (j = 0; j < this.columns; j++) {
                switch (this.playerBoard[i][j]) {
                    case 0:
                        //document.getElementById("p" + i + j).style.background = "#f6f8f9";
                        break;
                    case 1:
                        //document.getElementById("p" + i + j).style.background = "#bbb";
                        break;
                }
            }
        }
    };

    dragStart(event, domElement) {
        event.dataTransfer = event.originalEvent.dataTransfer;
        event.dataTransfer.setData("text", event.target.id);
        //const leftOffset = (event.pageX - event.target.offsetLeft) / thisBattleship.square_size;
        //event.dataTransfer.setData("leftOffset", parseInt(leftOffset));
        event.target.style.opacity = "0.4";

        thisBattleship.currentShipId = event.target.id;
    };

    dragStop(event) {
        event.target.style.opacity = "1";
    };

    flipShip(event) {
        //console.log( event);
        const parent_id = event.target.parentNode.id;
        const width = event.target.width;
        const height = event.target.height;
        const ship_height = parseInt( height) / thisBattleship.square_size;
        const ship_width = parseInt( width) / thisBattleship.square_size;

        //console.log( {width,height,ship_width,ship_height});

        if (parent_id == "pieces") {
            event.target.style.height = width + "px";
            event.target.style.width = height + "px";
            if( width > height) {
                event.target.src = "../assets/"+event.target.id+"-90.png";
            } else {
                event.target.src = "../assets/"+event.target.id+".png";
            }
        } else if (thisBattleship.canPlace(parent_id.substring(1, 2), ship_height, parent_id.substring(2, 3), ship_width, true)) {
            event.target.style.width = height + "px";
            event.target.style.height = width + "px";

            if( width > height) {
                event.target.src = "../assets/"+event.target.id+"-90.png";
            } else {
                event.target.src = "../assets/"+event.target.id+".png";
            }

            thisBattleship.removeShip(parent_id, ship_height, ship_width);
            thisBattleship.placeShip(parent_id, ship_width, ship_height);
            thisBattleship.redrawBoard();
        } else {
            alert("Cannot rotate ship");
        }
    };

    canPlace(row, ship_height, column, ship_width, rotated) {
        let skip_first = rotated;
        if( (row + ship_height <= this.rows) && (column + ship_width <= this.columns)) {
            let i = 0;
            for( i = row; i < row + ship_height; i++) {
                if( skip_first) {
                    skip_first = false;
                } else {
                    if (this.playerBoard[i][column] == 1) return false;
                }
            }

            skip_first = rotated;

            for( i = column; i < column + ship_width; i++) {
                if (skip_first) {
                    skip_first = false;
                } else {
                    if (this.playerBoard[row][i] == 1) return false;
                }
            }
        } else {
            return false;
        }
        return true;
    }

    bindDragEvents($pieces) {
        $pieces.attr("draggable", "true");
        $pieces.on("click", thisBattleship.flipShip);
        $pieces.on("dragend", thisBattleship.dragStop);
        $pieces.on("dragstart", thisBattleship.dragStart);
    }

    setOpponentBoard(boardShipPositions) {
        console.log("setting opponent board!!");
        for (let ship in boardShipPositions){
            boardShipPositions[ship].forEach(function (shipPosition) {
                thisBattleship.opponentBoard[shipPosition.row][shipPosition.column] = 1;
            })
        }
        console.log("opponent board set!!");
    }

    initPieces() {
        $('#pieces').html(""); // clear pieces
        const pieces = ["carrier", "battleship", "destroyer", "submarine", "patrol"];
        pieces.forEach( function( val) {
            $('#pieces').append("<img class='ship' id="+val+" src='assets/"+val+".png'>");
        });
    }
}

module.exports = {Battleship};
