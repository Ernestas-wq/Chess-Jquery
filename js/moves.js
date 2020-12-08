 
 // Tracking moves for castling
var whiteKingCounter = 0;
var blackKingCounter = 0;
var whiteLeftRookCounter = 0;
var whiteRightRookCounter = 0;
var blackLeftRookCounter = 0;
var blackRightRookCounter = 0;

function checkBishopMoves(row, column, player, targRow, targColumn, targPlayer) {
  var checkDiag = false;

  // Checking if it's a diagonal move and if we are not taking our own piece
  for (let i = 0; i < 8; i++) {
    if (
      ((targColumn == column + i && targRow == row + i) ||
        (targColumn == column - i && targRow == row - i) ||
        (targColumn == column - i && targRow == row + i) ||
        (targColumn == column + i && targRow == row - i)) &&
      targPlayer != player
    ) {
      checkDiag = true;
    }
  }
  // Collecting row indexes of the diagonal move
  var occupiedDiagRow = [];
  for (let j = 1; j < Math.abs(targRow - row); j++) {
    if (targRow > row) {
      occupiedDiagRow.push(targRow - j);
    } else {
      occupiedDiagRow.unshift(row - j);
    }
  }
  // Collecting corresponding column indexes of the diagonal move
  var occupiedDiagColumn = [];
  for (let k = 1; k < Math.abs(targColumn - column); k++) {
    if (targColumn > column) {
      occupiedDiagColumn.push(targColumn - k);
    } else {
      occupiedDiagColumn.unshift(column - k);
    }
  }
  // the collected row and column indexes combined represent each square in the path
  for (let c = 0; c < occupiedDiagRow.length; c++) {
    rowCheckIndex = occupiedDiagRow[c]; // Looping through all the row's in the path
    columnCheckIndex = occupiedDiagColumn[c]; // Looping through all the col's in the path
    // the two indexes combined represent a square, here we check if the square is empty
    // if it isn't empty can't move
    if (
      $("[empty][row='" + rowCheckIndex + "'][column='" + columnCheckIndex + "']").attr("empty") ==
      "false"
    ) {
      checkDiag = false;
    }
  }

  return checkDiag;
}
// Pawn move logic
function checkPawnMoves(row, column, player, targRow, targColumn, targPlayer) {
  let checkPawn = false;

  if (player == "white") {
    if (
      (((row == 2 &&
        targRow == row + 2 &&
        column == targColumn &&
        $("[empty][row='" + 3 + "'][column='" + column + "']").attr("empty") == "true"
        && $("[empty][row='" + 4 + "'][column='" + column + "']").attr("empty") == "true") ||
        (column == targColumn && targRow == row + 1)) &&
        targPlayer != "black" &&
        targPlayer != player) || // Moving straight
      (targRow == row + 1 &&
        (targColumn == column + 1 || targColumn == column - 1) &&
        targPlayer == "black") // Taking diagonal
    ) {
      checkPawn = true;
    }
  } else if (player == "black") {
    if (
      (((row == 7 &&
        targRow == row - 2 &&
        column == targColumn &&
        $("[empty][row='" + 6 + "'][column='" + column + "']").attr("empty") == "true" 
        && $("[empty][row='" + 5 + "'][column='" + column + "']").attr("empty") == "true") ||
        (column == targColumn && targRow == row - 1)) &&
        targPlayer != "white" &&
        targPlayer != player) || // Moving straight
      (targRow == row - 1 &&
        (targColumn == column - 1 || targColumn == column + 1) &&
        targPlayer == "white") // Taking diagonal
    ) {
      checkPawn = true;
    }
  }
  return checkPawn;
}
// King correct moves
function checkKingMoves(row, column, player, targRow, targColumn, targPlayer) {
  let checkKing = false;
  
  if (
    ((targColumn == column + 1 && targRow == row + 1) ||
      (targColumn == column + 1 && targRow == row - 1) ||
      (targColumn == column - 1 && targRow == row + 1) ||
      (targColumn == column - 1 && targRow == row - 1) ||
      (targRow == row && targColumn == column - 1) ||
      (targRow == row && targColumn == column + 1) ||
      (targColumn == column && targRow == row + 1) ||
      (targColumn == column && targRow == row - 1)) &&
    targPlayer != player
  ) {
    checkKing = true;
  }
  if(targColumn == column && targRow == row){
    checkKing = false;
  }
  return checkKing;
}
function checkKnightMoves(row, column, player, targRow, targColumn, targPlayer) {
  let checkKnight = false;
  if (
    (((targColumn == column + 1 || targColumn == column - 1) &&
      (targRow == row + 2 || targRow == row - 2)) || // Logic for two up one to the side
      ((targColumn == column + 2 || targColumn == column - 2) &&
        (targRow == row + 1 || targRow == row - 1))) && // Logic for one up two to the side
    targPlayer != player
  ) {
    checkKnight = true;
  }
  return checkKnight;
}

