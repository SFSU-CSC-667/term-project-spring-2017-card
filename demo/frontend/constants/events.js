const LOBBY = 'lobby';
const USER_JOINED = 'user-joined';
const MESSAGE_SEND = 'message-send';
const GET_USERS = 'get-connections';
const UPDATE_USER_SOCKET = 'user-socket';


const GET_HIGH_SCORES = 'GET_HIGH_SCORES';


const FIND_LEADER = 'findLeader';

// Host Events
const CREATE_GAME = 'playerCreateNewGame';
const GAME_START = 'hostRoomFull';
const COUNTDOWN = 'hostCountdownFinished';
const NEXT_MOVE = 'hostNextRound';

// Player Events
const PLAYER_JOIN_GAME = 'playerJoinGame';
const PLAYER_MOVE = 'playerAnswer';
const PLAYER_RESTART = 'playerRestart';

// game events
const NEW_GAME_CREATED = 'newGameCreated';
const PLAYER_JOINED_GAME = 'playerJoinedGame';
const PLAYER_LEAVE_GAME = 'PLAYER_LEAVE_GAME';
const PLAYER_FORFEIT_GAME = 'PLAYER_FORFEIT_GAME';
const UPDATE_SCORE = 'UPDATE_SCORE';
const SUBMIT_BOARD = 'SUBMIT_BOARD';
const GET_OPPONENT_BOARD = 'GET_OPPONENT_BOARD';
const ON_NEXT_MOVE = 'ON_NEXT_MOVE';
const GET_GAME_HOST = 'GET_GAME_HOST';
const GAME_MESSAGE_SEND = 'GAME_MESSAGE_SEND';


// lobby
// const PLAYER_RESTART = 'playerRestart';

module.exports = {
    LOBBY, USER_JOINED, MESSAGE_SEND, FIND_LEADER,
    CREATE_GAME, GAME_START, COUNTDOWN, NEXT_MOVE, PLAYER_JOIN_GAME, PLAYER_MOVE, PLAYER_RESTART,
    NEW_GAME_CREATED, GET_USERS, PLAYER_JOINED_GAME, UPDATE_USER_SOCKET, UPDATE_SCORE, SUBMIT_BOARD,
    GET_OPPONENT_BOARD, ON_NEXT_MOVE, GET_GAME_HOST, PLAYER_LEAVE_GAME, GAME_MESSAGE_SEND,
    GET_HIGH_SCORES, PLAYER_FORFEIT_GAME

};
