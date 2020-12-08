function positions(player) {
  let positions = {
      bishop:  {rows: [],
    cols: []
  },
  rook: {
    rows: [],
    cols: [],
  },
  knight: {
    rows: [],
    cols: [],
  },
  pawn: {
    rows: [],
    cols: [],
  },
  queen: {
    rows: [],
    cols: [],
  },
   king: {
    rows: [],
    cols: [],
  }
    };
 $("[player='"+ player +"']").each(function(){
        let piece = $(this).attr('piece');
        let row = parseInt($(this).attr('row'));
        let col = parseInt($(this).attr('column'));
        positions[piece].rows.push(row);
        positions[piece].cols.push(col);
      })
  return positions;
}

function movePiece(player, piece, row, column, targRow, targColumn) {
  $('#gameMessage').addClass('hidden');

trackMovesForCastle(player, piece, row, column);
  // clear space that piece is being moved from
  if(player == "white" && piece == "pawn" && targRow == 8){
    piece = "queen";
  }
  else if(player == "black" && piece == "pawn" && targRow == 1){
    piece = "queen";
  }
  $("[row='" + row + "'][column='" + column + "']")
    .css("background-image", "none")
    .css("background-url", "none")
    .attr("piece", "")
    .attr("player", "")
    .attr("empty", "true");
 

  // Moving piece
  $("[row='" + targRow + "'][column='" + targColumn + "']")
    .css("background", "url(pieces/" + player + "/" + piece + ".png")
    .css("background-size", "100% 100%")
    .attr("player", player)
    .attr("piece", piece)
    .attr("empty", "false").fadeOut(1).fadeIn(200);

    //Validate evaluateCheckMate
 if(player == "white" && kingInCheck('black') == true){
 gameMessage('Check!');
    if(evaluateCheckMate(player) == 0){
      gameMessage('White wins by checkmate!');
    }
  }
  else if(player == "black" && kingInCheck('white') == true){
    gameMessage('Check!');
      if(evaluateCheckMate(player) == 0){
           gameMessage('Black wins by checkmate!');
      }
  }
  selection = { piece: "", player: "", row: "", column: "" };
  resetBoardColors();
  swapTurns();

}