// Checking linear movement logic
function checkRookMoves(row, column, player, targRow, targColumn, targPlayer) {
  let checkRookMoves = false;
  // Checking if move is vertical or horizontal
  for (let j = 0; j <= 8; j++) {
    if (
      ((targColumn == column && targRow == j) || (targRow == row && targColumn == j)) &&
      targPlayer != player
    ) {
      checkRookMoves = true;
    }
  }

  // Checking if horizontal move has something in the way
  var checkHorizontal = [];
  if (targColumn == column) {
    for (let i = 1; i < Math.abs(targRow - row); i++) {
      if (targRow > row) {
        let rowIndexHorizontal = row + i;
        if (
          $("[empty][row='" + rowIndexHorizontal + "'][column='" + targColumn + "']").attr(
            "empty"
          ) == "false"
        ) {
          checkRookMoves = false;
        }
      } else if (row > targRow) {
        let rowIndexHorizontal = row - i;
        if (
          $("[empty][row='" + rowIndexHorizontal + "'][column='" + targColumn + "']").attr(
            "empty"
          ) == "false"
        ) {
          checkRookMoves = false;
        }
      }
    }
  }
  // Checking if vertical move has something in the way
  else if (targRow == row) {
    for (let z = 1; z < Math.abs(targColumn - column); z++) {
      if (targColumn > column) {
        let columnIndexVertical = column + z;
        if (
          $("[empty][row='" + targRow + "'][column='" + columnIndexVertical + "']").attr("empty") ==
          "false"
        ) {
          checkRookMoves = false;
        }
      } else if (column > targColumn) {
        let columnIndexVertical = column - z;
        if (
          $("[empty][row='" + targRow + "'][column='" + columnIndexVertical + "']").attr("empty") ==
          "false"
        ) {
          checkRookMoves = false;
        }
      }
    }
  }
  return checkRookMoves;
}
// Track moves for castle

function trackMovesForCastle(player, piece, row, column) {
 if(piece == "king" && player == "white"){
whiteKingCounter++;}
else if(piece == "king" && player == "black"){
blackKingCounter++;}
else if(piece == "rook" && player == "white" && row == 1 && column == 1){
whiteLeftRookCounter++;}
else if(piece == "rook" && player == "white" && row == 1 && column == 8){
whiteRightRookCounter++;}  
else if(piece == "rook" && player == "black" && row == 8 && column == 1){
blackLeftRookCounter++;}  
else if(piece == "rook" && player == "black" && row == 1 && column == 8){
blackRightRookCounter++;}
}


