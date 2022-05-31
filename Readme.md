# Sudoku Game:

## Description

It is a game specified for kids.. So, Images replace numbers in the Sudoku
game..

The game designed to have 2 levels of difficulty.. Level 1: 4X4 Grid Board & Level 2: 9x9 Grid Board..

The app uses **APIs** for generate Game Board and its Solutions.

 - For ***4x4 Grid Board*** I use:-

`https://sudoku-api.deta.dev/?type=4`

 - For ***9x9 Grid Board*** I use:-

`https://sudoku-board.p.rapidapi.com/new-board?diff=2&stype=list&solu=true`

## To Play the Game:-

1. In the ***Home*** Page select the User Name and Level..
2. Press ***Login*** button.. 
3. Then select the *group of images* will used in the game..
4. Press ***Start button*** to start the game counter and initialize the Grid Game Board..
5. Select the image by clicking on the wanted image in the Image Bar and click again to the right space in the Game Grid Board.. if the selected image matches the right image position based on solution Board, the image will inserted.. otherwise the *error Counter* increments by one..


## Some Note :-

1. If the Number of *errors* exceeds **10 errors** in the *level one* & **20 errors** in *level two*, the game will stop.
2. Level One has *1 minuet* timer, and level two has *2 minutes*..

## Author:- 
Ahmed Hamedy Ameen