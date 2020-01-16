import React, { useEffect, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent, DraggableEventHandler } from 'react-draggable';
import styled from 'styled-components';

const App: React.FC = () => {
    const [horizontalDividerPosition, setHorizontalDividerPosition] = useState(0);
    const [verticalDividerPosition, setVerticalDividerPosition] = useState(0);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const onHorizontalDrag: DraggableEventHandler = (_: DraggableEvent, data: DraggableData) => {
        setHorizontalDividerPosition(data.x);
    };

    const onVerticalDrag: DraggableEventHandler = (_: DraggableEvent, data: DraggableData) => {
        setVerticalDividerPosition(data.y);
    };

    const onMultiDrag: DraggableEventHandler = (_: DraggableEvent, data: DraggableData) => {
        setHorizontalDividerPosition(data.x);
        setVerticalDividerPosition(data.y);
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

    return (
        <Container height={windowHeight} width={windowWidth}>
            <Column>
                <Row>
                    <Viewport />
                    <Draggable axis="x" onDrag={onHorizontalDrag} position={{ x: horizontalDividerPosition, y: 0 }}>
                        <VerticalDivider />
                    </Draggable>
                    <Viewport />
                </Row>
                <Row>
                    <Draggable axis="y" onDrag={onVerticalDrag} position={{ y: verticalDividerPosition, x: 0 }}>
                        <HorizontalDivider />
                    </Draggable>
                    <Draggable
                        onDrag={onMultiDrag}
                        position={{ x: horizontalDividerPosition, y: verticalDividerPosition }}
                    >
                        <CenterHandle />
                    </Draggable>
                    <Draggable axis="y" onDrag={onVerticalDrag} position={{ y: verticalDividerPosition, x: 0 }}>
                        <HorizontalDivider />
                    </Draggable>
                </Row>
                <Row>
                    <Viewport />
                    <Draggable axis="x" onDrag={onHorizontalDrag} position={{ x: horizontalDividerPosition, y: 0 }}>
                        <VerticalDivider />
                    </Draggable>
                    <Viewport />
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

const Container = styled.div<IContainerProps>`
    background-color: black;
    height: ${props => props.height}px;
    width: ${props => props.width}px;
    overflow: hidden;
`;

const Viewport = styled.div`
    background-color: darkgrey;
    min-height: calc(50% - 4px);
    min-width: calc(50% - 4px);
`;

const HorizontalDivider = styled.div`
    background-color: white;
    cursor: ns-resize;
    height: 8px;
    min-width: calc(50% - 4px);
    z-index: 1000;
`;

const VerticalDivider = styled.div`
    background-color: white;
    cursor: ew-resize;
    height: calc(auto - 4px);
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
