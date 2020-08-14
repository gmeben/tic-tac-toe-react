import React from 'react'

export default function App() {
    return (
        <div>
            <header>
                <h1>Tic-Tac-Toe in React</h1>
            </header>
            <Game />
        </div>
    )
}

const clone = x => JSON.parse(JSON.stringify(x))

function generateGrid(rows, columns, mapper) {
    return Array(rows)
        .fill()
        .map(() => {
            return Array(columns).fill().map(mapper)
        }
    )
}

const newTicTacToeGrid = () => {
    return generateGrid(3, 3, () => {
        return null
    })
}

const NEXT_TURN = {
    O: 'X',
    X: 'O'
}

const initialState = {
    grid: newTicTacToeGrid(),
    turn: 'X'
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'CLICK': {
            const { x, y } = action.payload
            const { grid, turn } = state 

            if (grid[y][x]) {
                return state
            }
            
            const nextState = clone(state)

            nextState.grid[y][x] = turn
            nextState.turn = NEXT_TURN[turn]

            return nextState
        }

        default: 
            return state
    }
}

function Game() {
    const [state, dispatch] = React.useReducer(
        reducer,
        initialState
    )
    const { grid } = state

    const handleClick = (x, y) => {
        dispatch({
            type: 'CLICK', 
            payload: {x, y}
        })
    }
    return (
        <div>
            <Grid suppliedGrid={grid} handleClick={handleClick} />
        </div>
    )
}

function Grid({ suppliedGrid, handleClick }) {
    return (
        <div style={{
            display: 'inline-block'
            }}>
            <div style={{ 
                backgroundColor: `#444`,
                display: `grid`,
                gridTemplateRows: `repeat(${suppliedGrid.length}, 1fr )`,
                gridTemplateColumns: `repeat(${suppliedGrid[0].length}, 1fr)`,
                gridGap: 2
            }}>
                {suppliedGrid.map((row, rowIndex) => {
                    return row.map((value, columnIndex) => {
                        return (
                            <Cell 
                                key={`${columnIndex}-${rowIndex}`}
                                onClick={() => {
                                    handleClick(columnIndex, rowIndex)
                                }}
                                value={value} 
                            />
                        )
                    })
                })
            }
            </div>
        </div>
    )
}

function Cell({onClick, value}) {
    return (
        <div style={{
            backgroundColor: `#fff`,
            width: 100,
            height: 100
        }}>
            <button 
                style={{
                    width: `100%`,
                    height: `100%`
                }}
                onClick={onClick}
                type="button">{value}</button>
        </div>
    )
}