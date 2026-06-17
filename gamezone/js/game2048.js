$(function(){

    const SIZE = 4;

    let board = [];
    let score = 0;

    let best =
    parseInt(localStorage.getItem("gamezone_2048_high")) || 0;

    $("#bestScore").text(best);

    function initGame(){

        board = [];

        for(let r=0;r<SIZE;r++){

            board[r] = [];

            for(let c=0;c<SIZE;c++){

                board[r][c] = 0;
            }
        }

        score = 0;

        $("#score").text(score);

        $("#gameOverOverlay").addClass("d-none");
        $("#gameWinOverlay").addClass("d-none");

        addRandomTile();
        addRandomTile();

        render();
    }

    function addRandomTile(){

        let empty = [];

        for(let r=0;r<SIZE;r++){

            for(let c=0;c<SIZE;c++){

                if(board[r][c] === 0){

                    empty.push({r,c});
                }
            }
        }

        if(empty.length === 0) return;

        const pos =
        empty[Math.floor(Math.random()*empty.length)];

        board[pos.r][pos.c] =
        Math.random() < .9 ? 2 : 4;
    }

    function render(){

        const container =
        $("#tile-container");

        container.empty();

        const size =
        container.width();

        const gap =
        window.innerWidth <= 576 ? 10 : 15;

        const tileSize =
        (size - (gap*3))/4;

        for(let r=0;r<SIZE;r++){

            for(let c=0;c<SIZE;c++){

                const value =
                board[r][c];

                if(value === 0) continue;

                const tile =
                $("<div>")
                .addClass("tile")
                .addClass(
                    value > 2048
                    ? "tile-super"
                    : `tile-${value}`
                )
                .text(value);

                tile.css({

                    width:tileSize+"px",
                    height:tileSize+"px",

                    left:
                    c*(tileSize+gap),

                    top:
                    r*(tileSize+gap),

                    fontSize:
                    value >= 1024
                    ? tileSize*.25
                    : tileSize*.35
                });

                container.append(tile);
            }
        }

        $("#score").text(score);
        $("#bestScore").text(best);
    }

    function slide(row){

        row = row.filter(v=>v);

        for(let i=0;i<row.length-1;i++){

            if(row[i]===row[i+1]){

                row[i]*=2;

                score+=row[i];

                row[i+1]=0;

                if(row[i]===2048){

                    $("#gameWinOverlay")
                    .removeClass("d-none");
                }
            }
        }

        row =
        row.filter(v=>v);

        while(row.length<SIZE){

            row.push(0);
        }

        return row;
    }

    function moveLeft(){

        let moved=false;

        for(let r=0;r<SIZE;r++){

            let old=
            [...board[r]];

            board[r]=slide(board[r]);

            if(
            old.join()!=board[r].join()
            ){
                moved=true;
            }
        }

        return moved;
    }

    function moveRight(){

        let moved=false;

        for(let r=0;r<SIZE;r++){

            let old=
            [...board[r]];

            board[r].reverse();

            board[r]=slide(board[r]);

            board[r].reverse();

            if(
            old.join()!=board[r].join()
            ){
                moved=true;
            }
        }

        return moved;
    }

    function moveUp(){

        let moved=false;

        for(let c=0;c<SIZE;c++){

            let col=[];

            for(let r=0;r<SIZE;r++){

                col.push(board[r][c]);
            }

            let old=[...col];

            col=slide(col);

            for(let r=0;r<SIZE;r++){

                board[r][c]=col[r];
            }

            if(
            old.join()!=col.join()
            ){
                moved=true;
            }
        }

        return moved;
    }

    function moveDown(){

        let moved=false;

        for(let c=0;c<SIZE;c++){

            let col=[];

            for(let r=0;r<SIZE;r++){

                col.push(board[r][c]);
            }

            let old=[...col];

            col.reverse();

            col=slide(col);

            col.reverse();

            for(let r=0;r<SIZE;r++){

                board[r][c]=col[r];
            }

            if(
            old.join()!=col.join()
            ){
                moved=true;
            }
        }

        return moved;
    }

    function checkGameOver(){

        for(let r=0;r<SIZE;r++){

            for(let c=0;c<SIZE;c++){

                if(board[r][c]===0)
                return false;
            }
        }

        return true;
    }

    function afterMove(moved){

        if(!moved) return;

        addRandomTile();

        if(score>best){

            best=score;

            localStorage.setItem(
            "gamezone_2048_high",
            best
            );
        }

        render();

        if(checkGameOver()){

            $("#gameOverOverlay")
            .removeClass("d-none");
        }
    }

    $(document).keydown(function(e){

        switch(e.key){

            case "ArrowLeft":
                afterMove(moveLeft());
                break;

            case "ArrowRight":
                afterMove(moveRight());
                break;

            case "ArrowUp":
                afterMove(moveUp());
                break;

            case "ArrowDown":
                afterMove(moveDown());
                break;
        }
    });

    let sx=0;
    let sy=0;

    $(".game2048-container")[0]
    .addEventListener("touchstart",e=>{

        sx=e.touches[0].clientX;
        sy=e.touches[0].clientY;
    });

    $(".game2048-container")[0]
    .addEventListener("touchend",e=>{

        let dx=
        e.changedTouches[0].clientX-sx;

        let dy=
        e.changedTouches[0].clientY-sy;

        if(Math.abs(dx)>Math.abs(dy)){

            if(dx>30)
                afterMove(moveRight());

            if(dx<-30)
                afterMove(moveLeft());

        }else{

            if(dy>30)
                afterMove(moveDown());

            if(dy<-30)
                afterMove(moveUp());
        }
    });

    $("#restartBtn,#tryAgainBtn,#playAgainBtn")
    .click(initGame);

    $("#keepPlayingBtn").click(function(){

        $("#gameWinOverlay")
        .addClass("d-none");
    });

    $(window).resize(render);

    initGame();
});