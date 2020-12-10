let lightSquareColor = $(".square").css("background-color");
let darkSquareColor = $(".square-grey").css("background-color");
let tracker = 1;

//Themes
$("#themeDefault").on("click", function () {
  lightSquareColor = "white";
  darkSquareColor = "#aaa";
  resetBoardColors();
});

$("#theme1").on("click", function () {
  lightSquareColor = "rgb(157, 172, 255)";
  darkSquareColor = "rgb(111, 115, 210)";
  resetBoardColors();
});
$("#theme2").on("click", function () {
  lightSquareColor = "rgb(234, 240, 206)";
  darkSquareColor = "rgb(187, 190, 100)";
  resetBoardColors();
});

//Highlight good moves
function highLightMoves() {
  let player = $(this).attr("player");
  let row = parseInt($(this).attr("row"));
  let column = parseInt($(this).attr("column"));
  let piece = $(this).attr("piece");
  var moves = {
    row: [],
    col: [],
  };
  var kingMoves = {
    row: [],
    col: [],
  };
  resetBoardColors();

  if (playerTurn == player) {
    $(this).css("background-color", "green");
  }
  for (let m = 1; m <= 8; m++) {
    for (let z = 1; z <= 8; z++) {
      targPlayer = $("[empty][row='" + m + "'][column='" + z + "']").attr("player");
      if ($(this).attr("piece") == "bishop") {
        if (
          checkBishopMoves(row, column, player, m, z, targPlayer) == true &&
          playerTurn == player
        ) {
          moves.row.push(m);
          moves.col.push(z);
        }
      } else if ($(this).attr("piece") == "rook") {
        if (checkRookMoves(row, column, player, m, z, targPlayer) == true && playerTurn == player) {
          moves.row.push(m);
          moves.col.push(z);
        }
      } else if ($(this).attr("piece") == "queen") {
        if (
          (checkRookMoves(row, column, player, m, z, targPlayer) == true ||
            checkBishopMoves(row, column, player, m, z, targPlayer) == true) &&
          playerTurn == player
        ) {
          moves.row.push(m);
          moves.col.push(z);
        }
      } else if ($(this).attr("piece") == "knight") {
        if (
          checkKnightMoves(row, column, player, m, z, targPlayer) == true &&
          playerTurn == player
        ) {
          moves.row.push(m);
          moves.col.push(z);
        }
      } else if ($(this).attr("piece") == "pawn") {
        if (checkPawnMoves(row, column, player, m, z, targPlayer) == true && playerTurn == player) {
          moves.row.push(m);
          moves.col.push(z);
        }
      } else if ($(this).attr("piece") == "king") {
        if (checkKingMoves(row, column, player, m, z, targPlayer) == true && playerTurn == player) {
          kingMoves.row.push(m);
          kingMoves.col.push(z);
        }
      }
    }
  }

  // Out of the correct moves checking if they are legal with kingInCheck function
  for (let x = 0; x < moves.col.length; x++) {
    let targPiece = $("[empty][row='" + moves.row[x] + "'][column='" + moves.col[x] + "']").attr(
      "piece"
    );
    if (typeof targPiece == "undefined") {
      targPiece = "";
    }
    if (kingInCheck(player, row, column, moves.row[x], moves.col[x]) == false) {
      // Reverting changes of kingInCheck function and highlighting only the squares that dont leave king in check
      $("[empty][row='" + row + "'][column='" + column + "']").attr("empty", "false");
      $("[empty][row='" + moves.row[x] + "'][column='" + moves.col[x] + "']").attr("empty", "true");

      if (targPiece != "") {
        $("[empty][row='" + moves.row[x] + "'][column='" + moves.col[x] + "']").attr(
          "piece",
          targPiece
        );
        $("[empty][row='" + moves.row[x] + "'][column='" + moves.col[x] + "']").attr(
          "empty",
          "false"
        );
      }
      $("[empty][row='" + moves.row[x] + "'][column='" + moves.col[x] + "']").addClass("goodMove");
    }
  }
  // Same legality check just for he king
  if (kingMoves.col.length > 0) {
    // Checking if regular king moves are available and highlighting
    for (let p = 0; p < kingMoves.col.length; p++) {
      if (kingInCheck(player, row, column, kingMoves.row[p], kingMoves.col[p], "king") == false) {
        $("[empty][row='" + row + "'][column='" + column + "']").attr("empty", "false");
        $("[empty][row='" + kingMoves.row[p] + "'][column='" + kingMoves.col[p] + "']").addClass(
          "goodMove"
        );
      }
    }
    // Highlighting castle square if not in check
    // Same checking just for castle moves
    if (player == "white") {
      if (castle(player, row, column, 1, 3) == true && castle(player, row, column, 1, 7) == true) {
        $("[empty][row='" + 1 + "'][column='" + 3 + "']").addClass("goodMove");
        $("[empty][row='" + 1 + "'][column='" + 7 + "']").addClass("goodMove");
      } else if (castle(player, row, column, 1, 3) == true) {
        $("[empty][row='" + 1 + "'][column='" + 3 + "']").addClass("goodMove");
      } else if (castle(player, row, column, 1, 7) == true) {
        $("[empty][row='" + 1 + "'][column='" + 7 + "']").addClass("goodMove");
      }
    } else if (player == "black") {
      if (castle(player, row, column, 8, 3) == true && castle(player, row, column, 8, 7) == true) {
        $("[empty][row='" + 8 + "'][column='" + 3 + "']").addClass("goodMove");
        $("[empty][row='" + 8 + "'][column='" + 7 + "']").addClass("goodMove");
      } else if (castle(player, row, column, 8, 3) == true) {
        $("[empty][row='" + 8 + "'][column='" + 3 + "']").addClass("goodMove");
      } else if (castle(player, row, column, 8, 7) == true) {
        $("[empty][row='" + 8 + "'][column='" + 7 + "']").addClass("goodMove");
      }
    }
  }

  return;
}

// reset colors
function resetBoardColors() {
  $("[empty]").each(function () {
    $(this).removeClass("goodMove");
    if ($(this).hasClass("square")) {
      $(this).css("background-color", lightSquareColor);
    } else if ($(this).hasClass("square-grey")) {
      $(this).css("background-color", darkSquareColor);
    }
  });
}

//Flip the board
$("#flipBoard").on("click", function () {
  if (tracker % 2 != 0) {
    $("#board").addClass("rotate");
    $(".row__rowPrefix").addClass("rotate");
    $(".row__colPrefix").addClass("rotate");
    $(".square").addClass("rotate");
    $(".square-grey").addClass("rotate");
    tracker++;
  } else if (tracker % 2 == 0) {
    $("#board").removeClass("rotate");
    $(".row__rowPrefix").removeClass("rotate");
    $(".row__colPrefix").removeClass("rotate");
    $(".square").removeClass("rotate");
    $(".square-grey").removeClass("rotate");
    tracker++;
  }
});
// Piece count
function getPieceCount() {
  let pieceCount = 0;
  $("[piece]").each(function () {
    if ($(this).attr("empty") === "false") {
      pieceCount++;
    }
  });
  return pieceCount;
}
