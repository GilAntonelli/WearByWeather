// components/__tests__/HourlyForecastCard.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import HourlyForecastCard from '../HourlyForecastCard';

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Ionicons: (props: any) => (
      <View
        {...props}
        accessibilityLabel={props.accessibilityLabel}
        testID="mock-ionicon"
      />
    ),
  };
});

describe('HourlyForecastCard', () => {
  it('renders time and normalizes temperature when number (rounds and adds °C)', () => {
    const { getByText } = render(
      <HourlyForecastCard time="12:00" icon="10d" temperature={21.6} />
    );
    expect(getByText('12:00')).toBeTruthy();
    expect(getByText('22°C')).toBeTruthy(); // 21.6 -> 22°C
  });

  it('keeps single °C when temperature is a string with °C', () => {
    const { getByText } = render(
      <HourlyForecastCard time="13:00" icon="01d" temperature="18°C" />
    );
    expect(getByText('18°C')).toBeTruthy();
  });

  it('adds °C when temperature is a numeric string without °C', () => {
    const { getByText } = render(
      <HourlyForecastCard time="14:00" icon="01d" temperature="20" />
    );
    expect(getByText('20°C')).toBeTruthy();
  });

  it('shows precipitation row with POP percentage (rounded)', () => {
    const { getByTestId, getByText } = render(
      <HourlyForecastCard time="15:00" icon="10d" temperature={19} popPct={87.2} />
    );
    expect(getByTestId('precip-row')).toBeTruthy();
    expect(getByText('87%')).toBeTruthy(); // rounded
  });

  it('shows precipitation row with rain in mm using smart rounding (0.3 -> 0.3 mm)', () => {
    const { getByTestId, getByText } = render(
      <HourlyForecastCard time="16:00" icon="09d" temperature={17} rainMM={0.34} />
    );
    expect(getByTestId('precip-row')).toBeTruthy();
    expect(getByText('0.3 mm')).toBeTruthy();
  });

  it('shows precipitation row with rain in mm using smart rounding (3 -> 3 mm)', () => {
    const { getByTestId, getByText } = render(
      <HourlyForecastCard time="17:00" icon="09d" temperature={17} rainMM={3} />
    );
    expect(getByTestId('precip-row')).toBeTruthy();
    expect(getByText('3 mm')).toBeTruthy();
  });

  it('shows em dash when willRain=true and no POP/MM provided', () => {
    const { getByTestId, getByText } = render(
      <HourlyForecastCard time="18:00" icon="10n" temperature={16} willRain />
    );
    expect(getByTestId('precip-row')).toBeTruthy();
    // em dash
    expect(getByText('—')).toBeTruthy();
  });

  it('does not render precipitation row when no rain indicators are present', () => {
    const { queryByTestId } = render(
      <HourlyForecastCard time="19:00" icon="01n" temperature={20} />
    );
    expect(queryByTestId('precip-row')).toBeNull();
  });

  it('renders OpenWeather image when icon is provided (accessibility label)', () => {
    const { getByLabelText } = render(
      <HourlyForecastCard time="06:00" icon="04n" temperature={12} />
    );
    // The <Image> in the component has this a11y label
    expect(getByLabelText('Weather at 06:00')).toBeTruthy();
  });

  it('renders fallback icon when no icon is provided', () => {
    const { getByLabelText } = render(
      <HourlyForecastCard time="07:00" temperature={13} />
    );
    // The fallback Ionicons has this a11y label
    expect(getByLabelText('Weather icon unavailable')).toBeTruthy();
  });

  it('exposes default container accessibility label and default testID', () => {
    const { getByLabelText, getByTestId } = render(
      <HourlyForecastCard time="08:00" icon="02d" temperature={23} />
    );
    expect(getByLabelText('Hourly forecast 08:00')).toBeTruthy();
    expect(getByTestId('hourly-card')).toBeTruthy();
  });

  it('accepts a custom testID for QA targeting', () => {
    const { getByTestId } = render(
      <HourlyForecastCard
        time="09:00"
        icon="02d"
        temperature={25}
        testID="custom-hour-card"
      />
    );
    expect(getByTestId('custom-hour-card')).toBeTruthy();
  });
});
