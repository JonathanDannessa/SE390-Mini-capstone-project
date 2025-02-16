import React from 'react';
import { render } from '@testing-library/react-native';
import RouteInfoContainer from '../maps/RouteInfoContainer';

describe('Route Info Container Component', () => {
    test("renders correctly", () => {
        const { getByText, getByTestId } = render(<RouteInfoContainer eta={50} distance={500}/>);

        expect(getByText('ETA: 50 mins')).toBeTruthy();
        expect(getByText('Distance: 500 km')).toBeTruthy();

        const routeInfoContainer = getByTestId('route-info-container');
        const routeContainerStyle = routeInfoContainer.props.style;
        expect(routeContainerStyle[0].backgroundColor).toBe("#800000");
    });
});