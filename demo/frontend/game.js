/**
 * Created by dusan_cvetkovic on 12/10/16.
 */
import * as events from "./constants/events"
import * as userClass from './user'
import * as battleshipClass from './battleship'
import * as chatClass from './chat'

// let socket;
let thisGame;

class Game {
    constructor(gameID, socketIO, user) {
        thisGame = this;
        this.gameID = gameID;
        this.gameIsOn = false;
        this.battleship = new battleshipClass.Battleship();
        thisGame.battleship.initPieces();
        this.userSocket = socketIO;
        this.bindSocketEvents();

        this.hostUser = new userClass.User(user);
        this.isHostUser = this.hostUser.user.socket_id == socketIO.id;


        $('#submitBoard').on("click", this.onSubmitBoard);
        $('#leaveGame').on("click", this.onLeaveGame);

        this.$opponentScore = $('#header #opponent');
        this.$userScore = $('#header #user');
        this.$opponentPlacingDialog = $('#wait-opponent-placing');
        $('#submitBoard').show();
    }

    onSubmitBoard() {
        if ($('#pieces')[0].childNodes.length > 0) {
            alert("You have to place all your pieces!");
        } else {
            const $ships = $('.ship');
            $ships.unbind();
            $('#submitBoard').hide();
            thisGame.userSocket.emit(events.SUBMIT_BOARD, thisGame.getBoardData());
            thisGame.$opponentPlacingDialog.show();
        }
    }

    get opponentPlayer() {
        if (!thisGame.isHostUser)
            return thisGame.hostUser;
        else
            return thisGame.opponentUser;
    }

    get player() {
        if (thisGame.isHostUser)
            return thisGame.hostUser;
        else
            return thisGame.opponentUser;
    }

    bindSocketEvents() {

        this.userSocket.on(events.PLAYER_JOINED_GAME, thisGame.onPlayerJoinedGame);
        this.userSocket.on(events.UPDATE_SCORE, thisGame.onUpdateScore);
        this.userSocket.on(events.GET_OPPONENT_BOARD, thisGame.onOpponentBoardSubmit);
        this.userSocket.on(events.ON_NEXT_MOVE, thisGame.onOpponentMove);
        this.userSocket.on(events.PLAYER_FORFEIT_GAME, thisGame.onGameForfeited);

        // this.userSocket.on(events.GET_GAME_HOST, thisGame.onGetGameHost);
    }

    // onGetGameHost(data) {
    //     this.hostUser = new userClass.User(data);
    // }

    getBoardData() {
        return {
            board: thisGame.battleship.getBoard,
            user: thisGame.player.user,
            game_id: thisGame.gameID
        };
    }

    startGame() {
        $('.page').hide();
        $('#game').show();

        const $pieces = $('.ship');
        this.battleship.bindDragEvents($pieces);
        this.battleship.drawBord("p", 0);
        this.battleship.drawBord("o", 10);
        this.battleship.addFireListener(thisGame.onFireEvent);

        this.battleship.drawBord();

        if (!thisGame.gameIsOn)
            $('#opponent_board').addClass('disabled-button');
        else
            $('#opponent_board').removeClass('disabled-button');
        this.$opponentPlacingDialog.hide();
        // if (gameId != undefined) {
        //     thisGame.userGameId = gameId;
        // }
    }

    onFireEvent(fireEvent) {
        thisGame.userSocket.emit(events.ON_NEXT_MOVE, {
            game_id: thisGame.gameID,
            user: thisGame.player.user,
            opponent: thisGame.opponentPlayer.user,
            fire_event: fireEvent
        });
    }

    onOpponentMove(fireEventData) {
        if (fireEventData.opponent.id == thisGame.player.user.id){
            thisGame.battleship.displayOpponentFire(fireEventData.fire_event)
        }
    }

    onPlayerJoinedGame(data) {
        if (thisGame.isHostUser) {
            thisGame.startGame();
            thisGame.$userScore.html("User: " + data.user.username);
            // this.isHostUser = true;
        }
        else {
            thisGame.startGame();
        }

        thisGame.opponentUser = new userClass.User(data.user);
        console.log("logged to game: ", data);
        $('#game-area').show();
        $('#wait-opponent').hide();
        thisGame.$opponentScore.show();
        // $('#wait-opponent').removeClass('loader');
    }