// Checking if move is correct and then moving piece if so
function correctMove(player, piece, row, column, targRow, targColumn, targPiece, targPlayer) {
  var canMove = false;
  let whiteCastleLeft = false;
  let whiteCastleRight = false;
  let blackCastleLeft = false;
  let blackCastleRight = false;
  // console.log(playerTurn);
  row = parseInt(row);
  column = parseInt(column);
  targRow = parseInt(targRow);
  targColumn = parseInt(targColumn);
  // Pawn Logic
  if (piece == "pawn") {
       if (checkPawnMoves(row, column, player, targRow, targColumn, targPlayer) == true) {
      if (kingInCheck(player, row, column, targRow, targColumn) == true) {
        gameMessage('Illegal move!');
        canMove = false;
      } else {
        canMove = true;
      }
    }
  }

  // Knight Logic
  else if (piece == "knight") {
    if (checkKnightMoves(row, column, player, targRow, targColumn, targPlayer) == true) {
      if (kingInCheck(player, row, column, targRow, targColumn) == true) {
        gameMessage('Illegal move!');
        canMove = false;
      } else {
        canMove = true;
      }
    }
  }
  // Bishop moves
  else if (piece == "bishop") {
    if (checkBishopMoves(row, column, player, targRow, targColumn, targPlayer) == true) {
      if (kingInCheck(player, row, column, targRow, targColumn) == true) {
        gameMessage('Illegal move!');
        canMove = false;
      } else {
        canMove = true;
      }
    }
  }
  // Rook logic represented in the checkRookMoves function
  else if (piece == "rook") {
    if (checkRookMoves(row, column, player, targRow, targColumn, targPlayer) == true) {
      if (kingInCheck(player, row, column, targRow, targColumn) == true) {
        gameMessage('Illegal move!');
        canMove = false;
      } else {
        canMove = true;
      }
    }
  }
  // Queen = bishop+rook logic combined
  else if (piece == "queen") {
    if (
      checkBishopMoves(row, column, player, targRow, targColumn, targPlayer) == true ||
      checkRookMoves(row, column, player, targRow, targColumn, targPlayer) == true)
      if (kingInCheck(player, row, column, targRow, targColumn) == true) {
        gameMessage('Illegal move, player in check!');
        canMove = false;
      } else {
        canMove = true;
      }
  } 
  else if (piece == "king") {
    
    if (checkKingMoves(row, column, player, targRow, targColumn, targPlayer) == true) {
      if(kingInCheck(player, row, column, targRow, targColumn, piece) == true){
        gameMessage('Illegal move!');
        canMove = false;
      }
    else {
        canMove = true;
    }
      }
      // White castling conditions
    else if(castle(player, row, column, targRow, targColumn) == true &&
    targColumn == 3 && targRow == 1) {
     whiteCastleLeft = true;
    canMove = true;
    // console.log('White castling left');
    } 
    else if(castle(player, row, column, targRow, targColumn) == true &&
     targColumn == 7 && targRow == 1) {
      whiteCastleRight = true;
      canMove = true;
      // console.log("White castling right")
    }
    // Black castle coditions
       else if(castle(player, row, column, targRow, targColumn) == true &&
    targColumn == 3 && targRow == 8) {
      blackCastleLeft = true;
      canMove = true;
      // console.log('Black castling left');
    } 
    else if(castle(player, row, column, targRow, targColumn) == true &&
     targColumn == 7 && targRow == 8) {
      blackCastleRight = true;
      canMove = true;
      // console.log("Black castling right")
    }
  }
  // Moving the piece if the conditions are met and canMove returns as true
  // If castling swapping turns since moving two pieces at once
  if(canMove == true && whiteCastleLeft == true){
    movePiece(player, piece, row, column, targRow, targColumn);
    movePiece(player, "rook", 1, 1, 1, 4 );
    swapTurns();
  }
  else if(canMove == true && whiteCastleRight == true){
    movePiece(player, piece, row, column, targRow, targColumn);
    movePiece(player, "rook", 1, 8, 1, 6 );
    swapTurns();
  }
  else if(canMove == true && blackCastleLeft == true){
        movePiece(player, piece, row, column, targRow, targColumn);
         movePiece(player, "rook", 8, 1, 8, 4 );
          swapTurns();
  }
  else if(canMove == true && blackCastleRight == true){
        movePiece(player, piece, row, column, targRow, targColumn);
         movePiece(player, "rook", 8, 8, 8, 6 );
          swapTurns();
  }
  else if (canMove == true) {
    movePiece(player, piece, row, column, targRow, targColumn);
  }
}
// Swap turns
function swapTurns() {
  playerTurn = playerTurn == "white" ? "black" : "white";
}
function evaluateCheckMate(player) {
    if(player == "white"){
    evaluatedPlayer = "black";
    }
    else if(player == "black"){
        evaluatedPlayer = "white";
    }
  let legalMoves = 0;
  let piecePositions = positions(evaluatedPlayer);
  let availableMoves = {
    bishop:  {rows: [],
    cols: []
  },
  rook: {
    rows: [],
    cols: [],
  },
  knight: {
    rows: [],
    cols: [],
  },
  pawn: {
    rows: [],
    cols: [],
  },
  queen: {
    rows: [],
    cols: [],
  },
  king: {
    rows: [],
    cols: []
  }
  }
  // evaluate if opposite player is being checked
   
        for (let k = 1; k <= 8; k++) {
        for (let j = 1; j <= 8; j++) {
        targPlayer = $("[empty][row='" + k + "'][column='" + j + "']").attr("player");
    if(checkKingMoves(piecePositions.king.rows[0],
           piecePositions.king.cols[0], evaluatedPlayer, k, j, targPlayer) == true){
             availableMoves.king.rows.push(k);
             availableMoves.king.cols.push(j);
           }
    if(checkBishopMoves(piecePositions.bishop.rows[0], 
            piecePositions.bishop.cols[0], evaluatedPlayer, k, j) == true ||
            checkBishopMoves(piecePositions.bishop.rows[1], 
            piecePositions.bishop.cols[1], evaluatedPlayer, k, j) == true) {
              availableMoves.bishop.rows.push(k);
              availableMoves.bishop.cols.push(j);
            }
    if(checkBishopMoves(piecePositions.queen.rows[0], piecePositions.queen.cols[0],
         evaluatedPlayer, k, j) == true || 
    checkRookMoves(piecePositions.queen.rows[0], piecePositions.queen.cols[0], 
        evaluatedPlayer, k, j) == true){
              availableMoves.queen.rows.push(k);
              availableMoves.queen.cols.push(j);
            }
    if(checkKnightMoves(piecePositions.knight.rows[0], piecePositions.knight.cols[0],
         evaluatedPlayer, k, j) == true || 
       checkKnightMoves(piecePositions.knight.rows[1], piecePositions.knight.cols[1],
         evaluatedPlayer, k, j) == true){
              availableMoves.queen.rows.push(k);
              availableMoves.queen.cols.push(j);
            }
    if(checkRookMoves(piecePositions.rook.rows[0], piecePositions.rook.cols[0],
         evaluatedPlayer, k, j) == true || 
         checkRookMoves(piecePositions.rook.rows[1], piecePositions.rook.cols[1],
        evaluatedPlayer, k, j) == true){
              availableMoves.rook.rows.push(k);
              availableMoves.rook.cols.push(j);
            }
            //Pawns
            for(let p = 0; p < piecePositions.pawn.cols.length; p++){
              if(checkPawnMoves(piecePositions.pawn.rows[p], piecePositions.pawn.cols[p],
                 evaluatedPlayer, k, j) == true) {
                availableMoves.pawn.rows.push(k);
                availableMoves.pawn.cols.push(j);
              }
            }
        }
        
  }
// Collect all the moves that stops the check


for(let f = 0; f < availableMoves.king.cols.length ; f++){
if(kingInCheck(evaluatedPlayer, piecePositions.king.rows[0], piecePositions.king.cols[0], 
availableMoves.king.rows[f], availableMoves.king.cols[f], "king") == false){
  legalMoves++;
  // console.log("legal move is row: " + availableMoves.king.rows[f] + "row: " + availableMoves.king.cols[f]);
}
}
// Killing the function if there's atleast 1 legal move after every piece to save processing time
if(legalMoves > 0){return};
for(let f = 0; f < availableMoves.bishop.cols.length; f++ ){
  let targPiece = $("[empty][row='" + availableMoves.bishop.rows[f] + "'][column='"
   + availableMoves.bishop.cols[f] + "']").attr("piece");
     if (typeof targPiece == "undefined") {
    targPiece = "";
  }
  if(kingInCheck(evaluatedPlayer, piecePositions.bishop.rows[0], piecePositions.bishop.cols[0], 
  availableMoves.bishop.rows[f], availableMoves.bishop.cols[f]) == false){
    $("[empty][row='" + piecePositions.bishop.rows[0] + "'][column='"
     + piecePositions.bishop.cols[0] + "']").attr("empty", "false");
    $("[empty][row='" + availableMoves.bishop.rows[f] + "'][column='" + 
    availableMoves.bishop.cols[f] + "']").attr("empty", "true");
    if( targPiece != ""){
      $("[empty][row='" + availableMoves.bishop.rows[f] + "'][column='"
       + availableMoves.bishop.cols[f] + "']").attr("piece", targPiece);
      $("[empty][row='" + availableMoves.bishop.rows[f] + "'][column='"
       + availableMoves.bishop.cols[f] + "']").attr("empty", "false");

    }
    legalMoves++;
    // console.log("legal move is row: " + availableMoves.bishop.rows[f] + "col " + availableMoves.bishop.cols[f]);
  }
}
if(legalMoves > 0){return};
for(let f = 0; f < availableMoves.queen.cols.length; f++){
  let targPiece = $("[empty][row='" + availableMoves.queen.rows[f] + "'][column='"
   + availableMoves.queen.cols[f] + "']").attr("piece");
     if (typeof targPiece == "undefined") {
    targPiece = "";
  }
  if(kingInCheck(evaluatedPlayer, piecePositions.queen.rows[0], piecePositions.queen.cols[0],
   availableMoves.queen.rows[f], availableMoves.queen.cols[f]) == false){
    $("[empty][row='" + piecePositions.queen.rows[0] + "'][column='"
     + piecePositions.queen.cols[0] + "']").attr("empty", "false");
    $("[empty][row='" + availableMoves.queen.rows[f] + "'][column='"
     + availableMoves.queen.cols[f] + "']").attr("empty", "true");
    
    if( targPiece != ""){
      $("[empty][row='" + availableMoves.queen.rows[f] + "'][column='"
       + availableMoves.queen.cols[f] + "']").attr("piece", targPiece);
      $("[empty][row='" + availableMoves.queen.rows[f] + "'][column='"
       + availableMoves.queen.cols[f] + "']").attr("empty", "false");

    }
    legalMoves++;
    // console.log("legal move is row: " + availableMoves.queen.rows[f] + "col " + availableMoves.queen.cols[f]);
  }
}
if(legalMoves > 0){return};
for(let f = 0; f < availableMoves.knight.cols.length; f++){
  let targPiece = $("[empty][row='" + availableMoves.knight.rows[f] + "'][column='"
   + availableMoves.knight.cols[f] + "']").attr("piece");
     if (typeof targPiece == "undefined") {
    targPiece = "";
  }
  if(kingInCheck(evaluatedPlayer, piecePositions.knight.rows[0], piecePositions.knight.cols[0], 
  availableMoves.knight.rows[f], availableMoves.knight.cols[f]) == false){
    $("[empty][row='" + piecePositions.knight.rows[0] + "'][column='"
     + piecePositions.knight.cols[0] + "']").attr("empty", "false");
    $("[empty][row='" + availableMoves.knight.rows[f] + "'][column='"
     + availableMoves.knight.cols[f] + "']").attr("empty", "true");
    
    if( targPiece != ""){
      $("[empty][row='" + availableMoves.knight.rows[f] + "'][column='"
       + availableMoves.knight.cols[f] + "']").attr("piece", targPiece);
      $("[empty][row='" + availableMoves.knight.rows[f] + "'][column='"
       + availableMoves.knight.cols[f] + "']").attr("empty", "false");

    }
    legalMoves++;
    // console.log("legal move is row: " + availableMoves.knight.rows[f] + "col " + availableMoves.knight.cols[f]);
  }
}
for(let f = 0; f < availableMoves.rook.cols.length; f++){
  let targPiece = $("[empty][row='" + availableMoves.rook.rows[f] + "'][column='"
   + availableMoves.rook.cols[f] + "']").attr("piece");
     if (typeof targPiece == "undefined") {
    targPiece = "";
  }
  if(kingInCheck(evaluatedPlayer, piecePositions.rook.rows[0], piecePositions.rook.cols[0],
   availableMoves.rook.rows[f], availableMoves.rook.cols[f]) == false){
    $("[empty][row='" + piecePositions.rook.rows[0] + "'][column='"
     + piecePositions.rook.cols[0] + "']").attr("empty", "false");
    $("[empty][row='" + availableMoves.rook.rows[f] + "'][column='"
     + availableMoves.rook.cols[f] + "']").attr("empty", "true");
    
    if( targPiece != ""){
      $("[empty][row='" + availableMoves.rook.rows[f] + "'][column='"
       + availableMoves.rook.cols[f] + "']").attr("piece", targPiece);
      $("[empty][row='" + availableMoves.rook.rows[f] + "'][column='"
       + availableMoves.rook.cols[f] + "']").attr("empty", "false");

    }
    legalMoves++;
    // console.log("legal move is row: " + availableMoves.rook.rows[f] + "col " + availableMoves.rook.cols[f]);
  }
}
if(legalMoves > 0){return};

for(let f = 0; f < availableMoves.pawn.cols.length; f++){
  let targPiece = $("[empty][row='" + availableMoves.pawn.rows[f]
   + "'][column='" + availableMoves.pawn.cols[f] + "']").attr("piece");
     if (typeof targPiece == "undefined") {
    targPiece = "";
  }
  if(kingInCheck(evaluatedPlayer, piecePositions.pawn.rows[0], piecePositions.pawn.cols[0], 
  availableMoves.pawn.rows[f], availableMoves.pawn.cols[f]) == false){
    $("[empty][row='" + piecePositions.pawn.rows[0] + "'][column='"
     + piecePositions.pawn.cols[0] + "']").attr("empty", "false");
    $("[empty][row='" + availableMoves.pawn.rows[f] + "'][column='"
     + availableMoves.pawn.cols[f] + "']").attr("empty", "true");
    
    if( targPiece != ""){
      $("[empty][row='" + availableMoves.pawn.rows[f] + "'][column='"
       + availableMoves.pawn.cols[f] + "']").attr("piece", targPiece);
      $("[empty][row='" + availableMoves.pawn.rows[f]
       + "'][column='" + availableMoves.pawn.cols[f] + "']").attr("empty", "false");

    }
    legalMoves++;
    // console.log("legal move is row: " + availableMoves.pawn.rows[f] + "col " + availableMoves.pawn.cols[f]);
  }
}
if(legalMoves > 0){return};

 return legalMoves;
}

