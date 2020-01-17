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

const DIVIDER_THICKNESS = 8;
const HALF_DIVIDER_THICKNESS = DIVIDER_THICKNESS / 2;

const App: React.FC = () => {
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [horizontalDividerPosition, setHorizontalDividerPosition] = useState(window.innerHeight / 2);
    const [verticalDividerPosition, setVerticalDividerPosition] = useState(window.innerWidth / 2);

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
        const newWindowHeight = window.innerHeight;
        const newWindowWidth = window.innerWidth;
        const deltaY = newWindowHeight - windowHeight;
        const deltaX = newWindowWidth - windowWidth;
        const horizontalDividerOffset = deltaY;
        const verticalDividerOffset = deltaX;

        setWindowHeight(window.innerHeight);
        setWindowWidth(window.innerWidth);

        setHorizontalDividerPosition(horizontalDividerPosition + horizontalDividerOffset);
        setVerticalDividerPosition(verticalDividerPosition + verticalDividerOffset);
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
            height: height - HALF_DIVIDER_THICKNESS,
            width: width - HALF_DIVIDER_THICKNESS,
        };
    };

    const updateViewportDimensions = () => {};

    const upperLeftDimensions = getViewportDimensions(QUADRANTS.UPPER_LEFT);
    const upperRightDimensions = getViewportDimensions(QUADRANTS.UPPER_RIGHT);
    const lowerLeftDimensions = getViewportDimensions(QUADRANTS.LOWER_LEFT);
    const lowerRightDimensions = getViewportDimensions(QUADRANTS.LOWER_RIGHT);

    return (
        <Container
            style={{
                height: `${windowHeight}px`,
                width: `${windowWidth}px`,
            }}
        >
            <Column>
                <Row>
                    <Viewport
                        style={{ height: `${upperLeftDimensions.height}px`, width: `${upperLeftDimensions.width}px` }}
                    >
                        <LogoImage draggable={false} src={logo} />
                    </Viewport>
                    <DraggableCore onDrag={onVerticalDividerDrag}>
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
                    <DraggableCore onDrag={onHorizontalDividerDrag}>
                        <HorizontalDivider style={{ width: `${upperLeftDimensions.width}px` }} />
                    </DraggableCore>
                    <DraggableCore onDrag={onMultiDrag}>
                        <CenterHandle />
                    </DraggableCore>
                    <DraggableCore onDrag={onHorizontalDividerDrag}>
                        <HorizontalDivider style={{ width: `${lowerRightDimensions.width}px` }} />
                    </DraggableCore>
                </Row>
                <Row>
                    <Viewport
                        style={{ height: `${lowerLeftDimensions.height}px`, width: `${lowerLeftDimensions.width}px` }}
                    >
                        <LogoImage draggable={false} src={logo} />
                    </Viewport>
                    <DraggableCore onDrag={onVerticalDividerDrag}>
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

const Container = styled.div`
    background-color: black;
    overflow: hidden;
`;

const Viewport = styled.div`
    background-color: rgb(60, 60, 60);
`;

const LogoImage = styled.img`
    max-height: 100%;
    max-width: 100%;
`;

const HorizontalDivider = styled.div`
    background-color: white;
    cursor: ns-resize;
    height: ${DIVIDER_THICKNESS}px;
    z-index: 1000;
`;

const VerticalDivider = styled.div`
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
