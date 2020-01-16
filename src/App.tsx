import React, { useEffect, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent, DraggableEventHandler } from 'react-draggable';
import styled from 'styled-components';

interface IDimension {
    height?: number;
    width?: number;
}

enum QUADRANTS {
    UPPER_LEFT,
    UPPER_RIGHT,
    LOWER_LEFT,
    LOWER_RIGHT,
}

const App: React.FC = () => {
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
        // const height = (windowHeight + horizontalDividerPosition) / 2 - 4;
        // const width = (windowWidth + verticalDividerPosition) / 2 - 4;

        // return {
        //     height,
        //     width,
        // };

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

    const upperLeftDimensions = getViewportDimensions(QUADRANTS.UPPER_LEFT);
    const upperRightDimensions = getViewportDimensions(QUADRANTS.UPPER_RIGHT);
    const lowerLeftDimensions = getViewportDimensions(QUADRANTS.LOWER_LEFT);
    const lowerRightDimensions = getViewportDimensions(QUADRANTS.LOWER_RIGHT);

    return (
        <Container height={windowHeight} width={windowWidth}>
            <Column>
                <Row>
                    <Viewport height={upperLeftDimensions.height} width={upperLeftDimensions.width} />
                    <Draggable axis="x" onDrag={onVerticalDividerDrag} position={{ x: verticalDividerPosition, y: 0 }}>
                        <VerticalDivider height={upperLeftDimensions.height} />
                    </Draggable>
                    <Viewport height={upperRightDimensions.height} width={upperRightDimensions.width} />
                </Row>
                <Row>
                    <Draggable
                        axis="y"
                        onDrag={onHorizontalDividerDrag}
                        position={{ x: 0, y: horizontalDividerPosition }}
                    >
                        <HorizontalDivider width={upperLeftDimensions.width} />
                    </Draggable>
                    <Draggable
                        onDrag={onMultiDrag}
                        position={{ x: verticalDividerPosition, y: horizontalDividerPosition }}
                    >
                        <CenterHandle />
                    </Draggable>
                    <Draggable
                        axis="y"
                        onDrag={onHorizontalDividerDrag}
                        position={{ x: 0, y: horizontalDividerPosition }}
                    >
                        <HorizontalDivider width={upperRightDimensions.width} />
                    </Draggable>
                </Row>
                <Row>
                    <Viewport height={lowerLeftDimensions.height} width={lowerLeftDimensions.width} />
                    <Draggable axis="x" onDrag={onVerticalDividerDrag} position={{ x: verticalDividerPosition, y: 0 }}>
                        <VerticalDivider height={lowerLeftDimensions.height} />
                    </Draggable>
                    <Viewport height={lowerRightDimensions.height} width={lowerRightDimensions.width} />
                </Row>
            </Column>
            >
        </Container>
    );
};

interface IContainerProps {
    height: number;
    width: number;
}

const Container = styled.div<IDimension>`
    background-color: black;
    height: ${props => props.height}px;
    width: ${props => props.width}px;
    overflow: hidden;
`;

const Viewport = styled.div<IDimension>`
    background-color: darkgrey;
    height: ${props => props.height}px;
    width: ${props => props.width}px;
`;

const HorizontalDivider = styled.div<IDimension>`
    background-color: white;
    cursor: ns-resize;
    height: 8px;
    width: ${props => props.width}px;
    z-index: 1000;
`;

const VerticalDivider = styled.div<IDimension>`
    background-color: white;
    cursor: ew-resize;
    height: ${props => props.height}px;
    width: 8px;
    z-index: 1000;
`;

const CenterHandle = styled.div`
    background-color: white;
    cursor: move;
    height: 8px;
    width: 8px;
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
