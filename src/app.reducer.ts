
export interface TriangleType {
    angle: number;
    top: number;
    left: number;
    center: Location;
    key: string;
}

export interface ActionModel {
    type: 'cursore-moved' | 'init';
    payload: any;
}


export function appReducer(state: TriangleType[], action: ActionModel) {
    const clonnedState: TriangleType[] = JSON.parse(JSON.stringify(state));

    if (action.type === 'cursore-moved') {
        const updatedTriangles = clonnedState.filter(trig => calculateDistance(trig.center, action.payload) <= 100);
        const directionCalculator = getDirectionCalculator(action.payload);
        for (const trig of updatedTriangles) {
            trig.angle = directionCalculator(trig.center);
        }
    }

    if (action.type === 'init') {
        const {
            windowWidth,
            windowHeight,
            columns,
            rows,
            triangleWidth,
            triangleHeight
        } = action.payload;
        return initState(triangleWidth, triangleHeight, windowWidth, windowHeight, columns, rows);
    }

    return clonnedState;
}

export function initState(
    triangleWidth: number,
    triangleHeight: number,
    windowWidth: number,
    windowHeight: number,
    columns: number,
    rows: number
): TriangleType[] {
    console.assert(columns >= 2);
    console.assert(rows >= 2);
    const blockWidth = windowWidth / columns;
    const blockHeight = windowHeight / rows;
    
    const trigs: TriangleType[] = [];
    for (let rowI = 1; rowI < rows; rowI++) {
        for (let colI = 1; colI < columns; colI++) {
            trigs.push({
                angle: 0,
                center: {
                    x: colI * blockWidth,
                    y: rowI * blockHeight
                },
                top: rowI * blockHeight - (triangleHeight / 2),
                left: colI * blockWidth - (triangleWidth / 2),
                key: `x:${colI * blockWidth}, y:${rowI * blockHeight}`
            });
        }
    }

    return trigs;
}

interface Location {
    x: number;
    y: number;
}

function calculateDistance(p0: Location, p1: Location): number {
    return Math.sqrt((p0.x - p1.x) * (p0.x - p1.x) + (p0.y - p1.y) * (p0.y - p1.y))
}

// returns angle
function getDirectionCalculator({ x: cX, y: cY }: Location) {
    return function ({ x: tX, y: tY }: Location) {
        return Math.atan2(tY - cY, tX - cX) - Math.PI / 2;
    }
}