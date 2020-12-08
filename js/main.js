var selection = { piece: "", player: "", row: "", column: "" },
  playerTurn = "white";
  // Getting start positions for restart game,
let startPositionsWhite = positions("white");
let startPositionsBlack = positions("black");
// setting up the board
$("[piece]").each(function () {

  let player = $(this).attr("player"),
    piece = $(this).attr("piece"),
    boardSquareColor = $(this).css("background-color");
  if (piece == "" || player == "") {
    $(this).attr("empty", "true");
    return;
  }
  $(this).attr("empty", "false");
  $(this).css("background", "url(pieces/" + player + "/" + piece + ".png)")
  .css("background-size", "100% 100%")
  .css("background-color", boardSquareColor);

});

// Setting up the logic for moving pieces
$("[empty]").on("click", function () {
  var empty = $(this).attr("empty"),
    targPiece = $(this).attr("piece"),
    targPlayer = $(this).attr("player"),
    targRow = $(this).attr("row"),
    targColumn = $(this).attr("column");
  if (targPlayer == playerTurn) {
    selection = { piece: targPiece, player: targPlayer, row: targRow, column: targColumn };
  } else if (
    selection.piece != "" &&
    selection.player != "" &&
    selection.player == playerTurn &&
    (targRow != selection.row || targColumn !== selection.column)
  ) {
    if (typeof targPiece == "undefined") {
      targPiece = "";
    }
    if (typeof targPlayer == "undefined") {
      targPlayer = "";
    }
    //Check to see if move is eligible
    correctMove(selection.player,selection.piece,selection.row,selection.column,
      targRow, targColumn,targPiece, targPlayer);
  } 
});
// adding highlight on not empty squares
 $('[empty]').on("mouseover", function(e){
  if(e.target.getAttribute('empty') == "false"){
    e.target.addEventListener('click', highLightMoves);
  }
  });

function gameMessage(message){
  $('#gameMessage').removeClass('hidden');
  $('#gameMessage').html(message);
}


function newGame() {
$("[piece]").each(function () { 
  $(this).attr("empty", "true").attr("piece", "").attr("player", "")
  .css("background-image", "none")
  .css("background-url", "none");
  
})
  for(const key in startPositionsWhite) {
    for(let i = 0; i < startPositionsWhite[key].rows.length; i ++){
      $("[empty][row='" + startPositionsWhite[key].rows[i] + "'][column='" + startPositionsWhite[key].cols[i] + "']")
      .css("background", "url(pieces/" + "white" + "/" + key + ".png")
      .css("background-size", "100% 100%")
     .attr("empty", "false").attr("piece", key).attr("player", "white")  
    }
  for(const key in startPositionsBlack) {
    for(let i = 0; i < startPositionsBlack[key].rows.length; i ++){
      $("[empty][row='" + startPositionsBlack[key].rows[i] + "'][column='" + startPositionsBlack[key].cols[i] + "']")
      .css("background", "url(pieces/" + "black" + "/" + key + ".png")
      .css("background-size", "100% 100%")
     .attr("empty", "false").attr("piece", key).attr("player", "black")  
    }
    resetBoardColors();
  }
}
}
$('#restart').on('click', function(){
  newGame();
} );