    onUpdateScore(gameDataResult) {
        console.log(gameDataResult);
        const gameData = gameDataResult.game;
        if (thisGame.isHostUser) {
            thisGame.displayScore(gameData.player1_username,
                gameData.player1_score,
                gameData.player2_username,
                gameData.player2_score
            );
        }
        else {
            thisGame.displayScore(gameData.player2_username,
                gameData.player2_score,
                gameData.player1_username,
                gameData.player1_score
            );
        }

        thisGame.checkForGameOver(gameDataResult);

        if (thisGame.gameIsOn && ( (thisGame.isHostUser && gameData.player1_turn) ||
            (!thisGame.isHostUser && !gameData.player1_turn) ) ) {
            $('#opponent_board').removeClass('disabled-button');
        }
        else {
            $('#opponent_board').addClass('disabled-button');
        }


    }

    checkForGameOver(gameDataResult) {
        console.log("ships left: ", gameDataResult.shipsLeft);
        switch (gameDataResult.shipsLeft.length) {
            case 2:
                thisGame.gameIsOn = true;
                thisGame.$opponentPlacingDialog.hide();
                break;
            case 1:
                const userShipsLeft = gameDataResult.shipsLeft[0];
                if (thisGame.player.user.id == userShipsLeft.player_id) {
                    const winner = thisGame.getPlayerById(userShipsLeft.player_id);
                    console.log("You won: ", winner.user);
                    alertify.notify("You won: "+winner.user.username, 'success');
                    // var notification = alertify.notify('sample', 'success', 5, function(){
                    //     console.log('You won.'); });

                    thisGame.userSocket.emit(events.PLAYER_LEAVE_GAME, {
                        gameId: thisGame.gameID,
                        user: winner.user
                    });

                }
                else {
                    const loser = thisGame.getOtherPlayerById(userShipsLeft.player_id)
                    console.log("You lost: ", loser.user);
                    alertify.notify("You lost: "+loser.user.username, 'error');
                    // alertify.notify('sample', 'success', 5, function(){
                    //     console.log('You lost.'); });
                    thisGame.userSocket.emit(events.PLAYER_LEAVE_GAME, {
                        gameId: thisGame.gameID,
                        user: loser.user
                    });
                }

                $('.page').hide();
                $('#lobby').show();
                thisGame.populateHeader(thisGame.player.user);
                thisGame.restartGameState();
        }
    }

    onLeaveGame() {
        const usersList = [{player_id:thisGame.opponentUser.user.id}];
        // thisGame.checkForGameOver({shipsLeft:usersList});
        thisGame.userSocket.emit(events.PLAYER_FORFEIT_GAME,
            {gameId: thisGame.gameID, shipsLeft:usersList});
        $('#submitBoard').show();
    }

    onGameForfeited(data){
        thisGame.checkForGameOver(data);
    }

    restartGameState() {
        thisGame.battleship = new battleshipClass.Battleship();
        thisGame.battleship.initPieces();

        $('#game-area').hide();
        $('#wait-opponent').show();

        $('#player_board').html("");
        $('#opponent_board').html("");
        thisGame.$opponentScore.hide();
        $('#submitBoard').show();

    }

    getPlayerById(id) {
        return thisGame.hostUser.user.id == id ? thisGame.hostUser : thisGame.opponentUser;
    }

    getOtherPlayerById(id) {
        return thisGame.hostUser.user.id != id ? thisGame.hostUser : thisGame.opponentUser;
    }

    displayScore(userName, userScore, opponentName, opponentScore) {
        thisGame.$userScore.html("User: " + userName +
            ": " + userScore);
        thisGame.$opponentScore.html("Opponent: " + opponentName +
            ": " + opponentScore);
    }

    onOpponentBoardSubmit(boardData) {
        if (boardData.user.id == thisGame.opponentPlayer.user.id) {
            console.log("setting opp board");
            thisGame.battleship.setOpponentBoard(boardData.board);
        }
    }

    onJoinGame(user, socketID) {
        this.userSocket.emit(events.PLAYER_JOIN_GAME, {
            gameId: thisGame.gameID,
            user: user,
            mySocketId: socketID
        });
    }

    populateHeader(user) {
        $('#header').show();
        $('#header #user').html("Welcome " + user.username);
        thisGame.$opponentScore.show();
    }

}


module.exports = {Game};
