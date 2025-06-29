import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import styled, { useTheme } from 'styled-components/native';
import { DefaultTheme } from 'styled-components/native';

interface InfoIconTextProps {
  text: string;
  marginBottom?: number;
  marginTop?: number;
}

const Container = styled.View<{ marginBottom: number; marginTop: number }>`
  flex-direction: row;
  align-items: flex-start;
  margin-top: ${({ marginTop }) => marginTop}px;
  margin-bottom: ${({ marginBottom }) => marginBottom}px;
`;

const StyledText = styled.Text`
  flex: 1;
  font-size: 12px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const InfoIconText: React.FC<InfoIconTextProps> = ({
  text,
  marginBottom = 12,
  marginTop = 0,
}) => {
  const theme = useTheme() as DefaultTheme;

  return (
    <Container marginBottom={marginBottom} marginTop={marginTop}>
      <Ionicons
        name="information-circle-outline"
        size={14}
        color={theme.colors.textLight}
        style={{
          marginRight: 6,
          marginTop: 2, // ajuste visual sutil
        }}
      />
      <StyledText>{text}</StyledText>
    </Container>
  );
};

export default InfoIconText;
