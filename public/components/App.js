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

function checkThree(a, b, c) {
    if (!a || !b || !c) {
        return false
    }
    return (a === b && b === c)
}

function checkForWin(grid) {
    const [nw, n, ne, w, c, e, sw, s, se] = grid.flat()
    return (
        checkThree(nw, n, ne) ||
        checkThree(w, c, e) ||
        checkThree(sw, s, se) ||
        checkThree(nw, w, sw) ||
        checkThree(n, c, s) ||
        checkThree(ne, e, se) ||
        checkThree(nw, c, se) ||
        checkThree(ne, c, sw)
    )
}

function checkForDraw(grid) {
    const flatGrid = grid.flat()
    return (!checkForWin(flatGrid) && flatGrid.filter(Boolean).length === flatGrid.length)
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

const getInitialState = () => ({
    grid: newTicTacToeGrid(),
    status: 'GAME_IN_PROGRESS',
    turn: 'X'
})

const reducer = (state, action) => {

    if (
        state.status === 'GAME_COMPLETE' &&
        action.type !== 'RESET'
    ) {
        return state
    }

    switch (action.type) {
        case 'RESET': {
            return getInitialState()
        }
        case 'CLICK': {
            const { x, y } = action.payload
            const { grid, turn } = state 

            if (grid[y][x]) {
                return state
            }
            
            const nextState = clone(state)

            nextState.grid[y][x] = turn

            if (checkForWin(nextState.grid)) {
                nextState.status = 'GAME_COMPLETE'
                return nextState
            }

            if (checkForDraw(nextState.grid)) {
                nextState.status = 'GAME_DRAW'
                return nextState
            }

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
        getInitialState()
    )
    const { grid, status, turn } = state

    const handleClick = (x, y) => {
        dispatch({
            type: 'CLICK', 
            payload: {x, y}
        })
    }

    const reset = () => {
        dispatch({
            type: `RESET`
        })
    }

    const statusDisplay = () => {
        switch (status) {
            case 'GAME_DRAW':
                return `DRAW`
            case 'GAME_COMPLETE':
                return `${turn} WINS`
            default:
                return `Next Turn: ${turn}`
        }
    }

    return (
        <div className={`app-container turn--${turn} ${(status === 'GAME_COMPLETE') ? 'game--finished' : ''}`}>
            <div style={{
                display: `flex`,
                justifyContent: `space-between`
            }}>
                <div>{statusDisplay()}</div>
                <button type="button" onClick={reset}>Reset</button>
            </div>
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
        <div className="cell">
            <button 
                className={`button ${(value) ? 'button--filled' : ''}`}
                onClick={onClick}
                type="button">{value}</button>
        </div>
    )
}