// Castle
function castle(player, row, column, targRow, targColumn) {
  let isCastling = false;
  // White castle conditions
  if(player == "white"){
if(row == 1 && column == 5 && targRow == 1 && targColumn == 3 && whiteKingCounter == 0
   && whiteLeftRookCounter == 0) {
  if( $("[empty][row='" + 1 + "'][column='" + 2 + "']").attr("empty") == "true" 
   &&  $("[empty][row='" + 1 + "'][column='" + 3 + "']").attr("empty") == "true"
   &&  $("[empty][row='" + 1 + "'][column='" + 4 + "']").attr("empty") == "true"
   && $("[empty][row='" + 1 + "'][column='" + 1 + "']").attr("player") == player
     && $("[empty][row='" + 1 + "'][column='" + 1 + "']").attr("piece") == "rook"

   && kingInCheck(player, row, column, 1, 2, "king") == false 
   && kingInCheck(player, row, column, 1, 3, "king") == false 
   && kingInCheck(player, row, column, 1, 4, "king") == false 
   && kingInCheck(player, row, column, 1, 5, "king") == false 
   ){    
     $("[empty][row='" + row + "'][column='" + column + "']").attr("empty", "false");
isCastling = true;
}
}
else if(row == 1 && column == 5 && targRow == 1 && targColumn == 7 && whiteKingCounter == 0 
  && whiteRightRookCounter == 0 ){
  if( $("[empty][row='" + 1 + "'][column='" + 6 + "']").attr("empty") == "true" 
   && $("[empty][row='" + 1 + "'][column='" + 7 + "']").attr("empty") == "true"
  && $("[empty][row='" + 1 + "'][column='" + 8 + "']").attr("player") == player
  && $("[empty][row='" + 1 + "'][column='" + 8 + "']").attr("piece") == "rook"
   && kingInCheck(player, row, column, 1, 5, "king") == false 
   && kingInCheck(player, row, column, 1, 6, "king") == false 
   && kingInCheck(player, row, column, 1, 7, "king") == false )
    
  {
    $("[empty][row='" + row + "'][column='" + column + "']").attr("empty", "false");
    isCastling = true;
}
}
} // White
// Black castle conditions
else if(player == "black"){
if(row == 8 && column == 5 && targRow == 8 && targColumn == 3 && blackKingCounter == 0
   && blackLeftRookCounter == 0) {
  if( $("[empty][row='" + 8 + "'][column='" + 2 + "']").attr("empty") == "true" 
  &&  $("[empty][row='" + 8 + "'][column='" + 3 + "']").attr("empty") == "true"
  &&  $("[empty][row='" + 8 + "'][column='" + 4 + "']").attr("empty") == "true"
&& $("[empty][row='" + 8 + "'][column='" + 1 + "']").attr("piece") == "rook"
  && $("[empty][row='" + 8 + "'][column='" + 1 + "']").attr("player") == player
  && kingInCheck(player, row, column, 8, 2, "king") == false 
  && kingInCheck(player, row, column, 8, 3, "king") == false 
  &&  kingInCheck(player, row, column, 8, 4, "king") == false 
  &&  kingInCheck(player, row, column, 8, 5, "king") == false){
   $("[empty][row='" + row + "'][column='" + column + "']").attr("empty", "false");

isCastling = true;
}
}
else if(row == 8 && column == 5 && targRow == 8 && targColumn == 7 && blackKingCounter == 0 
  && blackRightRookCounter == 0 ){
  if( $("[empty][row='" + 8 + "'][column='" + 6 + "']").attr("empty") == "true" 
   && $("[empty][row='" + 8 + "'][column='" + 7 + "']").attr("empty") == "true"
    && $("[empty][row='" + 8 + "'][column='" + 8 + "']").attr("piece") == "rook"
  && $("[empty][row='" + 8 + "'][column='" + 8 + "']").attr("player") == player
   && kingInCheck(player, row, column, 8, 5, "king") == false 
   && kingInCheck(player, row, column, 8, 6, "king") == false 
   && kingInCheck(player, row, column, 8, 7, "king") == false )
  {
   $("[empty][row='" + row + "'][column='" + column + "']").attr("empty", "false");
    isCastling = true;
}
}
}
// Black
return isCastling;
}
// Getting kings coordinates to evaluate check with every piece being moved
function kingCoordinates(player) {
  var kingCoordinates = {
    row: "",
    col: "",
  };

  if (player == "white") {
    kingCoordinates.row = $("[player=white][piece=king]").attr("row");
    kingCoordinates.col = $("[player=white][piece=king]").attr("column");
  } else if (player == "black") {
    kingCoordinates.row = $("[player=black][piece=king]").attr("row");
    kingCoordinates.col = $("[player=black][piece=king]").attr("column");
  }

  return kingCoordinates;
}
// Evaluating if king is in check
function kingInCheck(player, row, column, targRow, targColumn, movingPiece) {
  let kingRow = parseInt(kingCoordinates(player).row);
  let kingCol = parseInt(kingCoordinates(player).col);
  // Temporary changing empty state of square and allowing taking of piece to see if king would
  // remain in check.
   let piece = $("[empty][row='" + targRow + "'][column='" + targColumn + "']").attr("piece");
  if (typeof piece == "undefined") {
    piece = "";
  } 
  if(movingPiece != "king"){
  $("[empty][row='" + row + "'][column='" + column + "']").attr("empty", "true");
  $("[empty][row='" + targRow + "'][column='" + targColumn + "']").attr("empty", "false");
  $("[empty][row='" + targRow + "'][column='" + targColumn + "']").attr("piece", "");

  }
 
  // if the king is moving, need to update the relative position, and temporarly change empty state 
  // to evaluate if king is still in check after the move
  if(movingPiece == "king"){
    $("[empty][row='" + row + "'][column='" + column + "']").attr("empty", "true");
    $("[empty][row='" + targRow + "'][column='" + targColumn + "']").attr("piece", "");

    kingRow = targRow;
    kingCol = targColumn;
  }
  let isChecked = false;
  // Running all available check lines relative to kings position
  for (let m = 1; m <= 8; m++) {
    for (let z = 1; z <= 8; z++) {
      targPlayer = $("[empty][row='" + m + "'][column='" + z + "']").attr("player");
      if (checkBishopMoves(kingRow, kingCol, player, m, z, targPlayer) == true) {
        if (
          $("[empty][row='" + m + "'][column='" + z + "']").attr("piece") == "bishop" ||
          $("[empty][row='" + m + "'][column='" + z + "']").attr("piece") == "queen"
        ) {
          isChecked = true;
        }
      } else if (checkRookMoves(kingRow, kingCol, player, m, z, targPlayer) == true) {
        if (
          $("[empty][row='" + m + "'][column='" + z + "']").attr("piece") == "rook" ||
          $("[empty][row='" + m + "'][column='" + z + "']").attr("piece") == "queen"
        ) {
          isChecked = true;
        }
      } else if (checkKnightMoves(kingRow, kingCol, player, m, z, targPlayer) == true) {
        if ($("[empty][row='" + m + "'][column='" + z + "']").attr("piece") == "knight") {
          isChecked = true;
        }
      }
         else if (checkKingMoves(kingRow, kingCol, player, m, z, targPlayer) == true) {
           if ($("[empty][row='" + m + "'][column='" + z + "']").attr("piece") == "king" ) {
           isChecked = true;
          }
        }
// Pawn logic, have to check for color of pawn as well for different kings
      if (player == "white") {
        if (checkPawnMoves(kingRow, kingCol, player, m, z, targPlayer) == true) {
          if (
            $("[empty][row='" + m + "'][column='" + z + "']").attr("piece") == "pawn" &&
            $("[empty][row='" + m + "'][column='" + z + "'][piece='" + "pawn" + "']")
            .attr("player") == "black"
          ) {
            isChecked = true;
          }
        }
      }
      if (player == "black") {
        if (checkPawnMoves(kingRow, kingCol, player, m, z, targPlayer) == true ) {
          if (
            $("[empty][row='" + m + "'][column='" + z + "']").attr("piece") == "pawn" &&
            $("[empty][row='" + m + "'][column='" + z + "'][piece='" + "pawn" + "']").attr(
              "player"
            ) == "white"
          ) {
            isChecked = true;
          }
        }    
      }
      // Preventing the king from stepping into other kings range;
      if(player == "black"){
      if (checkKingMoves(kingRow, kingCol, player, m, z, targPlayer) == true ) {
          if (
            $("[empty][row='" + m + "'][column='" + z + "']").attr("piece") == "king" &&
            $("[empty][row='" + m + "'][column='" + z + "'][piece='" + "king" + "']").attr(
              "player"
            ) == "white"
          ) {
            isChecked = true;
          }
        }
      }
      if(player == "white"){
            if (checkKingMoves(kingRow, kingCol, player, m, z, targPlayer) == true
         ) {
          if (
            $("[empty][row='" + m + "'][column='" + z + "']").attr("piece") == "king" &&
            $("[empty][row='" + m + "'][column='" + z + "'][piece='" + "king" + "']").attr(
              "player"
            ) == "black"
          ) {
            isChecked = true;
          }
        }
      }

    }
  }
  if (isChecked == true) {
    $("[empty][row='" + row + "'][column='" + column + "']").attr("empty", "false");
    $("[empty][row='" + targRow + "'][column='" + targColumn + "']").attr("empty", "true");
    if (piece != "") {
      $("[empty][row='" + targRow + "'][column='" + targColumn + "']").attr("empty", "false");
      $("[empty][row='" + targRow + "'][column='" + targColumn + "']").attr("piece", piece);
    }
  }
  if(movingPiece == "king" && isChecked == false){
      $("[empty][row='" + row + "'][column='" + column + "']").attr("empty", "false");
      $("[empty][row='" + targRow + "'][column='" + targColumn + "']").attr("piece", piece);
  }
  return isChecked;
}

