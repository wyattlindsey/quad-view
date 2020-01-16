import React, { useEffect, useState, isValidElement } from 'react';
import Draggable, { DraggableData, DraggableEvent, DraggableEventHandler } from 'react-draggable';
import styled, { ThemedStyledFunction, StyledComponentBase } from 'styled-components';

interface IDimension {
    height?: number; // todo not optional
    width?: number;
}

enum QUADRANTS {
    UPPER_LEFT,
    UPPER_RIGHT,
    LOWER_LEFT,
    LOWER_RIGHT,
}

enum DIVIDER_SEGMENTS {
    TOP = 'TOP',
    RIGHT = 'RIGHT',
    BOTTOM = 'BOTTOM',
    LEFT = 'LEFT',
    CENTER = 'CENTER',
}

const DIVIDER_THICKNESS = 8;
const HALF_DIVIDER_THICKNESS = DIVIDER_THICKNESS / 2;

const App: React.FC = () => {
    const [isDragging, setIsDragging] = useState<DIVIDER_SEGMENTS | null>(null);
    const [horizontalDividerPosition, setHorizontalDividerPosition] = useState(0);
    const [verticalDividerPosition, setVerticalDividerPosition] = useState(0);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const onHorizontalDividerDrag: DraggableEventHandler = (_: DraggableEvent, data: DraggableData) => {
        setHorizontalDividerPosition(data.y);
    };

    const onVerticalDividerDrag: DraggableEventHandler = (_: DraggableEvent, data: DraggableData) => {
        setVerticalDividerPosition(data.x);
    };

    const onMultiDrag: DraggableEventHandler = (_: DraggableEvent, data: DraggableData) => {
        setHorizontalDividerPosition(data.y);
        setVerticalDividerPosition(data.x);
    };

    const handleResize = () => {
        setWindowHeight(window.innerHeight);
        setWindowWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const getViewportDimensions = (quadrant: QUADRANTS): IDimension => {
        let height, width;

        switch (quadrant) {
            case QUADRANTS.UPPER_LEFT:
                height = windowHeight / 2 + horizontalDividerPosition;
                width = windowWidth / 2 + verticalDividerPosition;
                break;
            case QUADRANTS.UPPER_RIGHT:
                height = windowHeight / 2 + horizontalDividerPosition;
                width = windowWidth / 2 - verticalDividerPosition;
                break;
            case QUADRANTS.LOWER_LEFT:
                height = windowHeight / 2 - horizontalDividerPosition;
                width = windowWidth / 2 + verticalDividerPosition;
                break;
            case QUADRANTS.LOWER_RIGHT:
                height = windowHeight / 2 - horizontalDividerPosition;
                width = windowWidth / 2 - verticalDividerPosition;
                break;
        }

        return {
            height,
            width,
        };
    };

    const updateViewportDimensions = () => {};

    const upperLeftDimensions = getViewportDimensions(QUADRANTS.UPPER_LEFT);
    const upperRightDimensions = getViewportDimensions(QUADRANTS.UPPER_RIGHT);
    const lowerLeftDimensions = getViewportDimensions(QUADRANTS.LOWER_LEFT);
    const lowerRightDimensions = getViewportDimensions(QUADRANTS.LOWER_RIGHT);

    return (
        <Container height={windowHeight} width={windowWidth}>
            <Column>
                <Row>
                    <Viewport
                        style={{ height: `${upperLeftDimensions.height}px`, width: `${upperLeftDimensions.width}px` }}
                    />
                    <Draggable
                        axis="x"
                        onDrag={onVerticalDividerDrag}
                        onMouseDown={() => setIsDragging(DIVIDER_SEGMENTS.TOP)}
                        onStop={() => setIsDragging(null)}
                        // position={isDragging === DIVIDER_SEGMENTS.TOP ? { x: 0, y: 0 } : undefined}
                        // position={{ x: verticalDividerPosition, y: 0 }}
                    >
                        <VerticalDivider
                            style={{
                                height: `${upperLeftDimensions.height}px`,
                            }}
                        />
                    </Draggable>
                    <Viewport
                        style={{
                            height: `${upperRightDimensions.height}px`,
                            width: `${upperRightDimensions.width}px`,
                        }}
                    />
                </Row>
                <Row>
                    <Draggable
                        axis="y"
                        onDrag={onHorizontalDividerDrag}
                        onMouseDown={() => setIsDragging(DIVIDER_SEGMENTS.LEFT)}
                        onStop={() => setIsDragging(null)}
                        // position={{ x: 0, y: horizontalDividerPosition }}
                    >
                        <HorizontalDivider style={{ width: `${upperLeftDimensions.width}px` }} />
                    </Draggable>
                    <Draggable
                        onDrag={onMultiDrag}
                        onMouseDown={() => setIsDragging(DIVIDER_SEGMENTS.CENTER)}
                        onStop={() => setIsDragging(null)}
                        // position={{ x: verticalDividerPosition, y: horizontalDividerPosition }}
                    >
                        <CenterHandle />
                    </Draggable>
                    <Draggable
                        axis="y"
                        onDrag={onHorizontalDividerDrag}
                        onMouseDown={() => setIsDragging(DIVIDER_SEGMENTS.RIGHT)}
                        onStop={() => setIsDragging(null)}
                        // position={{ x: 0, y: horizontalDividerPosition }}
                    >
                        <HorizontalDivider style={{ width: `${lowerLeftDimensions.width}px` }} />
                    </Draggable>
                </Row>
                <Row>
                    <Viewport
                        style={{ height: `${lowerLeftDimensions.height}px`, width: `${lowerLeftDimensions.width}px` }}
                    />
                    <Draggable
                        axis="x"
                        onDrag={onVerticalDividerDrag}
                        onMouseDown={() => setIsDragging(DIVIDER_SEGMENTS.BOTTOM)}
                        onStop={() => setIsDragging(null)}
                        // position={{ x: verticalDividerPosition, y: 0 }}
                    >
                        <VerticalDivider style={{ height: `${lowerLeftDimensions.height}px` }} />
                    </Draggable>
                    <Viewport
                        style={{ height: `${lowerRightDimensions.height}px`, width: `${lowerRightDimensions.width}px` }}
                    />
                </Row>
            </Column>
            >
        </Container>
    );
};

const Container = styled.div<IDimension>`
    background-color: black;
    overflow: hidden;
`;

const Viewport = styled.div<IDimension>`
    background-color: darkgrey;
`;

const HorizontalDivider = styled.div<IDimension>`
    background-color: white;
    cursor: ns-resize;
    height: ${DIVIDER_THICKNESS}px;
    z-index: 1000;
`;

const VerticalDivider = styled.div<IDimension>`
    background-color: white;
    cursor: ew-resize;
    width: ${DIVIDER_THICKNESS}px;
    z-index: 1000;
`;

const CenterHandle = styled.div`
    background-color: white;
    cursor: move;
    height: ${DIVIDER_THICKNESS}px;
    width: ${DIVIDER_THICKNESS}px;
    z-index: 1001;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    height: inherit;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    height: inherit;
`;

export default App;
