import React, { useEffect, useState } from 'react';
import { DraggableCore, DraggableData, DraggableEvent, DraggableEventHandler } from 'react-draggable';
import styled from 'styled-components';
import logo from './logo.svg';

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

const App: React.FC = () => {
    const [isDragging, setIsDragging] = useState<DIVIDER_SEGMENTS | null>(null);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [horizontalDividerPosition, setHorizontalDividerPosition] = useState(windowHeight / 2);
    const [verticalDividerPosition, setVerticalDividerPosition] = useState(windowWidth / 2);

    const onHorizontalDividerDrag: DraggableEventHandler = (e: DraggableEvent, data: DraggableData) => {
        e.stopPropagation();
        setHorizontalDividerPosition(data.y);
    };

    const onVerticalDividerDrag: DraggableEventHandler = (e: DraggableEvent, data: DraggableData) => {
        e.stopPropagation();
        setVerticalDividerPosition(data.x);
    };

    const onMultiDrag: DraggableEventHandler = (e: DraggableEvent, data: DraggableData) => {
        e.stopPropagation();
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
                height = horizontalDividerPosition;
                width = verticalDividerPosition;
                break;
            case QUADRANTS.UPPER_RIGHT:
                height = horizontalDividerPosition;
                width = windowWidth - verticalDividerPosition;
                break;
            case QUADRANTS.LOWER_RIGHT:
                height = windowHeight - horizontalDividerPosition;
                width = windowWidth - verticalDividerPosition;
                break;
            case QUADRANTS.LOWER_LEFT:
                height = windowHeight - horizontalDividerPosition;
                width = verticalDividerPosition;
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
                    >
                        <LogoImage draggable={false} src={logo} />
                    </Viewport>
                    <DraggableCore
                        onDrag={onVerticalDividerDrag}
                        onMouseDown={() => setIsDragging(DIVIDER_SEGMENTS.TOP)}
                        onStop={() => setIsDragging(null)}
                    >
                        <VerticalDivider
                            style={{
                                height: `${upperLeftDimensions.height}px`,
                            }}
                        />
                    </DraggableCore>
                    <Viewport
                        style={{
                            height: `${upperRightDimensions.height}px`,
                            width: `${upperRightDimensions.width}px`,
                        }}
                    >
                        <LogoImage draggable={false} src={logo} />
                    </Viewport>
                </Row>
                <Row>
                    <DraggableCore
                        onDrag={onHorizontalDividerDrag}
                        onMouseDown={() => setIsDragging(DIVIDER_SEGMENTS.LEFT)}
                        onStop={() => setIsDragging(null)}
                    >
                        <HorizontalDivider style={{ width: `${upperLeftDimensions.width}px` }} />
                    </DraggableCore>
                    <DraggableCore
                        onDrag={onMultiDrag}
                        onMouseDown={() => setIsDragging(DIVIDER_SEGMENTS.CENTER)}
                        onStop={() => setIsDragging(null)}
                    >
                        <CenterHandle />
                    </DraggableCore>
                    <DraggableCore
                        onDrag={onHorizontalDividerDrag}
                        onMouseDown={() => setIsDragging(DIVIDER_SEGMENTS.RIGHT)}
                        onStop={() => setIsDragging(null)}
                    >
                        <HorizontalDivider style={{ width: `${lowerRightDimensions.width}px` }} />
                    </DraggableCore>
                </Row>
                <Row>
                    <Viewport
                        style={{ height: `${lowerLeftDimensions.height}px`, width: `${lowerLeftDimensions.width}px` }}
                    >
                        <LogoImage draggable={false} src={logo} />
                    </Viewport>
                    <DraggableCore
                        onDrag={onVerticalDividerDrag}
                        onMouseDown={() => setIsDragging(DIVIDER_SEGMENTS.BOTTOM)}
                        onStop={() => setIsDragging(null)}
                    >
                        <VerticalDivider style={{ height: `${lowerLeftDimensions.height}px` }} />
                    </DraggableCore>
                    <Viewport
                        style={{ height: `${lowerRightDimensions.height}px`, width: `${lowerRightDimensions.width}px` }}
                    >
                        <LogoImage draggable={false} src={logo} />
                    </Viewport>
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
    background-color: rgb(60, 60, 60);
`;

const LogoImage = styled.img`
    max-height: 100%;
    max-width: 100%;
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
